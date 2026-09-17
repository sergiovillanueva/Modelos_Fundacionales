import assert from 'node:assert/strict';
import {test} from 'node:test';
import {COCO_SIGMAS, keypointOks, poseOks, distanceForOks} from '../src/lib/keypoints.js';

const SCALE = 150;
const ojo = 0.025;
const cadera = 0.107;

test('sin error, un punto clave vale 1', () => {
  assert.equal(keypointOks(0, ojo, SCALE), 1);
});

test('el mismo error penaliza mucho más en un punto rígido que en uno flexible', () => {
  const rigido = keypointOks(5, ojo, SCALE);
  const flexible = keypointOks(5, cadera, SCALE);
  assert.ok(rigido < flexible);
  assert.ok(Math.abs(rigido - 0.8007) < 1e-3);
  assert.ok(Math.abs(flexible - 0.9879) < 1e-3);
});

test('la similitud baja de forma monótona al aumentar el error', () => {
  let previous = 1;
  for (const distance of [2, 5, 10, 20, 40]) {
    const current = keypointOks(distance, ojo, SCALE);
    assert.ok(current < previous, `${distance} px no baja respecto al anterior`);
    previous = current;
  }
  assert.ok(previous > 0);
});

test('una persona más grande tolera más error en píxeles', () => {
  assert.ok(keypointOks(10, ojo, 300) > keypointOks(10, ojo, 150));
});

test('el OKS del esqueleto es la media de los puntos visibles', () => {
  const keypoints = [
    {distance: 0, sigma: ojo},
    {distance: 0, sigma: cadera},
    {distance: 999, sigma: ojo, visible: false}
  ];
  assert.equal(poseOks(keypoints, SCALE), 1);
  assert.equal(poseOks([], SCALE), null);
});

test('la distancia que deja un punto en 0,5 crece con la tolerancia', () => {
  const rigido = distanceForOks(0.5, ojo, SCALE);
  const flexible = distanceForOks(0.5, cadera, SCALE);
  assert.ok(flexible > rigido * 4);
  assert.ok(Math.abs(keypointOks(rigido, ojo, SCALE) - 0.5) < 1e-9);
});

test('las constantes COCO cubren los diecisiete puntos del estándar', () => {
  const rigidos = COCO_SIGMAS.filter((item) => item.kind === 'rígido');
  const flexibles = COCO_SIGMAS.filter((item) => item.kind === 'flexible');
  assert.equal(COCO_SIGMAS.length, 9);
  assert.ok(Math.max(...rigidos.map((item) => item.sigma)) < Math.min(...flexibles.map((item) => item.sigma)));
});
