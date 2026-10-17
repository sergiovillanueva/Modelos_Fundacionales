/**
 * The operation inside every convolutional layer, on a grayscale image: each output pixel is
 * the weighted sum of its 3 x 3 neighbourhood. A trained CNN learns these nine weights; here
 * they are classic hand-made filters, which is what the first layers end up resembling.
 */

const kernel = (label, integers, divisor, signed) => ({
  label,
  integers,
  divisor,
  weights: integers.map((value) => value / divisor),
  signed
});

/** Integer weights and a divisor, as kernels are usually written; `weights` is what is applied. */
export const KERNELS = {
  vertical: kernel('Bordes verticales', [-1, 0, 1, -2, 0, 2, -1, 0, 1], 1, true),
  horizontal: kernel('Bordes horizontales', [-1, -2, -1, 0, 0, 0, 1, 2, 1], 1, true),
  blur: kernel('Desenfoque', [1, 2, 1, 2, 4, 2, 1, 2, 1], 16, false),
  sharpen: kernel('Realce', [0, -1, 0, -1, 5, -1, 0, -1, 0], 1, false)
};

/** The 3 x 3 neighbourhood under the probe and the weighted sum that becomes the output pixel. */
export function probeAt(gray, width, height, x, y, weights) {
  const patch = [];
  for (let ky = -1; ky <= 1; ky += 1) {
    const yy = Math.min(height - 1, Math.max(0, y + ky));
    for (let kx = -1; kx <= 1; kx += 1) {
      const xx = Math.min(width - 1, Math.max(0, x + kx));
      patch.push(gray[yy * width + xx]);
    }
  }
  return {patch, sum: patch.reduce((total, value, index) => total + value * weights[index], 0)};
}

/** Convolution with replicated borders; values in, values out (no clipping). */
export function convolve(gray, width, height, weights) {
  if (gray.length !== width * height) throw new Error('image size does not match width x height');
  if (weights.length !== 9) throw new Error('a 3 x 3 kernel has nine weights');
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        const yy = Math.min(height - 1, Math.max(0, y + ky));
        for (let kx = -1; kx <= 1; kx += 1) {
          const xx = Math.min(width - 1, Math.max(0, x + kx));
          sum += gray[yy * width + xx] * weights[(ky + 1) * 3 + (kx + 1)];
        }
      }
      out[y * width + x] = sum;
    }
  }
  return out;
}

/**
 * Feature map to 0-255 for display. Edge filters give negative and positive responses: both
 * signs mean "there is an edge here", so the magnitude is shown. It is stretched to the 98th
 * percentile rather than the maximum, or a handful of very strong edges would leave the rest black.
 */
export function toDisplay(values, signed) {
  const out = new Uint8ClampedArray(values.length);
  if (signed) {
    const magnitudes = Float32Array.from(values, Math.abs).sort();
    const top = magnitudes[Math.floor(0.98 * (magnitudes.length - 1))] || magnitudes[magnitudes.length - 1];
    const scale = top > 0 ? 255 / top : 0;
    values.forEach((value, index) => { out[index] = Math.abs(value) * scale; });
  } else {
    values.forEach((value, index) => { out[index] = value; });
  }
  return out;
}

/** Luminance of RGBA pixels (ITU-R BT.601), the usual way to go from colour to gray. */
export function toGray(rgba) {
  const gray = new Float32Array(rgba.length / 4);
  for (let index = 0; index < gray.length; index += 1) {
    gray[index] = 0.299 * rgba[index * 4] + 0.587 * rgba[index * 4 + 1] + 0.114 * rgba[index * 4 + 2];
  }
  return gray;
}
