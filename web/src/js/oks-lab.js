import {keypointOks} from '../lib/keypoints.js';

function formatOks(value) {
  return value.toFixed(2).replace('.', ',');
}

export function initOksLab(root = document) {
  const lab = root.querySelector('[data-oks-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-oks-distance]');
  const message = lab.querySelector('[data-oks-message]');
  const readout = lab.querySelector('[data-oks-value]');
  if (!slider || !message || !readout) return;

  const scale = Number(lab.dataset.scale || 150);
  const joints = [...lab.querySelectorAll('[data-joint]')].map((row) => ({
    id: row.dataset.joint,
    label: row.dataset.label,
    sigma: Number(row.dataset.sigma),
    row,
    bar: row.querySelector('[data-joint-bar]'),
    value: row.querySelector('[data-joint-value]'),
    marker: lab.querySelector(`[data-marker="${row.dataset.joint}"]`)
  }));
  if (!joints.length) return;

  function update() {
    const distance = Number(slider.value);
    const scores = joints.map((joint) => ({joint, oks: keypointOks(distance, joint.sigma, scale)}));

    for (const {joint, oks} of scores) {
      joint.bar.style.setProperty('--bar-share', oks.toFixed(4));
      joint.value.textContent = formatOks(oks);
      joint.row.classList.toggle('is-winner', oks >= 0.9);
      // El marcador se separa del punto real tanto como indique el deslizador.
      joint.marker?.setAttribute('transform', `translate(${distance / 3}, 0)`);
    }

    readout.textContent = `${distance} px`;
    const rigido = scores.find((item) => item.joint.id === 'ojo');
    const flexible = scores.find((item) => item.joint.id === 'cadera');
    message.textContent = distance === 0
      ? 'Sin error, todos los puntos valen 1,00.'
      : `El mismo error de ${distance} px deja el ojo en ${formatOks(rigido.oks)} y la cadera en ${formatOks(flexible.oks)}.`;
    slider.setAttribute(
      'aria-valuetext',
      `${distance} píxeles de error. ${scores.map((item) => `${item.joint.label}, ${formatOks(item.oks)}`).join('. ')}.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
