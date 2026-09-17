/**
 * Dos cuentas que se hacen antes de empezar un proyecto de visión.
 * Son estimaciones de orden de magnitud para decidir, no presupuestos ni medidas.
 */

/** Horas y jornadas de anotación para un dataset propio, con su revisión. */
export function annotationBudget({classes, imagesPerClass, secondsPerImage, reviewShare = 0.3, hoursPerDay = 6}) {
  if (![classes, imagesPerClass, secondsPerImage].every((value) => Number.isFinite(value) && value > 0)) {
    return null;
  }

  const images = classes * imagesPerClass;
  const annotationHours = (images * secondsPerImage) / 3600;
  const reviewHours = annotationHours * reviewShare;
  const totalHours = annotationHours + reviewHours;

  return {
    images,
    annotationHours,
    reviewHours,
    totalHours,
    days: totalHours / hoursPerDay
  };
}

export const PRECISIONS = [
  {id: 'fp32', label: 'float32', bytes: 4},
  {id: 'fp16', label: 'float16 o bfloat16', bytes: 2},
  {id: 'int8', label: 'int8 cuantizado', bytes: 1}
];

/**
 * Memoria aproximada para inferencia: los pesos más un margen para activaciones y
 * fragmentación. El margen es el que suele bastar con lotes pequeños; entrenar necesita
 * bastante más porque guarda gradientes y estados del optimizador.
 */
export function inferenceMemory({millionParams, precision, overhead = 1.35}) {
  const entry = PRECISIONS.find((item) => item.id === precision);
  if (!entry || !Number.isFinite(millionParams) || millionParams <= 0) return null;

  const weightsGb = (millionParams * 1e6 * entry.bytes) / 1e9;
  return {
    precision: entry,
    weightsGb,
    totalGb: weightsGb * overhead
  };
}

/** Devuelve las GPU de la lista en las que cabe ese modelo. */
export function fittingDevices(totalGb, devices) {
  return devices.filter((device) => device.gb >= totalGb);
}
