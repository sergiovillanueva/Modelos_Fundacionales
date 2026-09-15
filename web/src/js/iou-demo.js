import {iou} from '../lib/metrics.js';

export function initIouDemo(root = document) {
  const lab = root.querySelector('[data-iou-demo]');
  if (!lab) return;

  const slider = lab.querySelector('[data-iou-offset]');
  const predicted = lab.querySelector('[data-iou-prediction]');
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
    intersection.setAttribute('x', String(overlapStart));
    intersection.setAttribute('width', String(Math.max(0, overlapEnd - overlapStart)));
    output.textContent = value.toFixed(2);
    message.textContent = value >= 0.5
      ? 'Con IoU ≥ 0,50, la localización supera este criterio geométrico.'
      : 'Con IoU < 0,50, la localización no supera este criterio geométrico.';
  }

  slider.addEventListener('input', update);
  update();
}

