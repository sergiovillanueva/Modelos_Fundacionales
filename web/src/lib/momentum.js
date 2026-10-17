/**
 * The DINO teacher is an exponential moving average of the student:
 * teacher <- m * teacher + (1 - m) * student. Here on a single synthetic weight, enough to see
 * the trade-off between a calm target and one that keeps up.
 */

/** A student weight that drifts towards a value while it jumps around step to step. */
export function studentSeries(steps = 120) {
  const series = [];
  for (let step = 0; step < steps; step += 1) {
    const drift = 1 - Math.exp(-step / 30);
    // Deterministic noise: a sum of sines stands in for minibatch noise.
    const noise = 0.18 * Math.sin(step * 1.7) + 0.11 * Math.sin(step * 4.3 + 1) + 0.07 * Math.sin(step * 9.1 + 2);
    series.push(+(drift + noise).toFixed(4));
  }
  return series;
}

/** Teacher trajectory for a momentum m; it starts where the student starts. */
export function teacherSeries(student, momentum) {
  if (!(momentum >= 0 && momentum < 1)) throw new Error('momentum must be in [0, 1)');
  const teacher = [];
  let value = student[0];
  for (const weight of student) {
    value = momentum * value + (1 - momentum) * weight;
    teacher.push(value);
  }
  return teacher;
}

/** How much a series jumps from one step to the next: mean absolute change. */
export function roughness(series) {
  let sum = 0;
  for (let index = 1; index < series.length; index += 1) sum += Math.abs(series[index] - series[index - 1]);
  return sum / Math.max(1, series.length - 1);
}

/** Steps an average lags behind: for an EMA the effective window is 1 / (1 - m). */
export function effectiveWindow(momentum) {
  return 1 / (1 - momentum);
}

/** Momentum values the lab offers; DINO schedules m from 0.996 up to 1. */
export const MOMENTUMS = [0.5, 0.8, 0.9, 0.95, 0.98, 0.99, 0.996, 0.999];
