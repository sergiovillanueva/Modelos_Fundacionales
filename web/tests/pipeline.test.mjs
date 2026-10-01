import assert from 'node:assert/strict';
import {test} from 'node:test';
import {PIPELINE_TASKS, PIPELINE_DEVICES, pipelineSnippet, findTask} from '../src/lib/pipeline.js';

test('el fragmento nombra la tarea, el modelo y el dispositivo elegidos', () => {
  const snippet = pipelineSnippet('detectar', 'gpu');
  assert.ok(snippet.includes('"zero-shot-object-detection",'));
  assert.ok(snippet.includes('model="IDEA-Research/grounding-dino-tiny"'));
  assert.ok(snippet.includes('device="cuda"'));
  assert.ok(snippet.startsWith('from transformers import pipeline'));
});

test('cambiar de dispositivo solo cambia esa línea', () => {
  const cpu = pipelineSnippet('clasificar', 'cpu').split('\n');
  const gpu = pipelineSnippet('clasificar', 'gpu').split('\n');
  const distintas = cpu.filter((line, index) => line !== gpu[index]);
  assert.equal(distintas.length, 1);
  assert.ok(distintas[0].includes('device='));
});

test('las tareas con clases abiertas pasan candidate_labels', () => {
  assert.ok(findTask('buscar').call.includes('candidate_labels'));
  assert.ok(findTask('detectar').call.includes('candidate_labels'));
  assert.ok(!findTask('clasificar').call.includes('candidate_labels'));
});

test('cada tarea y cada dispositivo declaran identificador único y nota', () => {
  const ids = PIPELINE_TASKS.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of [...PIPELINE_TASKS, ...PIPELINE_DEVICES]) {
    assert.ok(item.note.length > 20, item.id);
  }
});

test('una combinación inventada no devuelve código', () => {
  assert.equal(pipelineSnippet('inventada', 'cpu'), null);
  assert.equal(pipelineSnippet('clasificar', 'tpu'), null);
});

test('la detección cerrada usa el umbral y no candidate_labels', () => {
  const snippet = pipelineSnippet('detectar-coco', 'gpu');
  assert.ok(snippet.includes('"object-detection",'));
  assert.ok(snippet.includes('model="PekingU/rtdetr_r50vd"'));
  assert.ok(snippet.includes('threshold=0.5'));
  assert.ok(!snippet.includes('candidate_labels'));
});

// Pipeline tasks in transformers 5.18 (src/transformers/pipelines/__init__.py). image-to-text and
// image-to-image were removed in version 5, and keypoint-detection never existed.
const TRANSFORMERS_5_TASKS = new Set([
  'audio-classification', 'automatic-speech-recognition', 'text-to-audio', 'feature-extraction',
  'text-classification', 'token-classification', 'table-question-answering', 'document-question-answering',
  'fill-mask', 'text-generation', 'zero-shot-classification', 'zero-shot-image-classification',
  'zero-shot-audio-classification', 'image-classification', 'image-feature-extraction', 'image-segmentation',
  'image-text-to-text', 'object-detection', 'zero-shot-object-detection', 'depth-estimation',
  'video-classification', 'mask-generation', 'keypoint-matching', 'any-to-any'
]);

test('cada tarea del constructor existe en transformers 5', () => {
  for (const task of PIPELINE_TASKS) {
    assert.ok(TRANSFORMERS_5_TASKS.has(task.task), `${task.id}: «${task.task}» no es una tarea de pipeline en transformers 5`);
  }
});

test('ningún bloque de código del curso llama a una pipeline que ya no existe', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const content = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '../content');
  for (const dir of fs.readdirSync(content).filter((name) => name.startsWith('tema-'))) {
    const html = fs.readFileSync(path.join(content, dir, 'sections.html'), 'utf8');
    for (const block of html.match(/<pre class="code-sample"[\s\S]*?<\/pre>/g) || []) {
      for (const [, task] of block.matchAll(/pipeline\(\s*"([a-z-]+)"/g)) {
        assert.ok(TRANSFORMERS_5_TASKS.has(task), `${dir}: pipeline("${task}") no existe en transformers 5`);
      }
    }
  }
});
