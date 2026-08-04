/**
 * Shared presentational primitives for the AI Social Media Frame Picker.
 *
 * Grouped in one module because each piece is small, they are only ever used
 * together, and a separate file per 20-line component would add more import
 * noise than clarity. Anything that grows beyond this scope should move out.
 */

import React, { memo } from 'react';
import type { PipelineStage } from '../../ai/types';

/**
 * Colour ramp for a 0-100 score.
 *
 * Thresholds match the language used in the copy: 85+ is "excellent", 70+ is
 * "good", 50+ is "usable", below that is "weak". Colour and wording are driven
 * from the same boundaries so they can never disagree.
 */
export const scoreTone = (score: number): { text: string; bg: string; ring: string; label: string } => {
  if (score >= 85) {
    return {
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      ring: 'ring-emerald-500/30',
      label: 'Excellent',
    };
  }
  if (score >= 70) {
    return {
      text: 'text-cyan-700 dark:text-cyan-300',
      bg: 'bg-cyan-50 dark:bg-cyan-500/10',
      ring: 'ring-cyan-500/30',
      label: 'Good',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      ring: 'ring-amber-500/30',
      label: 'Usable',
    };
  }
  return {
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    ring: 'ring-rose-500/30',
    label: 'Weak',
  };
};

interface ScoreBadgeProps {
  score: number;
  /** `lg` for category cards, `sm` for gallery tiles. */
  size?: 'sm' | 'lg';
}

/**
 * The "96 / 100" badge.
 *
 * `role="img"` with a full-sentence label: a screen reader announcing
 * "96 slash 100" is ambiguous, whereas "Quality score 96 out of 100, Excellent"
 * conveys both the number and its meaning in one pass.
 */
export const ScoreBadge = memo(({ score, size = 'sm' }: ScoreBadgeProps) => {
  const tone = scoreTone(score);
  const isLarge = size === 'lg';

  return (
    <div
      role="img"
      aria-label={`Quality score ${score} out of 100, ${tone.label}`}
      className={`inline-flex items-baseline gap-1 rounded-full ring-1 ${tone.bg} ${tone.ring} ${tone.text} ${
        isLarge ? 'px-3 py-1.5' : 'px-2 py-1'
      }`}
    >
      <span className={`font-display font-bold tabular-nums ${isLarge ? 'text-xl' : 'text-sm'}`}>
        {score}
      </span>
      <span className={isLarge ? 'text-xs opacity-70' : 'text-[10px] opacity-70'}>/100</span>
    </div>
  );
});
ScoreBadge.displayName = 'ScoreBadge';

interface ReasonListProps {
  reasons: string[];
  warnings?: string[];
  /** Cap the rendered rows. Gallery tiles show fewer than category cards. */
  limit?: number;
}

/** Bulleted "why this frame won" list, with warnings styled distinctly. */
export const ReasonList = memo(({ reasons, warnings = [], limit }: ReasonListProps) => {
  const shownReasons = limit ? reasons.slice(0, limit) : reasons;

  return (
    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
      {shownReasons.map(reason => (
        <li key={reason} className="flex items-start gap-1.5">
          <span aria-hidden="true" className="mt-0.5 text-emerald-500">
            ✓
          </span>
          <span>{reason}</span>
        </li>
      ))}
      {warnings.map(warning => (
        <li key={warning} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
          <span aria-hidden="true" className="mt-0.5">
            !
          </span>
          <span>{warning}</span>
        </li>
      ))}
    </ul>
  );
});
ReasonList.displayName = 'ReasonList';

/** Light glassmorphism surface. One definition keeps the effect consistent. */
export const GlassPanel = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-900/60 ${className}`}
  >
    {children}
  </div>
);

/** The four visible pipeline steps, in order. */
const STEPS: ReadonlyArray<{ id: string; label: string; stages: PipelineStage[] }> = [
  { id: 'upload', label: 'Upload', stages: ['idle'] },
  { id: 'analyzing', label: 'Analyzing', stages: ['extracting', 'analyzing'] },
  { id: 'selecting', label: 'AI Selecting', stages: ['selecting'] },
  { id: 'results', label: 'Results', stages: ['done'] },
];

/** Map a pipeline stage onto a step index, so the indicator has one source of truth. */
const stageToStepIndex = (stage: PipelineStage): number => {
  const index = STEPS.findIndex(step => step.stages.includes(stage));
  // 'error' matches nothing; keep the indicator on the analysing step so the
  // error message below it reads as belonging to that phase.
  return index === -1 ? 1 : index;
};

interface StepIndicatorProps {
  stage: PipelineStage;
}

/**
 * Step-based progress header.
 *
 * An ordered list rather than a row of divs: the numbering and sequence are
 * genuine semantics, and it means a screen reader announces "step 2 of 4"
 * without any ARIA scaffolding.
 */
export const StepIndicator = memo(({ stage }: StepIndicatorProps) => {
  const activeIndex = stageToStepIndex(stage);

  return (
    <nav aria-label="Progress">
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  isActive
                    ? 'bg-cyan-500 text-white'
                    : isComplete
                      ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
                // `aria-current="step"` is the standard hook screen readers use
                // to announce which step of a sequence is active.
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-white/25' : isComplete ? 'bg-cyan-500 text-white' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
                {step.label}
              </div>
              {index < STEPS.length - 1 && (
                <span aria-hidden="true" className="hidden h-px w-4 bg-gray-300 dark:bg-gray-700 sm:block" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
StepIndicator.displayName = 'StepIndicator';

interface ProgressBarProps {
  value: number;
  message: string;
  stage: PipelineStage;
}

/**
 * Animated determinate progress bar.
 *
 * Carries full `progressbar` semantics plus an `aria-live` status line, so a
 * screen-reader user gets periodic spoken updates instead of silence during
 * what can be a minute of processing.
 */
export const ProgressBar = memo(({ value, message, stage }: ProgressBarProps) => (
  <div className="w-full">
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${stage} progress`}
      className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-[width] duration-300 ease-out"
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
    <p aria-live="polite" className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
      {message}
    </p>
  </div>
));
ProgressBar.displayName = 'ProgressBar';
