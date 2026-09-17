import {inferenceMemory, fittingDevices} from '../lib/planning.js';

const conDecimal = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 1});

export function initVramLab(root = document) {
  const lab = root.querySelector('[data-vram-lab]');
  if (!lab) return;

  const params = lab.querySelector('[data-vram-params]');
  const precision = lab.querySelector('[data-vram-precision]');
  const total = lab.querySelector('[data-vram-total]');
  const weights = lab.querySelector('[data-vram-weights]');
  const message = lab.querySelector('[data-vram-message]');
  const paramsLabel = lab.querySelector('[data-vram-params-value]');
  if (!params || !precision || !total || !message) return;

  const devices = [...lab.querySelectorAll('[data-device]')].map((node) => ({
    node,
    name: node.dataset.device,
    gb: Number(node.dataset.gb)
  }));

  function update() {
    const result = inferenceMemory({
      millionParams: Number(params.value),
      precision: precision.value
    });
    if (!result) return;

    if (paramsLabel) paramsLabel.textContent = `${params.value} M`;
    total.textContent = conDecimal.format(result.totalGb);
    if (weights) weights.textContent = conDecimal.format(result.weightsGb);

    const caben = new Set(fittingDevices(result.totalGb, devices).map((device) => device.name));
    for (const device of devices) device.node.classList.toggle('is-out', !caben.has(device.name));

    message.textContent = caben.size
      ? `Cabe en ${caben.size} de las ${devices.length} tarjetas de la lista, contando solo inferencia.`
      : 'No cabe en ninguna de estas tarjetas. Toca cuantizar, partir el modelo o buscar uno más pequeño.';
  }

  params.addEventListener('input', update);
  precision.addEventListener('change', update);
  update();
}
