/**
 * The scoring engine: turns `FrameMetrics` into a 0-100 score plus the reasons
 * behind it, then ranks frames per platform.
 *
 * Design rules this file follows deliberately:
 *
 * 1. **Nothing is random.** Every point is traceable to a measured metric. Two
 *    runs over the same video produce byte-identical scores.
 * 2. **Penalties are multiplicative, quality is additive.** A frame accumulates
 *    quality points, then hard defects (black frame, heavy blur) scale the total
 *    down. That ordering matters: an additive penalty lets a frame with one fatal
 *    flaw and nine good metrics still score well, which is wrong. A blurred
 *    frame is unusable no matter how vivid its colours are.
 * 3. **Reasons are generated from the same numbers as the score,** never written
 *    by hand per frame, so the explanation can never drift from the maths.
 */

import type {
  CategoryPick,
  FrameMetrics,
  MetricWeights,
  PlatformProfile,
  ScoredFrame,
} from './types';
import { clamp01 } from './imageMetrics';
import { PLATFORM_PROFILES } from './platformProfiles';

/**
 * Baseline importance of each positive metric for a generic quality judgement.
 *
 * These are relative, not absolute — the weighted sum is divided by the total
 * weight, so the numbers only need to be sensible against each other. Sharpness
 * leads because an unsharp frame has no use at any size; exposure follows
 * because bad exposure is the second most common reason a frame is unusable.
 */
const BASE_WEIGHTS: Readonly<Record<string, number>> = {
  sharpness: 26,
  exposure: 16,
  contrast: 12,
  composition: 12,
  colorfulness: 10,
  entropy: 8,
  resolutionScore: 8,
  faceArea: 5,
  ruleOfThirds: 4,
  centerWeight: 4,
  brightness: 3,
};

/** Metrics that contribute positively, resolved once at module load. */
const POSITIVE_METRICS = Object.keys(BASE_WEIGHTS) as Array<keyof FrameMetrics>;

/**
 * Read a metric as a 0..1 number, coercing the non-numeric fields safely.
 * Keeps the weighted-sum loop free of per-key special cases.
 */
const metricValue = (metrics: FrameMetrics, key: keyof FrameMetrics): number => {
  const raw = metrics[key];
  if (typeof raw === 'number') return clamp01(raw);
  return 0;
};

/**
 * Weighted mean of the positive metrics under a given emphasis profile.
 * @returns 0..1, before penalties and bonuses.
 */
