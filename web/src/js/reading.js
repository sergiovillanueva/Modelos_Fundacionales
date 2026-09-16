import {initMediaControls} from './media.js';
import {initQuizzes} from './quiz.js';
import {initIouDemo} from './iou-demo.js';
import {initThresholdLab} from './threshold-lab.js';
import {initPromptLab} from './prompt-lab.js';
import {initSimilarityLab} from './similarity-lab.js';

initMediaControls();
initQuizzes();
initIouDemo();
initThresholdLab();
initPromptLab();
initSimilarityLab();

const panels = [...document.querySelectorAll('.reading-content > section')];
const previous = document.querySelector('[data-step-previous]');
const next = document.querySelector('[data-step-next]');
const counter = document.querySelector('[data-step-counter]');
const presentation = document.getElementById('btn-mode-presentation');
let activeIndex = 0;

function indexFromHash() {
  if (!location.hash) return 0;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return activeIndex; }
  const index = panels.findIndex(panel => panel.id === id);
  return index < 0 ? activeIndex : index;
}

function showStep(index, {navigate = false} = {}) {
  activeIndex = Math.max(0, Math.min(index, panels.length - 1));
  panels.forEach((panel, current) => {
    panel.hidden = current !== activeIndex;
    const heading = panel.querySelector('h2');
    heading.id ||= `${panel.id}-title`;
    heading.tabIndex = -1;
    panel.setAttribute('aria-labelledby', heading.id);
  });
  const panel = panels[activeIndex];
  previous.disabled = activeIndex === 0;
  next.hidden = activeIndex === panels.length - 1;
  counter.replaceChildren(
    document.createTextNode(`${activeIndex + 1} / ${panels.length} · `),
    Object.assign(document.createElement('em'), {textContent: panel.dataset.title})
  );
  const advance = panels.length > 1 ? activeIndex / (panels.length - 1) : 1;
  counter.closest('.lesson-nav')?.style.setProperty('--step-progress', String(advance));
  presentation.href = `${presentation.getAttribute('href').split('#')[0]}#/${panel.id}`;
  if (navigate) {
    if (location.hash !== `#${panel.id}`) history.pushState(null, '', `#${panel.id}`);
    panel.querySelector('h2').focus({preventScroll: true});
    window.scrollTo({top: 0, behavior: 'instant'});
  }
}

if (panels.length) {
  previous.addEventListener('click', () => showStep(activeIndex - 1, {navigate: true}));
  next.addEventListener('click', () => showStep(activeIndex + 1, {navigate: true}));
  window.addEventListener('hashchange', () => showStep(indexFromHash()));
  window.addEventListener('popstate', () => showStep(indexFromHash()));
  showStep(indexFromHash());
  document.body.classList.add('course-ready');
}

const material = document.querySelector('.course-material');
document.addEventListener('click', event => {
  if (material && !material.contains(event.target)) material.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && material?.open) {
    material.open = false;
    material.querySelector('summary').focus();
  }
});
