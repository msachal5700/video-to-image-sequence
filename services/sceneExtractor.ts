/**
 * Smart scene-change detection + frame extraction.
 *
 * Two phases, 100% client-side:
 *
 *   Phase 1 (detect): the video is sampled at ~2 probes/second on a small
 *   (160px) offscreen canvas. Each probe's luma plane is compared against the
 *   last *kept* frame via mean absolute difference. When the difference
 *   exceeds the user-adjustable sensitivity threshold, a scene cut is
 *   registered. To avoid keeping blurry mid-transition frames, the frame at
 *   the cut and one 0.15s later are compared with a Laplacian-variance focus
 *   measure and the sharper timestamp wins.
 *
 *   Phase 2 (export): every kept timestamp is re-seeked at full resolution,
 *   encoded to the requested format, streamed to the preview grid via
 *   `onFrame`, and packed into a ZIP.
 *
 * Honest limitations (also surfaced in the UI helper text): gradual fades and
 * slow pans may register as a single scene or be split late; very dark / very
 * uniform footage produces few scenes. Detection is heuristic, not exact.
 */

import JSZip from 'jszip';
import {
  OutputFormat,
  ProcessingStats,
  sceneSensitivityToThreshold,
  SCENE_SAMPLE_FPS,
  SCENE_ANALYSIS_WIDTH,
  MAX_SCENE_FRAMES,
} from '../types';
import { toLuma, laplacianVariance } from '../ai/imageMetrics';

export interface SceneExtractionOptions {
  file: File;
  /** 1–100 slider value; higher catches subtler changes. */
  sensitivity: number;
  format: OutputFormat;
  quality?: number; // 0 to 1, for jpg/webp
  onProgress: (stats: ProcessingStats) => void;
  onFrame?: (frameBlob: Blob, index: number) => void;
  /** Called live as scenes are detected, then with the final count. */
  onSceneCount?: (count: number) => void;
  /** Checked between probes/exports so Cancel stays responsive. */
  shouldCancel: () => boolean;
}

const SEEK_TIMEOUT_MS = 10_000;
const MAX_EXPORT_DIM = 1920;

const MIME: Record<OutputFormat, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

/** Load a File into a video element and wait for metadata. */
const loadVideo = (file: File): Promise<{ video: HTMLVideoElement; url: string }> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');

    const fail = (message: string) => {
      URL.revokeObjectURL(url);
      reject(new Error(message));
    };
    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        fail("DURATION_UNKNOWN: The browser could not read this video's duration. Try an MP4 (H.264) file.");
        return;
      }
      resolve({ video, url });
    };
    video.onerror = () =>
      fail('CODEC_UNSUPPORTED: This video codec is not supported by your browser. Try converting to MP4 H.264 first.');
    video.src = url;
  });

/** Seek and resolve once the frame at that position is painted. */
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
    video.currentTime = Math.max(0, Math.min(time, video.duration - 0.05));
  });

/** Mean absolute luma difference between two frames, normalised to 0–1. */
const frameDifference = (a: Float32Array, b: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length / 255;
};

const canvasToBlob = (canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('CANVAS_FAILED: Frame encoding failed.'))),
      MIME[format],
      format === 'png' ? undefined : quality
    );
  });

const nextTick = (): Promise<void> =>
  new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));

