import assert from 'node:assert/strict';
import {test} from 'node:test';
import {relativeUrl, absoluteUrl} from '../scripts/paths.mjs';

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

test('URL absoluta de la portada, sin index.html a la vista', () => {
  assert.equal(absoluteUrl('https://ejemplo.com', 'index.html'), 'https://ejemplo.com/');
});

test('URL absoluta de un tema: queda la carpeta, no el fichero', () => {
  assert.equal(absoluteUrl('https://ejemplo.com', 'temas/04-dino/index.html'), 'https://ejemplo.com/temas/04-dino/');
});

test('URL absoluta de un recurso, aunque el dominio traiga barra de sobra', () => {
  assert.equal(absoluteUrl('https://ejemplo.com/', 'assets/brand/social-card.png'), 'https://ejemplo.com/assets/brand/social-card.png');
});
