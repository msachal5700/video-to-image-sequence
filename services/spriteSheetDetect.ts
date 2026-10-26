/**
 * Sprite-sheet frame detection for sheets that do NOT use a regular grid.
 *
 * Two strategies, both dependency-free:
 *
 * 1. `detectFrames` — for sheets whose sprites sit on a uniform
 *    background (transparent, or a single flat colour). A pixel counts as
 *    "content" when it is visibly different from the background. Content
 *    pixels are grouped with connected-component labelling on a downscaled
 *    mask (so sprites anywhere on the sheet are found, not just grid-aligned
 *    ones), each component's bounding box is refined against the
 *    full-resolution pixels, and tiny specks are discarded as noise. Sprites
 *    must not touch each other — a visible gutter of background between
 *    them is what separates one frame from the next.
 *
 * 2. Atlas parsers — `parseTexturePackerJson` (both the hash and array
 *    shapes TexturePacker emits) and `parseSparrowXml` (Starling/Sparrow
 *    `SubTexture` entries). When a sheet ships with its atlas file, the
 *    rectangles in the file are authoritative — no detection guessing.
 */

export interface DetectedRect {
  name?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A pixel is content when its alpha is meaningful AND (for opaque sheets) it differs from the background colour. */
const isContentPixel = (
  data: Uint8ClampedArray,
  i: number,
  bg: { r: number; g: number; b: number; a: number },
  colorThreshold: number
): boolean => {
  const a = data[i + 3];
  if (bg.a < 250) {
    // Transparent background: anything visibly non-transparent is content.
    return a > 8;
  }
  if (a < 8) return true; // a transparent hole in an opaque sheet is still "not background"
  const dr = data[i] - bg.r;
  const dg = data[i + 1] - bg.g;
  const db = data[i + 2] - bg.b;
  return dr * dr + dg * dg + db * db > colorThreshold * colorThreshold;
};

export interface DetectOptions {
  /** Smallest sprite dimension (full-res px) treated as a sprite, not noise. Default 4. */
  minSize?: number;
  /** Colour distance from the background that counts as content (opaque sheets). Default 24. */
  colorThreshold?: number;
}

/** Longest side of the analysis mask. Component labelling runs on this, not on full-res pixels. */
const MASK_MAX = 800;

/**
 * Detect frame rectangles in a sprite sheet by connected-component labelling.
 * `imageData` is the full sheet. Returns rectangles in reading order
 * (top-to-bottom, left-to-right), or an empty array when no
 * background-separated sprites could be found.
 */
export const detectFrames = (
  imageData: ImageData,
  options: DetectOptions = {}
): DetectedRect[] => {
  const minSize = options.minSize ?? 4;
  const colorThreshold = options.colorThreshold ?? 24;
  const { width, height, data } = imageData;
  if (width === 0 || height === 0) return [];

  // Background = the top-left pixel. Sprite sheets are laid out on a uniform
  // backdrop; if a sprite touches the corner this degrades gracefully to the
  // transparent check below via the alpha branch only when alpha < 250.
  const bg = { r: data[0], g: data[1], b: data[2], a: data[3] };
  const isContent = (x: number, y: number) => isContentPixel(data, (y * width + x) * 4, bg, colorThreshold);

  // Downscaled content mask: a cell is content when any full-res pixel in
  // its block is. One full-res pass, then labelling on at most 800x800.
  const scale = Math.min(1, MASK_MAX / Math.max(width, height));
  const maskW = Math.max(1, Math.round(width * scale));
  const maskH = Math.max(1, Math.round(height * scale));
  const mask = new Uint8Array(maskW * maskH);
  for (let y = 0; y < height; y++) {
    const my = Math.min(maskH - 1, Math.floor(y * scale));
    const rowBase = y * width * 4;
    for (let x = 0; x < width; x++) {
      if (isContentPixel(data, rowBase + x * 4, bg, colorThreshold)) {
        mask[my * maskW + Math.min(maskW - 1, Math.floor(x * scale))] = 1;
      }
    }
  }

  // Connected components (4-connectivity) over the mask, iterative flood fill.
  const visited = new Uint8Array(maskW * maskH);
  const minCells = Math.max(1, Math.round(minSize * scale));
  interface Comp { minX: number; minY: number; maxX: number; maxY: number; cells: number }
  const comps: Comp[] = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || visited[start]) continue;
    const comp: Comp = { minX: maskW, minY: maskH, maxX: -1, maxY: -1, cells: 0 };
    const stack = [start];
    visited[start] = 1;
    while (stack.length > 0) {
      const cell = stack.pop() as number;
      const cx = cell % maskW;
      const cy = (cell / maskW) | 0;
      comp.cells++;
      if (cx < comp.minX) comp.minX = cx;
      if (cx > comp.maxX) comp.maxX = cx;
      if (cy < comp.minY) comp.minY = cy;
      if (cy > comp.maxY) comp.maxY = cy;
      const neighbours = [
        cy > 0 ? cell - maskW : -1,
        cy < maskH - 1 ? cell + maskW : -1,
        cx > 0 ? cell - 1 : -1,
        cx < maskW - 1 ? cell + 1 : -1,
      ];
      for (const n of neighbours) {
        if (n >= 0 && mask[n] && !visited[n]) {
          visited[n] = 1;
          stack.push(n);
        }
      }
    }
    if (comp.maxX - comp.minX + 1 >= minCells && comp.maxY - comp.minY + 1 >= minCells && comp.cells >= minCells) {
      comps.push(comp);
    }
  }

  // Map each component back to full resolution and refine its edges against
  // the real pixels (the mask block size can overshoot by up to one block).
  const pad = Math.ceil(1 / scale) + 1;
  const rects: DetectedRect[] = [];
  for (const comp of comps) {
    let x0 = Math.max(0, Math.floor(comp.minX / scale) - pad);
    let y0 = Math.max(0, Math.floor(comp.minY / scale) - pad);
    let x1 = Math.min(width, Math.ceil((comp.maxX + 1) / scale) + pad);
    let y1 = Math.min(height, Math.ceil((comp.maxY + 1) / scale) + pad);
    // Shrink each side to the first row/column that actually holds content.
    const rowHas = (y: number) => { for (let x = x0; x < x1; x++) if (isContent(x, y)) return true; return false; };
    const colHas = (x: number) => { for (let y = y0; y < y1; y++) if (isContent(x, y)) return true; return false; };
    while (y0 < y1 && !rowHas(y0)) y0++;
    while (y1 > y0 && !rowHas(y1 - 1)) y1--;
    while (x0 < x1 && !colHas(x0)) x0++;
    while (x1 > x0 && !colHas(x1 - 1)) x1--;
    if (x1 - x0 >= minSize && y1 - y0 >= minSize) {
      rects.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
    }
  }

  // Reading order: group into rows by vertical overlap, then left-to-right.
  rects.sort((a, b) => a.y - b.y || a.x - b.x);
  return rects;
};

