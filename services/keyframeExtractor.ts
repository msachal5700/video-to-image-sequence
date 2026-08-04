/**
 * Adaptive keyframe extraction.
 *
 * The requirement is explicit: do NOT extract every frame. A 30-second 30fps
 * video has 900 frames; we want 80-150 *candidates*. Decoding and analysing all
 * 900 would take ~15x longer and produce a gallery of near-identical images that
 * the duplicate filter would throw away anyway.
 *
 * Strategy — a two-pass scene-aware sample:
 *
 *   Pass 1 (coarse): walk the video on a wide stride, hashing each probe. Cheap,
 *   and it tells us *where the cuts are* without decoding everything.
 *
 *   Pass 2 (refine): spend the remaining frame budget densely around detected
 *   cuts, because that is where visually distinct content lives, and sparsely
 *   inside long static shots, where extra samples add nothing.
 *
 * The result adapts to content: a fast-cut montage gets samples at every cut, a
 * 10-minute static lecture gets an even spread instead of 600 copies of the same
 * slide.
 *
 * Uses `HTMLVideoElement` seeking rather than `WebCodecs`. Deliberate: seeking
 * works on every browser and every container the browser can play, including
 * the MOV/WEBM files the existing tool already supports, whereas the WebCodecs
 * path in `frameExtractor.worker.ts` is MP4-only and needs an mp4box demux. For
 * *sparse* sampling — a few hundred seeks, not thousands of sequential frames —
 * seeking is also fast enough that the added complexity buys nothing.
 */

import type { CandidateFrame, FaceAnalysis, PipelineProgress } from '../ai/types';
import { differenceHash, toLuma } from '../ai/imageMetrics';
import { detectFaces } from '../models/faceDetector';

/**
 * Width of the analysis bitmap. Everything in `ai/imageMetrics` is calibrated
 * against this, so changing it means re-tuning SHARPNESS_MIDPOINT.
 *
 * 320px is the sweet spot: wide enough that the Laplacian still sees real edge
 * detail, small enough that a full metric pass is well under a millisecond.
 */
export const ANALYSIS_WIDTH = 320;

/** Preview JPEG width. Large enough for a retina card, small enough to hold hundreds in memory. */
const PREVIEW_WIDTH = 640;

/** Preview JPEG quality. 0.82 is visually clean and keeps previews ~40KB. */
const PREVIEW_QUALITY = 0.82;

/** Coarse probes in pass 1. Enough to find cuts without spending the whole budget. */
const COARSE_PROBES = 48;

/** dHash Hamming distance above which two coarse probes bracket a scene cut. */
const CUT_HASH_THRESHOLD = 18;

/** Seek timeout. A stuck seek must not hang the pipeline forever. */
const SEEK_TIMEOUT_MS = 10_000;

export interface ExtractionOptions {
  file: File;
  /** Upper bound on candidates handed to the analyser. */
  maxCandidates: number;
  onProgress: (progress: Partial<PipelineProgress>) => void;
  /** Checked between frames so the user's Cancel is responsive. */
  shouldCancel: () => boolean;
}

export interface ExtractionResult {
  frames: CandidateFrame[];
  /** Face analysis per frame id, computed during extraction where the bitmap lives. */
  faceMap: Map<string, FaceAnalysis>;
  /** Analysis pixel buffers per frame id, ready to transfer to the worker. */
  pixelMap: Map<string, { buffer: ArrayBuffer; width: number; height: number }>;
  duration: number;
  sourceWidth: number;
  sourceHeight: number;
}

/** Load a File into a video element and wait for metadata. */
const loadVideo = (file: File): Promise<{ video: HTMLVideoElement; url: string }> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    // Required for `drawImage` to work on some mobile browsers.
    video.setAttribute('playsinline', 'true');

    const cleanupAndFail = (message: string) => {
      URL.revokeObjectURL(url);
      reject(new Error(message));
    };

    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        cleanupAndFail(
          'DURATION_UNKNOWN: The browser could not read this video\'s duration. Try an MP4 (H.264) file.'
        );
        return;
      }
      resolve({ video, url });
    };

    video.onerror = () => {
      cleanupAndFail(
        'CODEC_UNSUPPORTED: This video codec is not supported by your browser. Try converting to MP4 H.264 first.'
      );
    };

    video.src = url;
  });

/** Seek to a timestamp and resolve once the frame at that position is painted. */
const seekTo = (video: HTMLVideoElement, time: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      video.onseeked = null;
      reject(new Error('SEEK_TIMEOUT: Video seeking timed out. The file may be corrupted.'));
    }, SEEK_TIMEOUT_MS);

    video.onseeked = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.onseeked = null;
      resolve();
    };

    // Clamp inside the media: seeking to exactly `duration` never fires `seeked`
    // in Safari, and lands past the last decodable frame elsewhere.
    video.currentTime = Math.max(0, Math.min(time, video.duration - 0.05));
  });

