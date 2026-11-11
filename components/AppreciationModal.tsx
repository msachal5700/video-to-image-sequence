import React, { useEffect, useState } from 'react';
import { X, Heart, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APPRECIATION_PAYMENT_URL, APPRECIATION_AMOUNTS } from '../utils/appreciation';

interface AppreciationModalProps {
  /** Dismiss without taking any action (× button, backdrop click, Escape). */
  onClose: () => void;
  /** Trigger the ZIP download and close the popup. */
  onDownloadFree: () => void;
}

type AmountChoice = number | 'custom';

/**
 * Shown once per session when an extraction finishes and the ZIP is ready.
 * The visitor can open the appreciation payment page, or just download —
 * the download is always one click away and never blocked by this popup.
 */
const AppreciationModal: React.FC<AppreciationModalProps> = ({ onClose, onDownloadFree }) => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<AmountChoice>(5);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleAppreciate = () => {
    // The payment page handles the amount itself (including Custom), so the
    // selected chip does not change the URL. Open in a new tab and keep this
    // popup up, so the download is still right here when the visitor returns.
    window.open(APPRECIATION_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  };

  const chipClass = (active: boolean) =>
    `py-3 rounded-xl font-bold text-sm transition-all border ${
      active
        ? 'bg-cyan-500 text-gray-950 border-cyan-500 shadow-lg shadow-cyan-500/20'
        : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-800 hover:text-white'
    }`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('appreciation.title')}
    >
      <div
        className="relative w-full max-w-md bg-gray-950 border border-cyan-800/80 rounded-3xl shadow-2xl shadow-black/60 p-6 sm:p-8 text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-colors"
          title={t('appreciation.close')}
          aria-label={t('appreciation.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-fit bg-cyan-950/80 p-3 rounded-full border border-cyan-800 shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-5">
          <Heart className="w-8 h-8 text-cyan-400" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
          {t('appreciation.title')}
        </h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          {t('appreciation.body')}
        </p>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {APPRECIATION_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={chipClass(selectedAmount === amount)}
              aria-pressed={selectedAmount === amount}
            >
              ${amount}
            </button>
          ))}
          <button
            onClick={() => setSelectedAmount('custom')}
            className={chipClass(selectedAmount === 'custom')}
            aria-pressed={selectedAmount === 'custom'}
          >
            {t('appreciation.custom')}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAppreciate}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
          >
            <Heart className="w-5 h-5" /> {t('appreciation.showAppreciation')}
          </button>
          <button
            onClick={onDownloadFree}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-base transition-all border border-gray-700 shadow-md"
          >
            <Download className="w-5 h-5" /> {t('appreciation.downloadFree')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppreciationModal;
