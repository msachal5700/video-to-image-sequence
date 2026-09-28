import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sync Google Consent Mode v2 with the visitor's cookie choice. */
const syncGtagConsent = (granted: boolean) => {
  try {
    window.gtag?.('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
  } catch (_) {
    // gtag not loaded (e.g. blocked) — nothing to sync
  }
};

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      // Fresh visitor: show the full-screen gate immediately
      setVisible(true);
    } else if (consent === 'all') {
      // Returning visitor: apply their stored choice to Google Consent Mode
      syncGtagConsent(true);
    }
  }, []);

  // Lock page scrolling while the consent gate is up
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('cookie_consent_accepted', type);
    setVisible(false);
    // Sync Google Consent Mode v2 (grants only when "Accept All")
    syncGtagConsent(type === 'all');
    // Notify ad components that consent may have changed
    window.dispatchEvent(new Event('cookieConsentChange'));
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-4 font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie and privacy consent"
    >
      <div className="w-full max-w-lg p-6 rounded-3xl bg-gray-950 border border-cyan-800/80 shadow-2xl text-sm text-gray-300 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold font-display text-white text-base">
            <span>🍪 Cookie & Privacy Consent</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
            GDPR & CCPA
          </span>
        </div>

        <p className="leading-relaxed text-gray-400">
          Before you continue, please choose how we may use cookies. We use local storage for essential converter settings and privacy-respecting cookies for traffic analytics and ad delivery. Your uploaded videos never leave your browser. Learn more in our{' '}
          <Link to="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
            Privacy Policy
          </Link>.
        </p>

        <div className="pt-1 flex flex-col sm:flex-row items-stretch gap-2 font-mono font-bold text-sm">
          <button
            onClick={() => handleAccept('essential')}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="flex-1 px-4 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 transition shadow-md shadow-cyan-500/20"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
