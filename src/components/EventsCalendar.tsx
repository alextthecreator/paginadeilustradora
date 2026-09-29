'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/i18n/LanguageContext';
import type { CalendarEvent } from '@/lib/calendar-types';
import { eventDayKeys, toDateKeyFromParts } from '@/lib/calendar-types';
import LoadingSpinner from './LoadingSpinner';

type CalendarResponse = {
  configured: boolean;
  events: CalendarEvent[];
  error?: string;
  status?: number;
};

type CalendarCell = {
  date: Date;
  key: string;
  inMonth: boolean;
};

type EventPreviewState = {
  event: CalendarEvent;
  top: number;
  left: number;
  placeAbove: boolean;
  width: number;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthName(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date).toUpperCase();
}

function weekdayLabels(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2024, 0, 1 + index)); // Monday-first
    return formatter.format(day).toUpperCase();
  });
}

function formatEventWhen(event: CalendarEvent, locale: string, allDayLabel: string) {
  if (event.allDay) return allDayLabel;
  const start = new Date(event.start);
  const end = new Date(event.end);
  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const same =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  if (same) {
    return `${start.toLocaleTimeString(locale, timeOpts)} – ${end.toLocaleTimeString(locale, timeOpts)}`;
  }
  const dateOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };
  return `${start.toLocaleString(locale, dateOpts)} – ${end.toLocaleString(locale, dateOpts)}`;
}

function previewPosition(el: HTMLElement): Omit<EventPreviewState, 'event'> {
  const rect = el.getBoundingClientRect();
  const width = Math.min(300, window.innerWidth - 24);
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
  const placeAbove = rect.top > Math.min(220, window.innerHeight * 0.35);
  const top = placeAbove ? rect.top - 10 : rect.bottom + 10;
  return { top, left, placeAbove, width };
}

