'use client';

import CookieConsentManager from './CookieConsentManager';
import { LanguageProvider } from '@/i18n/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider><CookieConsentManager />{children}</LanguageProvider>;
}
