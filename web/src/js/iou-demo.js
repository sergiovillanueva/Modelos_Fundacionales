import {iou} from '../lib/metrics.js';

export function initIouDemo(root = document) {
  const lab = root.querySelector('[data-iou-demo]');
  if (!lab) return;

  const slider = lab.querySelector('[data-iou-offset]');
  const predicted = lab.querySelector('[data-iou-prediction]');
  const predictionLabel = lab.querySelector('[data-iou-label]');
  const intersection = lab.querySelector('[data-iou-intersection]');
  const output = lab.querySelector('[data-iou-value]');
  const message = lab.querySelector('[data-iou-message]');

  if (!slider || !predicted || !intersection || !output || !message) return;

  const reference = [20, 20, 60, 60];

  function update() {
    const x = Number(slider.value);
    const prediction = [x, 20, x + 40, 60];
    const value = iou(reference, prediction);
    const overlapStart = Math.max(20, x);
    const overlapEnd = Math.min(60, x + 40);

    predicted.setAttribute('x', String(x));
    predictionLabel?.setAttribute('x', String(x + 20));
    intersection.setAttribute('x', String(overlapStart));
    intersection.setAttribute('width', String(Math.max(0, overlapEnd - overlapStart)));
    output.textContent = value.toFixed(2);
    message.textContent = value === 1 ? 'Coincidencia perfecta.'
      : value === 0 ? 'Sin solapamiento.' : 'Solapamiento parcial.';
    slider.setAttribute('aria-valuetext', `IoU ${value.toFixed(2)}. ${message.textContent}`);
  }

  slider.addEventListener('input', update);
  update();
}
