import {initMediaControls} from './media.js';

document.addEventListener('DOMContentLoaded', () => {
  initMediaControls();

  // Highlight active section on scroll and sync presentation URL
  const sections = document.querySelectorAll('.reading-content > section');
  const indexLinks = document.querySelectorAll('.topic-index-link');
  const currentSectionLabel = document.getElementById('reading-current-section');
  const presBtn = document.getElementById('btn-mode-presentation');

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const title = entry.target.getAttribute('data-title') || id;

          if (currentSectionLabel) {
            currentSectionLabel.textContent = title;
          }

          indexLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          if (presBtn) {
            const baseHref = presBtn.getAttribute('href').split('#')[0];
            presBtn.setAttribute('href', `${baseHref}#/${id}`);
          }
        }
      });
    }, {
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach((sec) => observer.observe(sec));
  }
});
