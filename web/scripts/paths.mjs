import path from 'node:path';

export function relativeUrl(fromPage, targetPath) {
  const cleanFrom = fromPage.replace(/\\/g, '/');
  const cleanTarget = targetPath.replace(/\\/g, '/');
  const fromDir = path.posix.dirname(cleanFrom);
  const rel = path.posix.relative(fromDir, cleanTarget);
  return rel || '.';
}
