import {initMediaControls} from './media.js';
import {initQuizzes} from './quiz.js';
import {initIouDemo} from './iou-demo.js';

initMediaControls();
initQuizzes();
initIouDemo();

const panels = [...document.querySelectorAll('.reading-content > section')];
const tabs = [...document.querySelectorAll('.step-tab')];
const tablist = document.querySelector('.step-tabs');
const previous = document.querySelector('[data-step-previous]');
const next = document.querySelector('[data-step-next]');
const counter = document.querySelector('[data-step-counter]');
const presentation = document.getElementById('btn-mode-presentation');
let activeIndex = 0;

function indexFromHash() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return 0; }
  const index = panels.findIndex((panel) => panel.id === id);
  return index < 0 ? 0 : index;
}

function showStep(index, {navigate = false, focusHeading = false} = {}) {
  activeIndex = Math.max(0, Math.min(index, panels.length - 1));
  panels.forEach((panel, current) => {
    const selected = current === activeIndex;
    panel.hidden = !selected;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[current].id);
    tabs[current].setAttribute('role', 'tab');
    tabs[current].setAttribute('aria-selected', String(selected));
    tabs[current].tabIndex = selected ? 0 : -1;
  });

  const panel = panels[activeIndex];
  previous.disabled = activeIndex === 0;
  next.hidden = activeIndex === panels.length - 1;
  counter.textContent = `${activeIndex + 1} / ${panels.length}`;
  presentation.href = `${presentation.getAttribute('href').split('#')[0]}#/${panel.id}`;
  if (navigate) history.pushState(null, '', `#${panel.id}`);
  if (focusHeading) {
    const heading = panel.querySelector('h2');
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
    window.scrollTo({top: 0, behavior: 'instant'});
  }
}

if (panels.length && tabs.length === panels.length) {
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showStep(index, {navigate: true});
    });
    tab.addEventListener('keydown', (event) => {
      const destinations = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1};
      if (!(event.key in destinations)) return;
      event.preventDefault();
      const target = destinations[event.key];
      showStep(target, {navigate: true});
      tabs[target].focus();
    });
  });
  previous.addEventListener('click', () => showStep(activeIndex - 1, {navigate: true, focusHeading: true}));
  next.addEventListener('click', () => showStep(activeIndex + 1, {navigate: true, focusHeading: true}));
  window.addEventListener('hashchange', () => showStep(indexFromHash()));
  window.addEventListener('popstate', () => showStep(indexFromHash()));
  showStep(indexFromHash());
  document.body.classList.add('course-ready');
}

const material = document.querySelector('.course-material');
document.addEventListener('click', (event) => {
  if (material && !material.contains(event.target)) material.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && material?.open) {
    material.open = false;
    material.querySelector('summary').focus();
  }
});
