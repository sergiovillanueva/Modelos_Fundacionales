import {rankByCosine, unitVector} from '../lib/embeddings.js';

function formatSimilarity(value) {
  return value.toFixed(2).replace('.', ',').replace('-', '−');
}

export function initSimilarityLab(root = document) {
  const lab = root.querySelector('[data-similarity-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-similarity-angle]');
  const arrow = lab.querySelector('[data-similarity-arrow]');
  const winner = lab.querySelector('[data-similarity-winner]');
  if (!slider || !arrow || !winner) return;

  const centre = {
    x: Number(lab.dataset.centreX || 80),
    y: Number(lab.dataset.centreY || 86),
    radius: Number(lab.dataset.radius || 46)
  };

  const candidates = [...lab.querySelectorAll('[data-candidate]')].map((row) => ({
    id: row.dataset.candidate,
    label: row.dataset.label,
    vector: unitVector(Number(row.dataset.angle)),
    row,
    bar: row.querySelector('[data-candidate-bar]'),
    value: row.querySelector('[data-candidate-value]'),
    anchor: lab.querySelector(`[data-anchor="${row.dataset.candidate}"]`)
  }));
  if (!candidates.length) return;

  function update() {
    const angle = Number(slider.value);
    const imageVector = unitVector(angle);
    const ranking = rankByCosine(imageVector, candidates);
    const best = ranking[0];

    arrow.setAttribute('x2', String(centre.x + centre.radius * imageVector[0]));
    arrow.setAttribute('y2', String(centre.y - centre.radius * imageVector[1]));

    for (const candidate of ranking) {
      // La barra recorre todo el carril: -1 queda a la izquierda y 1, a la derecha.
      const share = (candidate.similarity + 1) / 2;
      candidate.bar.style.setProperty('--bar-share', share.toFixed(4));
      candidate.value.textContent = formatSimilarity(candidate.similarity);
      candidate.row.classList.toggle('is-winner', candidate.id === best.id);
      candidate.anchor?.classList.toggle('is-winner', candidate.id === best.id);
    }

    winner.textContent = `El texto más cercano es «${best.label}», con similitud ${formatSimilarity(best.similarity)}.`;
    slider.setAttribute(
      'aria-valuetext',
      `${angle} grados. ${ranking.map((item) => `${item.label}, ${formatSimilarity(item.similarity)}`).join('. ')}.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
