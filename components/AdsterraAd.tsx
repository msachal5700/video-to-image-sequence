import React, { useEffect, useRef, memo } from 'react';

interface AdsterraAdProps {
  className?: string;
  label?: string;
}

const AdsterraAd = ({ className = '', label = '' }: AdsterraAdProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      // Adsterra banner script - update with your Adsterra publisher ID
      script.src = 'https://code.adsterra.com/banners/adsterra_ad.js';
      
      const div = document.createElement('div');
      div.id = 'adsterra-ad-container';
      
      ref.current.appendChild(script);
      ref.current.appendChild(div);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      {label && <p className="text-[10px] text-gray-700 mb-1 uppercase tracking-wider">{label}</p>}
      <div ref={ref} className="w-full flex flex-col items-center justify-center min-h-[90px]">
        {import.meta.env.DEV && (
          <div className="text-center text-xs text-gray-500">
            📢 Adsterra ad (development mode)
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AdsterraAd);