export default function EventsCalendar() {
  const { locale, t } = useLanguage();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [configured, setConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorKind, setErrorKind] = useState<string | null>(null);
  const [preview, setPreview] = useState<EventPreviewState | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);
      setErrorKind(null);
      try {
        const response = await fetch('/api/calendar');
        const data = (await response.json()) as CalendarResponse;
        if (cancelled) return;
        setConfigured(Boolean(data.configured));
        setEvents(Array.isArray(data.events) ? data.events : []);
        const failed = Boolean(data.error) || !response.ok;
        setHasError(failed);
        setErrorKind(failed ? data.error || 'unknown' : null);
      } catch {
        if (!cancelled) {
          setHasError(true);
          setErrorKind('fetch_failed');
          setEvents([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!preview) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null);
    };
    const onScroll = () => setPreview(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [preview]);

  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const weekdayLongest = useMemo(
    () => Math.max(...weekdays.map((label) => label.length), 1),
    [weekdays]
  );
  const monthName = useMemo(() => formatMonthName(month, locale), [month, locale]);

  const monthCells = useMemo(() => {
    const first = startOfMonth(month);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: CalendarCell[] = [];

    for (let i = startOffset - 1; i >= 0; i -= 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), -i);
      cells.push({
        date,
        key: toDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate()),
        inMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      cells.push({
        date,
        key: toDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate()),
        inMonth: true,
      });
    }

    let nextDay = 1;
    while (cells.length % 7 !== 0) {
      const date = new Date(month.getFullYear(), month.getMonth() + 1, nextDay);
      cells.push({
        date,
        key: toDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate()),
        inMonth: false,
      });
      nextDay += 1;
    }

    return cells;
  }, [month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      for (const key of eventDayKeys(event)) {
        const list = map.get(key) || [];
        list.push(event);
        map.set(key, list);
      }
    }
    return map;
  }, [events]);

  const selectedKey = selected
    ? toDateKeyFromParts(selected.getFullYear(), selected.getMonth() + 1, selected.getDate())
    : null;
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) || [] : [];
  const today = new Date();

  const clearHoverClose = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const openPreview = (event: CalendarEvent, el: HTMLElement) => {
    clearHoverClose();
    setPreview({ event, ...previewPosition(el) });
  };

  const scheduleClosePreview = () => {
    clearHoverClose();
    hoverCloseTimer.current = setTimeout(() => setPreview(null), 120);
  };

  return (
    <section className="events-calendar">
      <motion.header
        className="events-calendar-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="events-calendar-hero-row">
          <button
            type="button"
            className="events-calendar-nav-btn"
            onClick={() => {
              setMonth((current) => addMonths(current, -1));
              setSelected(null);
              setPreview(null);
            }}
            aria-label={t.calendar.prevMonth}
          >
            <FaChevronLeft />
          </button>

          <div className="events-calendar-hero-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${month.getFullYear()}-${month.getMonth()}-label`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <h1
                  className="events-calendar-month-title"
                  style={{ ['--month-chars' as string]: monthName.length }}
                >
                  <span className="events-calendar-month-name">{monthName}</span>
                  <span className="events-calendar-month-year">{month.getFullYear()}</span>
                </h1>
                <p className="events-calendar-kicker">{t.calendar.title}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="events-calendar-nav-btn"
            onClick={() => {
              setMonth((current) => addMonths(current, 1));
              setSelected(null);
              setPreview(null);
            }}
            aria-label={t.calendar.nextMonth}
          >
            <FaChevronRight />
          </button>
        </div>
      </motion.header>

      {isLoading ? (
        <LoadingSpinner size="lg" text={t.calendar.loading} className="py-16" />
      ) : !configured ? (
        <p className="events-calendar-status">{t.calendar.notConfigured}</p>
      ) : hasError ? (
        <p className="events-calendar-status">
          {errorKind === 'not_public' ? t.calendar.notPublic : t.calendar.error}
        </p>
      ) : (
        <div
          className="events-calendar-board"
          style={{ ['--weekday-longest' as string]: weekdayLongest }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${month.getFullYear()}-${month.getMonth()}-grid`}
              className="events-calendar-month-flow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="events-calendar-weekdays" aria-hidden="true">
                {weekdays.map((label) => (
                  <div key={label} className="events-calendar-weekday">
                    <span className="events-calendar-weekday-full">{label}</span>
                    <span className="events-calendar-weekday-short">{label.slice(0, 3)}</span>
                  </div>
                ))}
              </div>

              <div
                className="events-calendar-grid"
                role="grid"
                aria-label={`${monthName} ${month.getFullYear()}`}
              >
                {monthCells.map((cell) => {
                  const dayEvents = eventsByDay.get(cell.key) || [];
                  const isSelected = selected ? sameDay(cell.date, selected) : false;
                  const isToday = sameDay(cell.date, today);
                  const visibleEvents = dayEvents.slice(0, 2);
                  const overflow = dayEvents.length - visibleEvents.length;

                  return (
                    <div
                      key={cell.key}
                      role="gridcell"
                      tabIndex={0}
                      className={[
                        'events-calendar-cell',
                        cell.inMonth ? 'is-current-month' : 'is-outside-month',
                        isSelected ? 'is-selected' : '',
                        isToday ? 'is-today' : '',
                        dayEvents.length ? 'has-events' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        setSelected(cell.date);
                        setPreview(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(cell.date);
                          setPreview(null);
                        }
                      }}
                      aria-label={`${cell.date.toLocaleDateString(locale)}${
                        dayEvents.length ? `, ${dayEvents.length} events` : ''
                      }`}
                    >
                      <span className="events-calendar-day-number">{cell.date.getDate()}</span>
                      <div className="events-calendar-cell-events">
                        {visibleEvents.map((event) => (
                          <span
                            key={`${cell.key}-${event.id}`}
                            className="events-calendar-event-chip"
                            onMouseEnter={(e) => openPreview(event, e.currentTarget)}
                            onMouseLeave={scheduleClosePreview}
                            onFocus={(e) => openPreview(event, e.currentTarget)}
                            onBlur={scheduleClosePreview}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(cell.date);
                              if (preview?.event.id === event.id) {
                                setPreview(null);
                              } else {
                                openPreview(event, e.currentTarget);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                openPreview(event, e.currentTarget);
                                setSelected(cell.date);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-haspopup="dialog"
                            aria-expanded={preview?.event.id === event.id}
                          >
                            {event.title}
                          </span>
                        ))}
                        {overflow > 0 ? (
                          <span className="events-calendar-event-more">
                            {t.calendar.moreEvents.replace('{count}', String(overflow))}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selectedKey || 'detail'}
                className="events-calendar-detail"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <p className="events-calendar-detail-date">
                  {selected.toLocaleDateString(locale, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                {selectedEvents.length === 0 ? (
                  <p className="events-calendar-empty">{t.calendar.noEventsDay}</p>
                ) : (
                  <ul className="events-calendar-detail-list">
                    {selectedEvents.map((event) => (
                      <li key={event.id} className="events-calendar-detail-item">
                        <h3>{event.title}</h3>
                        <p className="events-calendar-detail-meta">
                          {formatEventWhen(event, locale, t.calendar.allDay)}
                        </p>
                        {event.location ? (
                          <p>
                            {t.calendar.location}: {event.location}
                          </p>
                        ) : null}
                        {event.description ? <p>{event.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      {portalReady
        ? createPortal(
            <AnimatePresence>
              {preview ? (
                <>
                  <button
                    type="button"
                    className="events-calendar-preview-scrim"
                    aria-label="Close"
                    onClick={() => setPreview(null)}
                  />
                  <motion.div
                    key={preview.event.id}
                    className={[
                      'events-calendar-preview',
                      preview.placeAbove ? 'is-above' : 'is-below',
                    ].join(' ')}
                    style={{
                      left: preview.left,
                      width: preview.width,
                      ...(preview.placeAbove
                        ? { bottom: `calc(100dvh - ${preview.top}px)` }
                        : { top: preview.top }),
                    }}
                    initial={{
                      opacity: 0,
                      y: preview.placeAbove ? 10 : -10,
                      scale: 0.96,
                    }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: preview.placeAbove ? 8 : -8,
                      scale: 0.97,
                    }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    role="dialog"
                    aria-label={preview.event.title}
                    onMouseEnter={clearHoverClose}
                    onMouseLeave={scheduleClosePreview}
                  >
                    <p className="events-calendar-preview-title">{preview.event.title}</p>
                    <p className="events-calendar-preview-meta">
                      {formatEventWhen(preview.event, locale, t.calendar.allDay)}
                    </p>
                    {preview.event.location ? (
                      <p className="events-calendar-preview-location">
                        {t.calendar.location}: {preview.event.location}
                      </p>
                    ) : null}
                    {preview.event.description ? (
                      <p className="events-calendar-preview-body">{preview.event.description}</p>
                    ) : null}
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </section>
  );
}
