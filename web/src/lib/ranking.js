/**
 * Precision-recall curve and Average Precision from detections already marked as true or
 * false positives (the matching step decided that with IoU and the one-to-one rule).
 */

/**
 * Detections sorted by confidence, highest first. Each prefix of the list is one confidence
 * threshold, and gives one point of the curve.
 */
export function precisionRecallPoints(detections, totalObjects) {
  if (!(totalObjects > 0)) throw new Error('there must be at least one real object');
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const points = [];
  let truePositives = 0;
  sorted.forEach((detection, index) => {
    if (detection.tp) truePositives += 1;
    points.push({
      score: detection.score,
      precision: truePositives / (index + 1),
      recall: truePositives / totalObjects
    });
  });
  return points;
}

/**
 * Average Precision with all-point interpolation (PASCAL VOC since 2010): precision is
 * replaced by the best precision reachable at that recall or higher, and the area under that
 * staircase is summed. COCO averages 101 recall points instead; the idea is the same.
 */
export function averagePrecision(points) {
  const recalls = [0, ...points.map((point) => point.recall)];
  const precisions = [0, ...points.map((point) => point.precision)];
  for (let index = precisions.length - 2; index >= 0; index -= 1) {
    precisions[index] = Math.max(precisions[index], precisions[index + 1]);
  }
  let area = 0;
  for (let index = 1; index < recalls.length; index += 1) {
    area += (recalls[index] - recalls[index - 1]) * precisions[index];
  }
  return area;
}

/** The interpolated staircase itself, to draw the shaded area: [recall, precision] corners. */
export function interpolatedStaircase(points) {
  const corners = [];
  let best = 0;
  const reversed = [...points].reverse().map((point) => {
    best = Math.max(best, point.precision);
    return {recall: point.recall, precision: best};
  }).reverse();
  let previousRecall = 0;
  for (const point of reversed) {
    if (point.recall > previousRecall) {
      corners.push([previousRecall, point.precision], [point.recall, point.precision]);
      previousRecall = point.recall;
    }
  }
  return corners;
}

/** Area of the interpolated staircase up to the recall of the first `count` detections. */
export function areaUpTo(points, count) {
  const recalls = [0, ...points.map((point) => point.recall)];
  const precisions = [0, ...points.map((point) => point.precision)];
  for (let index = precisions.length - 2; index >= 0; index -= 1) {
    precisions[index] = Math.max(precisions[index], precisions[index + 1]);
  }
  let area = 0;
  for (let index = 1; index <= Math.min(count, points.length); index += 1) {
    area += (recalls[index] - recalls[index - 1]) * precisions[index];
  }
  return area;
}

/** The ranking of the lab: eight detections of one class over six real objects. */
export const LAB_DETECTIONS = [
  {score: 0.95, tp: true}, {score: 0.9, tp: true}, {score: 0.82, tp: false}, {score: 0.76, tp: true},
  {score: 0.64, tp: true}, {score: 0.51, tp: false}, {score: 0.43, tp: false}, {score: 0.3, tp: true}
];
export const LAB_OBJECTS = 6;
