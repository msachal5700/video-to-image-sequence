import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X, Lightbulb, Bug, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** Open the feedback dialog from anywhere (e.g. the download-complete area). */
export const openFeedbackWidget = () => {
  window.dispatchEvent(new CustomEvent('open-feedback'));
};

type FeedbackType = 'feature' | 'bug';

const FEEDBACK_ENDPOINT = 'https://formsubmit.co/ajax/sachalmahar5700@gmail.com';

const FeedbackWidget: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [ftype, setFtype] = useState<FeedbackType>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStatus('idle');
    };
    window.addEventListener('open-feedback', handler);
    return () => window.removeEventListener('open-feedback', handler);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[Site feedback] ${ftype === 'bug' ? 'Problem report' : 'Feature idea'} — videotoimagesequence.online`,
          _honey: '',
          _captcha: 'false',
          type: ftype,
          message: message.trim(),
          email: email.trim() || '(not provided)',
          page: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('sent');
      setMessage('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(v => !v);
          setStatus('idle');
        }}
        aria-label={t('feedback.button')}
        title={t('feedback.button')}
        className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-sm px-4 py-3 rounded-full shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span className="hidden sm:inline">{t('feedback.button')}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-[95] w-[calc(100vw-3rem)] max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 font-sans">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-bold font-display">{t('feedback.title')}</h3>
              <p className="text-gray-400 text-xs mt-1">{t('feedback.subtitle')}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('feedback.close')}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'sent' ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-white font-semibold">{t('feedback.thanks')}</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition-colors"
              >
                {t('feedback.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFtype('feature')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    ftype === 'feature'
                      ? 'bg-cyan-500 text-gray-950'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {t('feedback.feature')}
                </button>
                <button
                  type="button"
                  onClick={() => setFtype('bug')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    ftype === 'bug'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Bug className="w-4 h-4" />
                  {t('feedback.bug')}
                </button>
              </div>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
                placeholder={t(ftype === 'bug' ? 'feedback.placeholderBug' : 'feedback.placeholderFeature')}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
              />

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('feedback.emailPlaceholder')}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />

              {status === 'error' && (
                <p className="flex items-start gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {t('feedback.error')}{' '}
                  <a href="mailto:sachalmahar5700@gmail.com" className="underline">
                    sachalmahar5700@gmail.com
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !message.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 rounded-xl font-bold text-sm transition-all"
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? t('feedback.sending') : t('feedback.send')}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
