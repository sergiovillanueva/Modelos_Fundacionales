import {LAB_DETECTIONS, LAB_OBJECTS, areaUpTo, averagePrecision, interpolatedStaircase, precisionRecallPoints} from '../lib/ranking.js';

const format = (value) => value.toFixed(2).replace('.', ',');

// Plot area inside the SVG: recall on x, precision on y.
const LEFT = 30;
const RIGHT = 190;
const TOP = 8;
const BOTTOM = 98;
const px = (recall) => +(LEFT + recall * (RIGHT - LEFT)).toFixed(2);
const py = (precision) => +(BOTTOM - precision * (BOTTOM - TOP)).toFixed(2);

function areaPath(corners, upToRecall) {
  const kept = [];
  for (const [recall, precision] of corners) {
    if (recall <= upToRecall + 1e-9) kept.push([recall, precision]);
  }
  if (!kept.length) return '';
  const line = kept.map(([recall, precision]) => `L${px(recall)} ${py(precision)}`).join(' ');
  return `M${px(0)} ${py(0)} ${line} L${px(kept.at(-1)[0])} ${py(0)} Z`;
}

/** Everything the chart draws when the first `count` detections are accepted. */
export function chartGeometry(count) {
  const points = precisionRecallPoints(LAB_DETECTIONS, LAB_OBJECTS);
  const corners = interpolatedStaircase(points);
  const current = points[count - 1];
  return {
    points,
    current,
    areaAll: areaPath(corners, 1),
    areaDone: areaPath(corners, current.recall),
    curve: points.map((point) => `${px(point.recall)},${py(point.precision)}`).join(' '),
    marker: {cx: px(current.recall), cy: py(current.precision)},
    area: areaUpTo(points, count),
    ap: averagePrecision(points),
    dots: points.map((point) => ({cx: px(point.recall), cy: py(point.precision)}))
  };
}

export function initApLab(root = document) {
  const lab = root.querySelector('[data-ap-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-ap-count]');
  const message = lab.querySelector('[data-ap-message]');
  const precisionNode = lab.querySelector('[data-ap-precision]');
  const recallNode = lab.querySelector('[data-ap-recall]');
  const areaNode = lab.querySelector('[data-ap-area-value]');
  const valueNode = lab.querySelector('[data-ap-value]');
  const areaDone = lab.querySelector('[data-ap-area-done]');
  const marker = lab.querySelector('[data-ap-marker]');
  const guideX = lab.querySelector('[data-ap-guide-x]');
  const guideY = lab.querySelector('[data-ap-guide-y]');
  const dots = [...lab.querySelectorAll('[data-ap-dot]')];
  const ranks = [...lab.querySelectorAll('[data-ap-rank]')];
  if (!slider || !message || !precisionNode || !recallNode || !areaDone || !marker) return;

  function update() {
    const count = Number(slider.value);
    const geometry = chartGeometry(count);
    const {current, points} = geometry;
    const detection = LAB_DETECTIONS[count - 1];

    areaDone.setAttribute('d', geometry.areaDone);
    marker.setAttribute('cx', String(geometry.marker.cx));
    marker.setAttribute('cy', String(geometry.marker.cy));
    guideX?.setAttribute('x1', String(geometry.marker.cx));
    guideX?.setAttribute('x2', String(geometry.marker.cx));
    guideX?.setAttribute('y1', String(geometry.marker.cy));
    guideY?.setAttribute('x2', String(geometry.marker.cx));
    guideY?.setAttribute('y1', String(geometry.marker.cy));
    guideY?.setAttribute('y2', String(geometry.marker.cy));
    dots.forEach((dot, index) => dot.setAttribute('class', index < count ? 'ap-dot is-in' : 'ap-dot'));
    ranks.forEach((rank, index) => rank.classList.toggle('is-in', index < count));

    precisionNode.textContent = format(current.precision);
    recallNode.textContent = format(current.recall);
    if (valueNode) valueNode.textContent = format(detection.score);
    if (areaNode) areaNode.textContent = format(geometry.area);

    if (count === points.length) {
      message.textContent = `Con todo aceptado el recall llega a ${format(current.recall)}, no a 1: un objeto no lo detectó nadie. La AP es el área sombreada entera: ${format(geometry.ap)}.`;
    } else if (count === 1) {
      message.textContent = `Solo la detección más segura: precisión 1, pero el recall se queda en ${format(current.recall)}.`;
    } else if (detection.tp) {
      message.textContent = `Con umbral ${format(detection.score)} entra un acierto: el recall sube a ${format(current.recall)} y la precisión queda en ${format(current.precision)}.`;
    } else {
      message.textContent = `La detección de ${format(detection.score)} es un falso positivo: el recall no se mueve y la precisión baja a ${format(current.precision)}.`;
    }

    slider.setAttribute(
      'aria-valuetext',
      `Umbral ${format(detection.score)}. Precisión ${format(current.precision)}, recall ${format(current.recall)}.`
    );
  }

  slider.addEventListener('input', update);
  update();
}
