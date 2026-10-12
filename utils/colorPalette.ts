/**
 * Video color palette extraction — samples evenly-spaced frames from a video,
 * then runs median-cut quantization on downscaled pixel data to find the
 * dominant colors. 100% client-side, dependency-free.
 *
 * Approach: seek a <video> element to each timestamp, draw the frame to a
 * small offscreen canvas (64x36), collect pixels, then median-cut into K
 * boxes. Each box average becomes one palette color, weighted by population.
 */

export interface PaletteColor {
  /** e.g. "#a1b2c3" */
  hex: string;
  /** e.g. "rgb(161, 178, 195)" */
  rgb: string;
  /** [r, g, b] */
  channels: [number, number, number];
  /** share of sampled pixels in this box, 0..1 */
  share: number;
}

export interface PaletteOptions {
  file: File;
  /** frames sampled evenly across the duration */
  frameSamples: number;
  /** number of palette colors (median-cut boxes) */
  colorCount: number;
  onProgress?: (done: number, total: number) => void;
}

export interface PaletteResult {
  colors: PaletteColor[];
  baseName: string;
}

const SAMPLE_W = 64;
const SAMPLE_H = 36;

function loadVideo(file: File): Promise<{ video: HTMLVideoElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    (video as any).playsInline = true;
    video.onloadedmetadata = () => {
      video.onloadedmetadata = null;
      video.onerror = null;
      resolve({ video, url });
    };
    video.onerror = () => {
      video.onloadedmetadata = null;
      video.onerror = null;
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
      reject(new Error('Seeking failed while sampling frames.'));
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = Math.min(time, Math.max(0, video.duration - 0.05));
  });
}

type RGB = [number, number, number];

interface Box {
  pixels: RGB[];
}

function channelRange(box: Box): { channel: 0 | 1 | 2; range: number } {
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
  for (const [r, g, b] of box.pixels) {
    if (r < rMin) rMin = r; if (r > rMax) rMax = r;
    if (g < gMin) gMin = g; if (g > gMax) gMax = g;
    if (b < bMin) bMin = b; if (b > bMax) bMax = b;
  }
  const ranges: Array<{ channel: 0 | 1 | 2; range: number }> = [
    { channel: 0, range: rMax - rMin },
    { channel: 1, range: gMax - gMin },
    { channel: 2, range: bMax - bMin },
  ];
  ranges.sort((a, b) => b.range - a.range);
  return ranges[0];
}

/** Median-cut: split boxes along the widest channel until we have `count` boxes. */
function medianCut(pixels: RGB[], count: number): Box[] {
  let boxes: Box[] = [{ pixels }];
  while (boxes.length < count) {
    // Split the box with the largest pixel count * channel range (skip tiny boxes).
    let bestIdx = -1;
    let bestScore = -1;
    let bestSplit: { channel: 0 | 1 | 2; range: number } | null = null;
    boxes.forEach((box, i) => {
      if (box.pixels.length < 2) return;
      const split = channelRange(box);
      if (split.range === 0) return;
      const score = box.pixels.length * (split.range + 1);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
        bestSplit = split;
      }
    });
    if (bestIdx === -1 || !bestSplit) break;
    const box = boxes[bestIdx];
    const channel = bestSplit.channel;
    const sorted = [...box.pixels].sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(sorted.length / 2);
    boxes.splice(bestIdx, 1, { pixels: sorted.slice(0, mid) }, { pixels: sorted.slice(mid) });
  }
  return boxes;
}

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}`;
}

export async function extractPalette(opts: PaletteOptions): Promise<PaletteResult> {
  const { file, frameSamples, colorCount, onProgress } = opts;
  const { video, url } = await loadVideo(file);
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_W;
  canvas.height = SAMPLE_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas is not available in this browser.');
  }

  const allPixels: RGB[] = [];
  try {
    const duration = video.duration || 1;
    for (let i = 0; i < frameSamples; i++) {
      // Sample evenly, skipping the very first/last instants (often black).
      const t = duration * ((i + 0.5) / frameSamples);
      await seekTo(video, t);
      ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
      const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
      for (let p = 0; p < data.length; p += 4) {
        // Light pre-quantization (>>2) cuts noise and speeds up the cut.
        allPixels.push([data[p] >> 2 << 2, data[p + 1] >> 2 << 2, data[p + 2] >> 2 << 2]);
      }
      onProgress?.(i + 1, frameSamples);
    }
  } finally {
    URL.revokeObjectURL(url);
  }

  if (allPixels.length === 0) {
    throw new Error('No pixels could be sampled from this video.');
  }

  const boxes = medianCut(allPixels, Math.max(2, Math.min(12, colorCount)));
  const total = allPixels.length;
  const colors: PaletteColor[] = boxes
    .map((box) => {
      let r = 0, g = 0, b = 0;
      for (const [pr, pg, pb] of box.pixels) {
        r += pr; g += pg; b += pb;
      }
      const n = box.pixels.length || 1;
      const channels: RGB = [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
      return {
        hex: toHex(channels[0], channels[1], channels[2]),
        rgb: `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`,
        channels,
        share: box.pixels.length / total,
      };
    })
    // Dominant first.
    .sort((a, b) => b.share - a.share);

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'video';
  return { colors, baseName };
}

/** Render the palette as a horizontal PNG strip and return a blob. */
export function paletteToPngStrip(colors: PaletteColor[], swatchPx = 160): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = swatchPx * colors.length;
    canvas.height = swatchPx;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas is not available in this browser.'));
      return;
    }
    colors.forEach((c, i) => {
      ctx.fillStyle = c.hex;
      ctx.fillRect(i * swatchPx, 0, swatchPx, swatchPx);
    });
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not render the palette strip.'));
    }, 'image/png');
  });
}

export function paletteToCssVars(colors: PaletteColor[]): string {
  const lines = colors.map((c, i) => `  --palette-${i + 1}: ${c.hex};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

export function paletteToTextList(colors: PaletteColor[]): string {
  return colors
    .map((c, i) => `${i + 1}. ${c.hex} — ${c.rgb} (${Math.round(c.share * 100)}% of sampled pixels)`)
    .join('\n');
}
