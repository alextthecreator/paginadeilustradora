'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { initializeConsent, setConsentLanguage } from '@/lib/cookie-consent';

export default function CookieConsentManager() {
  const { locale } = useLanguage();
  useEffect(() => {
    let cancelled = false;
    initializeConsent(locale).then(() => {
      if (!cancelled) void setConsentLanguage(locale);
    }).catch((error) => console.error('Cookie preferences could not be loaded:', error));
    return () => { cancelled = true; };
  }, [locale]);
  return null;
}