const weightedQuality = (metrics: FrameMetrics, weights: MetricWeights): number => {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const key of POSITIVE_METRICS) {
    const base = BASE_WEIGHTS[key as string] ?? 0;
    const multiplier = weights[key] ?? 1;
    const weight = base * multiplier;
    weightedSum += metricValue(metrics, key) * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

/**
 * Multiplicative defect penalty. Returns a 0..1 factor applied to the quality.
 *
 * Motion blur is the harshest because it is unfixable in post. Clipping is
 * weighted next: blown highlights cannot be recovered, crushed shadows can be
 * lifted a little, which is why the highlight coefficient is higher.
 */
const defectFactor = (metrics: FrameMetrics, blurSensitivity: number): number => {
  let factor = 1;

  // Up to a 55% cut for severe directional smearing.
  factor *= 1 - clamp01(metrics.motionBlur) * 0.55 * blurSensitivity;

  // Blown highlights beyond 12% of the frame start to bite.
  const highlightExcess = Math.max(0, metrics.clippedHighlights - 0.12);
  factor *= 1 - clamp01(highlightExcess * 2.2) * 0.3;

  // Crushed shadows beyond 25% — more tolerant, dark frames are often stylistic.
  const shadowExcess = Math.max(0, metrics.clippedShadows - 0.25);
  factor *= 1 - clamp01(shadowExcess * 1.6) * 0.22;

  // A near-flat frame is a fade or a title card, not a usable still.
  if (metrics.entropy < 0.35) {
    factor *= 0.55 + metrics.entropy;
  }

  return clamp01(factor);
};

/**
 * Face-related bonus, in raw score points (not a 0..1 factor).
 *
 * Split from the weighted sum because a face is a *categorical* advantage for
 * social thumbnails rather than another quality axis — folding it into the mean
 * would let a large blurry face outrank a small sharp one.
 */
const faceBonus = (metrics: FrameMetrics, profile: PlatformProfile): number => {
  if (profile.faceBonus === 0 || metrics.faceCount === 0) return 0;

  // Faces occupying ~8% of the frame are ideal for a thumbnail; scale up to that
  // and hold, rather than rewarding an extreme close-up indefinitely.
  const sizeQuality = clamp01(metrics.faceArea / 0.08);
  const placementQuality = 1 - clamp01(metrics.faceCenterOffset);

  let bonus = profile.faceBonus * (0.55 + 0.3 * sizeQuality + 0.15 * placementQuality);

  // Only adjust for eyes/smile when the detector actually reported them.
  if (metrics.eyesVisible === true) bonus *= 1.12;
  else if (metrics.eyesVisible === false) bonus *= 0.6;

  if (metrics.smiling === true) bonus *= 1.08;

  return bonus;
};

/**
 * Aspect-fit penalty: how much of the frame survives the platform's crop.
 *
 * A 16:9 source cropped to 9:16 keeps only ~32% of its width. If the subject is
 * off to one side, it is simply gone. Scaling the penalty by how far the subject
 * sits from centre means a centred subject in landscape footage is barely
 * penalised for a vertical target, while an edge-placed one is heavily punished
 * — which is the actual behaviour a creator cares about.
 */
const aspectPenalty = (
  metrics: FrameMetrics,
  sourceWidth: number,
  sourceHeight: number,
  profile: PlatformProfile
): number => {
  if (sourceWidth <= 0 || sourceHeight <= 0) return 0;

  const sourceAspect = sourceWidth / sourceHeight;
  const target = profile.aspectRatio;

  // Fraction of the source area retained by a centre crop to the target aspect.
  const retained = sourceAspect > target ? target / sourceAspect : sourceAspect / target;
  const lost = 1 - clamp01(retained);

  // A subject on the thirds or at the edge is at far greater risk from the crop.
  const subjectRisk = 1 - clamp01(metrics.centerWeight);

  return clamp01(lost * (0.45 + 0.55 * subjectRisk)) * profile.aspectSensitivity;
};

/** Thresholds for turning numbers into the sentences shown on each card. */
const REASON_RULES: ReadonlyArray<{
  test: (m: FrameMetrics) => boolean;
  text: string;
}> = [
  { test: m => m.sharpness >= 0.78, text: 'Excellent sharpness' },
  { test: m => m.sharpness >= 0.58 && m.sharpness < 0.78, text: 'Good sharpness' },
  { test: m => m.exposure >= 0.78, text: 'Good lighting' },
  { test: m => m.contrast >= 0.6, text: 'Strong contrast' },
  { test: m => m.colorfulness >= 0.62, text: 'Vibrant colour' },
  { test: m => m.motionBlur <= 0.12, text: 'No motion blur' },
  { test: m => m.ruleOfThirds >= 0.72, text: 'Follows rule of thirds' },
  { test: m => m.centerWeight >= 0.74, text: 'Centered subject' },
  { test: m => m.entropy >= 0.72, text: 'Rich visual detail' },
  { test: m => m.resolutionScore >= 0.95, text: 'Full-resolution source' },
  { test: m => m.sceneChange >= 0.42, text: 'Distinct scene' },
];

/** Thresholds for the warning chips. Kept separate so tone stays consistent. */
const WARNING_RULES: ReadonlyArray<{
  test: (m: FrameMetrics) => boolean;
  text: string;
}> = [
  { test: m => m.motionBlur >= 0.4, text: 'Motion blur detected' },
  { test: m => m.sharpness < 0.35, text: 'Soft focus' },
  { test: m => m.clippedHighlights >= 0.18, text: 'Blown highlights' },
  { test: m => m.clippedShadows >= 0.35, text: 'Crushed shadows' },
  { test: m => m.brightness < 0.16, text: 'Very dark' },
  { test: m => m.brightness > 0.9, text: 'Overexposed' },
  { test: m => m.entropy < 0.35, text: 'Low detail' },
  { test: m => m.resolutionScore < 0.45, text: 'Low source resolution' },
];

/**
 * Build the reason list for a frame.
 *
 * Face reasons are appended separately because their wording depends on the
 * detector's provenance — a heuristic detector says "likely", a native one
 * states it plainly. Over-claiming here would be the fastest way to lose a
 * user's trust in the whole score.
 */
const buildReasons = (metrics: FrameMetrics, limit = 5): string[] => {
  const reasons = REASON_RULES.filter(rule => rule.test(metrics)).map(rule => rule.text);

  if (metrics.faceCount > 0) {
    if (metrics.faceSource === 'native') {
      reasons.unshift(
        metrics.faceCount === 1 ? 'Human face detected' : `${metrics.faceCount} faces detected`
      );
      if (metrics.smiling === true) reasons.push('Smiling subject');
      if (metrics.eyesVisible === true) reasons.push('Eyes open and visible');
    } else if (metrics.faceSource === 'heuristic') {
      reasons.unshift('Likely face or skin tones present');
    }
  }

  if (reasons.length === 0) {
    reasons.push('Best available frame in this segment');
  }

  return reasons.slice(0, limit);
};

/** Build the warning list for a frame. */
const buildWarnings = (metrics: FrameMetrics, limit = 3): string[] => {
  const warnings = WARNING_RULES.filter(rule => rule.test(metrics)).map(rule => rule.text);
  if (metrics.isBlackFrame) warnings.unshift('Black or blank frame');
  return warnings.slice(0, limit);
};

/**
 * Score one frame for generic quality, 0-100.
 *
 * The `best-overall` profile is used as the neutral reference so that the number
 * shown in the gallery is comparable across every frame in the video.
 */
export const scoreFrame = (
  metrics: FrameMetrics,
  sourceWidth: number,
  sourceHeight: number
): { score: number; reasons: string[]; warnings: string[] } => {
  // A black frame is worthless as a thumbnail regardless of anything else, and
  // returning early keeps it from ever ranking through an unlucky weight combo.
  if (metrics.isBlackFrame) {
    return {
      score: 1,
      reasons: [],
      warnings: ['Black or blank frame'],
    };
  }

  const quality = weightedQuality(metrics, {});
  const factor = defectFactor(metrics, 1);
  const overall = PLATFORM_PROFILES[0];

  const raw =
    quality * factor * 100 +
    faceBonus(metrics, overall) -
    aspectPenalty(metrics, sourceWidth, sourceHeight, overall) * 100;

  return {
    // Floor of 1 rather than 0: a score of zero reads as "failed to analyse",
    // which is a different and more alarming statement than "very poor frame".
    score: Math.max(1, Math.min(100, Math.round(raw))),
    reasons: buildReasons(metrics),
    warnings: buildWarnings(metrics),
  };
};

/**
 * Score one frame against a specific platform profile.
 * Shares every helper with `scoreFrame`, so the two can never diverge.
 */
export const scoreFrameForPlatform = (frame: ScoredFrame, profile: PlatformProfile): number => {
  if (frame.metrics.isBlackFrame) return 1;

  const quality = weightedQuality(frame.metrics, profile.weights);
  // Platforms that care about motion blur declare it in their weights; reuse that
  // as the blur sensitivity so the emphasis is stated in exactly one place.
  const blurSensitivity = profile.weights.motionBlur ?? 1;
  const factor = defectFactor(frame.metrics, blurSensitivity);

  const raw =
    quality * factor * 100 +
    faceBonus(frame.metrics, profile) -
    aspectPenalty(frame.metrics, frame.sourceWidth, frame.sourceHeight, profile) * 100;

  return Math.max(1, Math.min(100, Math.round(raw)));
};

/**
 * Reasons phrased for a specific platform.
 *
 * Leads with the platform-specific justification, then falls back to the generic
 * quality reasons, so the card explains *why this frame for this network* rather
 * than repeating the same four bullets ten times down the page.
 */
const buildPlatformReasons = (frame: ScoredFrame, profile: PlatformProfile): string[] => {
  const reasons: string[] = [];
  const m = frame.metrics;

  switch (profile.id) {
    case 'youtube-thumbnail':
      if (m.contrast >= 0.55) reasons.push('Holds contrast at sidebar thumbnail size');
      if (m.faceCount > 0) reasons.push('Face present — the strongest CTR signal on YouTube');
      break;
    case 'instagram-post':
      if (m.centerWeight >= 0.7) reasons.push('Subject survives the 1:1 square crop');
      if (m.colorfulness >= 0.6) reasons.push('Colour pops in a grid view');
      break;
    case 'instagram-story':
      if (m.centerWeight >= 0.7) reasons.push('Subject stays centred in a 9:16 crop');
      if (m.brightness >= 0.45) reasons.push('Bright enough for full-screen viewing');
      break;
    case 'linkedin-post':
      if (m.exposure >= 0.7) reasons.push('Clean, professional exposure');
      if (m.motionBlur <= 0.15) reasons.push('No motion artefacts');
      break;
    case 'pinterest-pin':
      if (m.entropy >= 0.65) reasons.push('Detail-rich, ideal for a discovery grid');
      if (m.colorfulness >= 0.6) reasons.push('Saturated palette stops the scroll');
      break;
    case 'x-post':
      if (m.contrast >= 0.55) reasons.push('Reads instantly in a timeline');
      break;
    case 'tiktok-cover':
      if (m.brightness >= 0.45) reasons.push('Bright vertical frame for a profile grid');
      if (m.faceCount > 0) reasons.push('Face-forward cover');
      break;
    case 'whatsapp-status':
      if (m.sharpness >= 0.6) reasons.push('Sharp enough to survive recompression');
      break;
    case 'wallpaper':
      if (m.resolutionScore >= 0.9) reasons.push('Full source resolution retained');
      if (m.ruleOfThirds >= 0.65) reasons.push('Subject placed off-centre, clear of desktop icons');
      break;
    case 'best-overall':
    default:
      break;
  }

  for (const reason of frame.reasons) {
    if (reasons.length >= 4) break;
    if (!reasons.includes(reason)) reasons.push(reason);
  }

  return reasons.slice(0, 4);
};

/**
 * Pick the winning frame for every platform.
 *
 * Runs over the full scored set once per profile. With the candidate cap at a
 * few hundred frames and ten profiles this is a few thousand cheap arithmetic
 * passes — trivial next to extraction, and it means each platform genuinely gets
 * the best frame for *it* rather than a re-ranked slice of a global top ten.
 */
export const pickCategoryWinners = (frames: ScoredFrame[]): CategoryPick[] => {
  if (frames.length === 0) return [];

  const picks: CategoryPick[] = [];
  // Tracks which frames are already spoken for, so ten cards do not all show the
  // same image when one frame happens to be the strongest on every axis.
  const usedFrameIds = new Set<string>();

  for (const profile of PLATFORM_PROFILES) {
    const ranked = frames
      .map(frame => ({ frame, categoryScore: scoreFrameForPlatform(frame, profile) }))
      .sort((a, b) => b.categoryScore - a.categoryScore);

    // Prefer an unused frame, but never leave a card empty for the sake of it:
    // on a short single-shot video there may only be a handful of viable frames.
    const fresh = ranked.find(entry => !usedFrameIds.has(entry.frame.id));
    const chosen = fresh ?? ranked[0];
    if (!chosen) continue;

    usedFrameIds.add(chosen.frame.id);

    picks.push({
      profile,
      frame: chosen.frame,
      categoryScore: chosen.categoryScore,
      reasons: buildPlatformReasons(chosen.frame, profile),
    });
  }

  return picks;
};
