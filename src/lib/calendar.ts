import { parseCalendarFeed } from './calendar-feed';
import { getCalendarIcsUrl } from '@/lib/site-config';
import type { CalendarEvent } from '@/lib/calendar-types';

export type { CalendarEvent } from '@/lib/calendar-types';
export { toDateKey } from '@/lib/calendar-types';

export type CalendarFetchResult = {
  configured: boolean;
  events: CalendarEvent[];
  error?: 'fetch_failed' | 'not_public' | 'invalid_feed' | 'unknown';
  status?: number;
};

export async function fetchCalendarEvents(): Promise<CalendarFetchResult> {
  const icsUrl = getCalendarIcsUrl();
  if (!icsUrl) {
    return { configured: false, events: [] };
  }

  let response: Response;
  try {
    response = await fetch(icsUrl, {
      headers: {
        'User-Agent': 'ToskaCR-Calendar/1.0 (portfolio; +https://toska-artproject.com)',
        Accept: 'text/calendar, text/plain, */*',
      },
      redirect: 'follow',
      next: { revalidate: 300 },
    });
  } catch (error) {
    console.error('Calendar ICS network error:', error);
    return { configured: true, events: [], error: 'fetch_failed' };
  }

  if (response.status === 404 || response.status === 403) {
    console.error('Calendar ICS not accessible:', response.status, icsUrl);
    return {
      configured: true,
      events: [],
      error: 'not_public',
      status: response.status,
    };
  }

  if (!response.ok) {
    console.error('Calendar ICS HTTP error:', response.status);
    return {
      configured: true,
      events: [],
      error: 'fetch_failed',
      status: response.status,
    };
  }

  const text = await response.text();
  if (!text.includes('BEGIN:VCALENDAR')) {
    console.error('Calendar ICS invalid feed body');
    return {
      configured: true,
      events: [],
      error: 'invalid_feed',
      status: response.status,
    };
  }

  try {
    return { configured: true, events: parseCalendarFeed(text) };
  } catch (error) {
    console.error('Calendar ICS parse error:', error);
    return { configured: true, events: [], error: 'invalid_feed' };
  }
}
