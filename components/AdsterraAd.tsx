import React, { useEffect, useRef, memo } from 'react';

interface AdsterraAdProps {
  className?: string;
  label?: string;
}

const AdsterraAd = ({ className = '', label = '' }: AdsterraAdProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.children.length === 0) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28128840.effectivecpmnetwork.com/999c8cf3f03558a8b1b5b28a2f0a1248/invoke.js';
      
      const div = document.createElement('div');
      div.id = 'container-999c8cf3f03558a8b1b5b28a2f0a1248';
      
      ref.current.appendChild(div);
      ref.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div ref={ref} className="w-full flex flex-col items-center justify-center" />
    </div>
  );
};

export default memo(AdsterraAd);
