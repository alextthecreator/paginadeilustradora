import ical, { type VEvent } from 'node-ical';
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

function isAllDay(event: VEvent): boolean {
  const start = event.start as Date & { dateOnly?: boolean };
  return Boolean(start?.dateOnly) || event.datetype === 'date';
}

function toIso(value: Date | undefined): string {
  if (!value) return '';
  return value.toISOString();
}

function mapEvents(data: ReturnType<typeof ical.sync.parseICS>): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const item of Object.values(data)) {
    if (!item || item.type !== 'VEVENT') continue;
    const event = item as VEvent;
    if (!event.start) continue;

    events.push({
      id: String(event.uid || `${event.start.toISOString()}-${event.summary || 'event'}`),
      title: String(event.summary || 'Event'),
      description: String(event.description || '')
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .trim(),
      location: String(event.location || '')
        .replace(/\\,/g, ',')
        .trim(),
      start: toIso(event.start),
      end: toIso(event.end || event.start),
      allDay: isAllDay(event),
    });
  }

  events.sort((a, b) => a.start.localeCompare(b.start));
  return events;
}

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
    const data = ical.sync.parseICS(text);
    return { configured: true, events: mapEvents(data) };
  } catch (error) {
    console.error('Calendar ICS parse error:', error);
    return { configured: true, events: [], error: 'invalid_feed' };
  }
}
