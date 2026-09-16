import assert from 'node:assert/strict';
import {test} from 'node:test';
import {iou, matchDetections} from '../src/lib/metrics.js';

test('IoU devuelve 1 para cajas iguales', () => {
  assert.equal(iou([20, 20, 60, 60], [20, 20, 60, 60]), 1);
});

test('IoU devuelve 0 para cajas separadas', () => {
  assert.equal(iou([20, 20, 60, 60], [60, 20, 100, 60]), 0);
});

test('IoU calcula el solapamiento inicial de la actividad', () => {
  assert.ok(Math.abs(iou([20, 20, 60, 60], [40, 20, 80, 60]) - 1 / 3) < 1e-9);
});

test('IoU no produce NaN con cajas degeneradas', () => {
  assert.equal(iou([0, 0, 0, 0], [0, 0, 0, 0]), 0);
});

const truths = [
  {id: 't1', box: [14, 40, 54, 74]},
  {id: 't2', box: [62, 34, 96, 66]},
  {id: 't3', box: [106, 44, 146, 78]}
];

const predictions = [
  {id: 'p1', score: 0.92, box: [15, 41, 55, 75]},
  {id: 'p2', score: 0.78, box: [64, 36, 98, 68]},
  {id: 'p3', score: 0.55, box: [104, 46, 142, 76]},
  {id: 'p4', score: 0.41, box: [30, 20, 58, 40]},
  {id: 'p5', score: 0.24, box: [108, 46, 148, 80]}
];

test('sin filtrar, la escena del laboratorio deja dos falsos positivos', () => {
  const result = matchDetections(truths, predictions, {scoreThreshold: 0});
  assert.equal(result.truePositives, 3);
  assert.equal(result.falsePositives, 2);
  assert.equal(result.falseNegatives, 0);
  assert.equal(result.precision, 0.6);
  assert.equal(result.recall, 1);
});

test('una predicción duplicada cuenta como falso positivo aunque solape mucho', () => {
  const result = matchDetections(truths, predictions, {scoreThreshold: 0});
  assert.equal(result.outcomes.get('p3').outcome, 'tp');
  assert.equal(result.outcomes.get('p5').outcome, 'fp');
  assert.ok(result.outcomes.get('p5').overlap > 0.5);
});

test('subir el umbral sube la precisión y baja el recall', () => {
  const holgado = matchDetections(truths, predictions, {scoreThreshold: 0.3});
  const estricto = matchDetections(truths, predictions, {scoreThreshold: 0.6});
  assert.ok(estricto.precision > holgado.precision);
  assert.ok(estricto.recall < holgado.recall);
  assert.deepEqual(estricto.missed, ['t3']);
});

test('sin predicciones que superen el umbral, la precisión queda indefinida', () => {
  const result = matchDetections(truths, predictions, {scoreThreshold: 0.95});
  assert.equal(result.precision, null);
  assert.equal(result.recall, 0);
  assert.equal(result.falseNegatives, 3);
});

test('un solapamiento por debajo del umbral IoU no es un acierto', () => {
  const result = matchDetections(
    [{id: 't1', box: [0, 0, 10, 10]}],
    [{id: 'p1', score: 1, box: [6, 6, 16, 16]}],
    {scoreThreshold: 0}
  );
  assert.equal(result.truePositives, 0);
  assert.equal(result.falsePositives, 1);
  assert.equal(result.outcomes.get('p1').outcome, 'fp');
});
