import React, { useEffect, useState } from 'react';
import { X, Timer } from 'lucide-react';
import AdUnit from './AdUnit';

interface InterstitialAdProps {
  onSkip: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/95 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col relative">
        
        {/* Ad Header */}
        <div className="bg-gray-950 p-4 flex justify-between items-center border-b border-gray-800 min-h-[60px]">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Advertisement</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              disabled={!canSkip}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all shadow-lg ${
                canSkip 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-cyan-500/20 cursor-pointer' 
                  : 'bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed border border-gray-700 shadow-none'
              }`}
            >
              {!canSkip ? (
                <>
                  <div className="w-6 h-6 relative shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22d3ee" strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - (timeLeft / 5) * 100}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] leading-none pt-px">{timeLeft}</span>
                  </div>
                  <span>Skip in {timeLeft}...</span>
                </>
              ) : (
                <>
                  <span>Skip Ad</span>
                  <X className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real Ad Content */}
        <div className="min-h-[250px] w-full bg-gray-950 flex flex-col items-center justify-center p-4 text-center relative border-b border-gray-800 overflow-hidden">
           <AdUnit className="my-0" />
           <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Ad</div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 text-center">
           <p className="text-xs font-medium text-gray-400 flex items-center justify-center gap-2">
             {!canSkip ? 'Supporting free tools ❤️' : 'Your conversion will start automatically after you skip the ad.'}
           </p>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;