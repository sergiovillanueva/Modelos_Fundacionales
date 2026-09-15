import Reveal from '../../vendor/reveal/reveal.mjs';
import {initMediaControls} from './media.js';

document.addEventListener('DOMContentLoaded', async () => {
  initMediaControls();

  const deck = new Reveal({
    hash: true,
    width: 1280,
    height: 720,
    center: false,
    transition: 'fade',
    slideNumber: 'c/t',
    autoSlide: 0,
    scrollActivationWidth: null,
    keyboardCondition: (event) => {
      // Don't intercept arrow keys or typing inside form controls
      if (event.target && event.target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="slider"]')) {
        return false;
      }
      return true;
    }
  });

  await deck.initialize();

  // Fullscreen button
  const fsBtn = document.getElementById('btn-fullscreen');
  if (fsBtn) {
    if (!document.fullscreenEnabled) {
      fsBtn.style.display = 'none';
    } else {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  // Update back to reading URL with current slide ID
  const backBtn = document.getElementById('btn-back-reading');
  function updateBackUrl() {
    if (!backBtn) return;
    const currentSlide = deck.getCurrentSlide();
    if (currentSlide && currentSlide.id) {
      const baseHref = backBtn.getAttribute('href').split('#')[0];
      backBtn.setAttribute('href', `${baseHref}#${currentSlide.id}`);
    }
  }

  deck.on('slidechanged', updateBackUrl);
  updateBackUrl();
});
