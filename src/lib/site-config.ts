import type { Locale } from '@/i18n';

export const siteConfig = {
  ecwidStoreId: '138778502',
  ecwidStoreElementId: 'my-store-138778502',
  shopPath: '/shop',
} as const;

/** Ecwid lang must match enabled languages in the Ecwid dashboard. */
export function getEcwidScriptUrl(locale: Locale) {
  return `https://app.ecwid.com/script.js?${siteConfig.ecwidStoreId}&data_platform=code&data_date=2026-07-08&lang=${locale}`;
}
