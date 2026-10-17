import {TEMPERATURES, TOY_BATCH, contrastiveLoss, similarityMatrix, softmaxRows} from '../lib/contrastive.js';

const format = (value) => value.toFixed(2).replace('.', ',');
export const formatTemperature = (value) => String(value).replace('.', ',');
const percent = (value) => `${Math.round(value * 100)} %`;

/** Row probabilities and loss of the toy batch at one of the lab temperatures. */
export function batchState(index) {
  const temperature = TEMPERATURES[index];
  const similarity = similarityMatrix(TOY_BATCH.images, TOY_BATCH.texts);
  return {
    temperature,
    probabilities: softmaxRows(similarity, temperature),
    loss: contrastiveLoss(similarity, temperature)
  };
}

export function initContrastLab(root = document) {
  const lab = root.querySelector('[data-contrast-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-contrast-temperature]');
  const message = lab.querySelector('[data-contrast-message]');
  const lossNode = lab.querySelector('[data-contrast-loss]');
  const catNode = lab.querySelector('[data-contrast-cat]');
  const valueNode = lab.querySelector('[data-contrast-value]');
  const cells = [...lab.querySelectorAll('[data-contrast-cell]')];
  if (!slider || !message || !lossNode || !catNode || cells.length !== 16) return;

  function update() {
    const {temperature, probabilities, loss} = batchState(Number(slider.value));
    for (const cell of cells) {
      const [row, column] = cell.dataset.contrastCell.split('-').map(Number);
      const value = probabilities[row][column];
      cell.textContent = percent(value);
      cell.style.setProperty('--p', value.toFixed(3));
      cell.classList.toggle('is-strong', value > 0.55);
    }
    const cat = probabilities[1][1];
    lossNode.textContent = format(loss);
    catNode.textContent = percent(cat);
    if (valueNode) valueNode.textContent = formatTemperature(temperature);

    if (temperature >= 0.3) {
      message.textContent = 'Temperatura alta: las cuatro columnas se reparten la probabilidad y aciertos y errores pesan casi igual. La pérdida apenas distingue lo bueno de lo malo.';
    } else if (temperature >= 0.03) {
      message.textContent = 'Zona útil: los pares correctos se llevan casi toda la probabilidad y el error del gato pesa sin dominar la pérdida.';
    } else {
      message.textContent = `Temperatura muy baja: la foto del gato da el ${percent(1 - cat)} a «un perro» y ese único error dispara la pérdida.`;
    }

    slider.setAttribute(
      'aria-valuetext',
      `Temperatura ${formatTemperature(temperature)}. Pérdida ${format(loss)}. El gato acierta con un ${percent(cat)}.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
