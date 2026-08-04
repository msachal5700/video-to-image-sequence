/**
 * Core type definitions for the AI Social Media Frame Picker.
 *
 * Everything in `ai/` is deliberately free of DOM and React dependencies so the
 * same functions can run on the main thread, inside a Web Worker, or in a test
 * runner. Only plain typed arrays cross the boundary.
 */

/** Where face information came from, so the UI can be honest about confidence. */
export type FaceDetectionSource = 'native' | 'heuristic' | 'unavailable';

/** A face-like region found in a frame, in normalised (0..1) coordinates. */
export interface DetectedFace {
  /** Left edge, 0..1 of frame width. */
  x: number;
  /** Top edge, 0..1 of frame height. */
  y: number;
  /** Width, 0..1 of frame width. */
  width: number;
  /** Height, 0..1 of frame height. */
  height: number;
  /** Detector confidence, 0..1. Heuristic detectors report lower values. */
  confidence: number;
  /** `null` when the detector cannot determine eye state. */
  eyesVisible: boolean | null;
  /** `null` when the detector cannot determine expression. */
  smiling: boolean | null;
}

/** Result of running every face detector adapter that is available. */
export interface FaceAnalysis {
  faces: DetectedFace[];
  source: FaceDetectionSource;
}

/**
 * Raw computer-vision measurements for a single frame.
 *
 * Every field is normalised to 0..1 unless documented otherwise, which keeps the
 * weighting maths in `scoreFrame` readable and makes new metrics cheap to add.
 */
export interface FrameMetrics {
  /** Variance-of-Laplacian focus measure. Higher = crisper edges. */
  sharpness: number;
  /** 1 = heavy directional smearing, 0 = none detected. */
  motionBlur: number;
  /** Mean luma. 0 = black, 1 = white. */
  brightness: number;
  /** Normalised luma standard deviation. */
  contrast: number;
  /** Composite exposure quality. 1 = well exposed, 0 = badly clipped. */
  exposure: number;
  /** Fraction of pixels blown out to pure white. */
  clippedHighlights: number;
  /** Fraction of pixels crushed to pure black. */
  clippedShadows: number;
  /** Hasler-Süsstrunk colourfulness, normalised. */
  colorfulness: number;
  /** Shannon entropy of the luma histogram, normalised. Proxy for detail. */
  entropy: number;
  /** How close the salient subject sits to a rule-of-thirds power point. */
  ruleOfThirds: number;
  /** How close the salient subject sits to the frame centre. */
  centerWeight: number;
  /** Blended composition quality from thirds, centring and edge balance. */
  composition: number;
  /** Source pixel count quality, relative to a 1080p reference. */
  resolutionScore: number;
  /** Histogram distance from the previous candidate. 1 = hard cut. */
  sceneChange: number;
  /** True when the frame is essentially a black or blank transition. */
  isBlackFrame: boolean;
  /** Number of faces found by whichever detector ran. */
  faceCount: number;
  /** Area of the largest face as a fraction of the frame. */
  faceArea: number;
  /** Distance of the largest face from frame centre, 0 = centred, 1 = corner. */
  faceCenterOffset: number;
  /** `null` when unknown rather than false, so the UI never over-claims. */
  eyesVisible: boolean | null;
  /** `null` when unknown rather than false. */
  smiling: boolean | null;
  /** Provenance of the face fields above. */
  faceSource: FaceDetectionSource;
}

/**
 * Compact perceptual fingerprints used for near-duplicate rejection.
 * `dHash` is a 64-bit difference hash split across two 32-bit halves so it
 * survives `structuredClone` without BigInt support concerns.
 */
export interface FrameSignature {
  dHashHigh: number;
  dHashLow: number;
  /** Coarse 4x4x4 RGB histogram, L1-normalised. */
  histogram: number[];
}

/** A frame pulled out of the video and kept as a scoring candidate. */
export interface CandidateFrame {
  /** Stable identifier, also used as a React key. */
  id: string;
  /** Position in extraction order, ascending by time. */
  index: number;
  /** Presentation time in seconds, used to re-seek for full-quality export. */
  timestamp: number;
  /** Object URL of the lightweight preview JPEG. */
  previewUrl: string;
  /** Native video width in pixels. */
  sourceWidth: number;
  /** Native video height in pixels. */
  sourceHeight: number;
}

