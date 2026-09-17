import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  cosineSimilarity,
  unitVector,
  polarVector,
  euclideanDistance,
  rankByCosine,
  nearestByDistance
} from '../src/lib/embeddings.js';

test('el coseno mide dirección y no longitud', () => {
  const corto = polarVector(30, 0.2);
  const largo = polarVector(30, 5);
  assert.ok(Math.abs(cosineSimilarity(corto, largo) - 1) < 1e-12);
  assert.ok(Math.abs(cosineSimilarity(unitVector(0), unitVector(90))) < 1e-12);
  assert.ok(Math.abs(cosineSimilarity(unitVector(0), unitVector(180)) + 1) < 1e-12);
});

test('la distancia euclídea sí cuenta la longitud', () => {
  assert.equal(euclideanDistance([0, 0], [3, 4]), 5);
  const corto = polarVector(30, 0.2);
  const largo = polarVector(30, 5);
  assert.ok(Math.abs(euclideanDistance(corto, largo) - 4.8) < 1e-12);
});

test('el ganador por coseno no tiene por qué ser el más próximo', () => {
  // Misma escena que el laboratorio: gato lejos y casi alineado, perro cerca y torcido.
  const imagen = polarVector(30, 0.55);
  const candidatos = [
    {id: 'gato', vector: polarVector(24, 1)},
    {id: 'perro', vector: polarVector(46, 0.6)},
    {id: 'bicicleta', vector: polarVector(130, 0.95)},
    {id: 'coche', vector: polarVector(152, 0.55)}
  ];

  const ranking = rankByCosine(imagen, candidatos);
  assert.equal(ranking[0].id, 'gato');
  assert.equal(nearestByDistance(imagen, candidatos).id, 'perro');
  assert.ok(ranking[0].distance > ranking[1].distance);
});

test('con vectores normalizados los dos criterios coinciden', () => {
  const imagen = unitVector(30);
  const candidatos = [
    {id: 'gato', vector: unitVector(24)},
    {id: 'perro', vector: unitVector(46)},
    {id: 'coche', vector: unitVector(152)}
  ];
  assert.equal(rankByCosine(imagen, candidatos)[0].id, nearestByDistance(imagen, candidatos).id);
});

test('los dos grupos quedan más cerca por dentro que entre sí', () => {
  const animales = cosineSimilarity(unitVector(24), unitVector(46));
  const vehiculos = cosineSimilarity(unitVector(130), unitVector(152));
  const cruzado = cosineSimilarity(unitVector(46), unitVector(130));
  assert.ok(animales > cruzado);
  assert.ok(vehiculos > cruzado);
});

test('vectores de distinta dimensión no rompen el cálculo', () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0, 0]), 0);
  assert.equal(euclideanDistance([1, 0], [1, 0, 0]), 0);
  assert.equal(nearestByDistance([1, 0], []), null);
});
