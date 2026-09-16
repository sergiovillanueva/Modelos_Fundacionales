import {matchDetections} from '../lib/metrics.js';

const OUTCOME_LABEL = {tp: 'TP', fp: 'FP'};

function readBox(rect) {
  const x = Number(rect.getAttribute('x'));
  const y = Number(rect.getAttribute('y'));
  return [x, y, x + Number(rect.getAttribute('width')), y + Number(rect.getAttribute('height'))];
}

function formatScore(value) {
  return value.toFixed(2).replace('.', ',');
}

function formatMetric(value) {
  return value === null ? '—' : formatScore(value);
}

export function initThresholdLab(root = document) {
  const lab = root.querySelector('[data-threshold-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-threshold-score]');
  const message = lab.querySelector('[data-threshold-message]');
  if (!slider || !message) return;

  const truths = [...lab.querySelectorAll('[data-truth]')].map((node) => ({
    id: node.dataset.truth,
    node,
    box: readBox(node)
  }));
  const predictions = [...lab.querySelectorAll('[data-prediction]')].map((node) => ({
    id: node.dataset.prediction,
    node,
    label: node.querySelector('text'),
    score: Number(node.dataset.score),
    box: readBox(node.querySelector('rect'))
  }));
  if (!truths.length || !predictions.length) return;

  const readouts = {
    precision: lab.querySelector('[data-threshold-precision]'),
    recall: lab.querySelector('[data-threshold-recall]'),
    tp: lab.querySelector('[data-threshold-tp]'),
    fp: lab.querySelector('[data-threshold-fp]'),
    fn: lab.querySelector('[data-threshold-fn]'),
    value: lab.querySelector('[data-threshold-value]')
  };

  function hasDuplicate(result) {
    return [...result.outcomes.values()].some((verdict) => verdict.outcome === 'fp' && verdict.overlap >= 0.5);
  }

  function describe(result, scoreThreshold) {
    if (result.precision === null) {
      return 'Con este umbral no queda ninguna predicción: el detector no propone nada.';
    }
    if (hasDuplicate(result)) {
      return 'Una predicción repite un objeto que ya estaba emparejado: cuenta como falsa alarma.';
    }
    if (result.falsePositives > 0 && result.falseNegatives === 0) {
      return 'Se ven todos los objetos, pero también sobran predicciones.';
    }
    if (result.falsePositives === 0 && result.falseNegatives === 0) {
      return 'Cada objeto tiene una predicción y ninguna sobra.';
    }
    if (result.falsePositives === 0 && result.falseNegatives > 0) {
      return 'Ya no sobra ninguna predicción, pero hay objetos sin detectar.';
    }
    return `Con umbral ${formatScore(scoreThreshold)} quedan aciertos, falsas alarmas y objetos perdidos.`;
  }

  function update() {
    const scoreThreshold = Number(slider.value) / 100;
    const result = matchDetections(truths, predictions, {scoreThreshold, iouThreshold: 0.5});

    for (const prediction of predictions) {
      const verdict = result.outcomes.get(prediction.id);
      const state = verdict ? verdict.outcome : 'filtered';
      prediction.node.setAttribute('class', `prediction is-${state}`);
      if (prediction.label) {
        prediction.label.textContent = verdict
          ? `${formatScore(prediction.score)} · ${OUTCOME_LABEL[verdict.outcome]}`
          : formatScore(prediction.score);
      }
    }

    for (const truth of truths) {
      truth.node.setAttribute('class', result.missed.includes(truth.id) ? 'truth is-missed' : 'truth');
    }

    readouts.precision.textContent = formatMetric(result.precision);
    readouts.recall.textContent = formatMetric(result.recall);
    readouts.tp.textContent = String(result.truePositives);
    readouts.fp.textContent = String(result.falsePositives);
    readouts.fn.textContent = String(result.falseNegatives);
    readouts.value.textContent = formatScore(scoreThreshold);
    message.textContent = describe(result, scoreThreshold);
    slider.setAttribute(
      'aria-valuetext',
      `Umbral ${formatScore(scoreThreshold)}. Precisión ${formatMetric(result.precision)}, recall ${formatMetric(result.recall)}. ${result.truePositives} aciertos, ${result.falsePositives} falsas alarmas, ${result.falseNegatives} objetos sin detectar.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
