import assert from 'node:assert/strict';
import {test} from 'node:test';
import {costMatrix, greedyAssignment, optimalAssignment, totalCost} from '../src/lib/assignment.js';
import {precisionRecallPoints, averagePrecision, interpolatedStaircase} from '../src/lib/ranking.js';
import {similarityMatrix, softmaxRows, contrastiveLoss} from '../src/lib/contrastive.js';
import {KERNELS, convolve, toDisplay, toGray} from '../src/lib/convolution.js';
import {studentSeries, teacherSeries, roughness, effectiveWindow} from '../src/lib/momentum.js';
import {keepNearer} from '../src/lib/depth.js';

const OBJECTS = [{box: [10, 30, 50, 70]}, {box: [55, 30, 95, 70]}, {box: [105, 30, 145, 70]}];
const scene = (x) => [{box: [x, 28, x + 40, 68]}, {box: [57, 31, 97, 71]}, {box: [103, 29, 143, 69]}, {box: [118, 4, 150, 24]}];

test('la asignación óptima nunca cuesta más que la codiciosa y da un objeto a cada predicción como mucho', () => {
  for (let x = 10; x <= 50; x += 2) {
    const cost = costMatrix(scene(x), OBJECTS);
    const greedy = greedyAssignment(cost);
    const optimal = optimalAssignment(cost);
    assert.ok(totalCost(cost, optimal) <= totalCost(cost, greedy) + 1e-9);
    const used = optimal.filter((column) => column !== -1);
    assert.equal(new Set(used).size, OBJECTS.length);
    assert.equal(optimal.filter((column) => column === -1).length, 1);
  }
});

test('la codiciosa se equivoca cuando la predicción más segura queda entre dos coches', () => {
  const cost = costMatrix(scene(36), OBJECTS);
  assert.deepEqual(greedyAssignment(cost), [1, 0, 2, -1]);
  assert.deepEqual(optimalAssignment(cost), [0, 1, 2, -1]);
  assert.deepEqual(greedyAssignment(costMatrix(scene(14), OBJECTS)), optimalAssignment(costMatrix(scene(14), OBJECTS)));
});

test('la asignación exige al menos tantas predicciones como objetos', () => {
  assert.throws(() => optimalAssignment([[0.1, 0.2]]));
});

const DETECTIONS = [
  {score: 0.95, tp: true}, {score: 0.9, tp: true}, {score: 0.82, tp: false}, {score: 0.76, tp: true},
  {score: 0.64, tp: true}, {score: 0.51, tp: false}, {score: 0.43, tp: false}, {score: 0.3, tp: true}
];

test('cada umbral añade un punto a la curva y el recall nunca baja al bajar el umbral', () => {
  const points = precisionRecallPoints(DETECTIONS, 6);
  assert.equal(points.length, 8);
  assert.equal(points[0].precision, 1);
  assert.ok(Math.abs(points[2].precision - 2 / 3) < 1e-9);
  for (let index = 1; index < points.length; index += 1) assert.ok(points[index].recall >= points[index - 1].recall);
  assert.ok(Math.abs(points.at(-1).recall - 5 / 6) < 1e-9);
});

test('la AP interpolada vale el área bajo la escalera y no pasa de 1', () => {
  const points = precisionRecallPoints(DETECTIONS, 6);
  const ap = averagePrecision(points);
  assert.ok(Math.abs(ap - 0.7037) < 1e-3);
  const perfect = precisionRecallPoints([{score: 0.9, tp: true}, {score: 0.8, tp: true}], 2);
  assert.equal(averagePrecision(perfect), 1);
  const corners = interpolatedStaircase(points);
  assert.equal(corners.at(-1)[0], points.at(-1).recall);
});

const TEXTS = [[1, 0.15, 0], [0.7, 0.7, 0], [0, 0.05, 1], [0.1, 0.6, 0.8]];
const IMAGES = [[1, 0.25, 0.05], [0.97, 0.38, 0.02], [0.05, 0.12, 1], [0.15, 0.55, 0.82]];

test('la temperatura afila la distribución sin cambiar el orden de los candidatos', () => {
  const matrix = similarityMatrix(IMAGES, TEXTS);
  const soft = softmaxRows(matrix, 1)[0];
  const sharp = softmaxRows(matrix, 0.05)[0];
  assert.ok(Math.abs(soft.reduce((a, b) => a + b, 0) - 1) < 1e-9);
  assert.ok(Math.max(...sharp) > Math.max(...soft));
  assert.equal(soft.indexOf(Math.max(...soft)), sharp.indexOf(Math.max(...sharp)));
  assert.throws(() => softmaxRows(matrix, 0));
});

test('con un error a medio entrenar la pérdida tiene un mínimo: ni muy caliente ni muy fría', () => {
  const matrix = similarityMatrix(IMAGES, TEXTS);
  const hot = contrastiveLoss(matrix, 1);
  const middle = contrastiveLoss(matrix, 0.05);
  const cold = contrastiveLoss(matrix, 0.01);
  assert.ok(middle < hot && middle < cold);
});

test('un filtro de bordes verticales responde en un escalón vertical y no en una zona lisa', () => {
  const width = 6, height = 4;
  const gray = new Float32Array(width * height).map((_, index) => (index % width < 3 ? 0 : 100));
  const out = convolve(gray, width, height, KERNELS.vertical.weights);
  assert.equal(out[1 * width + 0], 0);
  assert.equal(out[1 * width + 2], 400);
  const shown = toDisplay(out, true);
  assert.equal(shown[1 * width + 2], 255);
  const flat = convolve(new Float32Array(9).fill(50), 3, 3, KERNELS.blur.weights);
  for (const value of flat) assert.ok(Math.abs(value - 50) < 1e-4);
  assert.throws(() => convolve(new Float32Array(4), 3, 3, KERNELS.blur.weights));
});

test('la luminancia de un píxel blanco es 255 y la de uno negro 0', () => {
  const gray = toGray(new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]));
  assert.ok(Math.abs(gray[0] - 255) < 1e-3);
  assert.equal(gray[1], 0);
});

test('más momentum da una maestra más tranquila y con más retraso', () => {
  const student = studentSeries();
  const calm = teacherSeries(student, 0.95);
  const quick = teacherSeries(student, 0.5);
  assert.ok(roughness(calm) < roughness(quick));
  assert.ok(roughness(quick) < roughness(student));
  assert.equal(teacherSeries(student, 0)[10], student[10]);
  assert.ok(Math.abs(effectiveWindow(0.99) - 100) < 1e-9);
  assert.throws(() => teacherSeries(student, 1));
});

test('el corte por distancia conserva lo que está igual de cerca o más', () => {
  const {keep, kept, share} = keepNearer(new Uint8Array([10, 120, 200, 255]), 120);
  assert.deepEqual([...keep], [0, 1, 1, 1]);
  assert.equal(kept, 3);
  assert.equal(share, 0.75);
});
