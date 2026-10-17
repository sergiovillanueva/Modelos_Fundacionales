import {
  MATCHING_OBJECTS,
  costMatrix,
  greedyAssignment,
  matchingPredictions,
  optimalAssignment,
  totalCost
} from '../lib/assignment.js';

const format = (value) => value.toFixed(2).replace('.', ',');

export function initAssignmentLab(root = document) {
  const lab = root.querySelector('[data-assignment-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-assignment-position]');
  const message = lab.querySelector('[data-assignment-message]');
  const greedyNode = lab.querySelector('[data-assignment-greedy]');
  const optimalNode = lab.querySelector('[data-assignment-optimal]');
  const valueNode = lab.querySelector('[data-assignment-value]');
  const modeButtons = [...lab.querySelectorAll('[data-assignment-mode]')];
  // Drawing order puts p1 on top; the logic needs them in confidence order.
  const boxes = [...lab.querySelectorAll('[data-prediction]')]
    .sort((a, b) => Number(a.dataset.prediction) - Number(b.dataset.prediction));
  const cells = [...lab.querySelectorAll('[data-cost-cell]')];
  if (!slider || !message || !greedyNode || !optimalNode || !modeButtons.length || boxes.length !== 4) return;

  let mode = modeButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.assignmentMode || 'greedy';

  function update() {
    const x = Number(slider.value);
    const predictions = matchingPredictions(x);
    const cost = costMatrix(predictions, MATCHING_OBJECTS);
    const greedy = greedyAssignment(cost);
    const optimal = optimalAssignment(cost);
    const shown = mode === 'greedy' ? greedy : optimal;
    const greedyTotal = totalCost(cost, greedy);
    const optimalTotal = totalCost(cost, optimal);

    // The moving prediction: its box and its label follow the slider.
    const moving = boxes[0];
    moving.querySelector('rect').setAttribute('x', String(x));
    moving.querySelector('text').setAttribute('x', String(x));

    boxes.forEach((node, row) => {
      const column = shown[row];
      node.setAttribute('class', `match-box is-to-${column === -1 ? 'none' : column}`);
      const target = column === -1 ? '∅' : MATCHING_OBJECTS[column].label;
      node.querySelector('tspan').textContent = ` → ${target}`;
    });

    for (const cell of cells) {
      const [row, column] = cell.dataset.costCell.split('-').map(Number);
      cell.textContent = format(cost[row][column]);
      cell.className = shown[row] === column ? `is-chosen is-to-${column}` : '';
    }

    if (valueNode) valueNode.textContent = String(x);
    greedyNode.textContent = format(greedyTotal);
    optimalNode.textContent = format(optimalTotal);

    const same = greedy.every((column, row) => column === optimal[row]);
    if (same) {
      message.textContent = 'Las dos coinciden: cada predicción se queda con el coche que más solapa y p4, la sobrante, va a «ningún objeto».';
    } else if (mode === 'greedy') {
      const first = MATCHING_OBJECTS[greedy[0]].label;
      const second = MATCHING_OBJECTS[greedy[1]].label;
      message.textContent = `p1 elige primero y se queda con ${first}, que es el que más solapa. p2 tiene que conformarse con ${second}, al que no toca: el coste total sube a ${format(greedyTotal)}.`;
    } else {
      message.textContent = `La húngara busca el menor total: p1 renuncia a su mejor pareja para que p2 cubra B. Coste ${format(optimalTotal)} frente a ${format(greedyTotal)}.`;
    }

    slider.setAttribute('aria-valuetext', `p1 en x ${x}. Coste codicioso ${format(greedyTotal)}, húngaro ${format(optimalTotal)}.`);
  }

  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      mode = button.dataset.assignmentMode;
      modeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      update();
    });
  }
  slider.addEventListener('input', update);
  update();
}
