import React from 'react';
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
  workerRef?: React.MutableRefObject<Worker | null>;
}

export const extractFramesAndZip = async (options: ProcessVideoOptions): Promise<Blob> => {
  const { file, fps, format, quality = 0.8, maxFrames, onProgress, onFrame, workerRef } = options;

  const supportsWorker = typeof OffscreenCanvas !== 'undefined' && typeof VideoDecoder !== 'undefined';

  if (!supportsWorker) {
    return extractFramesLegacy(options);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('[MAIN] Creating Web Worker...');
      const worker = new Worker(new URL('../workers/frameExtractor.worker.ts', import.meta.url), { type: 'module' });
      
      if (workerRef) {
        workerRef.current = worker;
      }

      worker.onmessage = (e) => {
        const { type } = e.data;
        console.log('[MAIN] Worker onmessage type:', type, e.data);
        if (type === 'FALLBACK') {
          console.warn('[MAIN] Worker requested FALLBACK, running legacy seeker');
          if (workerRef) workerRef.current = null;
          worker.terminate();
          extractFramesLegacy(options).then(resolve).catch(reject);
        } else if (type === 'PROGRESS') {
          onProgress({
            processedFrames: e.data.processedFrames,
            totalFrames: e.data.totalFrames,
            progress: e.data.progress,
            estimatedTimeRemaining: e.data.estimatedTimeRemaining,
            startTime: e.data.startTime
          });
        } else if (type === 'FRAME') {
          if (onFrame) onFrame(e.data.blob, e.data.index);
        } else if (type === 'COMPLETE') {
          console.log('[MAIN] Worker completed frame extraction successfully');
          if (workerRef) workerRef.current = null;
          worker.terminate();
          resolve(e.data.zipBlob);
        } else if (type === 'ERROR') {
          console.error('[MAIN] Worker error event received, falling back to legacy', e.data.message);
          if (workerRef) workerRef.current = null;
          worker.terminate();
          extractFramesLegacy(options).then(resolve).catch(reject);
        }
      };

      worker.onerror = (err) => {
        console.error('[MAIN] Worker.onerror fired, falling back to legacy:', err);
        if (workerRef) workerRef.current = null;
        worker.terminate();
        extractFramesLegacy(options).then(resolve).catch(reject);
      };

      console.log('[MAIN] Posting START message to worker, buffer size:', arrayBuffer.byteLength);
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
      console.error('[MAIN] Failed in worker startup try block:', err);
      if (workerRef) workerRef.current = null;
      extractFramesLegacy(options).then(resolve).catch(reject);
    }
  });
};
