/**
 * Export service: re-decodes a chosen frame at full quality and encodes it.
 *
 * A key decision: downloads do **not** come from the 640px preview. The preview
 * exists to make a fast, low-memory gallery; exporting it would hand the user a
 * 640px JPEG when they asked for a 1280x720 PNG thumbnail. Instead the video is
 * re-opened and re-seeked to the frame's exact timestamp, so the export is a
 * genuine full-resolution capture.
 *
 * That costs one seek per download. The trade is deliberate: holding
 * full-resolution bitmaps for hundreds of candidates would use gigabytes, and
 * the overwhelming majority of them are never downloaded.
 */

import JSZip from 'jszip';
import type { FrameSizePreset, PickerOutputFormat, PlatformProfile, ScoredFrame } from '../ai/types';

/** MIME type per output format. */
const MIME_TYPES: Record<PickerOutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

/** File extension per output format. */
const EXTENSIONS: Record<PickerOutputFormat, string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
};

export interface ExportRequest {
  frame: ScoredFrame;
  format: PickerOutputFormat;
  size: FrameSizePreset;
  quality: number;
  /** Present when exporting for a specific platform, drives `size: 'platform'`. */
  profile?: PlatformProfile;
}

/**
 * Probe WebP encode support once.
 *
 * Safari below 14 and some embedded webviews accept `image/webp` in `toBlob`
 * without honouring it, silently returning a PNG. Checking the returned data URL
 * prefix is the only reliable test, so it is done once and cached.
 */
let webpSupport: boolean | null = null;

export const supportsWebP = (): boolean => {
  if (webpSupport !== null) return webpSupport;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    webpSupport = false;
  }
  return webpSupport;
};

/** Resolve the requested format to one the browser can actually encode. */
const resolveFormat = (format: PickerOutputFormat): PickerOutputFormat =>
  format === 'webp' && !supportsWebP() ? 'png' : format;

/** Target export dimensions for a frame under a given size preset. */
const resolveDimensions = (
  frame: ScoredFrame,
  size: FrameSizePreset,
  profile?: PlatformProfile
): { width: number; height: number; crop: boolean } => {
  const aspect = frame.sourceHeight / frame.sourceWidth;

  switch (size) {
    case 'platform':
      // Only the platform preset crops. Every other preset preserves the source
      // framing, because silently cropping a "1080p" export would be surprising.
      if (profile) {
        return { width: profile.recommendedWidth, height: profile.recommendedHeight, crop: true };
      }
      return { width: frame.sourceWidth, height: frame.sourceHeight, crop: false };
    case '1080':
      return { width: 1920, height: Math.round(1920 * aspect), crop: false };
    case '720':
      return { width: 1280, height: Math.round(1280 * aspect), crop: false };
    case 'original':
    default:
      return { width: frame.sourceWidth, height: frame.sourceHeight, crop: false };
  }
};

/**
 * Source rectangle for a centre crop that fills the target aspect ratio.
 * Equivalent to CSS `object-fit: cover`, computed in source pixels.
 */
const centerCropRect = (
  sourceWidth: number,
  sourceHeight: number,
  targetAspect: number
): { sx: number; sy: number; sWidth: number; sHeight: number } => {
  const sourceAspect = sourceWidth / sourceHeight;

  if (sourceAspect > targetAspect) {
    const sWidth = Math.round(sourceHeight * targetAspect);
    return { sx: Math.round((sourceWidth - sWidth) / 2), sy: 0, sWidth, sHeight: sourceHeight };
  }

  const sHeight = Math.round(sourceWidth / targetAspect);
  return { sx: 0, sy: Math.round((sourceHeight - sHeight) / 2), sWidth: sourceWidth, sHeight };
};

/**
 * A reusable decoder that keeps one video element alive across many exports.
 *
 * "Download All" over twelve frames would otherwise load and tear down the video
 * twelve times. Reusing the element makes it one load and twelve seeks, which is
 * the difference between a couple of seconds and most of a minute on a large file.
 * Callers must call `dispose()`.
 */
