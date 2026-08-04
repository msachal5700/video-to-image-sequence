/**
 * The interactive tool itself: upload → analyse → select → results.
 *
 * Kept separate from the SEO landing page so the marketing copy and the
 * application can evolve independently, and so the page reads as a thin shell
 * around one clearly-bounded widget.
 */

import React, { useCallback } from 'react';
import type { PlatformProfile, ScoredFrame } from '../../ai/types';
import { useFramePicker } from '../../hooks/useFramePicker';
import { CategoryCard } from './CategoryCard';
import { FrameGallery } from './FrameGallery';
import { GlassPanel, ProgressBar, StepIndicator } from './FramePickerUI';
import { PickerControls } from './PickerControls';
import { VideoDropzone } from './VideoDropzone';

export const FramePickerWorkspace = () => {
  const picker = useFramePicker();
  const {
    stage,
    progress,
    picks,
    frames,
    visibleFrames,
    favorites,
    selected,
    options,
    error,
    duplicatesRemoved,
    isBusy,
    isExporting,
    nativeFaceDetection,
  } = picker;

  const handleSelectAll = useCallback(
    () => picker.setAllSelected(visibleFrames.map(frame => frame.id), true),
    [picker, visibleFrames]
  );

  const handleClearSelection = useCallback(
    () => picker.setAllSelected(frames.map(frame => frame.id), false),
    [picker, frames]
  );

  const handleCardDownload = useCallback(
    (frame: ScoredFrame, profile: PlatformProfile) => picker.downloadFrame(frame, profile),
    [picker]
  );

  const handleTileDownload = useCallback(
    (frame: ScoredFrame) => picker.downloadFrame(frame),
    [picker]
  );

  const showResults = stage === 'done' && frames.length > 0;

  return (
    <div className="space-y-6">
      <StepIndicator stage={stage} />

      {error && (
        // `role="alert"` so the message is announced immediately rather than
        // waiting for the user to navigate to it.
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={picker.dismissError}
            aria-label="Dismiss error"
            className="shrink-0 rounded px-2 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            ✕
          </button>
        </div>
      )}

      {stage === 'idle' && !showResults && (
        <VideoDropzone onFile={picker.analyze} disabled={isBusy} />
      )}

      {isBusy && (
        <GlassPanel className="p-6 sm:p-8">
          <ProgressBar value={progress.progress} message={progress.message} stage={stage} />
          <dl className="mt-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Candidates found</dt>
              <dd className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {progress.framesFound}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Frames scored</dt>
              <dd className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {progress.framesAnalyzed}
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-xs text-gray-500 dark:text-gray-400">Face detection</dt>
              <dd className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {nativeFaceDetection ? 'Native' : 'Heuristic'}
              </dd>
            </div>
          </dl>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={picker.cancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel analysis
            </button>
          </div>
        </GlassPanel>
      )}

      {showResults && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Best frames for every platform
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Scored {frames.length} unique frames
                {duplicatesRemoved > 0 && ` · removed ${duplicatesRemoved} near-duplicates`}
                {!nativeFaceDetection && ' · face detection unavailable, using image heuristics'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={picker.downloadAllPicks}
                disabled={isExporting}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-gray-900"
              >
                Download all platform picks
              </button>
              <button
                type="button"
                onClick={picker.reset}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Try another video
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {picks.map(pick => (
              <CategoryCard
                key={pick.profile.id}
                pick={pick}
                isFavorite={favorites.has(pick.frame.id)}
                isExporting={isExporting}
                onDownload={handleCardDownload}
                onToggleFavorite={picker.toggleFavorite}
              />
            ))}
          </div>

          <PickerControls
            options={options}
            visibleCount={visibleFrames.length}
            totalCount={frames.length}
            selectedCount={selected.size}
            favoriteCount={favorites.size}
            isExporting={isExporting}
            onChange={picker.updateOptions}
            onDownloadAll={picker.downloadAll}
            onDownloadSelected={picker.downloadSelected}
            onDownloadFavorites={picker.downloadFavorites}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />

          {isExporting && progress.message && (
            <p aria-live="polite" className="text-center text-sm text-cyan-700 dark:text-cyan-300">
              {progress.message}
            </p>
          )}

          <FrameGallery
            frames={visibleFrames}
            favorites={favorites}
            selected={selected}
            isExporting={isExporting}
            onToggleSelected={picker.toggleSelected}
            onToggleFavorite={picker.toggleFavorite}
            onDownload={handleTileDownload}
          />
        </>
      )}
    </div>
  );
};
