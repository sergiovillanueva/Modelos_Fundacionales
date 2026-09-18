import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderTopic} from '../scripts/render.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const course = JSON.parse(fs.readFileSync(path.resolve(here, '../content/course.json'), 'utf8'));
const topic = course.topics.find((item) => item.id === '01-deteccion');

test('la lectura renderizada no contiene identificadores HTML duplicados', () => {
  const html = renderTopic(course, topic, 'reading');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('la pregunta ofrece una respuesta explicada sin botón de comprobación', () => {
  const html = renderTopic(course, topic, 'reading');
  assert.match(html, /data-question-id="q01"/);
  assert.match(html, /data-correct-option="b"/);
  assert.doesNotMatch(html, />Comprobar</);
});


test('la lectura declara canonical y tarjeta social con direcciones absolutas', () => {
  const html = renderTopic(course, topic, 'reading');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const imagen = html.match(/<meta property="og:image" content="([^"]+)">/)?.[1];
  // Las redes descartan la tarjeta si la direccion es relativa, y sin avisar.
  assert.ok(canonical?.startsWith('https://'), `canonical relativa: ${canonical}`);
  assert.ok(imagen?.startsWith('https://'), `og:image relativa: ${imagen}`);
});

test('la presentacion no se indexa, para no duplicar el tema', () => {
  const html = renderTopic(course, topic, 'presentation');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test('la imagen de la tarjeta existe y mide lo que dicen las etiquetas', () => {
  const ruta = path.resolve(here, '../public/assets/brand/social-card.png');
  assert.ok(fs.existsSync(ruta), 'falta social-card.png');
  // Un PNG guarda ancho y alto en la cabecera IHDR, bytes 16 a 24.
  const cabecera = fs.readFileSync(ruta).subarray(16, 24);
  assert.equal(cabecera.readUInt32BE(0), 1200);
  assert.equal(cabecera.readUInt32BE(4), 630);

  const html = renderTopic(course, topic, 'reading');
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
});
