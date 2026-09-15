import assert from 'node:assert/strict';
import {test} from 'node:test';
import {relativeUrl} from '../scripts/paths.mjs';

test('ruta de tema a descarga', () => {
  assert.equal(relativeUrl('temas/01-deteccion/index.html', 'descargas/tema-01-deteccion.pdf'), '../../descargas/tema-01-deteccion.pdf');
});

test('ruta de portada a tema', () => {
  assert.equal(relativeUrl('index.html', 'temas/01-deteccion/index.html'), 'temas/01-deteccion/index.html');
});

test('ruta entre páginas al mismo nivel', () => {
  assert.equal(relativeUrl('creditos.html', 'index.html'), 'index.html');
});

test('ruta desde subcarpeta a recurso raíz', () => {
  assert.equal(relativeUrl('temas/01-deteccion/presentar.html', 'assets/brand/logo.png'), '../../assets/brand/logo.png');
});
