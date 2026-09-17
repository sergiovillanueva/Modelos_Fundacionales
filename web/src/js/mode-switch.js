/**
 * Conmutador de modos: unos botones eligen qué bloque de salida se ve.
 * Cada botón puede además encender una capa sobre la imagen y escribir una nota.
 */
export function initModeSwitch(root = document) {
  const widgets = root.querySelectorAll('[data-mode-switch]');

  widgets.forEach((widget) => {
    const buttons = [...widget.querySelectorAll('[data-mode]')];
    const outputs = [...widget.querySelectorAll('[data-output]')];
    const overlay = widget.querySelector('[data-mode-overlay]');
    const note = widget.querySelector('[data-mode-note]');
    if (!buttons.length || !outputs.length) return;

    function select(button) {
      const mode = button.dataset.mode;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      outputs.forEach((output) => {
        output.hidden = output.dataset.output !== mode;
      });
      overlay?.classList.toggle('is-visible', button.dataset.overlay === 'true');
      if (note && button.dataset.note) note.textContent = button.dataset.note;
    }

    buttons.forEach((button) => button.addEventListener('click', () => select(button)));
    select(buttons.find((item) => item.getAttribute('aria-pressed') === 'true') || buttons[0]);
  });
}
