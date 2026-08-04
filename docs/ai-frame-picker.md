# AI Social Media Frame Picker

Feature documentation for `/ai-social-media-frame-picker`.

## What it does

Takes a video, finds the frames worth publishing, and ranks them per social
platform. The user uploads a file, the tool extracts keyframes around detected
scene changes, scores each one on measurable image-quality criteria, discards
near-duplicates, and presents the best frame for each of ten platform profiles
alongside a browsable gallery of everything that passed the score threshold.

All processing is client-side. No file is uploaded anywhere.

## Architecture

```
pages/AiSocialMediaFramePicker.tsx      SEO landing page + schema
pages/blog/AiBestFrameFromVideo.tsx     supporting long-form article
  └─ components/framePicker/
       FramePickerWorkspace.tsx         orchestrates the four-step flow
       VideoDropzone.tsx                upload
       FramePickerUI.tsx                StepIndicator, ProgressBar, ScoreBadge, GlassPanel
       CategoryCard.tsx                 one platform's winning frame
       PickerControls.tsx               threshold, format, size, sort, bulk actions
       FrameGallery.tsx                 lazy grid of all passing frames
          └─ hooks/useFramePicker.ts    all state; the only stateful piece
               └─ services/
                    framePickerPipeline.ts   extract → score → dedupe → rank
                    keyframeExtractor.ts     scene detection + adaptive sampling
                    frameExportService.ts    full-resolution re-decode + encode
                    └─ ai/
                         frameAnalyzer.ts    per-frame measurement
                         imageMetrics.ts     the actual CV maths
                         scoreEngine.ts      metrics → 0-100 + reasons
                         duplicateFilter.ts  perceptual hash grouping
                         platformProfiles.ts per-platform weights and dimensions
                         types.ts            shared contracts
                    └─ models/faceDetector.ts  native API + heuristic fallback
                    └─ workers/frameScorer.worker.ts  off-thread scoring
```

The dependency direction is strictly downward. `ai/` knows nothing about React,
`services/` knows nothing about the DOM beyond canvas, and the components know
nothing about how a score is produced. Each layer is independently testable.

## The scoring model

`ai/imageMetrics.ts` computes raw measurements; `ai/scoreEngine.ts` turns them
into a score. Keeping these separate matters, because measurement is objective
and weighting is a product decision that will change.

| Metric | Method | Why it earns its weight |
|---|---|---|
| Sharpness | Laplacian variance on luminance | Strongest single predictor of a usable frame |
| Motion blur | Directional gradient imbalance | Distinguishes movement smear from intentional defocus |
| Brightness | Histogram mean | Cheap, and catches under/over-exposed shots |
| Contrast | Histogram standard deviation | Flat frames read as lifeless at thumbnail size |
| Exposure | Clipped pixel count at 0 and 255 | Clipping destroys data permanently; it deserves its own penalty |
| Vibrancy | Mean saturation, penalised at both extremes | Both washed-out and garish frames underperform |
| Composition | Edge-density centre of mass vs thirds intersections | Approximates the rule of thirds |
| Faces | `FaceDetector` API, or skin-tone heuristic | Faces lift engagement on most platforms |
| Black frame | Mean luminance below threshold | Fade transitions otherwise score deceptively well |

Black frames are **disqualified**, not down-weighted. A naive sharpness measure
rates them highly because they contain almost no noise, which is how other tools
end up recommending a fade-out.

Each platform in `ai/platformProfiles.ts` re-weights these for its own context —
LinkedIn favours clean exposure, TikTok favours contrast, YouTube favours faces —
so the same video yields genuinely different winners per card.

## Why keyframes rather than every frame

A 30-second video at 30fps is 900 frames, of which perhaps 20 are visually
distinct. `keyframeExtractor.ts` samples coarsely, compares colour histograms
between consecutive samples to find scene boundaries, then samples densely around
those boundaries and sparsely through static stretches. Result: 80-150 candidates,
roughly fifteen times faster, same winner.

`duplicateFilter.ts` then groups frames by perceptual hash and keeps only the
highest-scoring member of each group, which removes the remaining near-identical
neighbours.

## Performance notes

- Scoring runs in a Web Worker. The main thread stays responsive across several
  hundred frames.
- Analysis happens at reduced working resolution. Memory stays flat whether the
  source is 720p or 4K.
- Preview thumbnails are small JPEGs; gallery tiles are `loading="lazy"`.
  Several hundred eagerly-decoded previews would spike memory on mobile.
- Downloads re-decode from the original video at full resolution. The previews
  are never the thing you receive.
- Object URLs are revoked on reset and unmount.

## Graceful degradation

| Missing capability | Behaviour |
|---|---|
| `FaceDetector` API | Falls back to skin-tone heuristics; UI reports "Heuristic" |
| WebP encoding | Format removed from the dropdown rather than silently substituted |
| Web Worker | Scoring runs on the main thread |
| Unsupported codec | Error surfaced through the alert region |

Nothing hard-fails to a blank screen. The face-detection mode is shown in the
results panel so the user knows which scoring path produced their numbers.

## Accessibility

- Gallery tiles are checkbox labels: click or keyboard, no custom key handling.
- Errors use `role="alert"`; progress uses `aria-live="polite"`.
- Favourite buttons carry `aria-pressed`; all icon buttons have `aria-label`.
- Alt text includes timestamp and score, so a screen reader user can tell frames
  apart rather than hearing "image" ten times.
- Every control is a native element with a visible focus ring.

## Extending

**Adding a platform** — append to `PLATFORM_PROFILES`. The cards, download
naming and landing-page grid all derive from that array; nothing else needs
touching.

**Changing weights** — edit `scoreEngine.ts` only. Measurement code is unaffected.

**Adding a metric** — add the measurement to `imageMetrics.ts`, extend
`FrameMetrics` in `types.ts`, then weight it in `scoreEngine.ts`. The type system
will point at every site that needs updating.

## Known limitations

- Smile detection is not implemented. The native `FaceDetector` API does not
  expose expression data, and shipping a TensorFlow.js model for it would cost
  several megabytes of download for a marginal signal. Eye visibility is
  approximated from landmarks where available.
- Composition scoring is a heuristic, not aesthetic judgement. It finds where
  visual weight sits, not whether the shot is interesting.
- Very long videos are sampled more sparsely. A 90-minute file returns results,
  but coverage per minute is lower than for a 60-second clip.
