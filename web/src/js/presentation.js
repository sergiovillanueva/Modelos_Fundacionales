import Reveal from '../../vendor/reveal/reveal.mjs';
import {initMediaControls} from './media.js';
import {initQuizzes} from './quiz.js';
import {initIouDemo} from './iou-demo.js';
import {initThresholdLab} from './threshold-lab.js';
import {initSimilarityLab} from './similarity-lab.js';
import {initLicenseLab} from './license-lab.js';
import {initOksLab} from './oks-lab.js';
import {initAnomalyLab} from './anomaly-lab.js';
import {initNmsLab} from './nms-lab.js';
import {initCompareMedia} from './compare-media.js';
import {initGridLab} from './grid-lab.js';
import {initMaskLab} from './mask-lab.js';
import {initCopyCode} from './copy-code.js';
import {initChoosers} from './chooser.js';
import {initBudgetLab} from './budget-lab.js';
import {initVramLab} from './vram-lab.js';
import {initModelTable} from './model-table.js';
import {initSceneCompare} from './scene-compare.js';
import {initPipelineLab} from './pipeline-lab.js';
import {initAnomalyMap} from './anomaly-map.js';
import {initModeSwitch} from './mode-switch.js';

document.addEventListener('DOMContentLoaded', async () => {
  initMediaControls();
  initQuizzes();
  initIouDemo();
  initThresholdLab();
    initSimilarityLab();
  initLicenseLab();
  initOksLab();
  initAnomalyLab();
  initNmsLab();
  initCompareMedia();
  initGridLab();
  initMaskLab();
  initCopyCode();
  initChoosers();
  initBudgetLab();
  initVramLab();
  initModelTable();
  initSceneCompare();
  initPipelineLab();
  initAnomalyMap();
  initModeSwitch();

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
  // Una diapositiva fiel al original puede traer más contenido del que cabe en 1280 x 720.
  // Se mide sin escalar y se reduce solo lo justo, como hace un lienzo de diapositiva.
  function fitCurrentSlide() {
    const slide = deck.getCurrentSlide();
    const fit = slide?.querySelector('.slide-fit');
    if (!fit) return;

    fit.style.transform = 'none';
    const styles = getComputedStyle(slide);
    const available = slide.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    const needed = fit.scrollHeight;
    const scale = needed > available ? Math.max(0.5, available / needed) : 1;
    fit.style.transform = scale < 1 ? `scale(${scale})` : 'none';
  }

  async function fitWhenReady() {
    fitCurrentSlide();
    const images = [...(deck.getCurrentSlide()?.querySelectorAll('img') || [])];
    await Promise.allSettled(images.map((image) => image.decode()));
    fitCurrentSlide();
  }

  deck.on('slidechanged', fitWhenReady);
  window.addEventListener('resize', fitCurrentSlide);
  await fitWhenReady();

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
