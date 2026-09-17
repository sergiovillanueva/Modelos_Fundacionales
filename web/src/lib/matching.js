/**
 * Verificación geométrica de emparejamientos: el paso que separa las parejas
 * buenas de las que solo se parecen. Una homografía lleva cada punto de la
 * primera imagen a su sitio en la segunda; si la pareja observada cae lejos de
 * ahí, no es coherente con la escena y se descarta.
 */

/** Aplica una homografía de 9 números, en orden por filas, a un punto del plano. */
export function applyHomography(homography, [x, y]) {
  const [a, b, c, d, e, f, g, h, i] = homography;
  const w = g * x + h * y + i;
  if (!w) return null;
  return [(a * x + b * y + c) / w, (d * x + e * y + f) / w];
}

/** Distancia entre donde debería caer el punto y donde se ha emparejado. */
export function reprojectionError(homography, source, observed) {
  const projected = applyHomography(homography, source);
  if (!projected) return Infinity;
  return Math.hypot(projected[0] - observed[0], projected[1] - observed[1]);
}

/**
 * Reparte las parejas entre aceptadas y descartadas según el umbral, en píxeles.
 * `minimum` es cuántas parejas coherentes se piden para fiarse del resultado:
 * una homografía se calcula con cuatro y se considera sólida bastante por encima.
 */
export function verifyMatches(homography, pairs, threshold, {minimum = 8} = {}) {
  const scored = pairs.map((pair) => ({
    ...pair,
    error: reprojectionError(homography, pair.source, pair.observed)
  }));
  const inliers = scored.filter((pair) => pair.error <= threshold);
  const outliers = scored.filter((pair) => pair.error > threshold);

  return {
    scored,
    inliers,
    outliers,
    ratio: scored.length ? inliers.length / scored.length : 0,
    reliable: inliers.length >= minimum,
    solvable: inliers.length >= 4
  };
}