/** A candidate frame after the scoring engine has run over it. */
export interface ScoredFrame extends CandidateFrame {
  /** Final quality score, 0-100, rounded for display. */
  score: number;
  /** Human-readable justifications shown under the score. */
  reasons: string[];
  /** Problems worth surfacing, e.g. "Motion blur detected". */
  warnings: string[];
  metrics: FrameMetrics;
  signature: FrameSignature;
}

/** Identifiers for every result card the UI renders. */
export type CategoryId =
  | 'best-overall'
  | 'youtube-thumbnail'
  | 'instagram-post'
  | 'instagram-story'
  | 'linkedin-post'
  | 'pinterest-pin'
  | 'x-post'
  | 'tiktok-cover'
  | 'whatsapp-status'
  | 'wallpaper';

/**
 * Per-metric multipliers. Omitted keys fall back to the baseline weight in
 * `BASE_WEIGHTS`, so a profile only has to describe how it differs.
 */
export type MetricWeights = Partial<Record<keyof FrameMetrics, number>>;

/** Describes one social platform target and what "good" means for it. */
export interface PlatformProfile {
  id: CategoryId;
  /** Emoji shown on the card, matching the product spec. */
  icon: string;
  /** Card heading. */
  label: string;
  /** One-line explanation of what this frame is for. */
  blurb: string;
  /** Target aspect ratio (width / height) used for crop-fit scoring. */
  aspectRatio: number;
  /** Human-readable aspect, e.g. "16:9". */
  aspectLabel: string;
  /** Recommended export width in pixels. */
  recommendedWidth: number;
  /** Recommended export height in pixels. */
  recommendedHeight: number;
  /** Metric emphasis for this platform. */
  weights: MetricWeights;
  /** Extra points when a face is present, 0 = platform is face-agnostic. */
  faceBonus: number;
  /** How strongly the crop-fit penalty applies, 0..1. */
  aspectSensitivity: number;
}

/** The winning frame for one category, plus why it won. */
export interface CategoryPick {
  profile: PlatformProfile;
  frame: ScoredFrame;
  /** Category-specific score, 0-100. Differs from `frame.score`. */
  categoryScore: number;
  /** Reasons tailored to this platform. */
  reasons: string[];
}

/** Output image container the user can pick. */
export type PickerOutputFormat = 'png' | 'jpeg' | 'webp';

/** Export resolution presets. */
export type FrameSizePreset = 'original' | 'platform' | '1080' | '720';

/** Result list ordering. */
export type SortMode = 'score' | 'scene' | 'newest';

/** User-adjustable settings for extraction and export. */
export interface PickerOptions {
  /** Frames below this score are hidden from the gallery. */
  minScore: number;
  format: PickerOutputFormat;
  size: FrameSizePreset;
  /** JPEG/WebP quality, 0..1. Ignored for PNG. */
  quality: number;
  sort: SortMode;
  /** Upper bound on candidate frames, protects low-memory devices. */
  maxCandidates: number;
}

/** Coarse pipeline stage, drives the four-step UI. */
export type PipelineStage = 'idle' | 'extracting' | 'analyzing' | 'selecting' | 'done' | 'error';

/** Progress payload emitted throughout the pipeline. */
export interface PipelineProgress {
  stage: PipelineStage;
  /** 0-100 within the current stage. */
  progress: number;
  /** Short status line shown under the progress bar. */
  message: string;
  framesFound: number;
  framesAnalyzed: number;
}

/** Everything the analyser needs about one frame, ready to cross a worker boundary. */
export interface AnalysisInput {
  id: string;
  index: number;
  timestamp: number;
  /** RGBA pixels of the downscaled analysis bitmap. */
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  /** Face analysis performed on the main thread, where the API lives. */
  faces: FaceAnalysis;
  /** Histogram of the previous candidate, for scene-change scoring. */
  previousHistogram: number[] | null;
}

/** Metrics plus signature for one analysed frame. */
export interface AnalysisResult {
  id: string;
  metrics: FrameMetrics;
  signature: FrameSignature;
}
