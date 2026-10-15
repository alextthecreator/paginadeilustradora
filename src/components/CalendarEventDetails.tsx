'use client';

import { Fragment } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { CalendarEvent } from '@/lib/calendar-types';
import { calendarIcs, formatEventWhen, googleCalendarUrl, isPastEvent, safeCalendarUrl, trimCalendarUrl } from '@/lib/calendar-event-utils';
import ShopSafeLink from './ShopSafeLink';

export function EventDescription({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /https?:\/\/[^\s<>"']+/gi;
  let cursor = 0;
  for (const match of Array.from(text.matchAll(pattern))) {
    const index = match.index!;
    const value = trimCalendarUrl(match[0]);
    const url = safeCalendarUrl(value);
    parts.push(text.slice(cursor, index));
    parts.push(url ? <a key={index} href={url} target="_blank" rel="noopener noreferrer">{value}</a> : value);
    parts.push(match[0].slice(value.length));
    cursor = index + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
}

function downloadEvent(event: CalendarEvent) {
  const url = URL.createObjectURL(new Blob([calendarIcs(event)], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.normalize('NFKD').replace(/[^a-z0-9]+/gi, '-').slice(0, 80) || 'event'}.ics`;
  document.body.appendChild(link);
  link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function CalendarEventDetails({ event }: { event: CalendarEvent }) {
  const { locale, t } = useLanguage();
  const bookingUrl = safeCalendarUrl(event.bookingUrl || '');
  const website = safeCalendarUrl(event.url || '');
  return <>
    <h3>{event.title}</h3>
    {isPastEvent(event) && <p className="events-calendar-past-label">{t.calendar.pastEvent}</p>}
    <p className="events-calendar-detail-meta">{formatEventWhen(event, locale, t.calendar.allDay)}</p>
    <p className="events-calendar-timezone">{t.calendar.timezone}</p>
    {event.location && <p><strong>{t.calendar.location}:</strong> {event.location}</p>}
    {event.price && <p><strong>{t.calendar.price}:</strong> {event.price}</p>}
    {event.description && <p><EventDescription text={event.description} /></p>}
    {!event.description && !event.location && !event.price && !bookingUrl && <p>{t.calendar.detailsMissing} <ShopSafeLink href="/contact">{t.calendar.askDetails}</ShopSafeLink></p>}
    {(bookingUrl || website) && <p className="events-calendar-booking">
      {bookingUrl && <a href={bookingUrl} target="_blank" rel="noopener noreferrer">{t.calendar.book}</a>}
      {website && website !== bookingUrl && <a href={website} target="_blank" rel="noopener noreferrer">{t.calendar.eventWebsite}</a>}
    </p>}
    <div className="events-calendar-save" role="group" aria-label={`${t.calendar.saveEvent}: ${event.title}`}>
      <span>{t.calendar.saveEvent}</span>
      <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
      <button type="button" onClick={() => downloadEvent(event)}>{t.calendar.downloadIcs}</button>
    </div>
  </>;
}
