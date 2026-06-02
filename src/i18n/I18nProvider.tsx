import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n, SUPPORTED_LANGUAGES, type Language } from './config';
import { getItem, setItem } from '@/storage/storage';

const LANG_KEY = 'lang';

function detectDefault(): Language {
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return nav.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

// Initialize the singleton eagerly so children can translate on first render.
initI18n(detectDefault());

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => (i18n.language as Language) || 'en');

  useEffect(() => {
    void (async () => {
      const stored = await getItem<Language | null>(LANG_KEY, null);
      const next = stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : detectDefault();
      await i18n.changeLanguage(next);
      setLanguageState(next);
    })();
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    void i18n.changeLanguage(next);
    void setItem(LANG_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within I18nProvider');
  return ctx;
}
