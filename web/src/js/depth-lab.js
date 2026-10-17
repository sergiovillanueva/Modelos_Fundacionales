import {keepNearer} from '../lib/depth.js';

/** Pixels that survive keep their colour; the rest are washed towards white so the cut shows. */
export function cutComposite(rgba, keep) {
  const out = new Uint8ClampedArray(rgba.length);
  for (let index = 0; index < keep.length; index += 1) {
    const offset = index * 4;
    if (keep[index]) {
      out[offset] = rgba[offset];
      out[offset + 1] = rgba[offset + 1];
      out[offset + 2] = rgba[offset + 2];
    } else {
      const luma = 0.299 * rgba[offset] + 0.587 * rgba[offset + 1] + 0.114 * rgba[offset + 2];
      const washed = 205 + luma * 0.18;
      out[offset] = washed;
      out[offset + 1] = washed;
      out[offset + 2] = washed + 6;
    }
    out[offset + 3] = 255;
  }
  return out;
}

export function depthMessage(threshold) {
  if (threshold < 40) return 'Se va el cielo, que el modelo pone al fondo de todo. La carretera, el coche lejano y el camión siguen.';
  if (threshold < 90) return 'Se van el fondo y el coche lejano. Del camión queda la parte cercana: su costado se aleja de la cámara.';
  if (threshold < 135) return 'Queda la trasera del camión, y la pantalla que muestra otra carretera sigue entera: el modelo le da la distancia del camión aunque enseñe una carretera lejana.';
  if (threshold < 200) return 'El camión cae al otro lado del corte. Quedan el asfalto más próximo y el coche de la derecha.';
  return 'Solo queda el coche de la derecha, casi pegado a la cámara.';
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image), {once: true});
    image.addEventListener('error', reject, {once: true});
    image.src = src;
  });
}

export function initDepthLab(root = document) {
  const lab = root.querySelector('[data-depth-lab]');
  if (!lab) return;

  const slider = lab.querySelector('[data-depth-threshold]');
  const message = lab.querySelector('[data-depth-message]');
  const shareNode = lab.querySelector('[data-depth-share]');
  const valueNode = lab.querySelector('[data-depth-value]');
  const photo = lab.querySelector('[data-depth-photo]');
  if (!slider || !message || !shareNode || !photo) return;

  Promise.all([loadImage(lab.dataset.rgb), loadImage(lab.dataset.closeness)]).then(([rgbImage, depthImage]) => {
    const width = rgbImage.naturalWidth;
    const height = rgbImage.naturalHeight;
    const read = (image) => {
      const scratch = document.createElement('canvas');
      scratch.width = width;
      scratch.height = height;
      const context = scratch.getContext('2d', {willReadFrequently: true});
      context.drawImage(image, 0, 0, width, height);
      return context.getImageData(0, 0, width, height).data;
    };
    const rgba = read(rgbImage);
    const depthRgba = read(depthImage);
    const closeness = new Uint8Array(width * height);
    for (let index = 0; index < closeness.length; index += 1) closeness[index] = depthRgba[index * 4];

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = photo.className;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', photo.alt);
    photo.replaceWith(canvas);
    const context = canvas.getContext('2d');
    const frame = context.createImageData(width, height);

    function update() {
      const threshold = Number(slider.value);
      const {keep, share} = keepNearer(closeness, threshold);
      frame.data.set(cutComposite(rgba, keep));
      context.putImageData(frame, 0, 0);
      const percent = `${Math.round(share * 100)} %`;
      shareNode.textContent = percent;
      if (valueNode) valueNode.textContent = String(threshold);
      message.textContent = depthMessage(threshold);
      slider.setAttribute('aria-valuetext', `Corte en ${threshold} de 255. Se conserva el ${percent} de la imagen.`);
    }

    slider.addEventListener('input', update);
    update();
  }).catch(() => {});
}
