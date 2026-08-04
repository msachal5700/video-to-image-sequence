/**
 * Turns raw frame pixels into the normalised `FrameMetrics` the scorer consumes.
 *
 * This module is the single place where raw CV measurements get mapped onto the
 * 0..1 scale. Keeping that mapping here — rather than scattered through the
 * scorer — means the weighting logic in `scoreEngine.ts` stays pure arithmetic
 * and every normalisation constant is reviewable in one screenful.
 */

import type { AnalysisInput, AnalysisResult, FaceAnalysis, FrameMetrics } from './types';
import {
  clamp01,
  clippingRatios,
  colorHistogram,
  colorfulness,
  differenceHash,
  edgeBalanceScore,
  histogramDistance,
  centerScore,
  laplacianVariance,
  lumaEntropy,
  lumaStats,
  motionBlurScore,
  ruleOfThirdsScore,
  saliencyCentroid,
  soften,
  toLuma,
} from './imageMetrics';

/**
 * Laplacian variance that maps to a 0.5 sharpness score.
 *
 * Calibrated against handheld 1080p footage downscaled to the 320px analysis
 * width: genuinely crisp frames land around 300-900, soft frames under 80.
 * A midpoint of 220 puts the decision boundary where human judgement flips.
 */
const SHARPNESS_MIDPOINT = 220;

/** Colourfulness that maps to 0.5. Muted footage sits ~15, vivid ~60. */
const COLORFULNESS_MIDPOINT = 42;

/** Reference pixel count for the resolution score (1920x1080). */
const REFERENCE_PIXELS = 1920 * 1080;

/** Below this mean luma with almost no variation, a frame is a black/fade card. */
const BLACK_FRAME_LUMA = 18;
const BLACK_FRAME_STDDEV = 10;

/**
 * Score exposure as a penalty against ideal mid-grey with minimal clipping.
 *
 * Two separate failure modes are folded together here because they are
 * perceptually equivalent to a viewer — a frame can be unusable because it is
 * globally too dark/bright, or because a well-averaged frame has its subject
 * blown out. Weighting clipping at 1.5x reflects that clipped detail is
 * unrecoverable, whereas a mildly dark frame can still be lifted in an editor.
 */
const exposureScore = (
  meanLuma: number,
  shadows: number,
  highlights: number
): number => {
  // 118/255 is a touch below mid-grey, which is where well-exposed video sits.
  const deviation = Math.abs(meanLuma - 118) / 118;
  const tonalPenalty = clamp01(deviation);
  const clippingPenalty = clamp01((shadows + highlights) * 1.5);
  return clamp01(1 - tonalPenalty * 0.7 - clippingPenalty * 0.5);
};

/**
 * Fold the geometric composition signals into one number.
 *
 * Rule of thirds is weighted highest because it is the most reliable predictor
 * of a frame reading well after a platform crops it. Centring matters second —
 * it is what saves a subject from being cropped out entirely. Edge balance is
 * a smaller corrective that punishes subjects glued to the frame border.
 */
const compositionScore = (
  thirds: number,
  center: number,
  edgeBalance: number
): number => clamp01(thirds * 0.45 + center * 0.3 + edgeBalance * 0.25);

/** Reduce a `FaceAnalysis` to the flat numeric fields `FrameMetrics` carries. */
const summariseFaces = (
  faces: FaceAnalysis
): Pick<
  FrameMetrics,
  'faceCount' | 'faceArea' | 'faceCenterOffset' | 'eyesVisible' | 'smiling' | 'faceSource'
> => {
  if (faces.faces.length === 0) {
    return {
      faceCount: 0,
      faceArea: 0,
      faceCenterOffset: 1,
      // `null` not `false`: "no face detected" is not the same claim as
      // "a face was found with its eyes shut", and the UI renders them
      // differently so it never states something it cannot support.
      eyesVisible: null,
      smiling: null,
      faceSource: faces.source,
    };
  }

  // Rank by area: the largest face is the subject, smaller ones are background.
  const largest = faces.faces.reduce((best, face) =>
    face.width * face.height > best.width * best.height ? face : best
  );

  const centerX = largest.x + largest.width / 2;
  const centerY = largest.y + largest.height / 2;
  const offset = Math.hypot(centerX - 0.5, centerY - 0.5) / 0.707;

  return {
    faceCount: faces.faces.length,
    faceArea: clamp01(largest.width * largest.height),
    faceCenterOffset: clamp01(offset),
    eyesVisible: largest.eyesVisible,
    smiling: largest.smiling,
    faceSource: faces.source,
  };
};

/**
 * Run the full metric suite over one frame.
 *
 * Ordered so the luma plane and histogram are each computed exactly once and
 * shared across every downstream measurement — the naive version recomputes
 * luma five times and roughly triples the per-frame cost.
 */
export const analyzeFrame = (input: AnalysisInput): AnalysisResult => {
  const { pixels, width, height, sourceWidth, sourceHeight, faces, previousHistogram } = input;

  const luma = toLuma(pixels, width, height);
  const { mean, stdDev } = lumaStats(luma);
  const { shadows, highlights } = clippingRatios(luma);
  const histogram = colorHistogram(pixels);
  const centroid = saliencyCentroid(luma, width, height);

  const rawSharpness = laplacianVariance(luma, width, height);
  const sharpness = soften(rawSharpness, SHARPNESS_MIDPOINT);
  const rawColorfulness = colorfulness(pixels);

  const thirds = ruleOfThirdsScore(centroid.x, centroid.y);
  const center = centerScore(centroid.x, centroid.y);
  const edgeBalance = edgeBalanceScore(centroid.x, centroid.y);

  const isBlackFrame = mean < BLACK_FRAME_LUMA && stdDev < BLACK_FRAME_STDDEV;

  const metrics: FrameMetrics = {
    sharpness,
    motionBlur: motionBlurScore(luma, width, height),
    brightness: clamp01(mean / 255),
    // 64 is roughly the std-dev of a punchy, well-graded frame.
    contrast: clamp01(stdDev / 64),
    exposure: exposureScore(mean, shadows, highlights),
    clippedShadows: shadows,
    clippedHighlights: highlights,
    colorfulness: soften(rawColorfulness, COLORFULNESS_MIDPOINT),
    entropy: lumaEntropy(luma),
    ruleOfThirds: thirds,
    centerWeight: center,
    composition: compositionScore(thirds, center, edgeBalance),
    // Square-root curve: the perceptual gap between 480p and 720p is far larger
    // than between 1440p and 4K, and a linear ratio would wildly over-reward
    // high-resolution sources that are otherwise mediocre frames.
    resolutionScore: clamp01(Math.sqrt((sourceWidth * sourceHeight) / REFERENCE_PIXELS)),
    sceneChange: previousHistogram ? histogramDistance(histogram, previousHistogram) : 1,
    isBlackFrame,
    ...summariseFaces(faces),
  };

  const hash = differenceHash(luma, width, height);

  return {
    id: input.id,
    metrics,
    signature: {
      dHashHigh: hash.high,
      dHashLow: hash.low,
      histogram,
    },
  };
};
