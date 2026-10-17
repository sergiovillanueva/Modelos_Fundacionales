import {KERNELS, convolve, probeAt, toDisplay, toGray} from '../lib/convolution.js';

const MESSAGES = {
  vertical: 'Se encienden los cambios de luz de izquierda a derecha: las aristas verticales de los edificios. El cielo, liso, queda negro.',
  horizontal: 'Ahora se encienden los cambios de arriba abajo: cornisas y filas de ventanas. Las aristas verticales casi desaparecen.',
  blur: 'Cada píxel pasa a ser la media ponderada de sus vecinos: se pierde el detalle fino y con él el ruido.',
  sharpen: 'El centro pesa 5 y los cuatro vecinos restan: las diferencias se exageran y la imagen parece más nítida.'
};

const signedNumber = (value) => (value < 0 ? `−${Math.abs(value)}` : String(value));

function loadImage(img) {
  if (img.complete && img.naturalWidth) return Promise.resolve(img);
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img), {once: true});
    img.addEventListener('error', reject, {once: true});
  });
}

export function initConvLab(root = document) {
  const lab = root.querySelector('[data-conv-lab]');
  if (!lab) return;

  const input = lab.querySelector('[data-conv-input]');
  const output = lab.querySelector('[data-conv-output]');
  const buttons = [...lab.querySelectorAll('[data-conv-kernel]')];
  const weightCells = [...lab.querySelectorAll('[data-conv-weight]')];
  const patchCells = [...lab.querySelectorAll('[data-conv-patch]')];
  const divisorNode = lab.querySelector('[data-conv-divisor]');
  const sumNode = lab.querySelector('[data-conv-sum]');
  const message = lab.querySelector('[data-conv-message]');
  const probes = [...lab.querySelectorAll('[data-conv-probe]')];
  const pad = lab.querySelector('[data-conv-pad]');
  if (!input || !output || !buttons.length || weightCells.length !== 9 || patchCells.length !== 9 || !sumNode || !message) return;

  let name = buttons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.convKernel || 'vertical';
  let probe = {x: Number(lab.dataset.probeX) || 0, y: Number(lab.dataset.probeY) || 0};
  let gray = null;
  let width = 0;
  let height = 0;
  const canvas = document.createElement('canvas');

  function drawProbe() {
    for (const node of probes) {
      node.style.left = `${((probe.x - 1) / width) * 100}%`;
      node.style.top = `${((probe.y - 1) / height) * 100}%`;
      node.style.width = `${(3 / width) * 100}%`;
      node.style.height = `${(3 / height) * 100}%`;
    }
    const kernel = KERNELS[name];
    const {patch, sum} = probeAt(gray, width, height, probe.x, probe.y, kernel.weights);
    patch.forEach((value, index) => { patchCells[index].textContent = String(Math.round(value)); });
    sumNode.textContent = signedNumber(Math.round(sum));
    pad?.setAttribute('aria-valuetext', `Píxel ${probe.x}, ${probe.y}. Resultado ${signedNumber(Math.round(sum))}.`);
  }

  function render() {
    const kernel = KERNELS[name];
    kernel.integers.forEach((value, index) => {
      weightCells[index].textContent = signedNumber(value);
      weightCells[index].className = value > 0 ? 'is-positive' : value < 0 ? 'is-negative' : '';
    });
    if (divisorNode) divisorNode.textContent = kernel.divisor > 1 ? `÷ ${kernel.divisor}` : '';
    message.textContent = MESSAGES[name];
    if (!gray) return;
    const shown = toDisplay(convolve(gray, width, height, kernel.weights), kernel.signed);
    const context = canvas.getContext('2d');
    const image = context.createImageData(width, height);
    shown.forEach((value, index) => {
      image.data.set([value, value, value, 255], index * 4);
    });
    context.putImageData(image, 0, 0);
    output.src = canvas.toDataURL('image/png');
    output.alt = `Mapa de características con el filtro ${kernel.label.toLowerCase()}.`;
    drawProbe();
  }

  function moveTo(event, image) {
    const box = image.getBoundingClientRect();
    probe = {
      x: Math.min(width - 1, Math.max(0, Math.floor(((event.clientX - box.left) / box.width) * width))),
      y: Math.min(height - 1, Math.max(0, Math.floor(((event.clientY - box.top) / box.height) * height)))
    };
    drawProbe();
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      name = button.dataset.convKernel;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      render();
    });
  }

  loadImage(input).then(() => {
    width = input.naturalWidth;
    height = input.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    context.drawImage(input, 0, 0);
    gray = toGray(context.getImageData(0, 0, width, height).data);
    for (const image of [input, output]) {
      image.addEventListener('pointerdown', (event) => moveTo(event, image));
      image.addEventListener('pointermove', (event) => { if (event.buttons || event.pointerType === 'mouse') moveTo(event, image); });
    }
    pad?.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 5 : 1;
      const moves = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step]};
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      probe = {
        x: Math.min(width - 1, Math.max(0, probe.x + move[0])),
        y: Math.min(height - 1, Math.max(0, probe.y + move[1]))
      };
      drawProbe();
    });
    render();
  }).catch(() => {});
  render();
}
