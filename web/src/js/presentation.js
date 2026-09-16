import Reveal from '../../vendor/reveal/reveal.mjs';
import {initMediaControls} from './media.js';
import {initQuizzes} from './quiz.js';
import {initIouDemo} from './iou-demo.js';
import {initThresholdLab} from './threshold-lab.js';
import {initPromptLab} from './prompt-lab.js';
import {initSimilarityLab} from './similarity-lab.js';

document.addEventListener('DOMContentLoaded', async () => {
  initMediaControls();
  initQuizzes();
  initIouDemo();
  initThresholdLab();
  initPromptLab();
  initSimilarityLab();

  const deck = new Reveal({
    hash: true,
    width: 1280,
    height: 720,
    center: false,
    transition: 'fade',
    transitionSpeed: 'fast',
    slideNumber: 'c/t',
    autoSlide: 0,
    scrollActivationWidth: null,
    keyboardCondition: (event) => {
      // Don't intercept arrow keys or typing inside form controls
      if (event.target && event.target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="slider"], [role="button"]')) {
        return false;
      }
      return true;
    }
  });

  await deck.initialize();

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
