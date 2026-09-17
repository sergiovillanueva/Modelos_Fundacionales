import {nonMaxSuppression} from '../lib/metrics.js';

function formatThreshold(value) {
  return value.toFixed(2).replace('.', ',');
}

export function initNmsLab(root = document) {
  const lab = root.querySelector('[data-nms-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-nms-threshold]');
  const message = lab.querySelector('[data-nms-message]');
  const keptNode = lab.querySelector('[data-nms-kept]');
  const suppressedNode = lab.querySelector('[data-nms-suppressed]');
  const valueNode = lab.querySelector('[data-nms-value]');
  if (!slider || !message || !keptNode || !suppressedNode || !valueNode) return;

  const candidates = [...lab.querySelectorAll('[data-candidate-box]')].map((node) => {
    const rect = node.querySelector('rect');
    const x = Number(rect.getAttribute('x'));
    const y = Number(rect.getAttribute('y'));
    return {
      id: node.dataset.candidateBox,
      object: node.dataset.object,
      score: Number(node.dataset.score),
      node,
      box: [x, y, x + Number(rect.getAttribute('width')), y + Number(rect.getAttribute('height'))]
    };
  });
  if (!candidates.length) return;

  const objects = new Set(candidates.map((item) => item.object));

  function update() {
    const threshold = Number(slider.value) / 100;
    const result = nonMaxSuppression(candidates, threshold);
    const kept = new Set(result.kept);
    const keptObjects = new Set(candidates.filter((item) => kept.has(item.id)).map((item) => item.object));

    for (const candidate of candidates) {
      candidate.node.setAttribute('class', `candidate-box is-${kept.has(candidate.id) ? 'kept' : 'suppressed'}`);
    }

    valueNode.textContent = formatThreshold(threshold);
    keptNode.textContent = String(result.keptCount);
    suppressedNode.textContent = String(result.suppressedCount);

    if (keptObjects.size < objects.size) {
      message.textContent = 'El umbral es tan bajo que una caja borra a la del coche vecino: se pierde un objeto real.';
    } else if (result.keptCount === objects.size) {
      message.textContent = 'Una caja por coche: el umbral limpia los duplicados sin borrar objetos.';
    } else {
      message.textContent = `Quedan ${result.keptCount} cajas para ${objects.size} coches: sobreviven duplicados.`;
    }

    slider.setAttribute(
      'aria-valuetext',
      `Umbral IoU ${formatThreshold(threshold)}. Quedan ${result.keptCount} cajas y se suprimen ${result.suppressedCount}.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
