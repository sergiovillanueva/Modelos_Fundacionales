import assert from 'node:assert/strict';
import {test} from 'node:test';
import {applyHomography, reprojectionError, verifyMatches} from '../src/lib/matching.js';

const IDENTIDAD = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const DESPLAZA = [1, 0, 10, 0, 1, 5, 0, 0, 1];

test('la identidad deja el punto donde estaba', () => {
  assert.deepEqual(applyHomography(IDENTIDAD, [7, 3]), [7, 3]);
});

test('una traslación mueve el punto y el error lo mide', () => {
  assert.deepEqual(applyHomography(DESPLAZA, [0, 0]), [10, 5]);
  assert.equal(reprojectionError(DESPLAZA, [0, 0], [10, 5]), 0);
  assert.equal(reprojectionError(DESPLAZA, [0, 0], [13, 9]), 5);
});

test('la división por la tercera fila es lo que da la perspectiva', () => {
  const perspectiva = [1, 0, 0, 0, 1, 0, 0, 0.5, 1];
  assert.deepEqual(applyHomography(perspectiva, [4, 2]), [2, 1]);
  assert.equal(applyHomography([1, 0, 0, 0, 1, 0, 0, 0, 0], [1, 1]), null);
});

test('el umbral reparte las parejas y decide si hay estimación', () => {
  const parejas = [
    {source: [0, 0], observed: [10, 5]},
    {source: [1, 1], observed: [11, 6]},
    {source: [2, 2], observed: [12, 7]},
    {source: [3, 3], observed: [13, 8]},
    {source: [4, 4], observed: [60, 60]}
  ];

  const estricto = verifyMatches(DESPLAZA, parejas, 1, {minimum: 4});
  assert.equal(estricto.inliers.length, 4);
  assert.equal(estricto.outliers.length, 1);
  assert.equal(estricto.reliable, true);
  assert.equal(estricto.solvable, true);
  assert.ok(Math.abs(estricto.ratio - 0.8) < 1e-9);

  const imposible = verifyMatches(DESPLAZA, parejas.slice(0, 3), 1, {minimum: 4});
  assert.equal(imposible.solvable, false);

  const permisivo = verifyMatches(DESPLAZA, parejas, 100, {minimum: 4});
  assert.equal(permisivo.outliers.length, 0);
});

test('una pareja colada por un umbral holgado contamina la estimación aunque sobren parejas', () => {
  const parejas = [
    {source: [0, 0], observed: [10, 5]},
    {source: [1, 1], observed: [11, 6]},
    {source: [2, 2], observed: [12, 7]},
    {source: [3, 3], observed: [13, 8]},
    {source: [4, 4], observed: [20, 9]}
  ];
  const limpio = verifyMatches(DESPLAZA, parejas, 1, {minimum: 4, noise: 3});
  assert.equal(limpio.reliable, true);
  assert.equal(limpio.contaminated, 0);

  const holgado = verifyMatches(DESPLAZA, parejas, 10, {minimum: 4, noise: 3});
  assert.equal(holgado.inliers.length, 5);
  assert.equal(holgado.contaminated, 1);
  assert.equal(holgado.reliable, false);
});
