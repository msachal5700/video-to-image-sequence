/**
 * Pipeline orchestrator: file in, ranked frames and category winners out.
 *
 * Owns the four stages the UI renders as steps:
 *   1. extract  — scene-aware keyframe sampling
 *   2. analyze  — CV metrics, off-thread
 *   3. select   — score, deduplicate, rank per platform
 *   4. done
 *
 * Kept separate from React so the whole flow is testable without mounting a
 * component, and so a future batch mode can drive it from a queue.
 */

import type {
  CandidateFrame,
  CategoryPick,
  PipelineProgress,
  PickerOptions,
  ScoredFrame,
  AnalysisResult,
  FaceAnalysis,
} from '../ai/types';
import { scoreFrame, pickCategoryWinners } from '../ai/scoreEngine';
import { removeDuplicates, countRemoved } from '../ai/duplicateFilter';
import { extractKeyframes } from './keyframeExtractor';

/**
 * Frames per worker message.
 *
 * 24 balances two costs: too small and postMessage overhead dominates, too large
 * and progress updates become chunky enough that the bar visibly stalls.
 */
const BATCH_SIZE = 24;

export interface PipelineResult {
  frames: ScoredFrame[];
  picks: CategoryPick[];
  duplicatesRemoved: number;
  duration: number;
  /** True when face data came from a real detector rather than the heuristic. */
  nativeFaceDetection: boolean;
}

export interface PipelineCallbacks {
  onProgress: (progress: PipelineProgress) => void;
  shouldCancel: () => boolean;
}

/** Merge a partial progress update onto the running state and emit it. */
const createProgressEmitter = (onProgress: (p: PipelineProgress) => void) => {
  const state: PipelineProgress = {
    stage: 'idle',
    progress: 0,
    message: '',
    framesFound: 0,
    framesAnalyzed: 0,
  };

  return (patch: Partial<PipelineProgress>) => {
    Object.assign(state, patch);
    onProgress({ ...state });
  };
};

/**
 * Run the analysis worker over every candidate, in batches.
 *
 * Falls back to synchronous main-thread analysis when Workers are unavailable or
 * the worker fails to start. The fallback is genuinely slower and will jank the
 * UI, but "slow" beats "broken" — and it keeps the feature working in locked-down
 * enterprise browsers and inside some in-app webviews.
 */
const analyzeAllFrames = async (
  frames: CandidateFrame[],
  faceMap: Map<string, FaceAnalysis>,
  pixelMap: Map<string, { buffer: ArrayBuffer; width: number; height: number }>,
  emit: (patch: Partial<PipelineProgress>) => void,
  shouldCancel: () => boolean
): Promise<Map<string, AnalysisResult>> => {
  const results = new Map<string, AnalysisResult>();
  if (frames.length === 0) return results;

  let worker: Worker | null = null;
  try {
    worker = new Worker(new URL('../workers/frameScorer.worker.ts', import.meta.url), {
      type: 'module',
    });
  } catch {
    worker = null;
  }

  if (!worker) {
    return analyzeOnMainThread(frames, faceMap, pixelMap, emit, shouldCancel);
  }

  try {
    let previousHistogram: number[] | null = null;

    for (let start = 0; start < frames.length; start += BATCH_SIZE) {
      if (shouldCancel()) break;

      const batch = frames.slice(start, start + BATCH_SIZE);
      const payload: Array<Record<string, unknown>> = [];
      const transfers: ArrayBuffer[] = [];

      for (const frame of batch) {
        const pixels = pixelMap.get(frame.id);
        if (!pixels) continue;
        payload.push({
          id: frame.id,
          index: frame.index,
          timestamp: frame.timestamp,
          buffer: pixels.buffer,
          width: pixels.width,
          height: pixels.height,
          sourceWidth: frame.sourceWidth,
          sourceHeight: frame.sourceHeight,
          faces: faceMap.get(frame.id) ?? { faces: [], source: 'unavailable' },
        });
        transfers.push(pixels.buffer);
      }

      if (payload.length === 0) continue;

      const batchResult = await runBatch(worker, payload, previousHistogram, transfers);
      for (const result of batchResult.results) {
        results.set(result.id, result);
        // Buffers were transferred, so drop our now-neutered references and let
        // the analysis bitmaps be collected as we go rather than at the end.
        pixelMap.delete(result.id);
      }
      previousHistogram = batchResult.lastHistogram;

      emit({
        stage: 'analyzing',
        progress: Math.round(((start + batch.length) / frames.length) * 100),
        message: `Analysing frames… ${results.size}/${frames.length}`,
        framesAnalyzed: results.size,
      });
    }
  } catch {
    // Worker died mid-run. Anything already analysed is kept; the remainder is
    // finished on the main thread so the user still gets a complete result.
    const remaining = frames.filter(frame => !results.has(frame.id));
    const fallback = await analyzeOnMainThread(
      remaining,
      faceMap,
      pixelMap,
      emit,
      shouldCancel
    );
    fallback.forEach((value, key) => results.set(key, value));
  } finally {
    worker.terminate();
  }

  return results;
};

/** Post one batch and resolve on its reply. */
const runBatch = (
  worker: Worker,
  frames: Array<Record<string, unknown>>,
  previousHistogram: number[] | null,
  transfers: ArrayBuffer[]
): Promise<{ results: AnalysisResult[]; lastHistogram: number[] | null }> =>
  new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as {
        type: string;
        results?: AnalysisResult[];
        lastHistogram?: number[] | null;
      };
      // FRAME_ERROR is informational — the batch continues, so keep listening.
      if (data.type !== 'BATCH_COMPLETE') return;
      cleanup();
      resolve({ results: data.results ?? [], lastHistogram: data.lastHistogram ?? null });
    };

    const handleError = (event: ErrorEvent) => {
      cleanup();
      reject(new Error(event.message || 'Analysis worker failed'));
    };

    const cleanup = () => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);

    worker.postMessage({ type: 'ANALYZE_BATCH', frames, previousHistogram }, transfers);
  });