/** TexturePacker JSON — supports the "hash" shape ({ frames: { name: { frame: {x,y,w,h} } } }) and the "array" shape ({ frames: [{ filename, frame }] }). */
export const parseTexturePackerJson = (text: string): DetectedRect[] => {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('That file is not valid TexturePacker JSON.');
  const frames = (parsed as { frames?: unknown }).frames;
  const out: DetectedRect[] = [];
  const push = (name: string, f: { x?: number; y?: number; w?: number; h?: number }) => {
    const x = Number(f.x), y = Number(f.y), w = Number(f.w), h = Number(f.h);
    if ([x, y, w, h].every(Number.isFinite) && w > 0 && h > 0) out.push({ name, x, y, w, h });
  };
  if (Array.isArray(frames)) {
    for (const entry of frames) {
      const e = entry as { filename?: string; frame?: { x?: number; y?: number; w?: number; h?: number } };
      if (e && e.frame) push(e.filename || `frame_${out.length}`, e.frame);
    }
  } else if (frames && typeof frames === 'object') {
    for (const [name, entry] of Object.entries(frames as Record<string, { frame?: { x?: number; y?: number; w?: number; h?: number } }>)) {
      if (entry && entry.frame) push(name, entry.frame);
    }
  }
  if (out.length === 0) throw new Error('No frames found in that TexturePacker JSON.');
  return out;
};

/** Sparrow / Starling XML atlas — <SubTexture name=".." x=".." y=".." width=".." height=".."/>. */
export const parseSparrowXml = (text: string): DetectedRect[] => {
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('That file is not valid XML.');
  const nodes = doc.querySelectorAll('SubTexture');
  const out: DetectedRect[] = [];
  nodes.forEach((n, i) => {
    const x = Number(n.getAttribute('x')), y = Number(n.getAttribute('y'));
    const w = Number(n.getAttribute('width')), h = Number(n.getAttribute('height'));
    if ([x, y, w, h].every(Number.isFinite) && w > 0 && h > 0) {
      out.push({ name: n.getAttribute('name') || `frame_${i}`, x, y, w, h });
    }
  });
  if (out.length === 0) throw new Error('No <SubTexture> frames found in that XML file.');
  return out;
};
