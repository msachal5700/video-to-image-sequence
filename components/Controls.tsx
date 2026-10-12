import React, { memo, useState, useEffect } from 'react';
import { Settings, Download, RefreshCcw, Video } from 'lucide-react';
import {
  FrameRate, VideoMetadata, SUPPORTED_FPS, AppState, OutputFormat,
  CadenceMode, INTERVAL_PRESETS, MIN_INTERVAL_SECONDS, MAX_INTERVAL_SECONDS,
  clampIntervalSeconds, ManualUnit, MIN_MANUAL_FPS, MAX_MANUAL_FPS,
  MIN_MANUAL_SECONDS, MAX_MANUAL_SECONDS, MIN_MANUAL_MINUTES, MAX_MANUAL_MINUTES,
  clampManualFps, clampManualSeconds, clampManualMinutes, manualToFps,
  MIN_SCENE_SENSITIVITY, MAX_SCENE_SENSITIVITY,
} from '../types';
import { formatBytes, formatTime } from '../utils/videoProcessor';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
  videoMetadata: VideoMetadata;
  selectedFps: FrameRate;
  onFpsChange: (fps: FrameRate) => void;
  cadenceMode: CadenceMode;
  onCadenceModeChange: (mode: CadenceMode) => void;
  intervalSeconds: number;
  onIntervalSecondsChange: (seconds: number) => void;
  manualUnit: ManualUnit;
  onManualUnitChange: (unit: ManualUnit) => void;
  manualValue: number;
  onManualValueChange: (value: number) => void;
  sceneSensitivity: number;
  onSceneSensitivityChange: (sensitivity: number) => void;
  /** Live scene count during scene-mode detection; null before/after. */
  detectedScenes: number | null;
  outputFormat: OutputFormat;
  onFormatChange: (f: OutputFormat) => void;
  onProcess: () => void;
  onReset: () => void;
  appState: AppState;
}

