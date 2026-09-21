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

/** Frame-extraction cadence: fixed FPS, or one frame every N seconds. */
export type CadenceMode = 'fps' | 'interval';

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
