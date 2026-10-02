/**
 * Contact sheet builder — extracts evenly-spaced frames from a video and
 * composites them into a single grid image (JPG/PNG), entirely in-browser.
 *
 * Approach: seek a <video> element to each timestamp, draw the frame to an
 * offscreen canvas, then tile the thumbnails onto a final canvas with
 * optional timestamp labels and a header strip (filename / dimensions /
 * duration), vcsi-style.
 */

export interface ContactSheetOptions {
  file: File;
  /** Total thumbnails in the sheet. */
  frameCount: number;
  /** Grid columns; rows are derived. */
  columns: number;
  /** Draw "MM:SS" under each thumbnail. */
  showTimestamps: boolean;
  /** Draw header strip with file metadata. */
  showHeader: boolean;
  /** Output image format. */
  format: 'jpg' | 'png';
  /** JPEG quality 0..1 (ignored for PNG). */
  quality: number;
  /** Per-thumbnail width in px; height follows video aspect ratio. */
  thumbWidth: number;
  onProgress?: (done: number, total: number) => void;
}

export interface ContactSheetResult {
  blob: Blob;
  width: number;
  height: number;
  frames: number;
}

const GUTTER = 8;
const HEADER_HEIGHT = 56;
const LABEL_HEIGHT = 22;

function formatTimestamp(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
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
      reject(new Error('Seek failed while building the contact sheet.'));
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    // Clamp into valid range; some browsers reject currentTime === duration.
    video.currentTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.05, 0));
  });
}

export async function buildContactSheet(opts: ContactSheetOptions): Promise<ContactSheetResult> {
  const { file, frameCount, columns, showTimestamps, showHeader, format, quality, thumbWidth, onProgress } = opts;
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
    const thumbH = Math.round((thumbWidth * srcH) / srcW);
    const labelH = showTimestamps ? LABEL_HEIGHT : 0;
    const cellW = thumbWidth;
    const cellH = thumbH + labelH;

    const sheetW = GUTTER + cols * (cellW + GUTTER);
    const sheetH = (showHeader ? HEADER_HEIGHT : 0) + GUTTER + rows * (cellH + GUTTER);

    const sheet = document.createElement('canvas');
    sheet.width = sheetW;
    sheet.height = sheetH;
    const ctx = sheet.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser.');

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Header strip
    if (showHeader) {
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, sheetW, HEADER_HEIGHT);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '600 17px system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      const name = file.name.length > 52 ? file.name.slice(0, 49) + '…' : file.name;
      ctx.fillText(name, 16, 20);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px system-ui, sans-serif';
      const meta = `${srcW}×${srcH}  •  ${formatTimestamp(duration)}  •  ${frameCount} frames`;
      ctx.fillText(meta, 16, 41);
    }

    // Evenly-spaced timestamps, skipping the first/last 2% (often black).
    const margin = duration * 0.02;
    const span = Math.max(duration - margin * 2, 0.01);
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = thumbWidth;
    frameCanvas.height = thumbH;
    const fctx = frameCanvas.getContext('2d');
    if (!fctx) throw new Error('Canvas is not available in this browser.');

    for (let i = 0; i < frameCount; i++) {
      const t = frameCount === 1 ? duration / 2 : margin + (span * i) / (frameCount - 1);
      await seekTo(video, t);
      // Let the frame settle before capture (some browsers need a tick).
      await new Promise(r => requestAnimationFrame(r));
      fctx.drawImage(video, 0, 0, thumbWidth, thumbH);

      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = GUTTER + col * (cellW + GUTTER);
      const y = (showHeader ? HEADER_HEIGHT : 0) + GUTTER + row * (cellH + GUTTER);
      ctx.drawImage(frameCanvas, x, y, cellW, thumbH);

      if (showTimestamps) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatTimestamp(t), x + cellW / 2, y + thumbH + labelH / 2);
        ctx.textAlign = 'left';
      }
      onProgress?.(i + 1, frameCount);
    }

    const blob: Blob = await new Promise((resolve, reject) => {
      sheet.toBlob(
        b => (b ? resolve(b) : reject(new Error('Failed to encode the contact sheet image.'))),
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        format === 'jpg' ? quality : undefined
      );
    });

    return { blob, width: sheetW, height: sheetH, frames: frameCount };
  } finally {
    URL.revokeObjectURL(url);
  }
}
