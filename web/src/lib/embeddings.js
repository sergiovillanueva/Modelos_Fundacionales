/**
 * Similitud coseno entre dos vectores de la misma dimensión.
 * Devuelve un valor entre -1 y 1: mide dirección, no longitud.
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator > 0 ? dot / denominator : 0;
}

/** Vector unitario en el plano a partir de un ángulo en grados. */
export function unitVector(degrees) {
  const radians = (degrees * Math.PI) / 180;
  return [Math.cos(radians), Math.sin(radians)];
}

/** Vector en el plano a partir de un ángulo en grados y una longitud. */
export function polarVector(degrees, length) {
  const [x, y] = unitVector(degrees);
  return [x * length, y * length];
}

/** Distancia euclídea entre dos vectores: aquí sí cuenta la longitud. */
export function euclideanDistance(a, b) {
  if (a.length !== b.length || a.length === 0) return 0;

  let total = 0;
  for (let index = 0; index < a.length; index += 1) {
    total += (a[index] - b[index]) ** 2;
  }
  return Math.sqrt(total);
}

/**
 * Ordena candidatos de texto por similitud con el vector de la imagen.
 * Es la regla de la clasificación zero-shot: gana el texto más cercano.
 */
export function rankByCosine(imageVector, candidates) {
  return candidates
    .map((candidate) => ({
      ...candidate,
      similarity: cosineSimilarity(imageVector, candidate.vector),
      distance: euclideanDistance(imageVector, candidate.vector)
    }))
    .sort((left, right) => right.similarity - left.similarity);
}

/** El candidato más próximo en línea recta, que no siempre es el que gana por coseno. */
export function nearestByDistance(imageVector, candidates) {
  return candidates
    .map((candidate) => ({...candidate, distance: euclideanDistance(imageVector, candidate.vector)}))
    .sort((left, right) => left.distance - right.distance)[0] || null;
}
