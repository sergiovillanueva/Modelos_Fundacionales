import {verifyMatches} from '../lib/matching.js';

function formatPx(value) {
  return `${value.toFixed(2).replace('.', ',')} px`;
}

export function initMatchingLab(root = document) {
  const lab = root.querySelector('[data-matching-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-matching-threshold]');
  const readout = lab.querySelector('[data-matching-threshold-value]');
  const kept = lab.querySelector('[data-matching-kept]');
  const dropped = lab.querySelector('[data-matching-dropped]');
  const verdict = lab.querySelector('[data-matching-verdict]');
  const message = lab.querySelector('[data-matching-message]');
  if (!slider) return;

  const homography = (lab.dataset.homography || '').split(',').map(Number);
  // Por debajo de este error, la diferencia es ruido de medida y no un emparejamiento malo.
  const ruido = Number(lab.dataset.noise || 3);
  const pairs = [...lab.querySelectorAll('[data-match]')].map((node) => ({
    node,
    note: node.dataset.note || '',
    source: node.dataset.source.split(',').map(Number),
    observed: node.dataset.observed.split(',').map(Number)
  }));
  if (homography.length !== 9 || !pairs.length) return;

  function update() {
    const threshold = Number(slider.value);
    const {scored, inliers, reliable, solvable} = verifyMatches(homography, pairs, threshold);

    for (const pair of scored) {
      pair.node.classList.toggle('is-inlier', pair.error <= threshold);
      pair.node.classList.toggle('is-outlier', pair.error > threshold);
    }

    if (readout) readout.textContent = formatPx(threshold);
    if (kept) kept.textContent = String(inliers.length);
    if (dropped) dropped.textContent = String(scored.length - inliers.length);

    if (verdict) {
      verdict.textContent = reliable ? 'Estimación sólida' : solvable ? 'Estimación frágil' : 'Sin solución';
      verdict.classList.toggle('is-permitido', reliable);
      verdict.classList.toggle('is-condiciones', !reliable && solvable);
      verdict.classList.toggle('is-prohibido', !solvable);
    }

    if (message) {
      // Una pareja que solo entra al abrir el umbral es ruido colado, tenga nombre o no.
      const colados = inliers.filter((pair) => pair.error > ruido);
      if (!solvable) {
        message.textContent = `Con ${inliers.length} parejas no hay ni las cuatro que pide una homografía. El umbral está tan cerrado que ni las buenas pasan.`;
      } else if (colados.length) {
        const detalle = colados.find((pair) => pair.note)?.note;
        message.textContent = `Se han colado ${colados.length} parejas que no encajan con la escena${detalle ? ` (${detalle})` : ''}. Con el umbral alto entra ruido y la estimación se tuerce.`;
      } else if (!reliable) {
        message.textContent = `${inliers.length} parejas coherentes bastan para calcular, pero cualquier error de medida se nota. Conviene apoyarse en más.`;
      } else {
        message.textContent = `${inliers.length} parejas coherentes y ${scored.length - inliers.length} descartadas. Las descartadas son las que se parecían sin estar en el mismo sitio.`;
      }
    }

    slider.setAttribute('aria-valuetext', `Umbral ${formatPx(threshold)}. ${inliers.length} parejas aceptadas de ${scored.length}.`);
  }

  slider.addEventListener('input', update);
  update();
}
