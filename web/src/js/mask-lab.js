/**
 * Segmentación sobre una foto real con máscaras precalculadas.
 * Cada indicación enciende su máscara, para comparar qué devuelve un prompt de instancia
 * frente a uno de concepto sin ejecutar ningún modelo en el navegador.
 */
export function initMaskLab(root = document) {
  const lab = root.querySelector('[data-mask-lab]');
  if (!lab) return;

  const buttons = [...lab.querySelectorAll('[data-mask-prompt]')];
  const message = lab.querySelector('[data-mask-message]');
  const counter = lab.querySelector('[data-mask-count]');
  if (!buttons.length || !message) return;

  // Los botones también llevan data-mask: las capas se distinguen por su clase.
  const layers = [...lab.querySelectorAll('.mask-layer[data-mask]')];

  function select(button) {
    const wanted = (button.dataset.mask || '').split(' ').filter(Boolean);

    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    for (const layer of layers) layer.classList.toggle('is-visible', wanted.includes(layer.dataset.mask));

    message.textContent = button.dataset.explanation || '';
    if (counter) counter.textContent = button.dataset.instances || String(wanted.length);
  }

  for (const button of buttons) {
    button.addEventListener('click', () => select(button));
  }

  const initial = buttons.find((item) => item.getAttribute('aria-pressed') === 'true') || buttons[0];
  select(initial);
}
