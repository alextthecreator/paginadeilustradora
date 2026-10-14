'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  defaultLocale,
  Locale,
  translations,
  TranslationKey,
} from './index';
import { localizeHref } from './paths';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKey;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children, initialLocale = defaultLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const locale = initialLocale;
  const setLocale = useCallback((nextLocale: Locale) => {
    // Document navigation protects Next metadata from Ecwid mutations too.
    window.location.assign(localizeHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, nextLocale));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
