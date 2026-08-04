/**
 * `useFramePicker` — the single stateful entry point for the feature.
 *
 * Owns the pipeline lifecycle, user options, favourites, selection and every
 * download path. The page component stays presentational, which keeps the UI
 * easy to restyle and the logic easy to reason about.
 *
 * Two invariants this hook is responsible for:
 *   1. Preview object URLs are always revoked. Hundreds of blob URLs left
 *      dangling is a real leak that grows with every video the user tries.
 *   2. A cancelled or superseded run never writes to state. React 18 double-
 *      invokes effects in dev and users re-upload mid-analysis; both would
 *      otherwise produce interleaved results from two runs.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  CategoryPick,
  PickerOptions,
  PipelineProgress,
  PlatformProfile,
  ScoredFrame,
  SortMode,
} from '../ai/types';
import { runFramePicker } from '../services/framePickerPipeline';
import {
  FrameExporter,
  buildFileName,
  downloadBlob,
  exportFramesAsZip,
} from '../services/frameExportService';

/** Sensible starting point: shows everything decent, exports lossless PNG. */
export const DEFAULT_OPTIONS: PickerOptions = {
  minScore: 50,
  format: 'png',
  size: 'original',
  quality: 0.92,
  sort: 'score',
  maxCandidates: 320,
};

/** Hard cap on input size, matching the 500MB target in the brief. */
export const MAX_FILE_BYTES = 500 * 1024 * 1024;

export interface FramePickerState {
  file: File | null;
  stage: PipelineProgress['stage'];
  progress: PipelineProgress;
  frames: ScoredFrame[];
  picks: CategoryPick[];
  visibleFrames: ScoredFrame[];
  favorites: Set<string>;
  selected: Set<string>;
  options: PickerOptions;
  error: string | null;
  duplicatesRemoved: number;
  isBusy: boolean;
  isExporting: boolean;
  nativeFaceDetection: boolean;
}

/** Sort comparators, keyed by mode. Declared once, outside the hook. */
const COMPARATORS: Record<SortMode, (a: ScoredFrame, b: ScoredFrame) => number> = {
  score: (a, b) => b.score - a.score,
  scene: (a, b) => a.index - b.index,
  // "Newest" means latest in the video — the end of a clip is usually the most
  // recently shot material, and it is the only meaningful reading of "newest"
  // for frames that all came from one file.
  newest: (a, b) => b.timestamp - a.timestamp,
};

