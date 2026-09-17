import {assignCells} from '../lib/grid.js';

const SVG = 'http://www.w3.org/2000/svg';

export function initGridLab(root = document) {
  const lab = root.querySelector('[data-grid-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-grid-size]');
  const lines = lab.querySelector('[data-grid-lines]');
  const cells = lab.querySelector('[data-grid-cells]');
  const message = lab.querySelector('[data-grid-message]');
  const sizeNode = lab.querySelector('[data-grid-value]');
  const countNode = lab.querySelector('[data-grid-count]');
  if (!slider || !lines || !cells || !message || !sizeNode || !countNode) return;

  const width = Number(lab.dataset.width || 160);
  const height = Number(lab.dataset.height || 100);
  const objects = [...lab.querySelectorAll('[data-object-centre]')].map((node) => ({
    id: node.dataset.objectCentre,
    label: node.dataset.label,
    centre: {
      x: Number(node.getAttribute('cx')) / width,
      y: Number(node.getAttribute('cy')) / height
    }
  }));
  if (!objects.length) return;

  function draw(gridSize, collisions) {
    lines.replaceChildren();
    cells.replaceChildren();

    for (let index = 1; index < gridSize; index += 1) {
      const vertical = document.createElementNS(SVG, 'line');
      vertical.setAttribute('x1', String((width / gridSize) * index));
      vertical.setAttribute('x2', String((width / gridSize) * index));
      vertical.setAttribute('y1', '0');
      vertical.setAttribute('y2', String(height));
      lines.appendChild(vertical);

      const horizontal = document.createElementNS(SVG, 'line');
      horizontal.setAttribute('y1', String((height / gridSize) * index));
      horizontal.setAttribute('y2', String((height / gridSize) * index));
      horizontal.setAttribute('x1', '0');
      horizontal.setAttribute('x2', String(width));
      lines.appendChild(horizontal);
    }

    const drawn = new Set();
    for (const item of collisions.assignments) {
      if (drawn.has(item.cell.key)) continue;
      drawn.add(item.cell.key);

      const rect = document.createElementNS(SVG, 'rect');
      rect.setAttribute('x', String((width / gridSize) * item.cell.column));
      rect.setAttribute('y', String((height / gridSize) * item.cell.row));
      rect.setAttribute('width', String(width / gridSize));
      rect.setAttribute('height', String(height / gridSize));
      rect.setAttribute('class', collisions.collisions.includes(item.cell.key) ? 'grid-cell is-shared' : 'grid-cell');
      cells.appendChild(rect);
    }
  }

  function update() {
    const gridSize = Number(slider.value);
    const result = assignCells(objects, gridSize);

    draw(gridSize, result);
    sizeNode.textContent = `${gridSize} × ${gridSize}`;
    countNode.textContent = `${result.detectable} de ${objects.length}`;
    message.textContent = result.collisions.length
      ? 'Dos centros caen en la misma celda: esa celda solo puede responsabilizarse de un objeto.'
      : 'Cada objeto cae en una celda distinta: la cuadrícula puede hacerse cargo de todos.';
    slider.setAttribute(
      'aria-valuetext',
      `Cuadrícula de ${gridSize} por ${gridSize}. ${result.detectable} de ${objects.length} objetos con celda propia.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
