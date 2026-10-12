/**
 * Sprite sheet builder — extracts evenly-spaced frames from a video and
 * composites them into a single grid PNG plus a JSON frame-data file,
 * entirely in-browser. Built for game developers: the PNG holds the frames,
 * the JSON maps every frame to its x/y/width/height cell (Unity/Godot-friendly).
 *
 * Approach: seek a <video> element to each timestamp, draw the frame to an
 * offscreen canvas, then tile the frames edge-to-edge onto a final canvas.
 * Unlike contact sheets, sprite sheets have no gutters, labels, or headers —
 * game engines expect clean, uniformly-sized cells.
 */

export interface SpriteSheetOptions {
  file: File;
  /** Total frames in the sheet. */
  frameCount: number;
  /** Grid columns; rows are derived. */
  columns: number;
  /** Per-frame cell size in px (square cells; source is cover-cropped). */
  cellSize: number;
  onProgress?: (done: number, total: number) => void;
}

export interface SpriteFrameMeta {
  /** e.g. "frame_0000" */
  name: string;
  /** frame index in the sheet, left-to-right, top-to-bottom */
  index: number;
  /** cell origin in px */
  x: number;
  y: number;
  /** cell size in px (square) */
  w: number;
  h: number;
}

export interface SpriteSheetJson {
  /** sprite sheet image file name this JSON describes */
  image: string;
  /** source video file name */
  sourceVideo: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  frameCount: number;
  /** seconds between sampled frames */
  frameIntervalSeconds: number;
  frames: SpriteFrameMeta[];
  /** how to use this file in common engines */
  usage: {
    godot: string;
    unity: string;
  };
}

export interface SpriteSheetResult {
  /** PNG blob of the grid */
  pngBlob: Blob;
  /** JSON metadata blob */
  jsonBlob: Blob;
  /** pretty-printed JSON text (for preview) */
  jsonText: string;
  width: number;
  height: number;
  frames: number;
  baseName: string;
}

function loadVideo(file: File): Promise<{ video: HTMLVideoElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    (video as any).playsInline = true;
    const cleanup = () => {
      video.onloadedmetadata = null;
      video.onerror = null;
    };
    video.onloadedmetadata = () => {
      cleanup();
      resolve({ video, url });
    };
    video.onerror = () => {
      cleanup();
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode this video in your browser. Try MP4, MOV, or WEBM.'));
    };
    video.src = url;
  });
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      reject(new Error('Seek failed while building the sprite sheet.'));
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.05, 0));
  });
}

export async function buildSpriteSheet(opts: SpriteSheetOptions): Promise<SpriteSheetResult> {
  const { file, frameCount, columns, cellSize, onProgress } = opts;
  const { video, url } = await loadVideo(file);

  try {
    const duration = video.duration;
    const srcW = video.videoWidth;
    const srcH = video.videoHeight;
    if (!duration || !isFinite(duration) || srcW === 0 || srcH === 0) {
      throw new Error('Could not read this video. It may be corrupted or use an unsupported codec.');
    }

    const cols = Math.max(1, Math.min(columns, frameCount));
    const rows = Math.ceil(frameCount / cols);
    const sheetW = cols * cellSize;
    const sheetH = rows * cellSize;

    const sheet = document.createElement('canvas');
    sheet.width = sheetW;
    sheet.height = sheetH;
    const ctx = sheet.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser.');

    // Cover-crop source region: square crop centered on the video frame so
    // every cell is a uniform square (what sprite pipelines expect).
    const cropSize = Math.min(srcW, srcH);
    const cropX = Math.round((srcW - cropSize) / 2);
    const cropY = Math.round((srcH - cropSize) / 2);

    // Evenly-spaced timestamps, skipping the first/last 2% (often black).
    const margin = duration * 0.02;
    const span = Math.max(duration - margin * 2, 0.01);

    const frames: SpriteFrameMeta[] = [];
    for (let i = 0; i < frameCount; i++) {
      const t = frameCount === 1 ? duration / 2 : margin + (span * i) / (frameCount - 1);
      await seekTo(video, t);
      await new Promise(r => requestAnimationFrame(r));

      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellSize;
      const y = row * cellSize;
      ctx.drawImage(video, cropX, cropY, cropSize, cropSize, x, y, cellSize, cellSize);

      frames.push({
        name: `frame_${String(i).padStart(4, '0')}`,
        index: i,
        x,
        y,
        w: cellSize,
        h: cellSize,
      });
      onProgress?.(i + 1, frameCount);
    }

    const pngBlob: Blob = await new Promise((resolve, reject) => {
      sheet.toBlob(
        b => (b ? resolve(b) : reject(new Error('Failed to encode the sprite sheet PNG.'))),
        'image/png'
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^\w\-]+/g, '_') || 'spritesheet';
    const json: SpriteSheetJson = {
      image: `${baseName}_spritesheet.png`,
      sourceVideo: file.name,
      frameWidth: cellSize,
      frameHeight: cellSize,
      columns: cols,
      rows,
      frameCount,
      frameIntervalSeconds: Math.round((span / Math.max(frameCount - 1, 1)) * 100) / 100,
      frames,
      usage: {
        godot: 'In Godot 4: add an AnimatedSprite2D, create a SpriteFrames resource, and use the frameWidth/frameHeight/columns grid — or import the PNG and slice it by the frames array in the editor.',
        unity: 'In Unity: import the PNG as a Sprite (Multiple), open the Sprite Editor, and slice by the frames array (x, y, w, h per frame) — or auto-slice on the uniform grid.',
      },
    };
    const jsonText = JSON.stringify(json, null, 2);
    const jsonBlob = new Blob([jsonText], { type: 'application/json' });

    return { pngBlob, jsonBlob, jsonText, width: sheetW, height: sheetH, frames: frameCount, baseName };
  } finally {
    URL.revokeObjectURL(url);
  }
}
