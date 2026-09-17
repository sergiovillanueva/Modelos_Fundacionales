function area([x1, y1, x2, y2]) {
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

export function iou(a, b) {
  if (![...a, ...b].every(Number.isFinite)) return 0;

  const intersection =
    Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) *
    Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const union = area(a) + area(b) - intersection;

  return union > 0 ? intersection / union : 0;
}

/**
 * Empareja predicciones con objetos reales según el protocolo habitual de detección:
 * se filtran por puntuación, se recorren de mayor a menor y cada una reclama el objeto
 * libre con mayor IoU siempre que alcance el umbral. Devuelve el recuento y las métricas.
 */
export function matchDetections(truths, predictions, {scoreThreshold = 0.5, iouThreshold = 0.5} = {}) {
  const kept = predictions
    .filter((prediction) => prediction.score >= scoreThreshold)
    .sort((left, right) => right.score - left.score);
  const claimed = new Set();
  const outcomes = new Map();

  for (const prediction of kept) {
    let best = null;
    let bestFree = 0;
    let bestOverlap = 0;
    for (const truth of truths) {
      const overlap = iou(truth.box, prediction.box);
      // El solapamiento máximo se informa siempre; solo los objetos libres pueden emparejarse,
      // de modo que una predicción duplicada queda como falso positivo aunque solape mucho.
      if (overlap > bestOverlap) bestOverlap = overlap;
      if (claimed.has(truth.id)) continue;
      if (overlap > bestFree) {
        best = truth;
        bestFree = overlap;
      }
    }
    if (best && bestFree >= iouThreshold) {
      claimed.add(best.id);
      outcomes.set(prediction.id, {outcome: 'tp', truthId: best.id, overlap: bestFree});
    } else {
      outcomes.set(prediction.id, {outcome: 'fp', truthId: null, overlap: bestOverlap});
    }
  }

  const truePositives = claimed.size;
  const falsePositives = kept.length - truePositives;
  const falseNegatives = truths.length - truePositives;

  return {
    outcomes,
    missed: truths.filter((truth) => !claimed.has(truth.id)).map((truth) => truth.id),
    truePositives,
    falsePositives,
    falseNegatives,
    precision: kept.length > 0 ? truePositives / kept.length : null,
    recall: truths.length > 0 ? truePositives / truths.length : null
  };
}

/**
 * Supresión de no-máximos: el post-procesado que DETR elimina.
 *
 * Se recorren las cajas de mayor a menor puntuación. Cada caja que sobrevive suprime a las
 * que solapan con ella por encima del umbral. El umbral es un hiperparámetro: demasiado bajo
 * borra objetos vecinos legítimos y demasiado alto deja duplicados.
 */
export function nonMaxSuppression(boxes, iouThreshold = 0.5) {
  const ordered = [...boxes].sort((left, right) => right.score - left.score);
  const kept = [];
  const suppressedBy = new Map();

  for (const candidate of ordered) {
    const winner = kept.find((box) => iou(box.box, candidate.box) > iouThreshold);
    if (winner) suppressedBy.set(candidate.id, winner.id);
    else kept.push(candidate);
  }

  return {
    kept: kept.map((box) => box.id),
    suppressedBy,
    keptCount: kept.length,
    suppressedCount: ordered.length - kept.length
  };
}