export const useFramePicker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<ScoredFrame[]>([]);
  const [picks, setPicks] = useState<CategoryPick[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [options, setOptions] = useState<PickerOptions>(DEFAULT_OPTIONS);
  const [error, setError] = useState<string | null>(null);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [nativeFaceDetection, setNativeFaceDetection] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress>({
    stage: 'idle',
    progress: 0,
    message: '',
    framesFound: 0,
    framesAnalyzed: 0,
  });

  const cancelRef = useRef(false);
  /** Monotonic run id. Stale runs compare against this and bail before setState. */
  const runIdRef = useRef(0);
  /** Live preview URLs, so unmount can revoke them all. */
  const previewUrlsRef = useRef<string[]>([]);

  /** Revoke every tracked preview URL and clear the register. */
  const revokePreviews = useCallback(() => {
    for (const url of previewUrlsRef.current) URL.revokeObjectURL(url);
    previewUrlsRef.current = [];
  }, []);

  useEffect(() => revokePreviews, [revokePreviews]);

  /** Cancel any in-flight run. */
  const cancel = useCallback(() => {
    cancelRef.current = true;
    runIdRef.current += 1;
    setProgress(previous => ({ ...previous, stage: 'idle', progress: 0, message: '' }));
  }, []);

  /** Clear all results and return to the upload step. */
  const reset = useCallback(() => {
    cancel();
    revokePreviews();
    setFile(null);
    setFrames([]);
    setPicks([]);
    setFavorites(new Set());
    setSelected(new Set());
    setDuplicatesRemoved(0);
    setError(null);
    setNativeFaceDetection(false);
    setProgress({ stage: 'idle', progress: 0, message: '', framesFound: 0, framesAnalyzed: 0 });
  }, [cancel, revokePreviews]);

  /**
   * Validate and analyse a video file.
   *
   * Validation happens before any decoding: reading a 2GB file's metadata to then
   * reject it wastes the user's time and memory.
   */
  const analyze = useCallback(
    async (nextFile: File) => {
      if (!nextFile.type.startsWith('video/')) {
        setError('Please choose a video file (MP4, MOV, or WEBM).');
        return;
      }
      if (nextFile.size > MAX_FILE_BYTES) {
        setError(
          `That file is ${(nextFile.size / 1024 / 1024).toFixed(0)}MB. The maximum is 500MB — try trimming the clip first.`
        );
        return;
      }

      // Supersede any previous run before touching state.
      runIdRef.current += 1;
      const runId = runIdRef.current;
      cancelRef.current = false;

      revokePreviews();
      setError(null);
      setFile(nextFile);
      setFrames([]);
      setPicks([]);
      setSelected(new Set());
      setFavorites(new Set());
      setDuplicatesRemoved(0);

      try {
        const result = await runFramePicker(nextFile, options, {
          onProgress: next => {
            if (runIdRef.current === runId) setProgress(next);
          },
          shouldCancel: () => cancelRef.current || runIdRef.current !== runId,
        });

        if (runIdRef.current !== runId) {
          // A newer run started while this one finished. Release its previews so
          // the superseded result does not leak, and discard it.
          for (const frame of result.frames) URL.revokeObjectURL(frame.previewUrl);
          return;
        }

        previewUrlsRef.current = result.frames.map(frame => frame.previewUrl);
        setFrames(result.frames);
        setPicks(result.picks);
        setDuplicatesRemoved(result.duplicatesRemoved);
        setNativeFaceDetection(result.nativeFaceDetection);
      } catch (caught) {
        if (runIdRef.current !== runId) return;
        const message = caught instanceof Error ? caught.message : 'Analysis failed.';
        // Strip the internal error prefix; it is useful in logs, not to users.
        setError(message.replace(/^[A-Z_]+:\s*/, ''));
        setProgress(previous => ({ ...previous, stage: 'error', message }));
      }
    },
    [options, revokePreviews]
  );

  /** Patch one or more options. */
  const updateOptions = useCallback((patch: Partial<PickerOptions>) => {
    setOptions(previous => ({ ...previous, ...patch }));
  }, []);

  /** Toggle a frame's favourite state. */
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Toggle a frame's selection state. */
  const toggleSelected = useCallback((id: string) => {
    setSelected(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Select or clear every currently visible frame. */
  const setAllSelected = useCallback((ids: string[], value: boolean) => {
    setSelected(previous => {
      const next = new Set(previous);
      for (const id of ids) {
        if (value) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  /**
   * Frames passing the score filter, in the chosen order.
   *
   * Memoised on the three inputs that can change it. Without this, moving the
   * score slider re-sorts several hundred frames on every mousemove event.
   */
  const visibleFrames = useMemo(() => {
    const filtered = frames.filter(frame => frame.score >= options.minScore);
    return filtered.sort(COMPARATORS[options.sort]);
  }, [frames, options.minScore, options.sort]);

  /** Download one frame at full quality. */
  const downloadFrame = useCallback(
    async (frame: ScoredFrame, profile?: PlatformProfile) => {
      if (!file) return;
      setIsExporting(true);
      const exporter = new FrameExporter(file);
      try {
        const blob = await exporter.export({
          frame,
          format: options.format,
          size: options.size,
          quality: options.quality,
          profile,
        });
        downloadBlob(blob, buildFileName(frame, options.format, profile));
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Export failed.';
        setError(message.replace(/^[A-Z_]+:\s*/, ''));
      } finally {
        exporter.dispose();
        setIsExporting(false);
      }
    },
    [file, options.format, options.quality, options.size]
  );

  /** Download a set of frames as one ZIP. */
  const downloadMany = useCallback(
    async (
      entries: Array<{ frame: ScoredFrame; profile?: PlatformProfile }>,
      zipName: string
    ) => {
      if (!file || entries.length === 0) return;
      setIsExporting(true);
      try {
        const blob = await exportFramesAsZip({
          file,
          frames: entries,
          format: options.format,
          size: options.size,
          quality: options.quality,
          onProgress: (done, total) => {
            setProgress(previous => ({
              ...previous,
              message: `Exporting ${done}/${total} frames…`,
            }));
          },
        });
        downloadBlob(blob, zipName);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Export failed.';
        setError(message.replace(/^[A-Z_]+:\s*/, ''));
      } finally {
        setIsExporting(false);
        setProgress(previous => ({ ...previous, message: '' }));
      }
    },
    [file, options.format, options.quality, options.size]
  );

  /** Download every visible frame. */
  const downloadAll = useCallback(
    () =>
      downloadMany(
        visibleFrames.map(frame => ({ frame })),
        'ai-picked-frames.zip'
      ),
    [downloadMany, visibleFrames]
  );

  /** Download only the checked frames. */
  const downloadSelected = useCallback(() => {
    const entries = frames
      .filter(frame => selected.has(frame.id))
      .map(frame => ({ frame }));
    return downloadMany(entries, 'ai-selected-frames.zip');
  }, [downloadMany, frames, selected]);

  /** Download the favourites. */
  const downloadFavorites = useCallback(() => {
    const entries = frames
      .filter(frame => favorites.has(frame.id))
      .map(frame => ({ frame }));
    return downloadMany(entries, 'ai-favorite-frames.zip');
  }, [downloadMany, frames, favorites]);

  /**
   * Download every category winner, each cropped to its platform's dimensions.
   * Forces `size: 'platform'` regardless of the current setting, because a
   * "download all platform picks" that ignored platform sizing would be useless.
   */
  const downloadAllPicks = useCallback(async () => {
    if (!file || picks.length === 0) return;
    setIsExporting(true);
    try {
      const blob = await exportFramesAsZip({
        file,
        frames: picks.map(pick => ({ frame: pick.frame, profile: pick.profile })),
        format: options.format,
        size: 'platform',
        quality: options.quality,
        onProgress: (done, total) => {
          setProgress(previous => ({
            ...previous,
            message: `Exporting ${done}/${total} platform frames…`,
          }));
        },
      });
      downloadBlob(blob, 'ai-social-media-frames.zip');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Export failed.';
      setError(message.replace(/^[A-Z_]+:\s*/, ''));
    } finally {
      setIsExporting(false);
      setProgress(previous => ({ ...previous, message: '' }));
    }
  }, [file, options.format, options.quality, picks]);

  const isBusy =
    progress.stage === 'extracting' ||
    progress.stage === 'analyzing' ||
    progress.stage === 'selecting';

  const state: FramePickerState = {
    file,
    stage: progress.stage,
    progress,
    frames,
    picks,
    visibleFrames,
    favorites,
    selected,
    options,
    error,
    duplicatesRemoved,
    isBusy,
    isExporting,
    nativeFaceDetection,
  };

  return {
    ...state,
    analyze,
    cancel,
    reset,
    updateOptions,
    toggleFavorite,
    toggleSelected,
    setAllSelected,
    downloadFrame,
    downloadAll,
    downloadSelected,
    downloadFavorites,
    downloadAllPicks,
    dismissError: () => setError(null),
  };
};

export type UseFramePickerReturn = ReturnType<typeof useFramePicker>;
