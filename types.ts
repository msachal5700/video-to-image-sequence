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

export type OutputFormat = 'jpg' | 'png';
