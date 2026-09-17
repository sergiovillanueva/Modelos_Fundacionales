/**
 * Comparador de dos imágenes alineadas: una cortina que se desplaza sobre la otra.
 * El deslizador es el control accesible; arrastrar sobre la imagen es un atajo.
 */
export function initCompareMedia(root = document) {
  const widgets = root.querySelectorAll('[data-compare]');

  widgets.forEach((widget) => {
    const stage = widget.querySelector('[data-compare-stage]');
    const slider = widget.querySelector('[data-compare-position]');
    if (!stage || !slider) return;

    const beforeLabel = widget.dataset.before || 'primera imagen';
    const afterLabel = widget.dataset.after || 'segunda imagen';

    function apply(percent) {
      const clamped = Math.min(100, Math.max(0, percent));
      stage.style.setProperty('--compare-x', `${clamped}%`);
      slider.setAttribute(
        'aria-valuetext',
        `${Math.round(clamped)} % visible de ${afterLabel}; el resto muestra ${beforeLabel}.`
      );
    }

    slider.addEventListener('input', () => apply(Number(slider.value)));

    function trackPointer(event) {
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width) return;
      const percent = ((event.clientX - bounds.left) / bounds.width) * 100;
      slider.value = String(Math.round(Math.min(100, Math.max(0, percent))));
      apply(Number(slider.value));
    }

    stage.addEventListener('pointerdown', (event) => {
      stage.setPointerCapture(event.pointerId);
      trackPointer(event);
    });
    stage.addEventListener('pointermove', (event) => {
      if (stage.hasPointerCapture(event.pointerId)) trackPointer(event);
    });
    stage.addEventListener('pointerup', (event) => stage.releasePointerCapture(event.pointerId));

    apply(Number(slider.value));
  });
}
