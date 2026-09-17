import {annotationBudget} from '../lib/planning.js';

const formato = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 0});
const conDecimal = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 1});

export function initBudgetLab(root = document) {
  const lab = root.querySelector('[data-budget-lab]');
  if (!lab) return;

  const inputs = {
    classes: lab.querySelector('[data-budget-classes]'),
    imagesPerClass: lab.querySelector('[data-budget-images]'),
    secondsPerImage: lab.querySelector('[data-budget-seconds]')
  };
  const outputs = {
    images: lab.querySelector('[data-budget-total-images]'),
    hours: lab.querySelector('[data-budget-hours]'),
    days: lab.querySelector('[data-budget-days]'),
    message: lab.querySelector('[data-budget-message]')
  };
  const labels = lab.querySelectorAll('[data-budget-value]');
  if (Object.values(inputs).some((node) => !node) || !outputs.message) return;

  function update() {
    const result = annotationBudget({
      classes: Number(inputs.classes.value),
      imagesPerClass: Number(inputs.imagesPerClass.value),
      secondsPerImage: Number(inputs.secondsPerImage.value)
    });
    if (!result) return;

    for (const label of labels) {
      const source = inputs[label.dataset.budgetValue];
      if (source) label.textContent = source.value;
    }

    outputs.images.textContent = formato.format(result.images);
    outputs.hours.textContent = formato.format(result.totalHours);
    outputs.days.textContent = conDecimal.format(result.days);
    outputs.message.textContent = result.days > 10
      ? 'Más de dos semanas de una persona solo anotando. Con este coste conviene probar antes un detector guiado por texto.'
      : 'Coste asumible para un conjunto propio. Aun así, empieza validando con zero-shot para saber si hace falta.';
  }

  for (const input of Object.values(inputs)) input.addEventListener('input', update);
  update();
}
