/**
 * Appreciation popup configuration.
 *
 * APPRECIATION_PAYMENT_URL is the page the "Show appreciation" button opens.
 * It is currently a PLACEHOLDER — swap this one line for the real payment
 * page URL (e.g. the live Buy Me a Coffee page) once the account exists.
 */
export const APPRECIATION_PAYMENT_URL = 'https://www.buymeacoffee.com/PLACEHOLDER';

/** sessionStorage flag: the popup shows at most once per browser session. */
export const APPRECIATION_SHOWN_KEY = 'vtis-appreciation-shown';

/** Preset appreciation amounts (USD) shown as chips in the popup. */
export const APPRECIATION_AMOUNTS = [2, 5, 10] as const;

export const hasSeenAppreciation = (): boolean => {
  try {
    return sessionStorage.getItem(APPRECIATION_SHOWN_KEY) === '1';
  } catch {
    // Storage unavailable (blocked cookies etc.) — treat as already seen so
    // the visitor is never nagged and the download is never interrupted.
    return true;
  }
};

export const markAppreciationSeen = (): void => {
  try {
    sessionStorage.setItem(APPRECIATION_SHOWN_KEY, '1');
  } catch {
    // Storage unavailable — the flag simply lasts for this page view only.
  }
};
