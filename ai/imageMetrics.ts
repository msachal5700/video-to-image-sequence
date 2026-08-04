/**
 * Pure computer-vision primitives operating on raw RGBA buffers.
 *
 * No DOM, no canvas, no React — every function here takes pixels in and returns
 * numbers out, which is what lets the whole scoring stage run inside a Web
 * Worker on a `Uint8ClampedArray` transferred from the extractor.
 *
 * All operations run over a downscaled analysis bitmap (see ANALYSIS_WIDTH in
 * `services/frameExtractor.ts`), so the cost per frame is a few hundred
 * microseconds rather than the tens of milliseconds a full-resolution pass
 * would take. That is the difference between a 30-second video analysing in
 * ~2s and in ~30s.
 */

import type { FrameSignature } from './types';

/** Luma coefficients from ITU-R BT.601, matching what canvas gives us. */
const LUMA_R = 0.299;
const LUMA_G = 0.587;
const LUMA_B = 0.114;

/** Clamp a value into the 0..1 range. */
export const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Linear interpolation helper used by several normalisation curves. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Map an unbounded positive measurement onto 0..1 with diminishing returns.
 * `midpoint` is the value that maps to 0.5, which makes tuning intuitive: pick
 * the number that represents "average" and the curve does the rest.
 */
export const soften = (value: number, midpoint: number): number => {
  if (value <= 0) return 0;
  return value / (value + midpoint);
};

/**
 * Convert an RGBA buffer to a single-channel luma plane.
 * Returns `Float32Array` because downstream convolutions want signed headroom.
 */
export const toLuma = (pixels: Uint8ClampedArray, width: number, height: number): Float32Array => {
  const luma = new Float32Array(width * height);
  for (let i = 0, p = 0; i < luma.length; i++, p += 4) {
    luma[i] = LUMA_R * pixels[p] + LUMA_G * pixels[p + 1] + LUMA_B * pixels[p + 2];
  }
  return luma;
};

/**
 * Variance of the Laplacian — the standard reference focus measure.
 *
 * A crisp frame has strong second-derivative responses at edges, producing high
 * variance. A blurred or defocused frame smears those edges and the variance
 * collapses. This is the single most predictive metric for "is this frame
 * usable as a thumbnail", which is why it carries the largest base weight.
 *
 * @returns Raw variance, unbounded. Normalise with `soften` before weighting.
 */
export const laplacianVariance = (luma: Float32Array, width: number, height: number): number => {
  if (width < 3 || height < 3) return 0;

  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    const rowUp = row - width;
    const rowDown = row + width;
    for (let x = 1; x < width - 1; x++) {
      // 4-neighbour Laplacian kernel: [0 1 0; 1 -4 1; 0 1 0]
      const value =
        luma[rowUp + x] +
        luma[rowDown + x] +
        luma[row + x - 1] +
        luma[row + x + 1] -
        4 * luma[row + x];
      sum += value;
      sumSq += value * value;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  return sumSq / count - mean * mean;
};

/** Mean and standard deviation of a luma plane, both in 0..255 units. */
export const lumaStats = (luma: Float32Array): { mean: number; stdDev: number } => {
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < luma.length; i++) {
    sum += luma[i];
    sumSq += luma[i] * luma[i];
  }
  const mean = sum / luma.length;
  const variance = Math.max(0, sumSq / luma.length - mean * mean);
  return { mean, stdDev: Math.sqrt(variance) };
};

/** Fractions of the frame that are clipped to pure black or pure white. */
export const clippingRatios = (
  luma: Float32Array
): { shadows: number; highlights: number } => {
  let shadows = 0;
  let highlights = 0;
  for (let i = 0; i < luma.length; i++) {
    if (luma[i] <= 6) shadows++;
    else if (luma[i] >= 249) highlights++;
  }
  return { shadows: shadows / luma.length, highlights: highlights / luma.length };
};

/**
 * Shannon entropy of the 256-bin luma histogram, normalised to 0..1.
 *
 * High entropy means tonal variety, which correlates with visual interest.
 * Near-zero entropy means a flat frame: a fade, a solid colour card, or a
 * blank slide. Useful as a cheap "is anything happening here" signal that is
 * independent of sharpness.
 */
export const lumaEntropy = (luma: Float32Array): number => {
  const histogram = new Uint32Array(256);
  for (let i = 0; i < luma.length; i++) {
    histogram[luma[i] | 0]++;
  }

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] === 0) continue;
    const p = histogram[i] / luma.length;
    entropy -= p * Math.log2(p);
  }
  // 8 bits is the theoretical maximum for a 256-bin histogram.
  return clamp01(entropy / 8);
};

/**
 * Hasler-Süsstrunk colourfulness metric.
 *
 * Correlates well with human judgements of "vivid" versus "washed out", and
 * unlike naive saturation averaging it does not reward a single blown-out
 * colour patch. Vivid frames measurably outperform muted ones as social
 * thumbnails, so this feeds directly into the vibrancy component.
 *
 * @returns Raw colourfulness, typically 0..150. Normalised by the caller.
 */