/** Reusable canvas pair. Recreating these per frame is a measurable cost at 300 frames. */
interface CanvasPair {
  analysis: HTMLCanvasElement;
  analysisCtx: CanvasRenderingContext2D;
  preview: HTMLCanvasElement;
  previewCtx: CanvasRenderingContext2D;
}

const createCanvases = (
  sourceWidth: number,
  sourceHeight: number
): CanvasPair => {
  const aspect = sourceHeight / sourceWidth;

  const analysis = document.createElement('canvas');
  analysis.width = ANALYSIS_WIDTH;
  analysis.height = Math.max(2, Math.round(ANALYSIS_WIDTH * aspect));
  // `willReadFrequently` matters here: without it Chrome keeps the canvas on the
  // GPU and every `getImageData` forces a synchronous readback.
  const analysisCtx = analysis.getContext('2d', { willReadFrequently: true });

  const preview = document.createElement('canvas');
  const previewWidth = Math.min(PREVIEW_WIDTH, sourceWidth);
  preview.width = previewWidth;
  preview.height = Math.max(2, Math.round(previewWidth * aspect));
  const previewCtx = preview.getContext('2d');

  if (!analysisCtx || !previewCtx) {
    throw new Error(
      'CANVAS_FAILED: Could not initialise the canvas renderer. Try closing other browser tabs to free memory.'
    );
  }

  return { analysis, analysisCtx, preview, previewCtx };
};

/** Grab the analysis pixels for the currently displayed video frame. */
const grabAnalysisPixels = (
  video: HTMLVideoElement,
  canvases: CanvasPair
): ImageData => {
  const { analysis, analysisCtx } = canvases;
  analysisCtx.drawImage(video, 0, 0, analysis.width, analysis.height);
  return analysisCtx.getImageData(0, 0, analysis.width, analysis.height);
};

/** Render the preview JPEG for the currently displayed video frame. */
const grabPreview = (video: HTMLVideoElement, canvases: CanvasPair): Promise<Blob> => {
  const { preview, previewCtx } = canvases;
  previewCtx.drawImage(video, 0, 0, preview.width, preview.height);
  return new Promise((resolve, reject) => {
    preview.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('CANVAS_FAILED: Preview encoding failed.'))),
      'image/jpeg',
      PREVIEW_QUALITY
    );
  });
};

/**
 * Pass 1 — coarse scan for scene boundaries.
 *
 * Only hashes; no previews, no metrics, nothing retained. That keeps the cost of
 * knowing the video's structure to roughly 48 seeks regardless of length.
 *
 * @returns Timestamps that immediately follow a detected cut.
 */
const findSceneCuts = async (
  video: HTMLVideoElement,
  canvases: CanvasPair,
  duration: number,
  onProgress: (progress: Partial<PipelineProgress>) => void,
  shouldCancel: () => boolean
): Promise<number[]> => {
  const probeCount = Math.min(COARSE_PROBES, Math.max(4, Math.floor(duration * 2)));
  const stride = duration / probeCount;
  const cuts: number[] = [];

  let previousHash: { high: number; low: number } | null = null;

  for (let i = 0; i < probeCount; i++) {
    if (shouldCancel()) break;

    const time = i * stride;
    try {
      await seekTo(video, time);
    } catch {
      // A failed probe is not fatal — the refine pass will still sample here.
      continue;
    }

    const imageData = grabAnalysisPixels(video, canvases);
    const luma = toLuma(imageData.data, imageData.width, imageData.height);
    const hash = differenceHash(luma, imageData.width, imageData.height);

    if (previousHash) {
      const distance =
        popcount(hash.high ^ previousHash.high) + popcount(hash.low ^ previousHash.low);
      if (distance >= CUT_HASH_THRESHOLD) cuts.push(time);
    }
    previousHash = hash;

    onProgress({
      stage: 'extracting',
      // Pass 1 is budgeted at the first 25% of the extraction bar; the refine
      // pass owns the remaining 75%, which matches roughly where the time goes.
      progress: Math.round((i / probeCount) * 25),
      message: 'Scanning for scene changes…',
    });
  }

  return cuts;
};

