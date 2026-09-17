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
