import type { Locale } from '@/i18n';

export const siteConfig = {
  ecwidStoreId: '138778502',
  ecwidStoreElementId: 'my-store-138778502',
  shopPath: '/shop',
  calendarPath: '/calendar',
} as const;

/** Public Google Calendar ICS/iCal URL (Settings → Integrate calendar). */
export function getCalendarIcsUrl() {
  const raw = process.env.GOOGLE_CALENDAR_ICS_URL?.trim() || '';
  if (!raw) return '';

  try {
    const url = new URL(raw);
    // Allow paste of Google "embed" link and convert it to public ICS.
    if (url.hostname === 'calendar.google.com' && url.pathname.includes('/calendar/embed')) {
      const src = url.searchParams.get('src');
      if (src) {
        return `https://calendar.google.com/calendar/ical/${encodeURIComponent(src)}/public/basic.ics`;
      }
    }
  } catch {
    return raw;
  }

  return raw;
}

/** Ecwid lang must match enabled languages in the Ecwid dashboard. */
export function getEcwidScriptUrl(locale: Locale) {
  return `https://app.ecwid.com/script.js?${siteConfig.ecwidStoreId}&data_platform=code&data_date=2026-07-08&lang=${locale}`;
}
