/**
 * One platform result card: preview, score, reasons, download, favourite.
 *
 * The preview is shown inside a wrapper whose aspect ratio matches the target
 * platform, with `object-cover`. That makes the card an honest preview of what
 * the exported crop will look like, rather than showing a 16:9 still under a
 * label that promises a 9:16 story.
 */

import React, { memo } from 'react';
import type { CategoryPick, ScoredFrame, PlatformProfile } from '../../ai/types';
import { ReasonList, ScoreBadge } from './FramePickerUI';

interface CategoryCardProps {
  pick: CategoryPick;
  isFavorite: boolean;
  isExporting: boolean;
  onDownload: (frame: ScoredFrame, profile: PlatformProfile) => void;
  onToggleFavorite: (id: string) => void;
}

/** Format a timestamp as `m:ss.mmm` for the caption. */
const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  return `${minutes}:${remainder.toFixed(2).padStart(5, '0')}`;
};

const CategoryCardComponent = ({
  pick,
  isFavorite,
  isExporting,
  onDownload,
  onToggleFavorite,
}: CategoryCardProps) => {
  const { profile, frame, categoryScore, reasons } = pick;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/70">
      <header className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-gray-900 dark:text-white">
          <span aria-hidden="true">{profile.icon}</span>
          {profile.label}
        </h3>
        <ScoreBadge score={categoryScore} size="lg" />
      </header>

      <div
        className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
        // Inline `aspectRatio` rather than a Tailwind class: the value comes from
        // data, and Tailwind cannot generate arbitrary classes at runtime.
        style={{ aspectRatio: String(profile.aspectRatio) }}
      >
        <img
          src={frame.previewUrl}
          // Alt text describes the frame's provenance and purpose, which is the
          // useful information here — the image content itself is unknown to us.
          alt={`Best ${profile.label} frame from the video at ${formatTimestamp(frame.timestamp)}, quality score ${categoryScore} out of 100`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {profile.aspectLabel} · {formatTimestamp(frame.timestamp)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">{profile.blurb}</p>
        <ReasonList reasons={reasons} warnings={frame.warnings} limit={4} />

        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onDownload(frame, profile)}
            disabled={isExporting}
            className="flex-1 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-900"
          >
            {isExporting ? 'Exporting…' : `Download ${profile.recommendedWidth}×${profile.recommendedHeight}`}
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(frame.id)}
            // `aria-pressed` communicates toggle state; without it a screen reader
            // announces only "Favorite" and never whether it is currently set.
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? 'Remove' : 'Set'} ${profile.label} frame as favorite`}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
              isFavorite
                ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * Memoised on the props that actually change.
 *
 * Ten cards re-rendering because an unrelated gallery checkbox moved is wasted
 * work, and each card holds a decoded image.
 */
export const CategoryCard = memo(CategoryCardComponent);
CategoryCard.displayName = 'CategoryCard';
