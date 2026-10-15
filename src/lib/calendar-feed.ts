import ical, { type VEvent } from 'node-ical';
import { Parser } from 'htmlparser2';
import type { CalendarEvent } from './calendar-types';
import { safeCalendarUrl, trimCalendarUrl } from './calendar-event-utils';

function textValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'val' in value) return String(value.val || '');
  return '';
}

function dateOnlyIso(date: Date) {
  // node-ical represents DATE values at midnight in the server's local zone.
  // Preserve the calendar date rather than shifting it through UTC.
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

/** Google descriptions may contain HTML. Convert it to text; never render it. */
export function descriptionText(value: string) {
  let text = '', ignored = 0;
  const anchors: { href?: string; start: number }[] = [];
  const blocks = new Set(['p', 'div', 'li', 'br']);
  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === 'script' || name === 'style') ignored++;
      if (ignored) return;
      if (blocks.has(name)) text += '\n';
      if (name === 'a') anchors.push({ href: safeCalendarUrl(attrs.href || ''), start: text.length });
    },
    ontext(value) { if (!ignored) text += value; },
    onclosetag(name) {
      if (name === 'script' || name === 'style') { ignored = Math.max(0, ignored - 1); return; }
      if (ignored) return;
      if (name === 'a') {
        const anchor = anchors.pop();
        if (anchor?.href && text.slice(anchor.start).trim() !== anchor.href) text += ` (${anchor.href})`;
      }
      if (blocks.has(name)) text += '\n';
    },
  }, { decodeEntities: true });
  parser.write(value); parser.end();
  return text.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function parseCalendarFeed(source: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const item of Object.values(ical.sync.parseICS(source))) {
    if (!item || item.type !== 'VEVENT') continue;
    const event = item as VEvent;
    if (!event.start || event.status === 'CANCELLED') continue;
    const allDay = Boolean((event.start as Date & { dateOnly?: boolean }).dateOnly) || event.datetype === 'date';
    const rawDescription = descriptionText(textValue(event.description));
    let price: string | undefined, bookingUrl: string | undefined;
    const description = rawDescription.split('\n').filter(line => {
      const cost = line.match(/^\s*(?:[-*]\s*)?(?:price|cost|cena|koszt|precio|costo)\s*:\s*(.+)$/i);
      if (cost && !price) { price = cost[1].trim(); return false; }
      if (/^\s*(?:sign[- ]?up|book(?:ing)?|tickets|zapisy|rezerwacja|inscripci[oó]n|inscripciones|reservar|entradas)\b/i.test(line)) {
        const match = line.match(/https?:\/\/[^\s<>"']+/i);
        const url = match && safeCalendarUrl(trimCalendarUrl(match[0]));
        if (url && !bookingUrl) { bookingUrl = url; return false; }
      }
      return true;
    }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
    const start = allDay ? dateOnlyIso(event.start) : event.start.toISOString();
    const end = event.end ? (allDay ? dateOnlyIso(event.end) : event.end.toISOString()) : (allDay ? new Date(new Date(start).getTime() + 86400000).toISOString() : start);
    events.push({ id: textValue(event.uid) || `${start}-${textValue(event.summary)}`, title: textValue(event.summary) || 'Event', description,
      location: textValue(event.location).trim(), start, end, allDay, price, bookingUrl, url: safeCalendarUrl(textValue(event.url)) });
  }
  return events.sort((a, b) => a.start.localeCompare(b.start));
}
