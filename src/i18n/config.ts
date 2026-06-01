import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

export const SUPPORTED_LANGUAGES = ['en', 'zh-CN'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function initI18n(language: Language = 'en') {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        'zh-CN': { translation: zhCN },
      },
      lng: language,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  }
  return i18n;
}

export default i18n;
