/**
 * Web Worker that runs the CV metric suite off the main thread.
 *
 * Frames arrive as transferred `ArrayBuffer`s (zero-copy), get analysed, and the
 * numeric results come back. Pixel data is never sent *back* — only the compact
 * `FrameMetrics` and `FrameSignature` objects, which is what keeps the message
 * traffic in kilobytes rather than the tens of megabytes a naive round-trip
 * would move for a few hundred frames.
 *
 * The main thread stays free to paint the progress bar and lazy previews while
 * this runs, which is the whole point: a 500MB video takes a while, and a frozen
 * tab during that time reads as a crash.
 */

import { analyzeFrame } from '../ai/frameAnalyzer';
import type { AnalysisResult, FaceAnalysis } from '../ai/types';

/** One frame's worth of work, as it crosses the postMessage boundary. */
interface ScoreRequestFrame {
  id: string;
  index: number;
  timestamp: number;
  buffer: ArrayBuffer;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  faces: FaceAnalysis;
}

interface ScoreRequest {
  type: 'ANALYZE_BATCH';
  frames: ScoreRequestFrame[];
  /** Histogram of the last frame from the previous batch, for scene continuity. */
  previousHistogram: number[] | null;
}

self.onmessage = (event: MessageEvent<ScoreRequest>) => {
  const { type, frames, previousHistogram } = event.data;
  if (type !== 'ANALYZE_BATCH') return;

  const results: AnalysisResult[] = [];
  // Carried across frames so scene-change is measured against the immediately
  // preceding candidate, not against a fixed reference.
  let lastHistogram = previousHistogram;

  for (const frame of frames) {
    try {
      const result = analyzeFrame({
        id: frame.id,
        index: frame.index,
        timestamp: frame.timestamp,
        pixels: new Uint8ClampedArray(frame.buffer),
        width: frame.width,
        height: frame.height,
        sourceWidth: frame.sourceWidth,
        sourceHeight: frame.sourceHeight,
        faces: frame.faces,
        previousHistogram: lastHistogram,
      });
      results.push(result);
      lastHistogram = result.signature.histogram;
    } catch (error) {
      // Skip the frame rather than failing the batch. One unreadable frame in a
      // 300-frame video should cost that frame, not the whole analysis.
      self.postMessage({
        type: 'FRAME_ERROR',
        id: frame.id,
        message: error instanceof Error ? error.message : 'Unknown analysis error',
      });
    }
  }

  self.postMessage({
    type: 'BATCH_COMPLETE',
    results,
    lastHistogram,
  });
};

export {};
