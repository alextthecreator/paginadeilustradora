export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
};

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
  return toDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
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

  let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  if (last < cursor) {
    return [toDateKey(event.start, false)];
  }
  while (cursor <= last) {
    keys.push(
      toDateKeyFromParts(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate())
    );
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}
