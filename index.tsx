import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Initialise i18next before rendering — must be imported before any component
import './i18n/index';

// Chunk-load recovery: after a new deployment, a visitor holding stale
// cached entry HTML can request a JS chunk hash that no longer exists.
// The lazy import then fails and, with no error boundary, the visitor is
// stuck on the loading fallback. Reload once to pick up the fresh entry
// (a sessionStorage timestamp guards against reload loops).
const CHUNK_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|chunkloaderror|loading chunk \d+ failed/i;
const CHUNK_RELOAD_KEY = 'vtis-chunk-reload-at';

function chunkErrorMessage(reason: unknown): string {
  if (!reason) return '';
  if (typeof reason === 'string') return reason;
  const msg = (reason as { message?: unknown }).message;
  return typeof msg === 'string' ? msg : String(reason);
}

function recoverFromChunkError(reason: unknown): void {
  if (!CHUNK_ERROR_PATTERN.test(chunkErrorMessage(reason))) return;
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    if (Date.now() - last < 30000) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    return;
  }
  window.location.reload();
}

window.addEventListener('vite:preloadError', (event) => {
  recoverFromChunkError((event as Event & { payload?: unknown }).payload ?? 'Failed to fetch dynamically imported module');
});
window.addEventListener('error', (event) => {
  recoverFromChunkError(event.error ?? event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  recoverFromChunkError(event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);