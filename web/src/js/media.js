export function initMediaControls(root = document) {
  const containers = root.querySelectorAll('.media-container[data-media-type="gif"]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach((container) => {
    const img = container.querySelector('.interactive-media');
    const btn = container.querySelector('.btn-toggle-anim');
    const label = container.querySelector('.anim-status-label');

    if (!img || !btn || !label) return;

    const posterSrc = img.src;
    const animatedSrc = img.getAttribute('data-animated-src');
    let isPlaying = false;

    btn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        img.src = animatedSrc;
        label.textContent = '⏸ Pausar GIF';
        btn.setAttribute('aria-label', 'Pausar animación');
      } else {
        img.src = posterSrc;
        label.textContent = '▶ Reproducir GIF';
        btn.setAttribute('aria-label', 'Reproducir animación');
      }
    });
  });
}
