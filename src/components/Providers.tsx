'use client';

import CookieConsentManager from './CookieConsentManager';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Locale } from '@/i18n';

export default function Providers({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return <LanguageProvider initialLocale={locale}><CookieConsentManager />{children}</LanguageProvider>;
}
