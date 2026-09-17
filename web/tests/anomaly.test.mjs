import assert from 'node:assert/strict';
import {test} from 'node:test';
import {euclidean, scorePatch, buildCoreSet} from '../src/lib/anomaly.js';

const bank = [
  {id: 'a', point: [0, 0]},
  {id: 'b', point: [3, 4]},
  {id: 'c', point: [10, 0]},
  {id: 'd', point: [10, 10]}
];

test('la distancia euclídea usa el teorema de Pitágoras', () => {
  assert.equal(euclidean([0, 0], [3, 4]), 5);
});

test('un parche dentro del banco puntúa bajo y encuentra su vecino', () => {
  const result = scorePatch(bank, [3, 5]);
  assert.equal(result.nearest.id, 'b');
  assert.equal(result.score, 1);
});

test('alejarse del banco sube la puntuación de anomalía', () => {
  const cerca = scorePatch(bank, [1, 1]).score;
  const lejos = scorePatch(bank, [40, 40]).score;
  assert.ok(lejos > cerca);
});

test('un banco vacío no puede puntuar nada', () => {
  assert.equal(scorePatch([], [0, 0]), null);
});

test('el CoreSet cubre los extremos en vez de repetir vecinos', () => {
  const core = buildCoreSet(bank, 2);
  assert.equal(core.length, 2);
  assert.ok(core.includes(bank[0]));
  // El segundo elegido es el más alejado del primero, no su vecino inmediato.
  assert.equal(core[1].id, 'd');
});

test('pedir un CoreSet mayor que el banco devuelve el banco entero', () => {
  assert.equal(buildCoreSet(bank, 10).length, bank.length);
});
