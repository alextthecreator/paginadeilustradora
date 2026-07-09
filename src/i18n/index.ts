import en from './locales/en';
import es from './locales/es';
import pl from './locales/pl';

export type Locale = 'en' | 'es' | 'pl';

export const locales: Locale[] = ['en', 'es', 'pl'];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'ENG',
  es: 'ESP',
  pl: 'PL',
};

// Upload flag PNGs to Cloudinary: toska-cr/icons/flag_en.png, flag_es.png, flag_pl.png
// Or replace with your own Cloudinary URLs after upload
export const localeFlags: Record<Locale, string> = {
  en: 'https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614631/eng_u7caar.svg',
  es: 'https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614631/esp_ipgymy.svg',
  pl: 'https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614632/pl_zzjxlm.svg',
};

// Emoji fallback until flag images are uploaded to Cloudinary
export const localeFlagEmoji: Record<Locale, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  pl: '🇵🇱',
};

export const translations = { en, es, pl } as const;

export type TranslationKey = typeof en;
