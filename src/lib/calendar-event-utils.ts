import type { CalendarEvent } from './calendar-types';
import { CALENDAR_TIME_ZONE, toDateKey } from './calendar-types';

export function safeCalendarUrl(value: string): string | undefined {
  try {
    if (/[\r\n]/.test(value)) return undefined;
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch { return undefined; }
}

export function trimCalendarUrl(value: string) {
  let url = value.replace(/[.,;!?]+$/, '');
  while (url.endsWith(')') && (url.match(/\)/g) || []).length > (url.match(/\(/g) || []).length) url = url.slice(0, -1);
  return url;
}

export function calendarToday(now = new Date()) {
  const [year, month, day] = toDateKey(now.toISOString()).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isPastEvent(event: CalendarEvent, now = new Date()) {
  if (event.allDay) return toDateKey(event.end, true) <= toDateKey(now.toISOString());
  return new Date(event.end || event.start).getTime() <= now.getTime();
}

export function formatEventWhen(event: CalendarEvent, locale: string, allDayLabel: string) {
  if (event.allDay) return allDayLabel;
  const sameDay = toDateKey(event.start) === toDateKey(event.end);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: CALENDAR_TIME_ZONE, hourCycle: 'h23', hour: '2-digit', minute: '2-digit',
    ...(sameDay ? {} : { day: 'numeric', month: 'short' }),
  };
  const format = new Intl.DateTimeFormat(locale, options);
  return `${format.format(new Date(event.start))} – ${format.format(new Date(event.end))}`;
}

export function eventNotes(event: CalendarEvent) {
  return [event.description, event.price ? `Price: ${event.price}` : '', event.bookingUrl ? `Booking: ${event.bookingUrl}` : '', event.url && event.url !== event.bookingUrl ? event.url : ''].filter(Boolean).join('\n\n');
}

function calendarDates(event: CalendarEvent) {
  if (!event.allDay) return [event.start, event.end].map(value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''));
  const start = toDateKey(event.start, true).replace(/-/g, '');
  let end = toDateKey(event.end, true).replace(/-/g, '');
  if (end <= start) end = new Date(new Date(event.start).getTime() + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
  return [start, end];
}

export function googleCalendarUrl(event: CalendarEvent) {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.search = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: calendarDates(event).join('/'), details: eventNotes(event), location: event.location, ctz: CALENDAR_TIME_ZONE }).toString();
  return url.href;
}

function escapeText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

/** RFC 5545: fold at 75 UTF-8 octets without splitting a Unicode character. */
function foldLine(value: string) {
  const encoder = new TextEncoder();
  let line = '', length = 0;
  const lines: string[] = [];
  for (const character of Array.from(value)) {
    const size = encoder.encode(character).length;
    if (length + size > 75) { lines.push(line); line = ' '; length = 1; }
    line += character; length += size;
  }
  lines.push(line);
  return lines.join('\r\n');
}

export function calendarIcs(event: CalendarEvent, now = new Date()) {
  const [start, end] = calendarDates(event);
  const kind = event.allDay ? ';VALUE=DATE' : '';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Toska Art Project//Events//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${escapeText(event.id)}`, `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART${kind}:${start}`,
    ...(event.allDay || end > start ? [`DTEND${kind}:${end}`] : []),
    `SUMMARY:${escapeText(event.title)}`, `DESCRIPTION:${escapeText(eventNotes(event))}`, `LOCATION:${escapeText(event.location)}`,
    ...(safeCalendarUrl(event.bookingUrl || event.url || '') ? [`URL:${safeCalendarUrl(event.bookingUrl || event.url || '')}`] : []),
    'END:VEVENT', 'END:VCALENDAR'];
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}
