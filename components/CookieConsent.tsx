import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('cookie_consent_accepted', type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-lg z-[120] animate-fade-in font-sans">
      <div className="p-5 rounded-3xl bg-gray-950/95 border border-cyan-800/80 shadow-2xl backdrop-blur-md text-xs text-gray-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold font-display text-white text-sm">
            <span>🍪 Cookie & Privacy Consent</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
            GDPR & CCPA
          </span>
        </div>

        <p className="leading-relaxed text-gray-400">
          We use local storage for essential converter settings and privacy-respecting cookies for traffic analytics and ad delivery. Your uploaded videos never leave your browser. Learn more in our{' '}
          <Link to="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
            Privacy Policy
          </Link>.
        </p>

        <div className="pt-1 flex items-center justify-end gap-2 font-mono font-bold text-xs">
          <button
            onClick={() => handleAccept('essential')}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 transition shadow-md shadow-cyan-500/20"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
