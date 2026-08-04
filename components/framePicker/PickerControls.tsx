/**
 * User controls: score threshold, format, size, sort, and bulk download actions.
 *
 * Every control is a native input. Native `range`, `select` and `button` elements
 * arrive with keyboard support, focus management and screen-reader semantics
 * already correct — a custom-styled div would need all of that rebuilt, and
 * usually rebuilt worse.
 */

import React, { memo } from 'react';
import type {
  FrameSizePreset,
  PickerOptions,
  PickerOutputFormat,
  SortMode,
} from '../../ai/types';
import { supportsWebP } from '../../services/frameExportService';

interface PickerControlsProps {
  options: PickerOptions;
  visibleCount: number;
  totalCount: number;
  selectedCount: number;
  favoriteCount: number;
  isExporting: boolean;
  onChange: (patch: Partial<PickerOptions>) => void;
  onDownloadAll: () => void;
  onDownloadSelected: () => void;
  onDownloadFavorites: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

/** Shared classes for the select controls, so the four stay identical. */
const SELECT_CLASS =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

const LABEL_CLASS = 'mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300';

/** Secondary button styling, shared by the bulk actions. */
const ACTION_CLASS =
  'rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900';

const FORMAT_OPTIONS: ReadonlyArray<{ value: PickerOutputFormat; label: string }> = [
  { value: 'png', label: 'PNG — lossless' },
  { value: 'jpeg', label: 'JPEG — smallest' },
  { value: 'webp', label: 'WEBP — best ratio' },
];

const SIZE_OPTIONS: ReadonlyArray<{ value: FrameSizePreset; label: string }> = [
  { value: 'original', label: 'Original resolution' },
  { value: 'platform', label: 'Platform recommended' },
  { value: '1080', label: '1920 × 1080' },
  { value: '720', label: '1280 × 720' },
];

const SORT_OPTIONS: ReadonlyArray<{ value: SortMode; label: string }> = [
  { value: 'score', label: 'Highest score' },
  { value: 'scene', label: 'Scene order' },
  { value: 'newest', label: 'Newest first' },
];

const PickerControlsComponent = ({
  options,
  visibleCount,
  totalCount,
  selectedCount,
  favoriteCount,
  isExporting,
  onChange,
  onDownloadAll,
  onDownloadSelected,
  onDownloadFavorites,
  onSelectAll,
  onClearSelection,
}: PickerControlsProps) => {
  // WebP is offered only where the browser can actually encode it, rather than
  // letting the user pick it and silently handing back a PNG.
  const formatOptions = FORMAT_OPTIONS.filter(
    option => option.value !== 'webp' || supportsWebP()
  );

  return (
    <section
      aria-label="Frame filters and download options"
      className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/60 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="fp-min-score" className={LABEL_CLASS}>
            Minimum score: <span className="tabular-nums text-cyan-600 dark:text-cyan-400">{options.minScore}</span>
          </label>
          <input
            id="fp-min-score"
            type="range"
            min={0}
            max={100}
            step={5}
            value={options.minScore}
            onChange={event => onChange({ minScore: Number(event.target.value) })}
            aria-describedby="fp-min-score-help"
            className="w-full accent-cyan-600"
          />
          <p id="fp-min-score-help" className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            Showing {visibleCount} of {totalCount} frames
          </p>
        </div>

        <div>
          <label htmlFor="fp-format" className={LABEL_CLASS}>
            Output format
          </label>
          <select
            id="fp-format"
            value={options.format}
            onChange={event => onChange({ format: event.target.value as PickerOutputFormat })}
            className={SELECT_CLASS}
          >
            {formatOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fp-size" className={LABEL_CLASS}>
            Frame size
          </label>
          <select
            id="fp-size"
            value={options.size}
            onChange={event => onChange({ size: event.target.value as FrameSizePreset })}
            className={SELECT_CLASS}
          >
            {SIZE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fp-sort" className={LABEL_CLASS}>
            Sort by
          </label>
          <select
            id="fp-sort"
            value={options.sort}
            onChange={event => onChange({ sort: event.target.value as SortMode })}
            className={SELECT_CLASS}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quality slider only applies to lossy formats, so it is hidden for PNG
          rather than shown disabled — a greyed control invites pointless fiddling. */}
      {options.format !== 'png' && (
        <div className="mt-4 max-w-xs">
          <label htmlFor="fp-quality" className={LABEL_CLASS}>
            Encode quality:{' '}
            <span className="tabular-nums text-cyan-600 dark:text-cyan-400">
              {Math.round(options.quality * 100)}%
            </span>
          </label>
          <input
            id="fp-quality"
            type="range"
            min={50}
            max={100}
            step={2}
            value={Math.round(options.quality * 100)}
            onChange={event => onChange({ quality: Number(event.target.value) / 100 })}
            className="w-full accent-cyan-600"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={isExporting || visibleCount === 0}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-900"
        >
          Download all ({visibleCount})
        </button>
        <button
          type="button"
          onClick={onDownloadSelected}
          disabled={isExporting || selectedCount === 0}
          className={ACTION_CLASS}
        >
          Download selected ({selectedCount})
        </button>
        <button
          type="button"
          onClick={onDownloadFavorites}
          disabled={isExporting || favoriteCount === 0}
          className={ACTION_CLASS}
        >
          Download favorites ({favoriteCount})
        </button>
        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-gray-200 dark:bg-gray-700 sm:block" />
        <button type="button" onClick={onSelectAll} disabled={visibleCount === 0} className={ACTION_CLASS}>
          Select all
        </button>
        <button type="button" onClick={onClearSelection} disabled={selectedCount === 0} className={ACTION_CLASS}>
          Clear selection
        </button>
      </div>
    </section>
  );
};

export const PickerControls = memo(PickerControlsComponent);
PickerControls.displayName = 'PickerControls';
