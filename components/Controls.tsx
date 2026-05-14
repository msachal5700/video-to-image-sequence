import React, { memo } from 'react';
import { Settings, Download, RefreshCcw, Video } from 'lucide-react';
import { FrameRate, VideoMetadata, SUPPORTED_FPS, AppState, OutputFormat } from '../types';
import { formatBytes, formatTime } from '../utils/videoProcessor';

interface ControlsProps {
  videoMetadata: VideoMetadata;
  selectedFps: FrameRate;
  onFpsChange: (fps: FrameRate) => void;
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
  outputFormat,
  onFormatChange,
  onProcess,
  onReset,
  appState,
}) => {
  const estimatedFrames = Math.floor(videoMetadata.duration * selectedFps);
  const isProcessing = appState === AppState.PROCESSING || appState === AppState.ZIPPING;

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
            <h4 className="font-semibold text-white uppercase tracking-wider text-sm">Configuration</h4>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Output Frame Rate (FPS)</label>
              
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
                        {fps} Frames Per Second
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Output Format</label>
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <p className="text-gray-500 text-[11px] mt-3 font-medium">
                {outputFormat === 'jpg' && 'Smaller file size, recommended for most uses'}
                {outputFormat === 'png' && 'Lossless quality, best for VFX and game dev'}
              </p>
            </div>
            
            <div className="bg-cyan-950/20 border-l-2 border-cyan-500 rounded-r-xl p-4 flex justify-between items-center">
               <span className="text-sm font-medium text-gray-300">Estimated Output:</span>
               <span className="text-xl font-bold text-white font-mono">{estimatedFrames.toLocaleString()} <span className="text-xs font-medium text-cyan-400 tracking-wider">IMAGES</span></span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="bg-cyan-950 border border-cyan-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
           {/* Decorative background glow */}
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors pointer-events-none" />

           <div className="relative z-10 mb-8">
              <h4 className="font-bold text-white text-xl mb-3 font-display">Ready to Extract?</h4>
              <p className="text-sm text-cyan-100/70 leading-relaxed">
                Click below to process this video entirely in your browser. All frames will be extracted locally and combined into a single ZIP file download.
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
              <>Processing...</>
            ) : (
              <>
                <span>Extract Frames Now</span>
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