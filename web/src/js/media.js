export function initMediaControls(root = document) {
  const containers = root.querySelectorAll('.media-container[data-media-type="animation"]');
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
        label.textContent = 'Detener';
        btn.setAttribute('aria-label', 'Detener animación');
      } else {
        img.src = posterSrc;
        label.textContent = 'Ver animación';
        btn.setAttribute('aria-label', 'Ver animación');
      }
    });
  });
}
