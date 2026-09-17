/**
 * Asistente de decisión: unas preguntas y una recomendación.
 * Cada resultado declara con qué respuestas aparece, en data-when ("clave=valor" separados
 * por espacios). Gana el primero que encaje; data-when="*" es el respaldo.
 */
export function initChoosers(root = document) {
  const choosers = root.querySelectorAll('[data-chooser]');

  choosers.forEach((chooser) => {
    const groups = [...chooser.querySelectorAll('[data-chooser-question]')];
    const results = [...chooser.querySelectorAll('[data-when]')];
    const status = chooser.querySelector('[data-chooser-status]');
    if (!groups.length || !results.length) return;

    function answers() {
      const picked = {};
      for (const group of groups) {
        const checked = group.querySelector('input:checked');
        if (checked) picked[group.dataset.chooserQuestion] = checked.value;
      }
      return picked;
    }

    function matches(rule, picked) {
      if (rule === '*') return true;
      return rule.split(' ').filter(Boolean).every((pair) => {
        const [key, value] = pair.split('=');
        return picked[key] === value;
      });
    }

    function update() {
      const picked = answers();
      const complete = groups.length === Object.keys(picked).length;
      const winner = complete ? results.find((node) => matches(node.dataset.when, picked)) : null;

      for (const node of results) node.hidden = node !== winner;
      if (status) {
        status.textContent = complete
          ? ''
          : `Responde ${groups.length - Object.keys(picked).length} pregunta(s) más para ver la recomendación.`;
      }
    }

    chooser.addEventListener('change', update);
    update();
  });
}
