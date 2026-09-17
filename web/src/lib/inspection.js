/**
 * Decisión de una inspección por parches: qué celdas superan el umbral y qué se hace con la pieza.
 * Es la regla de PatchCore una vez calculado el mapa de anomalía.
 */

/** Celdas por encima del umbral, con su máximo. */
export function flagPatches(scores, threshold) {
  const flagged = [];
  let max = 0;
  scores.forEach((score, index) => {
    if (score > max) max = score;
    if (score > threshold) flagged.push(index);
  });
  return {flagged, count: flagged.length, max};
}

/**
 * Una pieza se rechaza cuando acumula al menos `minCells` celdas por encima del umbral.
 * Pedir más de una celda filtra el ruido suelto a costa de perder defectos diminutos.
 */
export function inspectPiece(scores, threshold, {minCells = 1} = {}) {
  const {flagged, count, max} = flagPatches(scores, threshold);
  return {flagged, count, max, rejected: count >= minCells};
}

/** Cuenta los errores de una tanda: falsas alarmas en las buenas y escapes en las defectuosas. */
export function inspectionErrors(pieces, threshold, options) {
  let falseAlarms = 0;
  let escapes = 0;
  for (const piece of pieces) {
    const {rejected} = inspectPiece(piece.scores, threshold, options);
    if (rejected && !piece.faulty) falseAlarms += 1;
    if (!rejected && piece.faulty) escapes += 1;
  }
  return {falseAlarms, escapes};
}