export const colorfulness = (pixels: Uint8ClampedArray): number => {
  let rgSum = 0;
  let rgSumSq = 0;
  let ybSum = 0;
  let ybSumSq = 0;
  const count = pixels.length / 4;

  for (let p = 0; p < pixels.length; p += 4) {
    const r = pixels[p];
    const g = pixels[p + 1];
    const b = pixels[p + 2];
    const rg = r - g;
    const yb = 0.5 * (r + g) - b;
    rgSum += rg;
    rgSumSq += rg * rg;
    ybSum += yb;
    ybSumSq += yb * yb;
  }

  const rgMean = rgSum / count;
  const ybMean = ybSum / count;
  const rgStd = Math.sqrt(Math.max(0, rgSumSq / count - rgMean * rgMean));
  const ybStd = Math.sqrt(Math.max(0, ybSumSq / count - ybMean * ybMean));

  const stdRoot = Math.sqrt(rgStd * rgStd + ybStd * ybStd);
  const meanRoot = Math.sqrt(rgMean * rgMean + ybMean * ybMean);
  return stdRoot + 0.3 * meanRoot;
};

/**
 * Directional gradient energy, used to separate motion blur from soft focus.
 *
 * Motion blur is *anisotropic*: panning smears horizontally, so vertical edges
 * survive while horizontal edges vanish, and the ratio between the two axes
 * skews hard. Defocus blur is isotropic and leaves the ratio near 1. Comparing
 * the axes therefore distinguishes "camera was moving" from "camera missed
 * focus" — a distinction that matters because the first is unrecoverable and
 * the second sometimes still reads fine at thumbnail size.
 *
 * @returns 0 = no directional smearing detected, 1 = severe.
 */
export const motionBlurScore = (
  luma: Float32Array,
  width: number,
  height: number
): number => {
  if (width < 3 || height < 3) return 0;

  let horizontalEnergy = 0;
  let verticalEnergy = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const gx = luma[row + x + 1] - luma[row + x - 1];
      const gy = luma[row + width + x] - luma[row - width + x];
      horizontalEnergy += Math.abs(gx);
      verticalEnergy += Math.abs(gy);
      count++;
    }
  }

  if (count === 0) return 0;
  horizontalEnergy /= count;
  verticalEnergy /= count;

  const total = horizontalEnergy + verticalEnergy;
  // A frame with almost no gradient at all is blurred or blank; either way the
  // blur metric should not fire, because `sharpness` already penalises it and
  // double-counting would push flat frames below genuinely motion-blurred ones.
  if (total < 2) return 0;

  const ratio = Math.abs(horizontalEnergy - verticalEnergy) / total;
  // Natural images sit around 0.15 asymmetry; treat that as the noise floor and
  // only start reporting blur beyond it.
  return clamp01((ratio - 0.15) / 0.45);
};

/**
 * Locate the visually salient region using a gradient-energy centroid.
 *
 * A full saliency model would need a neural net; for frame ranking the centre
 * of mass of edge energy is a strong, essentially free approximation. Busy,
 * in-focus subjects dominate the gradient field, so the centroid lands on them.
 *
 * @returns Normalised centroid coordinates plus the spread of the energy.
 */
export const saliencyCentroid = (
  luma: Float32Array,
  width: number,
  height: number
): { x: number; y: number; spread: number } => {
  let weightSum = 0;
  let xSum = 0;
  let ySum = 0;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const gx = luma[row + x + 1] - luma[row + x - 1];
      const gy = luma[row + width + x] - luma[row - width + x];
      const magnitude = Math.abs(gx) + Math.abs(gy);
      weightSum += magnitude;
      xSum += magnitude * x;
      ySum += magnitude * y;
    }
  }

  if (weightSum <= 0) {
    return { x: 0.5, y: 0.5, spread: 0 };
  }

  const cx = xSum / weightSum / width;
  const cy = ySum / weightSum / height;

  // Second pass for spread: how tightly energy clusters around the centroid.
  let varianceSum = 0;
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const gx = luma[row + x + 1] - luma[row + x - 1];
      const gy = luma[row + width + x] - luma[row - width + x];
      const magnitude = Math.abs(gx) + Math.abs(gy);
      const dx = x / width - cx;
      const dy = y / height - cy;
      varianceSum += magnitude * (dx * dx + dy * dy);
    }
  }

  return { x: cx, y: cy, spread: Math.sqrt(varianceSum / weightSum) };
};

/**
 * Score how closely a point sits to one of the four rule-of-thirds power points.
 *
 * @returns 1 when exactly on a power point, decaying to 0 at the far corner.
 */
