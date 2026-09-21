import React, { memo, useState, useEffect } from 'react';
import { Settings, Download, RefreshCcw, Video } from 'lucide-react';
import {
  FrameRate, VideoMetadata, SUPPORTED_FPS, AppState, OutputFormat,
  CadenceMode, INTERVAL_PRESETS, MIN_INTERVAL_SECONDS, MAX_INTERVAL_SECONDS,
  clampIntervalSeconds,
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
  outputFormat,
  onFormatChange,
  onProcess,
  onReset,
  appState,
}) => {
  const { t } = useTranslation();
  const estimatedFrames = cadenceMode === 'interval'
    ? Math.max(1, Math.floor(videoMetadata.duration / intervalSeconds))
    : Math.floor(videoMetadata.duration * selectedFps);
  const isProcessing = appState === AppState.PROCESSING || appState === AppState.ZIPPING;

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
          disabled={isProcessing}
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
              <div className="grid grid-cols-2 gap-2 mb-4" role="tablist" aria-label={t('controls.extractionCadence')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={cadenceMode === 'fps'}
                  onClick={() => onCadenceModeChange('fps')}
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                  className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border ${
                    cadenceMode === 'interval'
                      ? 'bg-cyan-500 text-gray-950 border-cyan-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {t('controls.everyNSeconds')}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
              ) : (
              <>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('controls.intervalLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {INTERVAL_PRESETS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onIntervalSecondsChange(s)}
                    disabled={isProcessing}
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
                  disabled={isProcessing}
                  className="w-24 bg-gray-950 border border-gray-800 text-white font-mono font-bold rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
                <span className="text-xs text-gray-500">{t('controls.secondsUnit', { min: MIN_INTERVAL_SECONDS, max: MAX_INTERVAL_SECONDS })}</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-3 font-medium">
                {t('controls.intervalDesc')}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
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
               <span className="text-xl font-bold text-white font-mono">{estimatedFrames.toLocaleString()} <span className="text-xs font-medium text-cyan-400 tracking-wider">{t('controls.estimatedImages')}</span></span>
            </div>
            {estimatedFrames > 1000 && (
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
            disabled={isProcessing}
            className={`relative z-10 w-full py-4.5 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3
              ${isProcessing 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-gray-950 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {isProcessing ? (
              <>{t('controls.processing')}</>
            ) : (
              <>
                <span>{t('controls.extractFrames')}</span>
                <Download className="w-5 h-5 hidden sm:block" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Controls);