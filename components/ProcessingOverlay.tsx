import React from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { AppState, ProcessingStats } from '../types';
import { formatTime } from '../utils/videoProcessor';

interface ProcessingOverlayProps {
  appState: AppState;
  stats: ProcessingStats | null;
  downloadUrl: string | null;
  onReset: () => void;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  appState,
  stats,
  downloadUrl,
  onReset,
}) => {
  if (appState === AppState.IDLE) return null;

  const isZipping = appState === AppState.ZIPPING;
  const isCompleted = appState === AppState.COMPLETED;
  const isError = appState === AppState.ERROR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
           {!isCompleted && !isError && (
             <div 
               className="h-full bg-cyan-400 transition-all duration-300 ease-out"
               style={{ width: `${stats?.progress || 0}%` }}
             />
           )}
        </div>

        {isError && (
           <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Something went wrong</h3>
              <p className="text-gray-400 text-sm">We couldn't process this video. It might be corrupted or the format is unsupported.</p>
              <button
                onClick={onReset}
                className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Try Again
              </button>
           </div>
        )}

        {!isCompleted && !isError && (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-cyan-400 transition-all duration-300 ease-out"
                  strokeDasharray={`${stats?.progress || 0}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-bold text-white font-display tabular-nums">
                  {Math.round(stats?.progress || 0)}%
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                {isZipping ? 'Creating ZIP Archive...' : 'Extracting Frames...'}
              </h3>
              <p className="text-sm text-gray-400">
                {isZipping 
                  ? 'Compressing images for download.' 
                  : `Processed ${stats?.processedFrames} of ${stats?.totalFrames} frames`
                }
              </p>
            </div>

            {!isZipping && stats?.estimatedTimeRemaining !== undefined && (
               <div className="bg-gray-950 py-2 px-4 rounded-lg inline-block border border-gray-800">
                 <p className="text-xs text-cyan-400 font-mono tracking-wider">
                    EST. REMAINING: {formatTime(stats.estimatedTimeRemaining || 0)}
                 </p>
               </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-cyan-950/50 border border-cyan-800 rounded-full flex items-center justify-center animate-bounce-small">
              <CheckCircle2 className="w-12 h-12 text-cyan-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Success!</h3>
              <p className="text-gray-400 text-sm">
                Your image sequence is ready to download.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={downloadUrl!}
                download="frames.zip"
                className="w-full py-4 px-6 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" />
                Download ZIP
              </a>
              
              <button
                onClick={onReset}
                className="w-full py-3 px-6 text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Convert Another Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingOverlay;