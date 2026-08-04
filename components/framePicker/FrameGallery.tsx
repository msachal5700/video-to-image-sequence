/**
 * Scrollable grid of every frame above the score threshold.
 *
 * Each tile is a checkbox-labelled figure so selection works by click or
 * keyboard without any custom key handling. Previews use `loading="lazy"`, which
 * matters here: several hundred tiles decoded eagerly would spike memory and
 * stall the main thread on mobile.
 */

import React, { memo } from 'react';
import type { ScoredFrame } from '../../ai/types';
import { ScoreBadge } from './FramePickerUI';

interface FrameGalleryProps {
  frames: ScoredFrame[];
  favorites: Set<string>;
  selected: Set<string>;
  isExporting: boolean;
  onToggleSelected: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (frame: ScoredFrame) => void;
}

const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds - minutes * 60).toFixed(2).padStart(5, '0')}`;
};

interface TileProps {
  frame: ScoredFrame;
  isFavorite: boolean;
  isSelected: boolean;
  isExporting: boolean;
  onToggleSelected: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (frame: ScoredFrame) => void;
}

/** Memoised per tile so toggling one frame does not re-render the other 300. */
const FrameTile = memo(
  ({
    frame,
    isFavorite,
    isSelected,
    isExporting,
    onToggleSelected,
    onToggleFavorite,
    onDownload,
  }: TileProps) => (
    <figure
      className={`group relative overflow-hidden rounded-xl border transition-all ${
        isSelected
          ? 'border-cyan-500 ring-2 ring-cyan-500/40'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* The whole thumbnail is the checkbox label, giving a large hit area and
          correct semantics for free. */}
      <label className="block cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelected(frame.id)}
          className="peer sr-only"
        />
        <span className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border border-white/70 bg-black/40 text-[11px] font-bold text-white peer-checked:border-cyan-400 peer-checked:bg-cyan-500">
          {isSelected ? '✓' : ''}
        </span>
        <img
          src={frame.previewUrl}
          alt={`Video frame at ${formatTimestamp(frame.timestamp)}, quality score ${frame.score} out of 100`}
          loading="lazy"
          decoding="async"
          // Intrinsic size comes from the source video, not the preview JPEG.
          // The ratio is what the browser needs to reserve layout space and
          // avoid shifting the grid as tiles stream in.
          width={frame.sourceWidth}
          height={frame.sourceHeight}
          className="aspect-video w-full bg-gray-100 object-cover dark:bg-gray-800"

        />
      </label>

      <figcaption className="flex items-center justify-between gap-1 px-2 py-2">
        <ScoreBadge score={frame.score} />
        <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">
          {formatTimestamp(frame.timestamp)}
        </span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(frame.id)}
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? 'Remove' : 'Set'} frame at ${formatTimestamp(frame.timestamp)} as favorite`}
            className={`rounded px-1.5 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              isFavorite ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
            }`}
          >
            <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
          </button>
          <button
            type="button"
            onClick={() => onDownload(frame)}
            disabled={isExporting}
            aria-label={`Download frame at ${formatTimestamp(frame.timestamp)}`}
            className="rounded px-1.5 py-1 text-xs text-gray-500 transition-colors hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-40 dark:text-gray-400 dark:hover:text-cyan-400"
          >
            <span aria-hidden="true">⬇</span>
          </button>
        </span>
      </figcaption>
    </figure>
  )
);
FrameTile.displayName = 'FrameTile';

const FrameGalleryComponent = ({
  frames,
  favorites,
  selected,
  isExporting,
  onToggleSelected,
  onToggleFavorite,
  onDownload,
}: FrameGalleryProps) => {
  if (frames.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No frames meet the current minimum score. Lower the slider to see more.
      </p>
    );
  }

  return (
    <section aria-label="All scored frames">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {frames.map(frame => (
          <FrameTile
            key={frame.id}
            frame={frame}
            isFavorite={favorites.has(frame.id)}
            isSelected={selected.has(frame.id)}
            isExporting={isExporting}
            onToggleSelected={onToggleSelected}
            onToggleFavorite={onToggleFavorite}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
};

export const FrameGallery = memo(FrameGalleryComponent);
FrameGallery.displayName = 'FrameGallery';
