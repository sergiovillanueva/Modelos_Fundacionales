/**
 * OKS (Object Keypoint Similarity), la métrica con la que COCO evalúa esqueletos.
 *
 * Cada articulación tiene su propia constante de tolerancia: las rígidas, como los ojos,
 * admiten mucho menos error que las flexibles, como la cadera. Por eso el mismo desplazamiento
 * en píxeles penaliza de forma muy distinta según el punto.
 */
export const COCO_SIGMAS = [
  {id: 'nariz', label: 'Nariz', sigma: 0.026, kind: 'rígido'},
  {id: 'ojo', label: 'Ojo', sigma: 0.025, kind: 'rígido'},
  {id: 'oreja', label: 'Oreja', sigma: 0.035, kind: 'rígido'},
  {id: 'hombro', label: 'Hombro', sigma: 0.079, kind: 'flexible'},
  {id: 'codo', label: 'Codo', sigma: 0.072, kind: 'flexible'},
  {id: 'muneca', label: 'Muñeca', sigma: 0.062, kind: 'flexible'},
  {id: 'cadera', label: 'Cadera', sigma: 0.107, kind: 'flexible'},
  {id: 'rodilla', label: 'Rodilla', sigma: 0.087, kind: 'flexible'},
  {id: 'tobillo', label: 'Tobillo', sigma: 0.089, kind: 'flexible'}
];

/**
 * Similitud de un punto clave: 1 si acierta exacto y baja hacia 0 según se aleja.
 * `scale` es la raíz del área de la persona, en píxeles.
 */
export function keypointOks(distance, sigma, scale) {
  if (!(scale > 0) || !(sigma > 0) || !Number.isFinite(distance)) return 0;
  const tolerance = 2 * sigma * scale;
  return Math.exp(-(distance * distance) / (2 * tolerance * tolerance));
}

/** OKS de un esqueleto: media de los puntos visibles. */
export function poseOks(keypoints, scale) {
  const visible = keypoints.filter((point) => point.visible !== false);
  if (!visible.length) return null;

  const total = visible.reduce(
    (sum, point) => sum + keypointOks(point.distance, point.sigma, scale),
    0
  );
  return total / visible.length;
}

/** Píxeles de error que dejan un punto justo en el OKS indicado. Útil para explicar la tolerancia. */
export function distanceForOks(target, sigma, scale) {
  if (!(target > 0) || target > 1) return null;
  const tolerance = 2 * sigma * scale;
  return tolerance * Math.sqrt(-2 * Math.log(target));
}