export const extractSceneFramesAndZip = async (
  options: SceneExtractionOptions
): Promise<Blob> => {
  const {
    file,
    sensitivity,
    format,
    quality = 0.9,
    onProgress,
    onFrame,
    onSceneCount,
    shouldCancel,
  } = options;

  const threshold = sceneSensitivityToThreshold(sensitivity);
  const startTime = Date.now();
  const { video, url } = await loadVideo(file);

  const report = (processedFrames: number, totalFrames: number, progress: number, message: string) =>
    onProgress({ totalFrames, processedFrames, progress, startTime, estimatedTimeRemaining: null });

  // ── Phase 1: detect scene cuts ──────────────────────────────────────────
  const aspect = video.videoHeight / Math.max(1, video.videoWidth);
  const analysis = document.createElement('canvas');
  analysis.width = SCENE_ANALYSIS_WIDTH;
  analysis.height = Math.max(2, Math.round(SCENE_ANALYSIS_WIDTH * aspect));
  const actx = analysis.getContext('2d', { willReadFrequently: true });
  if (!actx) {
    URL.revokeObjectURL(url);
    throw new Error('CANVAS_FAILED: Could not initialise the canvas renderer. Try closing other browser tabs to free memory.');
  }

  const grabLuma = (): { luma: Float32Array; sharpness: number } => {
    actx.drawImage(video, 0, 0, analysis.width, analysis.height);
    const data = actx.getImageData(0, 0, analysis.width, analysis.height);
    const luma = toLuma(data.data, data.width, data.height);
    return { luma, sharpness: laplacianVariance(luma, data.width, data.height) };
  };

  const duration = video.duration;
  const sceneTimes: number[] = [];

  try {
    // Scene 1 always starts near the beginning (t=0 is often a black/fade frame).
    const firstTime = Math.min(0.15, duration * 0.02);
    await seekTo(video, firstTime);
    let lastKept = grabLuma();
    sceneTimes.push(Math.round(firstTime * 1000) / 1000);
    onSceneCount?.(sceneTimes.length);

    const stride = 1 / SCENE_SAMPLE_FPS;
    const probeCount = Math.max(2, Math.floor(duration * SCENE_SAMPLE_FPS));

    for (let i = 1; i <= probeCount; i++) {
      if (shouldCancel() || sceneTimes.length >= MAX_SCENE_FRAMES) break;
      const time = Math.min(i * stride, duration - 0.1);
      if (time <= firstTime) continue;

      try {
        await seekTo(video, time);
      } catch {
        continue; // a failed probe is not fatal
      }

      const probe = grabLuma();
      if (frameDifference(probe.luma, lastKept.luma) >= threshold) {
        // Cut detected. The frame exactly at a cut is often a dissolve or a
        // compression-starved frame, so compare it against a frame 0.15s later
        // and keep whichever is sharper.
        let keepTime = time;
        try {
          const laterTime = Math.min(time + 0.15, duration - 0.1);
          await seekTo(video, laterTime);
          const later = grabLuma();
          if (later.sharpness > probe.sharpness * 1.2) {
            keepTime = laterTime;
            lastKept = later;
          } else {
            lastKept = probe;
          }
        } catch {
          lastKept = probe;
        }
        sceneTimes.push(Math.round(keepTime * 1000) / 1000);
        onSceneCount?.(sceneTimes.length);
      }

      if (i % 8 === 0) {
        report(i, probeCount, Math.round((i / probeCount) * 25), `Detecting scenes… ${sceneTimes.length} found`);
        await nextTick();
      }
    }
  } catch (err) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
    throw err;
  }

  report(probeCountSafe(duration), probeCountSafe(duration), 25, `Detected ${sceneTimes.length} scenes — extracting frames…`);
  onSceneCount?.(sceneTimes.length);

  // ── Phase 2: export each scene frame at full resolution ─────────────────
  const zip = new JSZip();
  const ext = format === 'jpg' ? 'jpg' : format;

  let targetWidth = video.videoWidth;
  let targetHeight = video.videoHeight;
  if (targetWidth > MAX_EXPORT_DIM || targetHeight > MAX_EXPORT_DIM) {
    const ratio = Math.min(MAX_EXPORT_DIM / targetWidth, MAX_EXPORT_DIM / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;
  const ectx = exportCanvas.getContext('2d');
  if (!ectx) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
    throw new Error('CANVAS_FAILED: Could not initialise the export canvas.');
  }

  try {
    for (let i = 0; i < sceneTimes.length; i++) {
      if (shouldCancel()) break;
      try {
        await seekTo(video, sceneTimes[i]);
      } catch {
        continue;
      }
      ectx.drawImage(video, 0, 0, targetWidth, targetHeight);
      const blob = await canvasToBlob(exportCanvas, format, quality);
      const name = `scene_${String(i + 1).padStart(4, '0')}.${ext}`;
      zip.file(name, blob);
      onFrame?.(blob, i);

      const progress = 25 + Math.round(((i + 1) / sceneTimes.length) * 75);
      report(i + 1, sceneTimes.length, progress, `Extracting scene ${i + 1}/${sceneTimes.length}…`);
      if (i % 4 === 3) await nextTick();
    }
  } finally {
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  }

  report(sceneTimes.length, sceneTimes.length, 100, 'Done');
  try {
    return await zip.generateAsync({
      type: 'blob',
      compression: format === 'png' ? 'DEFLATE' : 'STORE',
      compressionOptions: format === 'png' ? { level: 3 } : undefined,
    });
  } catch {
    throw new Error('ZIP_FAILED: Could not create ZIP archive. Your device may be running low on memory.');
  }
};

/** Probe count used for the detection-phase progress bar. */
const probeCountSafe = (duration: number): number => Math.max(2, Math.floor(duration * SCENE_SAMPLE_FPS));
