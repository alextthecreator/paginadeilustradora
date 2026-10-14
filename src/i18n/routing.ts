import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pl', 'es'], defaultLocale: 'en', localePrefix: 'as-needed',
  // A shared URL determines the language, regardless of browser/storage.
  localeDetection: false, localeCookie: false,
});
