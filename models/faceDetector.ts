/**
 * Face detection with graceful degradation.
 *
 * Three tiers, tried in order, each strictly better than the next:
 *
 *   1. **`FaceDetector`** — the native Shape Detection API. Chrome/Edge on
 *      Android and behind a flag on desktop. Hardware-accelerated, gives
 *      landmarks, and costs nothing to ship.
 *   2. **Skin-tone heuristic** — a YCbCr chrominance classifier with connected
 *      face-shaped region analysis. Pure arithmetic, works everywhere, and
 *      honestly reports itself as a *guess* via `source: 'heuristic'`.
 *   3. **Unavailable** — returns no faces and `source: 'unavailable'`, and every
 *      face-dependent score path treats that as "unknown", not "no face".
 *
 * A deliberate choice: no TensorFlow.js or MediaPipe model is downloaded. Both
 * would add 2-8MB to first paint and need WebGL, on a page whose entire value
 * proposition is that it is fast and needs no GPU. The native API covers the
 * platforms where it exists and the heuristic degrades honestly everywhere else.
 * `detectFacesWithModel` below is the seam to plug a real model into if that
 * trade-off ever changes.
 */

import type { DetectedFace, FaceAnalysis } from '../ai/types';

/** Minimal typing for the native API, which is absent from lib.dom.d.ts. */
interface NativeFaceDetectorLandmark {
  type?: string;
  locations: Array<{ x: number; y: number }>;
}

interface NativeDetectedFace {
  boundingBox: { x: number; y: number; width: number; height: number };
  landmarks?: NativeFaceDetectorLandmark[];
}

interface NativeFaceDetector {
  detect(source: ImageBitmapSource): Promise<NativeDetectedFace[]>;
}

interface NativeFaceDetectorConstructor {
  new (options?: { maxDetectedFaces?: number; fastMode?: boolean }): NativeFaceDetector;
}

/** Empty result, shared so the common no-face path allocates nothing. */
const EMPTY_NATIVE: FaceAnalysis = { faces: [], source: 'native' };
const EMPTY_UNAVAILABLE: FaceAnalysis = { faces: [], source: 'unavailable' };

/** Cached detector instance — construction is not free, detection is called a lot. */
let nativeDetector: NativeFaceDetector | null = null;
let nativeDetectorProbed = false;

/**
 * Resolve the native detector once and cache the verdict.
 *
 * The constructor can throw on browsers that expose the symbol but have the
 * feature disabled by policy, so this has to be a try/catch rather than a
 * simple `'FaceDetector' in window` check.
 */
const getNativeDetector = (): NativeFaceDetector | null => {
  if (nativeDetectorProbed) return nativeDetector;
  nativeDetectorProbed = true;

  const ctor = (globalThis as { FaceDetector?: NativeFaceDetectorConstructor }).FaceDetector;
  if (!ctor) return null;

  try {
    // `fastMode` trades a little recall for speed. Correct trade here: we are
    // scoring hundreds of frames and only need to know whether a face is there.
    nativeDetector = new ctor({ maxDetectedFaces: 8, fastMode: true });
  } catch {
    nativeDetector = null;
  }

  return nativeDetector;
};

/** True when the browser can do real face detection. Drives the UI capability badge. */
export const isNativeFaceDetectionAvailable = (): boolean => getNativeDetector() !== null;

/**
 * Infer eye visibility and expression from native landmarks.
 *
 * The Shape Detection API reports landmark *positions* but no open/closed or
 * expression state, so these are conservative inferences from what is present:
 * two eye landmarks means eyes were located, which is decent evidence they are
 * open, since closed eyes usually fail to localise. Expression genuinely cannot
 * be derived from landmark positions alone, so `smiling` stays `null` rather
 * than being guessed — the UI then simply omits the claim.
 */
const readLandmarks = (
  face: NativeDetectedFace
): { eyesVisible: boolean | null; smiling: boolean | null } => {
  if (!face.landmarks || face.landmarks.length === 0) {
    return { eyesVisible: null, smiling: null };
  }

  const eyes = face.landmarks.filter(landmark => landmark.type === 'eye');
  const eyesVisible = eyes.length >= 2 ? true : eyes.length === 0 ? null : false;

  return { eyesVisible, smiling: null };
};

/**
 * Native-API detection against an already-decoded bitmap.
 *
 * @param source Bitmap or canvas to scan.
 * @param width Source width, for normalising the bounding boxes.
 * @param height Source height.
 */
const detectNative = async (
  source: ImageBitmapSource,
  width: number,
  height: number
): Promise<FaceAnalysis | null> => {
  const detector = getNativeDetector();
  if (!detector) return null;

  try {
    const results = await detector.detect(source);
    if (results.length === 0) return EMPTY_NATIVE;

    const faces: DetectedFace[] = results.map(result => {
      const { eyesVisible, smiling } = readLandmarks(result);
      return {
        x: result.boundingBox.x / width,
        y: result.boundingBox.y / height,
        width: result.boundingBox.width / width,
        height: result.boundingBox.height / height,
        confidence: 0.9,
        eyesVisible,
        smiling,
      };
    });

    return { faces, source: 'native' };
  } catch {
    // A single frame failing detection should not abort the pipeline.
    return null;
  }
};

/**
 * YCbCr skin-tone classification.
 *
 * The Cb/Cr bounds are the widely cited Chai & Ngan ranges, which hold across
 * skin tones far better than any RGB rule because chrominance is largely
 * independent of melanin level — darker and lighter skin differ mainly in luma.
 * The extra luma gate rejects near-black and blown-out pixels where chrominance
 * is meaningless noise.
 */
const isSkinPixel = (r: number, g: number, b: number): boolean => {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  if (y < 40 || y > 245) return false;

  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
};

