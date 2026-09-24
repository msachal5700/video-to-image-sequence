import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'yn7fwe31c8';

/**
 * Injects the Microsoft Clarity tracking script only after the visitor grants
 * analytics consent ("Accept All" in the cookie banner), mirroring how Google
 * Analytics is gated by Consent Mode v2. Fires on late consent too.
 */
const loadClarity = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const w = window as unknown as Record<string, unknown>;
  if (w.clarity || document.querySelector('script[src*="clarity.ms/tag"]')) return;
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(s, first);
  else document.head.appendChild(s);
};

const hasAnalyticsConsent = (): boolean => {
  try {
    return localStorage.getItem('cookie_consent_accepted') === 'all';
  } catch {
    return false;
  }
};

const ClarityConsent: React.FC = () => {
  useEffect(() => {
    if (hasAnalyticsConsent()) loadClarity();
    const onConsentChange = () => {
      if (hasAnalyticsConsent()) loadClarity();
    };
    window.addEventListener('cookieConsentChange', onConsentChange);
    return () => window.removeEventListener('cookieConsentChange', onConsentChange);
  }, []);
  return null;
};

export default ClarityConsent;
