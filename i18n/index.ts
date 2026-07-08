import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English',    nativeName: 'English',    flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French',     nativeName: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português',  flag: '🇧🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',        flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',      flag: '🇮🇳', dir: 'ltr' },
] as const;

export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, es: { translation: es }, fr: { translation: fr },
                 de: { translation: de }, pt: { translation: pt }, zh: { translation: zh },
                 ar: { translation: ar }, hi: { translation: hi } },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nLang',
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export default i18n;