const Controls: React.FC<ControlsProps> = ({
  videoMetadata,
  selectedFps,
  onFpsChange,
  cadenceMode,
  onCadenceModeChange,
  intervalSeconds,
  onIntervalSecondsChange,
  manualUnit,
  onManualUnitChange,
  manualValue,
  onManualValueChange,
  sceneSensitivity,
  onSceneSensitivityChange,
  detectedScenes,
  outputFormat,
  onFormatChange,
  onProcess,
  onReset,
}) => {
  const { t } = useTranslation();
  const manualFps = manualToFps(manualUnit, manualValue);
  const estimatedFrames = cadenceMode === 'scene'
    ? (detectedScenes ?? 0)
    : cadenceMode === 'interval'
      ? Math.max(1, Math.floor(videoMetadata.duration / intervalSeconds))
      : cadenceMode === 'manual'
        ? Math.max(1, Math.floor(videoMetadata.duration * manualFps))
        : Math.floor(videoMetadata.duration * selectedFps);
  // In scene mode the count is unknown until detection runs; show "Auto".
  const estimatedLabel = cadenceMode === 'scene' && detectedScenes == null
    ? 'Auto'
    : estimatedFrames.toLocaleString();

  const sensitivityName =
    sceneSensitivity < 34 ? 'Low' : sceneSensitivity < 67 ? 'Medium' : 'High';

  // Local text state for the custom interval input so typing stays smooth;
  // it re-syncs whenever a preset button changes the value from outside.
  const [customInput, setCustomInput] = useState(String(intervalSeconds));
  useEffect(() => {
    setCustomInput(String(intervalSeconds));
  }, [intervalSeconds]);

  const applyCustomInterval = () => {
    const clamped = clampIntervalSeconds(Number(customInput));
    onIntervalSecondsChange(clamped);
    setCustomInput(String(clamped));
  };

  // Manual/custom cadence: three numeric inputs (FPS, seconds, minutes).
  // Local text state per field keeps typing smooth; editing a field selects it.
  const [manualInputs, setManualInputs] = useState({ fps: '2', seconds: '5', minutes: '1' });
  const [manualError, setManualError] = useState<string | null>(null);

  const MANUAL_FIELDS: { unit: ManualUnit; label: string; min: number; max: number; clamp: (v: number) => number }[] = [
    { unit: 'fps', label: t('controls.manualFpsLabel'), min: MIN_MANUAL_FPS, max: MAX_MANUAL_FPS, clamp: clampManualFps },
    { unit: 'seconds', label: t('controls.manualSecondsLabel'), min: MIN_MANUAL_SECONDS, max: MAX_MANUAL_SECONDS, clamp: clampManualSeconds },
    { unit: 'minutes', label: t('controls.manualMinutesLabel'), min: MIN_MANUAL_MINUTES, max: MAX_MANUAL_MINUTES, clamp: clampManualMinutes },
  ];

  const applyManualField = (unit: ManualUnit) => {
    const field = MANUAL_FIELDS.find(f => f.unit === unit)!;
    const raw = Number(manualInputs[unit]);
    if (!Number.isFinite(raw) || raw <= 0) {
      setManualError(t('controls.manualInvalid'));
      return;
    }
    if (raw < field.min || raw > field.max) {
      setManualError(t('controls.manualOutOfRange', { min: field.min, max: field.max }));
      return;
    }
    setManualError(null);
    onManualUnitChange(unit);
    onManualValueChange(raw);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in font-sans">
      {/* Video Info Card */}
      <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-950 p-3 rounded-xl border border-cyan-900">
            <Video className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white truncate max-w-[200px] sm:max-w-xs text-lg font-display" title={videoMetadata.name}>
              {videoMetadata.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 mt-1.5 font-mono">
              <span className="bg-gray-800 px-2.5 py-1 rounded-md text-white">{formatTime(videoMetadata.duration)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-gray-800/50 px-2 py-1 rounded-md border border-gray-800">{formatBytes(videoMetadata.originalSize)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-gray-800/50 px-2 py-1 rounded-md border border-gray-800">{videoMetadata.width}x{videoMetadata.height}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-white hover:bg-gray-800 p-2.5 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-gray-700"
          title="Remove Video"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Settings & Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-gray-300 border-b border-gray-800 pb-4">
            <Settings className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-white uppercase tracking-wider text-sm">{t('controls.configuration')}</h4>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.extractionCadence')}</label>

              {/* Cadence mode toggle */}
              <div className="grid grid-cols-4 gap-2 mb-4" role="tablist" aria-label={t('controls.extractionCadence')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={cadenceMode === 'fps'}
                  onClick={() => onCadenceModeChange('fps')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border ${
                    cadenceMode === 'fps'
                      ? 'bg-cyan-500 text-gray-950 border-cyan-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {t('controls.byFps')}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={cadenceMode === 'interval'}
                  onClick={() => onCadenceModeChange('interval')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border ${
                    cadenceMode === 'interval'
                      ? 'bg-cyan-500 text-gray-950 border-cyan-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {t('controls.everyNSeconds')}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={cadenceMode === 'manual'}
                  onClick={() => onCadenceModeChange('manual')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border ${
                    cadenceMode === 'manual'
                      ? 'bg-cyan-500 text-gray-950 border-cyan-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {t('controls.manualTab')}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={cadenceMode === 'scene'}
                  onClick={() => onCadenceModeChange('scene')}
                  className={`py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 border ${
                    cadenceMode === 'scene'
                      ? 'bg-cyan-500 text-gray-950 border-cyan-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  Smart scenes
                </button>
              </div>

              {cadenceMode === 'fps' ? (
              <>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.frameRate')}</label>

              <div className="space-y-5">
                <div className="relative">
                  <select
                    value={selectedFps}
                    onChange={(e) => onFpsChange(Number(e.target.value) as FrameRate)}
                    className="w-full bg-gray-950 border border-gray-800 text-white font-medium rounded-xl py-3.5 px-4 appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {SUPPORTED_FPS.map((fps) => (
                      <option key={fps} value={fps}>
                        {fps} {t('controls.fpsSuffix')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div className="px-1 pt-2">
                  <input
                    type="range"
                    min="0"
                    max={SUPPORTED_FPS.length - 1}
                    step="1"
                    value={SUPPORTED_FPS.indexOf(selectedFps)}
                    onChange={(e) => {
                      const fpsIndex = Number(e.target.value);
                      onFpsChange(SUPPORTED_FPS[fpsIndex] as FrameRate);
                    }}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    title={`Selected FPS: ${selectedFps}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                    <span>{SUPPORTED_FPS[0]}</span>
                    <span>{SUPPORTED_FPS[Math.floor(SUPPORTED_FPS.length / 2)]}</span>
                    <span>{SUPPORTED_FPS[SUPPORTED_FPS.length - 1]}</span>
                  </div>
                </div>
              </div>
              </>
              ) : cadenceMode === 'interval' ? (
              <>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.intervalLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {INTERVAL_PRESETS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onIntervalSecondsChange(s)}
                    aria-pressed={intervalSeconds === s}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 ${
                      intervalSeconds === s
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {t('controls.everySeconds', { count: s })}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <label htmlFor="custom-interval" className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                  {t('controls.customInterval')}
                </label>
                <input
                  id="custom-interval"
                  type="number"
                  min={MIN_INTERVAL_SECONDS}
                  max={MAX_INTERVAL_SECONDS}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onBlur={applyCustomInterval}
                  onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                  className="w-24 bg-gray-950 border border-gray-800 text-white font-mono font-bold rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
                <span className="text-xs text-gray-500">{t('controls.secondsUnit', { min: MIN_INTERVAL_SECONDS, max: MAX_INTERVAL_SECONDS })}</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-3 font-medium">
                {t('controls.intervalDesc')}
              </p>
              </>
              ) : cadenceMode === 'manual' ? (
              <>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.manualTitle')}</label>
              <div className="space-y-3">
                {MANUAL_FIELDS.map((field) => (
                  <div
                    key={field.unit}
                    onClick={() => applyManualField(field.unit)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      manualUnit === field.unit
                        ? 'bg-cyan-950/20 border-cyan-500/60'
                        : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        manualUnit === field.unit ? 'border-cyan-400' : 'border-gray-600'
                      }`}
                      aria-hidden="true"
                    >
                      {manualUnit === field.unit && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </span>
                    <span className="text-xs font-semibold text-gray-300 flex-1">{field.label}</span>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step="any"
                      value={manualInputs[field.unit]}
                      onChange={(e) => {
                        setManualInputs(prev => ({ ...prev, [field.unit]: e.target.value }));
                      }}
                      onBlur={() => applyManualField(field.unit)}
                      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 bg-gray-950 border border-gray-800 text-white font-mono font-bold rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      aria-label={field.label}
                    />
                    <span className="text-[10px] text-gray-500 font-mono w-16 shrink-0">{field.min}–{field.max}</span>
                  </div>
                ))}
              </div>
              {manualError && (
                <p className="text-red-400 text-xs mt-2 font-medium" role="alert">{manualError}</p>
              )}
              <p className="text-gray-500 text-[11px] mt-3 font-medium">
                {t('controls.manualDesc')}
              </p>
              <p className="text-cyan-400 text-xs mt-2 font-mono font-bold">
                {t('controls.manualEstimate', { count: estimatedFrames.toLocaleString(), duration: formatTime(videoMetadata.duration) })}
              </p>
              </>
              ) : (
              <>
              <label htmlFor="scene-sensitivity" className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Scene sensitivity — <span className="text-cyan-400">{sensitivityName}</span>
              </label>
              <input
                id="scene-sensitivity"
                type="range"
                min={MIN_SCENE_SENSITIVITY}
                max={MAX_SCENE_SENSITIVITY}
                step="1"
                value={sceneSensitivity}
                onChange={(e) => onSceneSensitivityChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title={`Scene sensitivity: ${sceneSensitivity}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
              {detectedScenes != null && (
                <p className="text-cyan-400 text-xs mt-3 font-semibold">
                  {detectedScenes} {detectedScenes === 1 ? 'scene' : 'scenes'} detected
                </p>
              )}
              <p className="text-gray-500 text-[11px] mt-3 font-medium leading-relaxed">
                Samples your video ~2× per second and keeps one frame each time the
                picture changes significantly — ideal for lectures, tutorials, and
                screen recordings. Works best on videos with clear cuts; slow fades
                and gradual pans may be grouped into fewer scenes. Detection runs
                entirely in your browser.
              </p>
              </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.outputFormat')}</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => onFormatChange('jpg')}
                  className={`py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 border ${
                    outputFormat === 'jpg'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => onFormatChange('png')}
                  className={`py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 border ${
                    outputFormat === 'png'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => onFormatChange('webp')}
                  className={`py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 border ${
                    outputFormat === 'webp'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  WebP
                </button>
              </div>
              <p className="text-gray-500 text-[11px] mt-3 font-medium">
                {outputFormat === 'jpg' && t('controls.formatJpgDesc')}
                {outputFormat === 'png' && t('controls.formatPngDesc')}
                {outputFormat === 'webp' && 'Best for web use — smaller than PNG, supports transparency, modern browser support'}
              </p>
            </div>
            
            <div className="bg-cyan-950/20 border-l-2 border-cyan-500 rounded-r-xl p-4 flex justify-between items-center">
               <span className="text-sm font-medium text-gray-300">{t('controls.estimatedOutput')}</span>
               <span className="text-xl font-bold text-white font-mono">{estimatedLabel} <span className="text-xs font-medium text-cyan-400 tracking-wider">{t('controls.estimatedImages')}</span></span>
            </div>
            {cadenceMode !== 'scene' && estimatedFrames > 1000 && (
              <p className="text-yellow-400 text-xs mt-2">
                {t('controls.mobileSlowWarning', { count: estimatedFrames.toLocaleString() })}
              </p>
            )}
          </div>
        </div>

        {/* Action Area */}
        <div className="bg-cyan-950 border border-cyan-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
           {/* Decorative background glow */}
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors pointer-events-none" />

           <div className="relative z-10 mb-8">
              <h4 className="font-bold text-white text-xl mb-3 font-display">{t('controls.readyTitle')}</h4>
              <p className="text-sm text-cyan-100/70 leading-relaxed">
                {t('controls.readyDesc')}
              </p>
           </div>

           <button
            onClick={onProcess}
            className="relative z-10 w-full py-4.5 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('controls.extractFrames')}</span>
            <Download className="w-5 h-5 hidden sm:block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Controls);