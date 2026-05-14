import React, { useEffect, useRef, memo } from 'react';

interface AdUnitProps {
  className?: string;
  label?: string;
}

const AdUnit = ({ className = '', label = '' }: AdUnitProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28128840.profitablecpmratenetwork.com/999c8cf3f03558a8b1b5b28a2f0a1248/invoke.js';
      
      const div = document.createElement('div');
      div.id = 'container-999c8cf3f03558a8b1b5b28a2f0a1248';
      
      ref.current.appendChild(script);
      ref.current.appendChild(div);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center my-6 ${className}`}>
      {label && <p className="text-[10px] text-gray-700 mb-1 uppercase tracking-wider">{label}</p>}
      <div ref={ref} className="w-full flex flex-col items-center justify-center min-h-[90px]" />
    </div>
  );
};
export default memo(AdUnit);
