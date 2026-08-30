import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdUnitProps {
  className?: string;
  slot?: string;
}

const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({
  className = '',
  slot = '9170158407',
}) => {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (_) {}
  }, []);

  return (
    // min-height reserves space before the ad loads, preventing layout shift (CLS)
    <div
      className={`w-full flex flex-col items-center my-6 ${className}`}
      style={{ minHeight: '100px' }}
    >
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-3034542374165383"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAdUnit;
