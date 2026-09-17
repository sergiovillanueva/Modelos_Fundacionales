/**
 * Genera el fragmento de código de un `pipeline` de Transformers a partir de la
 * tarea elegida y del dispositivo. La cadena resultante es la que se copia.
 */

export const PIPELINE_TASKS = [
  {
    id: 'clasificar',
    label: 'Clasificar la imagen entera',
    task: 'image-classification',
    model: 'google/vit-base-patch16-224',
    call: 'salida = pipe("foto.jpg")',
    print: 'print(salida[:3])',
    note: 'ViT base, 86 M de parámetros. Devuelve etiquetas de las 1.000 de ImageNet, así que solo sirve si tus clases están ahí.'
  },
  {
    id: 'buscar',
    label: 'Decidir entre textos que yo escribo',
    task: 'zero-shot-image-classification',
    model: 'openai/clip-vit-base-patch32',
    call: 'etiquetas = ["una caja rota", "una caja intacta"]\nsalida = pipe("foto.jpg", candidate_labels=etiquetas)',
    print: 'print(salida)',
    note: 'CLIP compara la imagen con cada texto. Cambiar las clases es cambiar la lista, sin reentrenar nada.'
  },
  {
    id: 'detectar',
    label: 'Localizar objetos descritos con palabras',
    task: 'zero-shot-object-detection',
    model: 'IDEA-Research/grounding-dino-tiny',
    call: 'etiquetas = ["una caja", "una persona"]\nsalida = pipe("foto.jpg", candidate_labels=etiquetas)',
    print: 'print([(d["label"], round(d["score"], 2)) for d in salida])',
    note: 'Grounding DINO devuelve cajas con su puntuación. Pide conceptos concretos: «una caja de cartón» funciona mejor que «objeto».'
  },
  {
    id: 'describir',
    label: 'Describir la escena en una frase',
    task: 'image-to-text',
    model: 'Salesforce/blip-image-captioning-base',
    call: 'salida = pipe("foto.jpg")',
    print: 'print(salida[0]["generated_text"])',
    note: 'BLIP redacta un pie de foto en inglés. Útil para indexar imágenes, poco fiable para leer cifras o texto pequeño.'
  }
];

export const PIPELINE_DEVICES = [
  {id: 'cpu', label: 'CPU', value: 'cpu', note: 'Arranca en cualquier portátil. Cuenta con segundos por imagen.'},
  {id: 'gpu', label: 'GPU', value: 'cuda', note: 'Con la GPU de Colab bajas a décimas de segundo por imagen.'}
];

export function findTask(id) {
  return PIPELINE_TASKS.find((item) => item.id === id) || null;
}

export function findDevice(id) {
  return PIPELINE_DEVICES.find((item) => item.id === id) || null;
}

export function pipelineSnippet(taskId, deviceId) {
  const task = findTask(taskId);
  const device = findDevice(deviceId);
  if (!task || !device) return null;

  return [
    'from transformers import pipeline',
    '',
    'pipe = pipeline(',
    `    "${task.task}",`,
    `    model="${task.model}",`,
    `    device="${device.value}",`,
    ')',
    task.call,
    task.print
  ].join('\n');
}
