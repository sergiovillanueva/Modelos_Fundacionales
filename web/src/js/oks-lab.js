import {keypointOks, poseOks, distanceForOks} from '../lib/keypoints.js';

const UMBRAL = 0.5;
// Alto del muñeco en unidades del dibujo: sirve para pintar el error a escala de la persona.
const ALTO_FIGURA = 110;

function formatOks(value) {
  return value.toFixed(2).replace('.', ',');
}

function formatPx(value) {
  return `${Math.round(value)} px`;
}

export function initOksLab(root = document) {
  const lab = root.querySelector('[data-oks-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-oks-distance]');
  const scaleSlider = lab.querySelector('[data-oks-scale]');
  const message = lab.querySelector('[data-oks-message]');
  const readout = lab.querySelector('[data-oks-value]');
  if (!slider || !message || !readout) return;

  const scaleReadout = lab.querySelector('[data-oks-scale-value]');
  const poseValue = lab.querySelector('[data-oks-pose]');
  const verdict = lab.querySelector('[data-oks-verdict]');

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
    const scale = scaleSlider ? Number(scaleSlider.value) : Number(lab.dataset.scale || 150);
    const scores = joints.map((joint) => ({joint, oks: keypointOks(distance, joint.sigma, scale)}));
    // El error se dibuja en proporción a la persona, así que encoger la persona lo agranda.
    const offset = Math.min(45, (distance * ALTO_FIGURA) / scale);

    for (const {joint, oks} of scores) {
      joint.bar.style.setProperty('--bar-share', oks.toFixed(4));
      joint.value.textContent = formatOks(oks);
      joint.row.classList.toggle('is-winner', oks >= 0.9);
      joint.marker?.setAttribute('transform', `translate(${offset.toFixed(2)}, 0)`);
    }

    const pose = poseOks(
      joints.map((joint) => ({distance, sigma: joint.sigma})),
      scale
    );
    if (poseValue) poseValue.textContent = formatOks(pose);
    if (verdict) {
      verdict.textContent = pose >= UMBRAL ? 'Cuenta como acierto' : 'Cuenta como fallo';
      verdict.classList.toggle('is-permitido', pose >= UMBRAL);
      verdict.classList.toggle('is-prohibido', pose < UMBRAL);
    }

    readout.textContent = formatPx(distance);
    if (scaleReadout) scaleReadout.textContent = formatPx(scale);

    const ojo = scores.find((item) => item.joint.id === 'ojo');
    const cadera = scores.find((item) => item.joint.id === 'cadera');
    const margenOjo = distanceForOks(UMBRAL, ojo.joint.sigma, scale);
    message.textContent = distance === 0
      ? `Sin error, todos los puntos valen 1,00. En una persona de ${formatPx(scale)}, el ojo aguanta hasta ${formatPx(margenOjo)} antes de bajar de ${formatOks(UMBRAL)}.`
      : `En una persona de ${formatPx(scale)}, ${distance} px dejan el ojo en ${formatOks(ojo.oks)} y la cadera en ${formatOks(cadera.oks)}. El ojo pierde medio punto a partir de ${formatPx(margenOjo)}.`;

    slider.setAttribute(
      'aria-valuetext',
      `${distance} píxeles de error. ${scores.map((item) => `${item.joint.label}, ${formatOks(item.oks)}`).join('. ')}.`
    );
    scaleSlider?.setAttribute('aria-valuetext', `Persona de ${formatPx(scale)}. OKS del esqueleto ${formatOks(pose)}.`);
  }

  slider.addEventListener('input', update);
  scaleSlider?.addEventListener('input', update);
  update();
}
