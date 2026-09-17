import assert from 'node:assert/strict';
import {test} from 'node:test';
import {annotationBudget, inferenceMemory, fittingDevices, PRECISIONS} from '../src/lib/planning.js';

test('el presupuesto multiplica clases por imágenes y añade la revisión', () => {
  const result = annotationBudget({classes: 4, imagesPerClass: 300, secondsPerImage: 45});
  assert.equal(result.images, 1200);
  assert.equal(result.annotationHours, 15);
  assert.equal(result.reviewHours, 4.5);
  assert.equal(result.totalHours, 19.5);
  assert.equal(result.days, 3.25);
});

test('doblar las clases dobla el coste', () => {
  const uno = annotationBudget({classes: 2, imagesPerClass: 200, secondsPerImage: 30});
  const dos = annotationBudget({classes: 4, imagesPerClass: 200, secondsPerImage: 30});
  assert.equal(dos.totalHours, uno.totalHours * 2);
});

test('un presupuesto con cifras imposibles no devuelve nada', () => {
  assert.equal(annotationBudget({classes: 0, imagesPerClass: 100, secondsPerImage: 30}), null);
  assert.equal(annotationBudget({classes: 3, imagesPerClass: 100, secondsPerImage: -1}), null);
});

test('la memoria sale de parámetros por bytes de la precisión', () => {
  const fp32 = inferenceMemory({millionParams: 1000, precision: 'fp32'});
  assert.equal(fp32.weightsGb, 4);
  assert.ok(Math.abs(fp32.totalGb - 5.4) < 1e-9);
});

test('bajar de float32 a float16 reduce la memoria a la mitad', () => {
  const fp32 = inferenceMemory({millionParams: 300, precision: 'fp32'});
  const fp16 = inferenceMemory({millionParams: 300, precision: 'fp16'});
  const int8 = inferenceMemory({millionParams: 300, precision: 'int8'});
  assert.equal(fp16.totalGb, fp32.totalGb / 2);
  assert.equal(int8.totalGb, fp32.totalGb / 4);
});

test('cada precisión declara sus bytes por parámetro', () => {
  assert.deepEqual(PRECISIONS.map((item) => item.bytes), [4, 2, 1]);
  assert.equal(inferenceMemory({millionParams: 100, precision: 'inventada'}), null);
});

test('solo caben las tarjetas con memoria suficiente', () => {
  const devices = [{name: 'portátil', gb: 8}, {name: 'T4', gb: 16}, {name: 'A100', gb: 40}];
  // 7000 M en float16 son 18,9 GB con el margen: se quedan fuera el portátil y la T4.
  const grande = inferenceMemory({millionParams: 7000, precision: 'fp16'});
  assert.ok(Math.abs(grande.totalGb - 18.9) < 1e-9);
  assert.deepEqual(fittingDevices(grande.totalGb, devices).map((d) => d.name), ['A100']);

  const mediano = inferenceMemory({millionParams: 3000, precision: 'fp16'});
  assert.deepEqual(fittingDevices(mediano.totalGb, devices).map((d) => d.name), ['T4', 'A100']);

  const enorme = inferenceMemory({millionParams: 8000, precision: 'fp32'});
  assert.deepEqual(fittingDevices(enorme.totalGb, devices), []);
});
