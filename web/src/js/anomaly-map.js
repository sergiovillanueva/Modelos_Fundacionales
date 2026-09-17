import {inspectPiece} from '../lib/inspection.js';

const SVG = 'http://www.w3.org/2000/svg';

function formatScore(value) {
  return value.toFixed(2).replace('.', ',');
}

export function initAnomalyMap(root = document) {
  const labs = root.querySelectorAll('[data-anomaly-map]');

  labs.forEach((lab) => {
    const photo = lab.querySelector('[data-anomaly-photo]');
    const grid = lab.querySelector('[data-anomaly-grid]');
    const slider = lab.querySelector('[data-anomaly-threshold]');
    const buttons = [...lab.querySelectorAll('[data-anomaly-piece]')];
    if (!photo || !grid || !slider || !buttons.length) return;

    const readout = lab.querySelector('[data-anomaly-threshold-value]');
    const countValue = lab.querySelector('[data-anomaly-count]');
    const maxValue = lab.querySelector('[data-anomaly-max]');
    const verdict = lab.querySelector('[data-anomaly-map-verdict]');
    const message = lab.querySelector('[data-anomaly-map-message]');

    const size = Number(lab.dataset.grid || 16);
    const cells = [];
    for (let index = 0; index < size * size; index += 1) {
      const rect = document.createElementNS(SVG, 'rect');
      rect.setAttribute('x', String(index % size));
      rect.setAttribute('y', String(Math.floor(index / size)));
      rect.setAttribute('width', '1');
      rect.setAttribute('height', '1');
      grid.appendChild(rect);
      cells.push(rect);
    }

    function current() {
      return buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || buttons[0];
    }

    function render() {
      const button = current();
      const scores = JSON.parse(button.dataset.scores);
      const threshold = Number(slider.value);
      const {flagged, count, max, rejected} = inspectPiece(scores, threshold);
      const faulty = button.dataset.faulty === 'true';
      const marked = new Set(flagged);

      photo.src = button.dataset.photo;
      photo.alt = button.dataset.photoAlt || '';

      cells.forEach((rect, index) => {
        rect.classList.toggle('is-flagged', marked.has(index));
        // La opacidad recuerda que el mapa es continuo y el umbral solo lo corta.
        rect.style.setProperty('--heat', Math.max(0, Math.min(1, (scores[index] - 1.1) / 0.8)).toFixed(3));
      });

      if (readout) readout.textContent = formatScore(threshold);
      if (countValue) countValue.textContent = String(count);
      if (maxValue) maxValue.textContent = formatScore(max);
      if (verdict) {
        verdict.textContent = rejected ? 'Se rechaza' : 'Se acepta';
        verdict.classList.toggle('is-prohibido', rejected);
        verdict.classList.toggle('is-permitido', !rejected);
      }

      if (message) {
        if (rejected && faulty) {
          message.textContent = `El defecto queda marcado con ${count} celdas, y la más alta llega a ${formatScore(max)}. La pieza sale de la línea.`;
        } else if (rejected && !faulty) {
          message.textContent = `Falsa alarma: esta pieza está bien y aun así ${count} celdas superan el umbral. Bajar el umbral sale caro en producción.`;
        } else if (!rejected && faulty) {
          message.textContent = `El defecto se escapa: ninguna celda pasa de ${formatScore(threshold)} y la más alta se queda en ${formatScore(max)}.`;
        } else {
          message.textContent = `Ninguna celda supera el umbral y la más alta se queda en ${formatScore(max)}. La pieza pasa.`;
        }
      }

      slider.setAttribute(
        'aria-valuetext',
        `Umbral ${formatScore(threshold)}. ${count} celdas marcadas. ${rejected ? 'Se rechaza' : 'Se acepta'}.`
      );
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        render();
      });
    });
    slider.addEventListener('input', render);
    render();
  });
}
