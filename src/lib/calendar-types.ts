export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  price?: string;
  bookingUrl?: string;
  url?: string;
};

export const CALENDAR_TIME_ZONE = 'Europe/Warsaw';

export function toDateKeyFromParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function toDateKey(iso: string, allDay = false): string {
  const date = new Date(iso);
  if (allDay) {
    return toDateKeyFromParts(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate()
    );
  }
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: CALENDAR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return `${parts.find(p => p.type === 'year')!.value}-${parts.find(p => p.type === 'month')!.value}-${parts.find(p => p.type === 'day')!.value}`;
}

/** Inclusive local/UTC day keys covered by an event (ICS all-day end is exclusive). */
export function eventDayKeys(event: CalendarEvent): string[] {
  const start = new Date(event.start);
  const end = new Date(event.end || event.start);
  const keys: string[] = [];

  if (event.allDay) {
    let cursor = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    // Exclusive end for all-day; if same/invalid, keep one day
    let endExclusive = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
    if (endExclusive <= cursor) {
      endExclusive = cursor + 24 * 60 * 60 * 1000;
    }
    while (cursor < endExclusive) {
      const d = new Date(cursor);
      keys.push(
        toDateKeyFromParts(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
      );
      cursor += 24 * 60 * 60 * 1000;
    }
    return keys;
  }

  let cursor = new Date(`${toDateKey(event.start)}T00:00:00Z`);
  const last = new Date(`${toDateKey(new Date(Math.max(start.getTime(), end.getTime() - 1)).toISOString())}T00:00:00Z`);
  if (last < cursor) {
    return [toDateKey(event.start, false)];
  }
  while (cursor <= last) {
    keys.push(
      toDateKeyFromParts(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, cursor.getUTCDate())
    );
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return keys;
}
