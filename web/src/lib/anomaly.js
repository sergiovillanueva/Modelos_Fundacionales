/**
 * Detección de anomalías por vecino más cercano, el mecanismo de un enfoque tipo PatchCore.
 *
 * El banco guarda embeddings de parches de imágenes normales. Un parche de test se puntúa
 * por su distancia al vecino más cercano del banco: cuanto más lejos de todo lo conocido,
 * más anómalo. No hay ningún ejemplo de defecto en el entrenamiento.
 */
export function euclidean(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/** Puntúa un parche contra el banco y devuelve su vecino más cercano. */
export function scorePatch(bank, patch) {
  if (!bank.length) return null;

  let nearest = bank[0];
  let best = euclidean(bank[0].point, patch);
  for (const entry of bank.slice(1)) {
    const distance = euclidean(entry.point, patch);
    if (distance < best) {
      best = distance;
      nearest = entry;
    }
  }

  return {score: best, nearest};
}

/**
 * Selecciona un subconjunto representativo del banco, como hace un CoreSet: se empieza por
 * un punto y se añade cada vez el más alejado de los ya elegidos, para cubrir todo el espacio
 * con muchos menos vectores.
 */
export function buildCoreSet(bank, size) {
  if (size >= bank.length) return [...bank];

  const chosen = [bank[0]];
  while (chosen.length < size) {
    let candidate = null;
    let bestDistance = -1;
    for (const entry of bank) {
      if (chosen.includes(entry)) continue;
      const distance = Math.min(...chosen.map((item) => euclidean(item.point, entry.point)));
      if (distance > bestDistance) {
        bestDistance = distance;
        candidate = entry;
      }
    }
    chosen.push(candidate);
  }
  return chosen;
}
