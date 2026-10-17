import {iou} from './metrics.js';

/**
 * Bipartite matching as DETR uses it while training: every real object gets exactly one
 * prediction, and predictions left over are matched to "no object".
 *
 * Cost of pairing a prediction with an object: 1 - IoU of their boxes. DETR adds class and
 * L1 terms; with a single class the overlap alone shows the idea.
 */
export function costMatrix(predictions, objects) {
  return predictions.map((prediction) => objects.map((object) => +(1 - iou(prediction.box, object.box)).toFixed(4)));
}

/**
 * Greedy one-to-one matching: predictions in order of confidence, each one takes the
 * cheapest object still free. Fast, but an early choice can ruin the total.
 * Returns, per prediction, the object index or -1 for "no object".
 */
export function greedyAssignment(cost, order = cost.map((_, index) => index)) {
  const taken = new Set();
  const assignment = cost.map(() => -1);
  for (const row of order) {
    let best = -1;
    for (let column = 0; column < cost[row].length; column += 1) {
      if (taken.has(column)) continue;
      if (best === -1 || cost[row][column] < cost[row][best]) best = column;
    }
    if (best !== -1) {
      assignment[row] = best;
      taken.add(best);
    }
  }
  return assignment;
}

function permutations(items, size) {
  if (size === 0) return [[]];
  const result = [];
  items.forEach((item, index) => {
    const rest = items.slice(0, index).concat(items.slice(index + 1));
    for (const tail of permutations(rest, size - 1)) result.push([item, ...tail]);
  });
  return result;
}

/**
 * Optimal one-to-one matching, the one the Hungarian algorithm finds. With a handful of
 * boxes, trying every way of giving each object a different prediction is exact and clear.
 * Requires at least as many predictions as objects, as in DETR.
 */
export function optimalAssignment(cost) {
  const rows = cost.length;
  const columns = cost[0]?.length ?? 0;
  if (columns > rows) throw new Error('DETR always predicts at least as many boxes as objects');
  let best = null;
  let bestTotal = Infinity;
  // Each permutation picks which prediction serves object 0, 1, 2...
  for (const chosen of permutations([...Array(rows).keys()], columns)) {
    const total = chosen.reduce((sum, row, column) => sum + cost[row][column], 0);
    if (total < bestTotal - 1e-12) {
      bestTotal = total;
      best = chosen;
    }
  }
  const assignment = cost.map(() => -1);
  best.forEach((row, column) => { assignment[row] = column; });
  return assignment;
}

/** Sum of the costs of the matched pairs; predictions on "no object" add nothing here. */
export function totalCost(cost, assignment) {
  return +assignment.reduce((sum, column, row) => (column === -1 ? sum : sum + cost[row][column]), 0).toFixed(4);
}

/**
 * The scene of the lab: three cars in a row and four predictions, sorted by confidence.
 * Only the first prediction moves; between two cars it fools the greedy matching.
 */
export const MATCHING_OBJECTS = [
  {label: 'A', box: [10, 30, 50, 70]},
  {label: 'B', box: [55, 30, 95, 70]},
  {label: 'C', box: [105, 30, 145, 70]}
];

export function matchingPredictions(x) {
  return [
    {label: 'p1', score: 0.94, box: [x, 28, x + 40, 68]},
    {label: 'p2', score: 0.9, box: [57, 31, 97, 71]},
    {label: 'p3', score: 0.86, box: [103, 29, 143, 69]},
    {label: 'p4', score: 0.31, box: [118, 4, 150, 24]}
  ];
}
