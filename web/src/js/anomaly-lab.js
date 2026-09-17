import {scorePatch} from '../lib/anomaly.js';

function formatScore(value) {
  return value.toFixed(2).replace('.', ',');
}

export function initAnomalyLab(root = document) {
  const lab = root.querySelector('[data-anomaly-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-anomaly-position]');
  const patchNode = lab.querySelector('[data-anomaly-patch]');
  const linkNode = lab.querySelector('[data-anomaly-link]');
  const scoreNode = lab.querySelector('[data-anomaly-score]');
  const verdictNode = lab.querySelector('[data-anomaly-verdict]');
  const message = lab.querySelector('[data-anomaly-message]');
  if (!slider || !patchNode || !linkNode || !scoreNode || !verdictNode || !message) return;

  const threshold = Number(lab.dataset.threshold || 14);
  const path = {
    fromX: Number(lab.dataset.fromX || 48),
    fromY: Number(lab.dataset.fromY || 52),
    toX: Number(lab.dataset.toX || 132),
    toY: Number(lab.dataset.toY || 22)
  };

  const bank = [...lab.querySelectorAll('[data-normal]')].map((node) => ({
    node,
    point: [Number(node.getAttribute('cx')), Number(node.getAttribute('cy'))]
  }));
  if (!bank.length) return;

  function update() {
    const ratio = Number(slider.value) / 100;
    const x = path.fromX + (path.toX - path.fromX) * ratio;
    const y = path.fromY + (path.toY - path.fromY) * ratio;
    const result = scorePatch(bank, [x, y]);

    patchNode.setAttribute('cx', x.toFixed(2));
    patchNode.setAttribute('cy', y.toFixed(2));
    linkNode.setAttribute('x1', x.toFixed(2));
    linkNode.setAttribute('y1', y.toFixed(2));
    linkNode.setAttribute('x2', String(result.nearest.point[0]));
    linkNode.setAttribute('y2', String(result.nearest.point[1]));

    for (const entry of bank) {
      entry.node.classList.toggle('is-nearest', entry === result.nearest);
    }

    const anomaly = result.score > threshold;
    scoreNode.textContent = formatScore(result.score);
    verdictNode.textContent = anomaly ? 'Anomalía' : 'Normal';
    verdictNode.className = `verdict is-${anomaly ? 'prohibido' : 'permitido'}`;
    patchNode.setAttribute('class', `anomaly-patch is-${anomaly ? 'anomaly' : 'normal'}`);
    message.textContent = anomaly
      ? `El parche queda a ${formatScore(result.score)} de lo más parecido que hay en el banco, por encima del umbral ${formatScore(threshold)}.`
      : `Hay un parche normal a ${formatScore(result.score)}, por debajo del umbral ${formatScore(threshold)}: nada que señalar.`;
    slider.setAttribute('aria-valuetext', `Distancia al vecino más cercano ${formatScore(result.score)}. ${anomaly ? 'Anomalía' : 'Normal'}.`);
  }

  slider.addEventListener('input', update);
  update();
}
