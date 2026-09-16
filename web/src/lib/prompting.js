/**
 * Modelo de una segmentación guiada por puntos.
 *
 * Cada región pertenece a un objeto. Un punto positivo propone el objeto completo al que
 * pertenece la región señalada; un punto negativo retira esa región de la propuesta. Es el
 * comportamiento que el alumno tiene que anticipar antes de hacer clic en el cuaderno.
 */
export function predictMask(regions, points) {
  const byId = new Map(regions.map((region) => [region.id, region]));
  const chosenObjects = new Set();

  for (const [regionId, sign] of points) {
    const region = byId.get(regionId);
    if (region && sign === 'positive') chosenObjects.add(region.object);
  }

  return regions
    .filter((region) => chosenObjects.has(region.object) && points.get(region.id) !== 'negative')
    .map((region) => region.id);
}

/** Describe la propuesta actual en una frase, sin depender del color de la escena. */
export function describeMask(regions, points, mask) {
  const byId = new Map(regions.map((region) => [region.id, region]));
  if (points.size === 0) return 'Sin ningún punto no hay nada que segmentar.';
  if (mask.length === 0) return 'Todas las regiones señaladas están excluidas: la máscara queda vacía.';

  const names = mask.map((id) => byId.get(id).name);
  const excluded = [...points]
    .filter(([id, sign]) => sign === 'negative' && byId.has(id))
    .map(([id]) => byId.get(id).name);
  const covered = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`;

  if (excluded.length === 0) return `La máscara cubre ${covered}.`;
  const dropped = excluded.length === 1 ? excluded[0] : `${excluded.slice(0, -1).join(', ')} y ${excluded.at(-1)}`;
  return `La máscara cubre ${covered}, sin ${dropped}.`;
}
