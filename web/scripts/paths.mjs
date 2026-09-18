import path from 'node:path';

export function relativeUrl(fromPage, targetPath) {
  const cleanFrom = fromPage.replace(/\\/g, '/');
  const cleanTarget = targetPath.replace(/\\/g, '/');
  const fromDir = path.posix.dirname(cleanFrom);
  const rel = path.posix.relative(fromDir, cleanTarget);
  return rel || '.';
}

// URL absoluta de una pagina o de un recurso, para canonical y para las etiquetas og:.
// Las redes sociales no aceptan rutas relativas: necesitan el dominio entero.
export function absoluteUrl(siteUrl, targetPath) {
  const base = String(siteUrl || '').replace(/\/+$/, '');
  const clean = String(targetPath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  // index.html sobra en la direccion publica: la raiz y la carpeta son la misma pagina.
  const publico = clean.replace(/(^|\/)index\.html$/, '$1');
  return publico ? `${base}/${publico}` : `${base}/`;
}
