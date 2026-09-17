/**
 * Orientación sobre licencias de modelos, no asesoramiento legal.
 *
 * La tabla recoge lo que explica la diapositiva de licencias del curso. La licencia real
 * se revisa por artefacto y por versión: el código y los pesos pueden tener términos distintos.
 */
export const LICENSES = [
  {id: 'apache-2.0', label: 'Apache-2.0', family: 'permisiva'},
  {id: 'mit', label: 'MIT', family: 'permisiva'},
  {id: 'bsd', label: 'BSD 2 o 3 cláusulas', family: 'permisiva'},
  {id: 'openrail', label: 'OpenRAIL / CreativeML', family: 'restringida'},
  {id: 'cc-by-sa', label: 'CC BY-SA', family: 'restringida'},
  {id: 'agpl', label: 'AGPL', family: 'copyleft-red'},
  {id: 'research', label: 'Research Only', family: 'no-comercial'},
  {id: 'cc-by-nc', label: 'CC BY-NC', family: 'no-comercial'}
];

export const USES = [
  {id: 'investigacion', label: 'Investigación académica'},
  {id: 'interno', label: 'Prototipo o uso interno'},
  {id: 'producto', label: 'Producto comercial que distribuyes'},
  {id: 'servicio', label: 'Servicio web o SaaS'}
];

const RULES = {
  permisiva: {
    investigacion: ['permitido', 'Sin restricciones de uso. Conserva el aviso de licencia y la atribución.'],
    interno: ['permitido', 'Sin restricciones de uso. Conserva el aviso de licencia y la atribución.'],
    producto: ['permitido', 'Uso comercial permitido. Conserva el aviso de licencia y la atribución.'],
    servicio: ['permitido', 'Uso comercial permitido. Conserva el aviso de licencia y la atribución.']
  },
  restringida: {
    investigacion: ['permitido', 'Permitido. Revisa igualmente las cláusulas de uso responsable.'],
    interno: ['condiciones', 'Permitido con condiciones: hay cláusulas de uso responsable que debes cumplir.'],
    producto: ['condiciones', 'Uso comercial permitido, pero con cláusulas de uso responsable. CC BY-SA obliga además a compartir los derivados con la misma licencia.'],
    servicio: ['condiciones', 'Uso comercial permitido, pero con cláusulas de uso responsable. CC BY-SA obliga además a compartir los derivados con la misma licencia.']
  },
  'copyleft-red': {
    investigacion: ['permitido', 'Permitido. La obligación de publicar el código aparece al distribuir o al ofrecer un servicio.'],
    interno: ['permitido', 'Sin distribución no se dispara la obligación. En cuanto lo publiques o lo sirvas, sí.'],
    producto: ['condiciones', 'Obliga a publicar tu código fuente completo. Si no quieres, busca una alternativa Apache-2.0 como RT-DETR o RF-DETR.'],
    servicio: ['condiciones', 'La cláusula de red obliga a publicar tu código fuente completo aunque solo lo ofrezcas por web. Alternativas Apache-2.0: RT-DETR o RF-DETR.']
  },
  'no-comercial': {
    investigacion: ['permitido', 'Este es justo su caso de uso previsto.'],
    interno: ['prohibido', 'Un prototipo dentro de una empresa ya es uso comercial. Busca otro modelo.'],
    producto: ['prohibido', 'Prohibido el uso comercial. Busca otro modelo antes de invertir tiempo.'],
    servicio: ['prohibido', 'Prohibido el uso comercial. Busca otro modelo antes de invertir tiempo.']
  }
};

/** Devuelve el veredicto y su motivo para una licencia y un uso concretos. */
export function evaluateLicense(licenseId, useId) {
  const license = LICENSES.find((item) => item.id === licenseId);
  const use = USES.find((item) => item.id === useId);
  if (!license || !use) return null;

  const [verdict, reason] = RULES[license.family][use.id];
  return {verdict, reason, license, use};
}
