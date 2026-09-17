import assert from 'node:assert/strict';
import {test} from 'node:test';
import {flagPatches, inspectPiece, inspectionErrors} from '../src/lib/inspection.js';

const BUENA = [0.9, 1.0, 1.1, 1.28, 0.95];
const DEFECTO = [0.9, 1.4, 1.89, 1.7, 1.0];

test('solo se marcan las celdas por encima del umbral', () => {
  const {flagged, count, max} = flagPatches(DEFECTO, 1.3);
  assert.deepEqual(flagged, [1, 2, 3]);
  assert.equal(count, 3);
  assert.ok(Math.abs(max - 1.89) < 1e-9);
});

test('con el umbral bien puesto la pieza buena pasa y la defectuosa no', () => {
  assert.equal(inspectPiece(BUENA, 1.3).rejected, false);
  assert.equal(inspectPiece(DEFECTO, 1.3).rejected, true);
});

test('bajar el umbral rechaza también la pieza buena', () => {
  assert.equal(inspectPiece(BUENA, 1.0).rejected, true);
});

test('subir el umbral deja escapar el defecto', () => {
  assert.equal(inspectPiece(DEFECTO, 1.95).rejected, false);
});

test('pedir más celdas filtra el ruido suelto', () => {
  const ruido = [0.9, 1.35, 0.9, 0.9];
  assert.equal(inspectPiece(ruido, 1.3).rejected, true);
  assert.equal(inspectPiece(ruido, 1.3, {minCells: 3}).rejected, false);
});

test('la tanda separa falsas alarmas de escapes', () => {
  const tanda = [
    {scores: BUENA, faulty: false},
    {scores: DEFECTO, faulty: true}
  ];
  assert.deepEqual(inspectionErrors(tanda, 1.3), {falseAlarms: 0, escapes: 0});
  assert.deepEqual(inspectionErrors(tanda, 1.0), {falseAlarms: 1, escapes: 0});
  assert.deepEqual(inspectionErrors(tanda, 1.95), {falseAlarms: 0, escapes: 1});
});
