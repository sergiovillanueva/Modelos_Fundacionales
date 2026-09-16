import {predictMask, describeMask} from '../lib/prompting.js';

const SIGN_LABEL = {positive: 'punto positivo', negative: 'punto negativo'};

export function initPromptLab(root = document) {
  const lab = root.querySelector('[data-prompt-lab]');
  if (!lab) return;

  const nodes = [...lab.querySelectorAll('[data-region]')];
  const message = lab.querySelector('[data-prompt-message]');
  const counter = lab.querySelector('[data-prompt-count]');
  const modeButtons = [...lab.querySelectorAll('[data-prompt-mode]')];
  if (!nodes.length || !message || !modeButtons.length) return;

  const regions = nodes.map((node) => ({
    id: node.dataset.region,
    object: node.dataset.object,
    name: node.dataset.name,
    node,
    dot: lab.querySelector(`[data-dot="${node.dataset.region}"]`)
  }));
  const points = new Map();
  let mode = 'positive';

  for (const region of regions) {
    if (region.node.dataset.start) points.set(region.id, region.node.dataset.start);
  }

  function render() {
    const mask = predictMask(regions, points);
    const inside = new Set(mask);

    for (const region of regions) {
      const sign = points.get(region.id);
      region.node.classList.toggle('is-inside', inside.has(region.id));
      region.node.setAttribute(
        'aria-label',
        `${region.name}. ${inside.has(region.id) ? 'Dentro de la máscara' : 'Fuera de la máscara'}${sign ? `, con ${SIGN_LABEL[sign]}` : ''}.`
      );
      region.node.setAttribute('aria-pressed', sign ? 'true' : 'false');
      if (region.dot) {
        region.dot.setAttribute('class', sign ? `prompt-dot is-${sign}` : 'prompt-dot is-empty');
        const glyph = region.dot.querySelector('text');
        if (glyph) glyph.textContent = sign === 'negative' ? '−' : '+';
      }
    }

    message.textContent = describeMask(regions, points, mask);
    if (counter) counter.textContent = String(points.size);
  }

  function toggle(region) {
    // Volver a marcar con el mismo signo retira el punto: así no hace falta un botón de reinicio.
    if (points.get(region.id) === mode) points.delete(region.id);
    else points.set(region.id, mode);
    render();
  }

  for (const region of regions) {
    region.node.addEventListener('click', () => toggle(region));
    region.node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      toggle(region);
    });
  }

  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      mode = button.dataset.promptMode;
      for (const item of modeButtons) item.setAttribute('aria-pressed', String(item === button));
    });
  }

  render();
}