/**
 * Main-thread analysis fallback.
 *
 * Yields between frames so the tab stays responsive. Imported dynamically to
 * keep `analyzeFrame` out of the initial bundle on the happy path, where the
 * worker owns that code.
 */
const analyzeOnMainThread = async (
  frames: CandidateFrame[],
  faceMap: Map<string, FaceAnalysis>,
  pixelMap: Map<string, { buffer: ArrayBuffer; width: number; height: number }>,
  emit: (patch: Partial<PipelineProgress>) => void,
  shouldCancel: () => boolean
): Promise<Map<string, AnalysisResult>> => {
  const { analyzeFrame } = await import('../ai/frameAnalyzer');
  const results = new Map<string, AnalysisResult>();
  let previousHistogram: number[] | null = null;

  for (let i = 0; i < frames.length; i++) {
    if (shouldCancel()) break;
    const frame = frames[i];
    const pixels = pixelMap.get(frame.id);
    if (!pixels) continue;

    try {
      const result = analyzeFrame({
        id: frame.id,
        index: frame.index,
        timestamp: frame.timestamp,
        pixels: new Uint8ClampedArray(pixels.buffer),
        width: pixels.width,
        height: pixels.height,
        sourceWidth: frame.sourceWidth,
        sourceHeight: frame.sourceHeight,
        faces: faceMap.get(frame.id) ?? { faces: [], source: 'unavailable' },
        previousHistogram,
      });
      results.set(result.id, result);
      previousHistogram = result.signature.histogram;
      pixelMap.delete(frame.id);
    } catch {
      // Skip unreadable frames, as the worker path does.
    }

    if (i % 8 === 7) {
      emit({
        stage: 'analyzing',
        progress: Math.round((i / frames.length) * 100),
        message: `Analysing frames… ${results.size}/${frames.length}`,
        framesAnalyzed: results.size,
      });
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
  }

  return results;
};

/**
 * Run the complete pipeline over one video file.
 *
 * @throws When the video cannot be decoded at all. Partial failures inside the
 *         pipeline degrade the result rather than throwing.
 */
export const runFramePicker = async (
  file: File,
  options: PickerOptions,
  callbacks: PipelineCallbacks
): Promise<PipelineResult> => {
  const emit = createProgressEmitter(callbacks.onProgress);
  const { shouldCancel } = callbacks;

  emit({
    stage: 'extracting',
    progress: 0,
    message: 'Reading video…',
    framesFound: 0,
    framesAnalyzed: 0,
  });

  const extraction = await extractKeyframes({
    file,
    maxCandidates: options.maxCandidates,
    onProgress: emit,
    shouldCancel,
  });

  if (extraction.frames.length === 0) {
    throw new Error(
      'NO_FRAMES: No frames could be read from this video. It may be corrupted or use an unsupported codec.'
    );
  }

  emit({
    stage: 'analyzing',
    progress: 0,
    message: 'Analysing frames…',
    framesFound: extraction.frames.length,
  });

  const analysis = await analyzeAllFrames(
    extraction.frames,
    extraction.faceMap,
    extraction.pixelMap,
    emit,
    shouldCancel
  );

  emit({ stage: 'selecting', progress: 30, message: 'Scoring and ranking frames…' });

  const scored: ScoredFrame[] = [];
  for (const frame of extraction.frames) {
    const result = analysis.get(frame.id);
    if (!result) {
      // Analysis failed for this frame; release its preview so the object URL
      // does not leak for an image that will never be rendered.
      URL.revokeObjectURL(frame.previewUrl);
      continue;
    }
    const { score, reasons, warnings } = scoreFrame(
      result.metrics,
      frame.sourceWidth,
      frame.sourceHeight
    );
    scored.push({ ...frame, score, reasons, warnings, metrics: result.metrics, signature: result.signature });
  }

  emit({ stage: 'selecting', progress: 60, message: 'Removing duplicate frames…' });

  // Black frames are dropped before dedup rather than filtered in the UI: they
  // would otherwise consume duplicate-cluster slots and, worse, win the "best
  // frame in this cluster" contest against a usable frame in a dark scene.
  const usable = scored.filter(frame => !frame.metrics.isBlackFrame);
  const deduped = removeDuplicates(usable.length > 0 ? usable : scored);

  // Free previews for frames that lost their duplicate cluster.
  const keptIds = new Set(deduped.map(frame => frame.id));
  for (const frame of scored) {
    if (!keptIds.has(frame.id)) URL.revokeObjectURL(frame.previewUrl);
  }

  emit({ stage: 'selecting', progress: 85, message: 'Choosing the best frame per platform…' });

  const picks = pickCategoryWinners(deduped);

  emit({
    stage: 'done',
    progress: 100,
    message: `Found ${deduped.length} high-quality frames`,
    framesFound: extraction.frames.length,
    framesAnalyzed: deduped.length,
  });

  return {
    frames: deduped,
    picks,
    duplicatesRemoved: countRemoved(scored.length, deduped.length),
    duration: extraction.duration,
    nativeFaceDetection: [...extraction.faceMap.values()].some(
      entry => entry.source === 'native'
    ),
  };
};
