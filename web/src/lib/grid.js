/**
 * La regla de la cuadrícula de YOLO: la celda donde cae el centro de un objeto es la
 * responsable de detectarlo. Si dos centros caen en la misma celda, YOLOv1 solo puede
 * quedarse con uno, que es su limitación más citada con objetos juntos o pequeños.
 */
export function cellForPoint(point, gridSize) {
  const column = Math.min(gridSize - 1, Math.max(0, Math.floor(point.x * gridSize)));
  const row = Math.min(gridSize - 1, Math.max(0, Math.floor(point.y * gridSize)));
  return {row, column, key: `${row}-${column}`};
}

/** Reparte los objetos entre celdas y señala las que reciben más de un centro. */
export function assignCells(objects, gridSize) {
  const assignments = objects.map((object) => ({...object, cell: cellForPoint(object.centre, gridSize)}));
  const counts = new Map();
  for (const item of assignments) {
    counts.set(item.cell.key, (counts.get(item.cell.key) || 0) + 1);
  }

  const collisions = [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
  return {
    assignments,
    collisions,
    detectable: assignments.length - collisions.reduce((sum, key) => sum + (counts.get(key) - 1), 0)
  };
}
