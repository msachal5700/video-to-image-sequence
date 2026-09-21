import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdUnitProps {
  className?: string;
  slot?: string;
}

const getConsent = (): 'all' | 'essential' | null => {
  try {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (consent === 'all' || consent === 'essential') return consent;
  } catch (_) {}
  return null;
};

const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({
  className = '',
  slot = '9170158407',
}) => {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const pending = useRef(false);
  // When AdSense reports no fill, hide the slot entirely so a blank
  // white box never shows against the dark theme.
  const [unfilled, setUnfilled] = useState(false);

  const loadAds = () => {
    if (pushed.current || pending.current) return;
    // Only load ads when user has accepted all cookies (including advertising)
    if (getConsent() !== 'all') return;
    pending.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (_) {
      pending.current = false;
    }
  };

  useEffect(() => {
    // Check consent on mount
    loadAds();

    // Listen for consent changes (e.g., user accepts all after initial load)
    const handler = () => loadAds();
    window.addEventListener('cookieConsentChange', handler);

    // Watch for AdSense's fill status: hide the slot when no ad is
    // served, so an empty white iframe never appears on the dark theme.
    const ins = ref.current;
    let observer: MutationObserver | null = null;
    if (ins) {
      const checkFill = () => {
        if (ins.getAttribute('data-ad-status') === 'unfilled') {
          setUnfilled(true);
        }
      };
      checkFill();
      observer = new MutationObserver(checkFill);
      observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    }

    return () => {
      window.removeEventListener('cookieConsentChange', handler);
      observer?.disconnect();
    };
  }, []);

  // No ad served: render nothing instead of a blank white box.
  if (unfilled) return null;

  return (
    // min-height reserves space before the ad loads, preventing layout shift (CLS)
    <div
      className={`w-full flex flex-col items-center my-6 ${className}`}
      style={{ minHeight: '100px' }}
    >
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', backgroundColor: 'transparent' }}
        data-ad-client="ca-pub-3034542374165383"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAdUnit;
