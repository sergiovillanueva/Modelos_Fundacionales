import assert from 'node:assert/strict';
import {test} from 'node:test';
import {iou} from '../src/lib/metrics.js';

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

