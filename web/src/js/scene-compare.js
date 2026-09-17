/**
 * Cambia el par de imágenes de un comparador deslizante sin tocar la cortina.
 * Cada botón trae sus dos rutas y sus dos textos alternativos.
 */
export function initSceneCompare(root = document) {
  const widgets = root.querySelectorAll('[data-scene-compare]');

  widgets.forEach((widget) => {
    const buttons = [...widget.querySelectorAll('[data-scene]')];
    const before = widget.querySelector('[data-scene-before]');
    const after = widget.querySelector('[data-scene-after]');
    const note = widget.querySelector('[data-scene-note]');
    if (!buttons.length || !before || !after) return;

    function select(button) {
      before.src = button.dataset.beforeSrc;
      before.alt = button.dataset.beforeAlt || '';
      after.src = button.dataset.afterSrc;
      after.alt = button.dataset.afterAlt || '';
      if (note && button.dataset.note) note.textContent = button.dataset.note;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    }

    buttons.forEach((button) => button.addEventListener('click', () => select(button)));

    const initial = buttons.find((item) => item.getAttribute('aria-pressed') === 'true') || buttons[0];
    select(initial);
  });
}
