/**
 * Near-duplicate rejection.
 *
 * Keyframe extraction inevitably returns runs of almost-identical frames: a
 * talking-head shot sampled every 400ms yields twenty frames of the same person
 * in the same pose. Showing all twenty is worse than useless — it buries the
 * genuinely different moments below a wall of repeats.
 *
 * Two-stage filter, cheapest first:
 *   1. dHash Hamming distance — 2 XORs and 2 popcounts per pair.
 *   2. Histogram L1 distance — only consulted when the hash is ambiguous.
 *
 * Within each duplicate cluster the highest-scoring frame wins, so deduplication
 * never costs quality: it only removes the weaker copies of a shot the user was
 * going to see anyway.
 */

import type { ScoredFrame } from './types';
import { hashDistance, histogramDistance } from './imageMetrics';

/**
 * Hamming distance below which two 64-bit dHashes are the same shot.
 *
 * Empirically: 0-4 is the same frame with compression noise, 5-10 is the same
 * shot with slight movement, 11+ is a genuinely different composition. 10 is the
 * boundary that keeps distinct moments while collapsing static runs.
 */
const HASH_DUPLICATE_THRESHOLD = 10;

/**
 * Hash range where the verdict is uncertain and the histogram gets a vote.
 * Below `HASH_DUPLICATE_THRESHOLD` we are already confident.
 */
const HASH_AMBIGUOUS_CEILING = 16;

/** Histogram distance below which frames in the ambiguous band are duplicates. */
const HISTOGRAM_DUPLICATE_THRESHOLD = 0.12;

/**
 * Decide whether two frames are perceptually the same image.
 *
 * dHash alone struggles with low-contrast frames, where small luma differences
 * flip many bits and inflate the distance. The histogram check rescues those
 * cases: if the colour distribution is nearly identical too, it is the same shot
 * regardless of what the hash says.
 */
export const isDuplicate = (a: ScoredFrame, b: ScoredFrame): boolean => {
  const hashDist = hashDistance(a.signature, b.signature);

  if (hashDist <= HASH_DUPLICATE_THRESHOLD) return true;
  if (hashDist > HASH_AMBIGUOUS_CEILING) return false;

  return (
    histogramDistance(a.signature.histogram, b.signature.histogram) <
    HISTOGRAM_DUPLICATE_THRESHOLD
  );
};

/**
 * Collapse runs of near-identical frames, keeping the best of each cluster.
 *
 * Comparison is against the *kept* representatives only, not every frame seen.
 * On a static shot that is one comparison per frame instead of N, turning a
 * quadratic blow-up into something linear in practice — which matters because
 * the pathological case (a long static shot) is also the common case.
 *
 * @param frames Scored frames in any order.
 * @returns Deduplicated frames, restored to ascending scene order.
 */
export const removeDuplicates = (frames: ScoredFrame[]): ScoredFrame[] => {
  if (frames.length <= 1) return [...frames];

  // Descending score means the first frame of any cluster is its best member,
  // so a kept representative never has to be swapped out later.
  const byScore = [...frames].sort((a, b) => b.score - a.score);
  const kept: ScoredFrame[] = [];

  for (const frame of byScore) {
    let duplicate = false;
    // Reverse order: temporally adjacent frames are the likeliest match, and
    // they cluster at the end of `kept`, so most checks exit on the first test.
    for (let i = kept.length - 1; i >= 0; i--) {
      if (isDuplicate(frame, kept[i])) {
        duplicate = true;
        break;
      }
    }
    if (!duplicate) kept.push(frame);
  }

  return kept.sort((a, b) => a.index - b.index);
};

/**
 * Count how many frames a dedup pass removed, for the "N duplicates removed"
 * line in the results header. Kept here so the UI never recomputes it.
 */
export const countRemoved = (before: number, after: number): number =>
  Math.max(0, before - after);