export class FrameExporter {
  private video: HTMLVideoElement | null = null;
  private objectUrl: string | null = null;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly file: File) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('CANVAS_FAILED: Could not initialise the export canvas.');
    }
    this.ctx = ctx;
  }

  /** Lazily open the video. Called on first export. */
  private async ensureVideo(): Promise<HTMLVideoElement> {
    if (this.video) return this.video;

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(this.file);
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        this.video = video;
        this.objectUrl = url;
        resolve(video);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('CODEC_UNSUPPORTED: Could not reopen the video for export.'));
      };

      video.src = url;
    });
  }

  /** Seek and wait for the frame to be painted. */
  private seek(video: HTMLVideoElement, time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        video.onseeked = null;
        reject(new Error('SEEK_TIMEOUT: Timed out seeking to the selected frame.'));
      }, 10_000);

      video.onseeked = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        video.onseeked = null;
        resolve();
      };

      video.currentTime = Math.max(0, Math.min(time, video.duration - 0.05));
    });
  }

  /** Render and encode one frame at full quality. */
  async export(request: ExportRequest): Promise<Blob> {
    const { frame, size, quality, profile } = request;
    const format = resolveFormat(request.format);

    const video = await this.ensureVideo();
    await this.seek(video, frame.timestamp);

    const { width, height, crop } = resolveDimensions(frame, size, profile);
    this.canvas.width = Math.max(1, width);
    this.canvas.height = Math.max(1, height);

    // Best available resampling — exports are user-facing artefacts, and the
    // extra cost is irrelevant when it happens once per download.
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    if (crop) {
      const { sx, sy, sWidth, sHeight } = centerCropRect(
        video.videoWidth,
        video.videoHeight,
        width / height
      );
      this.ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
    } else {
      this.ctx.drawImage(video, 0, 0, width, height);
    }

    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('CANVAS_FAILED: Frame encoding failed.'))),
        MIME_TYPES[format],
        // PNG ignores the quality argument; passing it anyway is harmless but
        // being explicit documents that lossless means lossless.
        format === 'png' ? undefined : quality
      );
    });
  }

  /** Release the video element and its object URL. */
  dispose(): void {
    if (this.video) {
      this.video.pause();
      this.video.removeAttribute('src');
      this.video.load();
      this.video = null;
    }
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}

/** Build a descriptive, filesystem-safe filename for a frame. */
export const buildFileName = (
  frame: ScoredFrame,
  format: PickerOutputFormat,
  profile?: PlatformProfile
): string => {
  const seconds = frame.timestamp.toFixed(2).replace('.', 's');
  const prefix = profile ? profile.id : 'frame';
  const extension = EXTENSIONS[resolveFormat(format)];
  return `${prefix}-score${frame.score}-${seconds}.${extension}`;
};

/** Trigger a browser download for a blob. */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Deferred revoke: Firefox cancels an in-flight download if the URL is
  // released synchronously after `click()`.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export interface BatchExportOptions {
  file: File;
  frames: Array<{ frame: ScoredFrame; profile?: PlatformProfile }>;
  format: PickerOutputFormat;
  size: FrameSizePreset;
  quality: number;
  onProgress?: (done: number, total: number) => void;
}

/**
 * Export several frames into a single ZIP.
 *
 * Uses one `FrameExporter` for the whole batch, and stores rather than deflates
 * JPEG/WebP entries — both are already compressed, so DEFLATE burns CPU for
 * roughly zero size reduction. PNG entries do get deflated, where it pays off.
 */
export const exportFramesAsZip = async (options: BatchExportOptions): Promise<Blob> => {
  const { file, frames, format, size, quality, onProgress } = options;
  const exporter = new FrameExporter(file);
  const zip = new JSZip();
  const resolved = resolveFormat(format);

  try {
    for (let i = 0; i < frames.length; i++) {
      const { frame, profile } = frames[i];
      try {
        const blob = await exporter.export({ frame, format, size, quality, profile });
        const name = buildFileName(frame, format, profile);
        if (resolved === 'png') {
          zip.file(name, blob, { compression: 'DEFLATE', compressionOptions: { level: 3 } });
        } else {
          zip.file(name, blob, { compression: 'STORE' });
        }
      } catch {
        // One frame failing must not lose the other eleven.
      }
      onProgress?.(i + 1, frames.length);
    }

    return zip.generateAsync({ type: 'blob' });
  } finally {
    exporter.dispose();
  }
};
