import assert from 'node:assert/strict';
import {test} from 'node:test';
import {cellForPoint, assignCells} from '../src/lib/grid.js';

const objetos = [
  {id: 'o1', centre: {x: 46 / 160, y: 52 / 100}},
  {id: 'o2', centre: {x: 50 / 160, y: 58 / 100}},
  {id: 'o3', centre: {x: 118 / 160, y: 44 / 100}}
];

test('el centro de la imagen cae en la celda central de una cuadrícula impar', () => {
  assert.deepEqual(cellForPoint({x: 0.5, y: 0.5}, 3), {row: 1, column: 1, key: '1-1'});
});

test('un punto en el borde derecho no se sale de la cuadrícula', () => {
  assert.deepEqual(cellForPoint({x: 1, y: 1}, 7), {row: 6, column: 6, key: '6-6'});
});

test('con la cuadrícula de YOLOv1 los tres objetos tienen celda propia', () => {
  const result = assignCells(objetos, 7);
  assert.equal(result.collisions.length, 0);
  assert.equal(result.detectable, 3);
});

test('al bajar la cuadrícula dos centros comparten celda y se pierde un objeto', () => {
  for (const size of [3, 4, 5, 6]) {
    const result = assignCells(objetos, size);
    assert.equal(result.collisions.length, 1, `la cuadrícula ${size} debería colisionar`);
    assert.equal(result.detectable, 2);
  }
});

test('subir la cuadrícula no garantiza separar dos centros cercanos', () => {
  // Lo que decide es dónde caen las líneas de la rejilla, así que el reparto no es monótono.
  const reparto = {};
  for (let size = 2; size <= 13; size += 1) {
    reparto[size] = assignCells(objetos, size).detectable;
  }
  assert.equal(reparto[7], 3);
  assert.equal(reparto[8], 2, 'con 8 × 8 los dos centros vuelven a compartir celda');
  assert.equal(reparto[12], 2, 'con 12 × 12 vuelven a compartir celda');
  assert.ok(reparto[8] < reparto[7]);
});

test('una celda compartida se cuenta una sola vez', () => {
  const result = assignCells(objetos, 4);
  assert.equal(result.collisions.length, 1);
  assert.equal(new Set(result.assignments.map((item) => item.cell.key)).size, 2);
});
