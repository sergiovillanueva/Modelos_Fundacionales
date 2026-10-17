import {MOMENTUMS, effectiveWindow, roughness, studentSeries, teacherSeries} from '../lib/momentum.js';

// Plot area inside the SVG: training step on x, weight value on y.
const LEFT = 8;
const RIGHT = 192;
const TOP = 6;
const BOTTOM = 96;
const LOW = -0.15;
const HIGH = 1.35;

function polyline(series) {
  const step = (RIGHT - LEFT) / (series.length - 1);
  return series
    .map((value, index) => `${(LEFT + index * step).toFixed(1)},${(BOTTOM - ((value - LOW) / (HIGH - LOW)) * (BOTTOM - TOP)).toFixed(1)}`)
    .join(' ');
}

export const formatMomentum = (value) => String(value).replace('.', ',');

/** Curves and figures for one of the lab momentum values. */
export function momentumState(index) {
  const momentum = MOMENTUMS[index];
  const student = studentSeries();
  const teacher = teacherSeries(student, momentum);
  return {
    momentum,
    studentLine: polyline(student),
    teacherLine: polyline(teacher),
    window: Math.round(effectiveWindow(momentum)),
    calm: roughness(teacher) / roughness(student)
  };
}

export function initMomentumLab(root = document) {
  const lab = root.querySelector('[data-momentum-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-momentum-value]');
  const message = lab.querySelector('[data-momentum-message]');
  const windowNode = lab.querySelector('[data-momentum-window]');
  const calmNode = lab.querySelector('[data-momentum-calm]');
  const labelNode = lab.querySelector('[data-momentum-label]');
  const teacherLine = lab.querySelector('[data-momentum-teacher]');
  if (!slider || !message || !windowNode || !calmNode || !teacherLine) return;

  function update() {
    const state = momentumState(Number(slider.value));
    teacherLine.setAttribute('points', state.teacherLine);
    windowNode.textContent = String(state.window);
    calmNode.textContent = `${Math.round(state.calm * 100)} %`;
    if (labelNode) labelNode.textContent = formatMomentum(state.momentum);

    if (state.momentum < 0.9) {
      message.textContent = 'La maestra casi copia a la estudiante: hereda su ruido y el objetivo cambia a cada paso.';
    } else if (state.momentum < 0.99) {
      message.textContent = `La maestra filtra el ruido y sigue la tendencia con unos ${state.window} pasos de retraso.`;
    } else {
      message.textContent = `Con m = ${formatMomentum(state.momentum)} la maestra promedia unos ${state.window} pasos y en estos 120 apenas avanza. En un entrenamiento real de DINO, con decenas de miles de pasos, sí alcanza a la estudiante.`;
    }

    slider.setAttribute(
      'aria-valuetext',
      `Momentum ${formatMomentum(state.momentum)}. Promedia unos ${state.window} pasos y salta un ${Math.round(state.calm * 100)} % de lo que salta la estudiante.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
