export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ZIPPING = 'ZIPPING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface VideoMetadata {
  name: string;
  duration: number;
  width: number;
  height: number;
  originalSize: number;
  type: string;
}

export interface ProcessingStats {
  totalFrames: number;
  processedFrames: number;
  progress: number; // 0 to 100
  startTime: number;
  estimatedTimeRemaining: number | null;
}

export type FrameRate = 1 | 5 | 10 | 12 | 15 | 24 | 25 | 30 | 60;

export const SUPPORTED_FPS: FrameRate[] = [1, 5, 10, 12, 15, 24, 25, 30, 60];

export type OutputFormat = 'jpg' | 'png' | 'webp';

/** Frame-extraction cadence: fixed FPS, one frame every N seconds, or smart scene-change detection. */
export type CadenceMode = 'fps' | 'interval' | 'scene';

/** Preset "every N seconds" intervals offered in the extractor UI. */
export const INTERVAL_PRESETS = [1, 5, 10, 30] as const;

export const MIN_INTERVAL_SECONDS = 1;
export const MAX_INTERVAL_SECONDS = 3600;

/** Clamp a custom every-N-seconds value into the sane 1–3600 range. */
export const clampIntervalSeconds = (value: number): number => {
  if (!Number.isFinite(value)) return 5;
  return Math.min(MAX_INTERVAL_SECONDS, Math.max(MIN_INTERVAL_SECONDS, Math.round(value)));
};

/** Effective FPS for the extraction pipeline when running in interval mode. */
export const intervalToFps = (intervalSeconds: number): number =>
  1 / clampIntervalSeconds(intervalSeconds);

/* ── Smart scene-detection cadence ────────────────────────────────────────── */

/** Scene-detection sensitivity slider bounds (higher = catches subtler changes). */
export const MIN_SCENE_SENSITIVITY = 1;
export const MAX_SCENE_SENSITIVITY = 100;
export const DEFAULT_SCENE_SENSITIVITY = 55;

/**
 * Map the 1–100 sensitivity slider to a mean-absolute luma-difference threshold
 * (0–1). 1 → ~0.32 (only hard cuts), 100 → ~0.05 (catches subtle changes).
 */
export const sceneSensitivityToThreshold = (sensitivity: number): number => {
  const s = Math.min(MAX_SCENE_SENSITIVITY, Math.max(MIN_SCENE_SENSITIVITY, Math.round(sensitivity)));
  return 0.32 - (s / 100) * 0.27;
};

/** Detection sampling rate: ~2 probes per second on a downscaled canvas. */
export const SCENE_SAMPLE_FPS = 2;

/** Analysis width for scene differencing. Small = fast; cuts still obvious. */
export const SCENE_ANALYSIS_WIDTH = 160;

/** Upper bound on detected scenes per video (memory/time guard). */
export const MAX_SCENE_FRAMES = 500;

/** Clamp a scene-sensitivity slider value into the sane 1–100 range. */
export const clampSceneSensitivity = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_SCENE_SENSITIVITY;
  return Math.min(MAX_SCENE_SENSITIVITY, Math.max(MIN_SCENE_SENSITIVITY, Math.round(value)));
};
