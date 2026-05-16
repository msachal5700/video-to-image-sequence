import React, { useEffect, useRef, memo } from 'react';

interface AtOptionsAdProps {
  className?: string;
  label?: string;
}

const AtOptionsAd = ({ className = '', label = '' }: AtOptionsAdProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      const scriptTag = document.createElement('script');
      scriptTag.innerHTML = `
        atOptions = {
          'key' : '6d4606d2eeb8071b4f629017dbc9bba9',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      ref.current.appendChild(scriptTag);

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.highperformanceformat.com/6d4606d2eeb8071b4f629017dbc9bba9/invoke.js';
      ref.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      {label && <p className="text-[10px] text-gray-700 mb-1 uppercase tracking-wider">{label}</p>}
      <div ref={ref} className="w-full flex flex-col items-center justify-center min-h-[90px]">
        {import.meta.env.DEV && (
          <div className="text-center text-xs text-gray-500">
            📢 Ad Placeholder (development mode)
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AtOptionsAd);