/** Local popcount, duplicated from imageMetrics to avoid exporting an internal. */
const popcount = (value: number): number => {
  let v = value - ((value >> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
  v = (v + (v >> 4)) & 0x0f0f0f0f;
  return (v * 0x01010101) >> 24;
};

/**
 * Build the pass-2 sample plan from the detected cuts.
 *
 * Half the budget goes to cut-adjacent samples, half to an even baseline spread.
 * The split guarantees two properties that matter: every detected scene is
 * represented, *and* a video with no detectable cuts (a single long take) still
 * yields a full, evenly spaced candidate set instead of almost nothing.
 */
const buildSamplePlan = (duration: number, cuts: number[], budget: number): number[] => {
  const times = new Set<number>();

  // Never sample frame 0 exactly — many encoders start on a black or faded frame.
  const firstSafe = Math.min(0.15, duration * 0.02);

  const cutBudget = Math.floor(budget / 2);
  if (cuts.length > 0) {
    const perCut = Math.max(1, Math.floor(cutBudget / cuts.length));
    for (const cut of cuts) {
      for (let i = 0; i < perCut; i++) {
        // Offset past the cut: the frame *at* a cut is often a dissolve or a
        // compression-starved I-frame, and the moment just after it is cleaner.
        const offset = 0.12 + i * 0.2;
        const time = cut + offset;
        if (time > firstSafe && time < duration - 0.1) times.add(round3(time));
      }
    }
  }

  const baselineCount = budget - times.size;
  if (baselineCount > 0) {
    const stride = (duration - firstSafe) / (baselineCount + 1);
    for (let i = 1; i <= baselineCount; i++) {
      const time = firstSafe + stride * i;
      if (time < duration - 0.1) times.add(round3(time));
    }
  }

  return Array.from(times).sort((a, b) => a - b);
};

/** Round to millisecond precision so the Set dedupes near-identical timestamps. */
const round3 = (value: number): number => Math.round(value * 1000) / 1000;

/**
 * Choose a candidate budget from the video's duration.
 *
 * Sub-linear on purpose. A 30s clip gets ~120 candidates (matching the spec's
 * 80-150 target); a 10-minute video gets ~300 rather than 2,400, because past a
 * few hundred the user cannot meaningfully review them and memory becomes the
 * binding constraint.
 */
export const computeCandidateBudget = (duration: number, maxCandidates: number): number => {
  const target = Math.round(40 + Math.sqrt(duration) * 16);
  return Math.max(12, Math.min(maxCandidates, target));
};

/**
 * Extract scene-aware candidate frames from a video file.
 *
 * Previews are `Blob` object URLs and analysis pixels are detached
 * `ArrayBuffer`s — neither holds a decoded bitmap, so peak memory stays roughly
 * `candidates x (preview KB + 320px RGBA)`, about 60MB at 300 candidates. That
 * is what makes a 500MB input viable: the source is streamed by the video
 * element and never held in JS memory at all.
 */
export const extractKeyframes = async (
  options: ExtractionOptions
): Promise<ExtractionResult> => {
  const { file, maxCandidates, onProgress, shouldCancel } = options;
  const { video, url } = await loadVideo(file);

  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;
  const duration = video.duration;

  if (sourceWidth === 0 || sourceHeight === 0) {
    URL.revokeObjectURL(url);
    throw new Error('CODEC_UNSUPPORTED: The browser reported zero video dimensions.');
  }

  const canvases = createCanvases(sourceWidth, sourceHeight);
  const frames: CandidateFrame[] = [];
  const faceMap = new Map<string, FaceAnalysis>();
  const pixelMap = new Map<string, { buffer: ArrayBuffer; width: number; height: number }>();

  try {
    const budget = computeCandidateBudget(duration, maxCandidates);
    const cuts = await findSceneCuts(video, canvases, duration, onProgress, shouldCancel);
    const plan = buildSamplePlan(duration, cuts, budget);

    for (let i = 0; i < plan.length; i++) {
      if (shouldCancel()) break;

      try {
        await seekTo(video, plan[i]);
      } catch {
        continue;
      }

      const imageData = grabAnalysisPixels(video, canvases);
      const preview = await grabPreview(video, canvases);
      const id = `frame-${i}-${Math.round(plan[i] * 1000)}`;

      // Face detection runs here, on the main thread, because the native
      // FaceDetector API is not exposed to workers. It reads the analysis canvas
      // rather than the full-resolution frame — 320px is ample for detection and
      // keeps the cost proportional to the analysis pass.
      const faces = await detectFaces(
        canvases.analysis,
        imageData.data,
        imageData.width,
        imageData.height
      );

      frames.push({
        id,
        index: i,
        timestamp: plan[i],
        previewUrl: URL.createObjectURL(preview),
        sourceWidth,
        sourceHeight,
      });
      faceMap.set(id, faces);
      // `.slice()` detaches a copy we own, so it can be transferred to the
      // worker without the canvas's backing store being neutered underneath us.
      pixelMap.set(id, {
        buffer: imageData.data.buffer.slice(0) as ArrayBuffer,
        width: imageData.width,
        height: imageData.height,
      });

      onProgress({
        stage: 'extracting',
        progress: 25 + Math.round((i / plan.length) * 75),
        message: `Extracting candidate frames… ${i + 1}/${plan.length}`,
        framesFound: frames.length,
      });

      // Yield to the event loop every few frames so the progress bar actually
      // paints and the Cancel button stays clickable.
      if (i % 4 === 3) await nextTick();
    }
  } finally {
    // Always release the media element, even if extraction threw partway.
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  }

  return { frames, faceMap, pixelMap, duration, sourceWidth, sourceHeight };
};

/** Yield to the browser so it can paint. */
const nextTick = (): Promise<void> =>
  new Promise(resolve => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
