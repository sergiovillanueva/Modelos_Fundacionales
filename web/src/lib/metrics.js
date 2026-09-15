function area([x1, y1, x2, y2]) {
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

export function iou(a, b) {
  if (![...a, ...b].every(Number.isFinite)) return 0;

  const intersection =
    Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) *
    Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const union = area(a) + area(b) - intersection;

  return union > 0 ? intersection / union : 0;
}