/** Grid resolution for the heuristic's coarse region analysis. */
const GRID = 16;

/**
 * Heuristic face detection via skin-tone region clustering.
 *
 * Buckets skin pixels into a 16x16 grid, finds the largest connected component,
 * and accepts it only if its bounding box is plausibly face-shaped. Grid-level
 * analysis rather than per-pixel flood fill keeps this at a few thousand
 * operations, which is what makes it viable to run on every candidate frame.
 *
 * This will never match a real detector. It is here so that face-aware scoring
 * degrades to "probably a person in shot" rather than to nothing at all on
 * Safari and Firefox, and it labels itself `heuristic` so the UI can hedge.
 */
export const detectFacesHeuristic = (
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): FaceAnalysis => {
  const cellCounts = new Uint32Array(GRID * GRID);
  const cellTotals = new Uint32Array(GRID * GRID);

  for (let y = 0; y < height; y++) {
    const gy = Math.min(GRID - 1, ((y * GRID) / height) | 0);
    const rowOffset = y * width * 4;
    for (let x = 0; x < width; x++) {
      const gx = Math.min(GRID - 1, ((x * GRID) / width) | 0);
      const cell = gy * GRID + gx;
      const p = rowOffset + x * 4;
      cellTotals[cell]++;
      if (isSkinPixel(pixels[p], pixels[p + 1], pixels[p + 2])) {
        cellCounts[cell]++;
      }
    }
  }

  // A cell counts as skin when a clear majority of its pixels are, which filters
  // out scattered false positives from wood, sand and warm lighting.
  const isSkinCell = new Uint8Array(GRID * GRID);
  let skinCellCount = 0;
  for (let i = 0; i < cellCounts.length; i++) {
    if (cellTotals[i] > 0 && cellCounts[i] / cellTotals[i] > 0.45) {
      isSkinCell[i] = 1;
      skinCellCount++;
    }
  }

  // Fewer than 4 of 256 cells is noise; more than 45% is a skin-toned wall,
  // a close-up of a hand, or a sepia grade — none of which is a face.
  if (skinCellCount < 4 || skinCellCount > GRID * GRID * 0.45) {
    return { faces: [], source: 'heuristic' };
  }

  // Iterative flood fill over the grid — no recursion, so no stack risk.
  const visited = new Uint8Array(GRID * GRID);
  let best: { minX: number; minY: number; maxX: number; maxY: number; size: number } | null = null;

  for (let start = 0; start < isSkinCell.length; start++) {
    if (!isSkinCell[start] || visited[start]) continue;

    const stack = [start];
    visited[start] = 1;
    let minX = GRID;
    let minY = GRID;
    let maxX = -1;
    let maxY = -1;
    let size = 0;

    while (stack.length > 0) {
      const cell = stack.pop() as number;
      const cx = cell % GRID;
      const cy = (cell / GRID) | 0;
      size++;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;

      const neighbours = [
        cy > 0 ? cell - GRID : -1,
        cy < GRID - 1 ? cell + GRID : -1,
        cx > 0 ? cell - 1 : -1,
        cx < GRID - 1 ? cell + 1 : -1,
      ];
      for (const neighbour of neighbours) {
        if (neighbour >= 0 && isSkinCell[neighbour] && !visited[neighbour]) {
          visited[neighbour] = 1;
          stack.push(neighbour);
        }
      }
    }

    if (!best || size > best.size) {
      best = { minX, minY, maxX, maxY, size };
    }
  }

  if (!best || best.size < 4) {
    return { faces: [], source: 'heuristic' };
  }

  const cellW = 1 / GRID;
  const boxWidth = (best.maxX - best.minX + 1) * cellW;
  const boxHeight = (best.maxY - best.minY + 1) * cellW;
  const aspect = boxWidth / boxHeight;

  // Human heads sit roughly between 0.55 and 1.5 width/height once hair and neck
  // are included. Anything outside that is a limb, a background, or a false hit.
  if (aspect < 0.5 || aspect > 1.7) {
    return { faces: [], source: 'heuristic' };
  }

  return {
    faces: [
      {
        x: best.minX * cellW,
        y: best.minY * cellW,
        width: boxWidth,
        height: boxHeight,
        // Deliberately low. This is a region that *could* be a face, and the
        // score weighting should treat it with corresponding scepticism.
        confidence: 0.45,
        eyesVisible: null,
        smiling: null,
      },
    ],
    source: 'heuristic',
  };
};

/**
 * Best-available face analysis for one frame.
 *
 * Tries the native API first, falls back to the heuristic. Never throws — a
 * detection failure degrades the score's face component but must not take down
 * the pipeline mid-video.
 *
 * @param bitmap Decoded frame for the native detector.
 * @param pixels RGBA buffer of the same frame for the heuristic path.
 */
export const detectFaces = async (
  bitmap: ImageBitmapSource | null,
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): Promise<FaceAnalysis> => {
  if (bitmap) {
    const native = await detectNative(bitmap, width, height);
    if (native) return native;
  }

  try {
    return detectFacesHeuristic(pixels, width, height);
  } catch {
    return EMPTY_UNAVAILABLE;
  }
};

/**
 * Extension seam for a real ML model (TensorFlow.js BlazeFace, MediaPipe Face
 * Mesh, or a WebNN graph).
 *
 * Left unimplemented on purpose — see the module header for why we do not ship
 * a model by default. To enable one: implement this to lazy-`import()` the
 * model, return `source: 'native'`-grade results with real `eyesVisible` and
 * `smiling` values, and call it from `detectFaces` ahead of `detectNative`. No
 * other file needs to change; `FaceAnalysis` already carries everything the
 * scorer reads.
 */
export const detectFacesWithModel = async (): Promise<FaceAnalysis> => EMPTY_UNAVAILABLE;
