/** Filtra la tabla de modelos candidatos por tarea y por licencia. */
export function initModelTable(root = document) {
  const table = root.querySelector('[data-model-table]');
  if (!table) return;

  const filters = [...table.querySelectorAll('[data-model-filter]')];
  const rows = [...table.querySelectorAll('[data-model-row]')];
  const counter = table.querySelector('[data-model-count]');
  if (!filters.length || !rows.length) return;

  function update() {
    let visible = 0;
    for (const row of rows) {
      const ok = filters.every((filter) => {
        const wanted = filter.value;
        return wanted === 'todas' || row.dataset[filter.dataset.modelFilter] === wanted;
      });
      row.hidden = !ok;
      if (ok) visible += 1;
    }
    if (counter) counter.textContent = String(visible);
  }

  for (const filter of filters) filter.addEventListener('change', update);
  update();
}
