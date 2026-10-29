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

// REVIEW PHASE (2026-10-29): manual ad units are disabled site-wide while the
// AdSense review is pending, so no page renders empty manual slots (MFA-pattern
// risk). Pages rely on the Auto Ads head tag in index.html only. Flip this to
// true after approval to restore the per-page units exactly as before
// (including the CLS min-height reserve below).
const MANUAL_AD_UNITS_ENABLED = false;

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

  const loadAds = () => {
    if (!MANUAL_AD_UNITS_ENABLED) return;
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

    return () => {
      window.removeEventListener('cookieConsentChange', handler);
    };
  }, []);

  if (!MANUAL_AD_UNITS_ENABLED) return null;

  return (
    // The reserved min-height is ALWAYS rendered — whether the ad fills, is
    // unfilled, or never loads (no ad consent). Previously the slot collapsed
    // to zero height when AdSense reported "unfilled", shifting all content
    // below it (CLS) for every visitor who accepted all cookies. Keeping the
    // space reserved matches what visitors without ad consent already see, so
    // there is no visual change for the majority. (min-height reserves space
    // before the ad loads, preventing layout shift.)
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
