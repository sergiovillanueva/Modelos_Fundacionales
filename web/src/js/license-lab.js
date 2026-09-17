import {evaluateLicense} from '../lib/licensing.js';

const VERDICT_LABEL = {
  permitido: 'Permitido',
  condiciones: 'Permitido con condiciones',
  prohibido: 'No permitido'
};

export function initLicenseLab(root = document) {
  const lab = root.querySelector('[data-license-lab]');
  if (!lab) return;

  const licenseInput = lab.querySelector('[data-license-choice]');
  const useInput = lab.querySelector('[data-license-use]');
  const verdictNode = lab.querySelector('[data-license-verdict]');
  const reasonNode = lab.querySelector('[data-license-reason]');
  if (!licenseInput || !useInput || !verdictNode || !reasonNode) return;

  function update() {
    const result = evaluateLicense(licenseInput.value, useInput.value);
    if (!result) return;

    verdictNode.textContent = VERDICT_LABEL[result.verdict];
    verdictNode.className = `verdict is-${result.verdict}`;
    reasonNode.textContent = result.reason;
  }

  licenseInput.addEventListener('change', update);
  useInput.addEventListener('change', update);
  update();
}
