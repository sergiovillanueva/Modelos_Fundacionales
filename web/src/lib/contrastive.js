/**
 * CLIP's contrastive objective on a tiny batch: N images, their N captions, and the N x N
 * table of similarities. The loss pushes every row and every column towards its diagonal.
 */

function normalize(vector) {
  const length = Math.hypot(...vector);
  return vector.map((value) => value / length);
}

/** Cosine similarity of every image with every text (vectors are normalized first). */
export function similarityMatrix(images, texts) {
  const a = images.map(normalize);
  const b = texts.map(normalize);
  return a.map((image) => b.map((text) => image.reduce((sum, value, index) => sum + value * text[index], 0)));
}

/** Softmax of each row after dividing by the temperature; subtracting the max keeps it stable. */
export function softmaxRows(matrix, temperature) {
  if (!(temperature > 0)) throw new Error('temperature must be positive');
  return matrix.map((row) => {
    const logits = row.map((value) => value / temperature);
    const top = Math.max(...logits);
    const exps = logits.map((value) => Math.exp(value - top));
    const sum = exps.reduce((total, value) => total + value, 0);
    return exps.map((value) => value / sum);
  });
}

function transpose(matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]));
}

/**
 * Symmetric cross-entropy, as in CLIP: images choose among texts (rows) and texts choose
 * among images (columns); the right answer is always the diagonal.
 */
export function contrastiveLoss(matrix, temperature) {
  const crossEntropy = (probabilities) =>
    -probabilities.reduce((sum, row, index) => sum + Math.log(row[index]), 0) / probabilities.length;
  const imageToText = crossEntropy(softmaxRows(matrix, temperature));
  const textToImage = crossEntropy(softmaxRows(transpose(matrix), temperature));
  return (imageToText + textToImage) / 2;
}

/**
 * A toy batch of four pairs with three-number embeddings. Halfway through training the cat
 * photo still sits closer to "a dog" than to "a cat": a hard negative.
 */
export const TOY_BATCH = {
  labels: ['perro', 'gato', 'coche', 'bici'],
  images: [[1, 0.25, 0.05], [1, 0.36, 0.03], [0.05, 0.12, 1], [0.15, 0.55, 0.82]],
  texts: [[1, 0.15, 0], [0.7, 0.7, 0], [0, 0.05, 1], [0.1, 0.6, 0.8]]
};

/** Temperatures the lab offers; CLIP starts at 0.07 and learns it. */
export const TEMPERATURES = [0.01, 0.015, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3, 0.5, 0.7, 1];
