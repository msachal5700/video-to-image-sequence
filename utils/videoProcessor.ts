import { ProcessingStats, OutputFormat } from '../types';
import { extractFramesLegacy } from '../workers/frameExtractor.legacy';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export interface ProcessVideoOptions {
  file: File;
  fps: number;
  format: OutputFormat;
  quality?: number; // 0 to 1
  maxFrames?: number; // default undefined = no limit
  onProgress: (stats: ProcessingStats) => void;
  onFrame?: (frameBlob: Blob, index: number) => void;
}

export const extractFramesAndZip = async (options: ProcessVideoOptions): Promise<Blob> => {
  const { file, fps, format, quality = 0.8, onProgress, onFrame } = options;

  const supportsWorker = typeof OffscreenCanvas !== 'undefined' && typeof VideoDecoder !== 'undefined';

  if (!supportsWorker) {
    return extractFramesLegacy(options);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const worker = new Worker(new URL('../workers/frameExtractor.worker.ts', import.meta.url), { type: 'module' });

      worker.onmessage = (e) => {
        const { type } = e.data;
        if (type === 'FALLBACK') {
          worker.terminate();
          extractFramesLegacy(options).then(resolve).catch(reject);
        } else if (type === 'PROGRESS') {
          onProgress({
            processedFrames: e.data.processedFrames,
            totalFrames: e.data.totalFrames,
            progress: e.data.progress,
            estimatedTimeRemaining: e.data.estimatedTimeRemaining,
            startTime: Date.now() // The worker doesn't manage start time correctly across threads, but progress does estimate it
          });
        } else if (type === 'FRAME') {
          if (onFrame) onFrame(e.data.blob, e.data.index);
        } else if (type === 'COMPLETE') {
          worker.terminate();
          resolve(e.data.zipBlob);
        } else if (type === 'ERROR') {
          worker.terminate();
          // Also fallback on error to be safe, sometimes WebCodecs fails strangely
          extractFramesLegacy(options).then(resolve).catch(reject);
        }
      };

      worker.onerror = (err) => {
        worker.terminate();
        extractFramesLegacy(options).then(resolve).catch(reject);
      };

      worker.postMessage({
        type: 'START',
        payload: {
          arrayBuffer,
          fps,
          format,
          quality,
          maxFrames
        }
      }, [arrayBuffer]);

    } catch (err) {
      extractFramesLegacy(options).then(resolve).catch(reject);
    }
  });
};
