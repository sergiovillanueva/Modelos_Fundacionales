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