export const ruleOfThirdsScore = (x: number, y: number): number => {
  const thirds = [1 / 3, 2 / 3];
  let best = Number.POSITIVE_INFINITY;

  for (const px of thirds) {
    for (const py of thirds) {
      const distance = Math.hypot(x - px, y - py);
      if (distance < best) best = distance;
    }
  }

  // Maximum possible distance from any power point is ~0.471 (frame corner).
  return clamp01(1 - best / 0.471);
};

/** Score how close a point sits to the exact frame centre. */
export const centerScore = (x: number, y: number): number => {
  const distance = Math.hypot(x - 0.5, y - 0.5);
  return clamp01(1 - distance / 0.707);
};

/**
 * Penalise frames whose subject is jammed against a frame edge.
 *
 * Edge-crowded subjects get cropped by every platform's aspect-ratio handling,
 * so a frame that looks fine in a 16:9 preview can lose the subject entirely as
 * a 1:1 Instagram post or a 9:16 story.
 *
 * @returns 1 = comfortably inside the safe area, 0 = hard against an edge.
 */
export const edgeBalanceScore = (x: number, y: number): number => {
  const marginX = Math.min(x, 1 - x);
  const marginY = Math.min(y, 1 - y);
  const margin = Math.min(marginX, marginY);
  // 0.15 of frame width is a reasonable safe-area margin for social crops.
  return clamp01(margin / 0.15);
};

/**
 * Coarse 4x4x4 RGB histogram, L1-normalised.
 *
 * 64 buckets is deliberately blunt: it has to be insensitive to noise and minor
 * lighting drift while still reacting to a genuine scene cut. Finer histograms
 * fire on every camera wobble and would shred the scene-change signal.
 */
export const colorHistogram = (pixels: Uint8ClampedArray): number[] => {
  const bins = new Array<number>(64).fill(0);
  const total = pixels.length / 4;

  for (let p = 0; p < pixels.length; p += 4) {
    const r = pixels[p] >> 6;
    const g = pixels[p + 1] >> 6;
    const b = pixels[p + 2] >> 6;
    bins[(r << 4) | (g << 2) | b]++;
  }

  for (let i = 0; i < bins.length; i++) {
    bins[i] /= total;
  }
  return bins;
};

/**
 * L1 distance between two normalised histograms, scaled to 0..1.
 * Used both for scene-change detection and as a coarse duplicate pre-filter.
 */
export const histogramDistance = (a: number[], b: number[]): number => {
  let distance = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    distance += Math.abs(a[i] - b[i]);
  }
  // L1 distance between two L1-normalised distributions maxes out at 2.
  return clamp01(distance / 2);
};

/**
 * 64-bit difference hash, returned as two 32-bit halves.
 *
 * dHash compares each pixel with its right-hand neighbour on a 9x8 grid, which
 * makes it robust to brightness shifts and mild compression while still
 * differing sharply between genuinely different images. That is exactly the
 * behaviour needed for near-duplicate rejection: two frames 200ms apart in a
 * static shot should hash nearly identically.
 */
export const differenceHash = (
  luma: Float32Array,
  width: number,
  height: number
): { high: number; low: number } => {
  const HASH_W = 9;
  const HASH_H = 8;
  const grid = new Float32Array(HASH_W * HASH_H);

  // Box-sample the source into the 9x8 grid.
  for (let gy = 0; gy < HASH_H; gy++) {
    const y0 = Math.floor((gy * height) / HASH_H);
    const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) * height) / HASH_H));
    for (let gx = 0; gx < HASH_W; gx++) {
      const x0 = Math.floor((gx * width) / HASH_W);
      const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) * width) / HASH_W));
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1 && y < height; y++) {
        const row = y * width;
        for (let x = x0; x < x1 && x < width; x++) {
          sum += luma[row + x];
          count++;
        }
      }
      grid[gy * HASH_W + gx] = count > 0 ? sum / count : 0;
    }
  }

  let high = 0;
  let low = 0;
  let bit = 0;
  for (let gy = 0; gy < HASH_H; gy++) {
    for (let gx = 0; gx < HASH_W - 1; gx++) {
      const isBrighter = grid[gy * HASH_W + gx] > grid[gy * HASH_W + gx + 1];
      if (isBrighter) {
        if (bit < 32) high |= 1 << bit;
        else low |= 1 << (bit - 32);
      }
      bit++;
    }
  }

  // `|0` normalises to signed 32-bit so equality comparisons behave.
  return { high: high | 0, low: low | 0 };
};

/** Population count of a 32-bit integer (Wegner / SWAR variant). */
const popcount32 = (value: number): number => {
  let v = value - ((value >> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
  v = (v + (v >> 4)) & 0x0f0f0f0f;
  return (v * 0x01010101) >> 24;
};

/**
 * Hamming distance between two 64-bit dHashes, as a 0..64 integer.
 * Below ~8 the two frames are perceptually the same shot.
 */
export const hashDistance = (a: FrameSignature, b: FrameSignature): number =>
  popcount32(a.dHashHigh ^ b.dHashHigh) + popcount32(a.dHashLow ^ b.dHashLow);
