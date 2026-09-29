'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/i18n/LanguageContext';
import type { CalendarEvent } from '@/lib/calendar-types';
import { toDateKey } from '@/lib/calendar-types';
import LoadingSpinner from './LoadingSpinner';

type CalendarResponse = {
  configured: boolean;
  events: CalendarEvent[];
  error?: 'fetch_failed' | 'not_public' | 'invalid_feed' | 'unknown' | string;
  status?: number;
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

function formatMonthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

function weekdayLabels(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // Monday-first week
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2024, 0, 1 + index)); // Mon Jan 1 2024
    return formatter.format(day);
  });
}

function formatEventTime(event: CalendarEvent, locale: string, allDayLabel: string) {
  if (event.allDay) return allDayLabel;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.start));
}

function formatEventDate(iso: string, locale: string, allDay: boolean) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(allDay ? { timeZone: 'UTC' } : {}),
  }).format(date);
}

export default function EventsCalendar() {
  const { locale, t } = useLanguage();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [configured, setConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorKind, setErrorKind] = useState<string | null>(null);

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
        setErrorKind(failed ? (data.error || 'unknown') : null);
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

  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);

  const monthCells = useMemo(() => {
    const first = startOfMonth(month);
    const startOffset = (first.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: Array<Date | null> = [];

    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(month.getFullYear(), month.getMonth(), day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = toDateKey(event.start, event.allDay);
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const selectedLocalKey = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
  const selectedEvents = eventsByDay.get(selectedLocalKey) || [];

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const key = toDateKey(event.start, event.allDay);
      const [y, m] = key.split('-').map(Number);
      return y === month.getFullYear() && m === month.getMonth() + 1;
    });
  }, [events, month]);

  const today = new Date();

  return (
    <section className="events-calendar">
      <motion.header
        className="events-calendar-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="type-display font-temeraire-display uppercase text-[#FF8A9D]">
          {t.calendar.title}
        </h1>
        <p className="type-lead font-mencken-regular text-[#FBEAD5]">{t.calendar.subtitle}</p>
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
        <div className="events-calendar-layout">
          <motion.div
            className="events-calendar-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="events-calendar-toolbar">
              <button
                type="button"
                className="events-calendar-nav-btn"
                onClick={() => setMonth((current) => addMonths(current, -1))}
                aria-label={t.calendar.prevMonth}
              >
                <FaChevronLeft />
              </button>
              <h2 className="events-calendar-month-label">{formatMonthLabel(month, locale)}</h2>
              <button
                type="button"
                className="events-calendar-nav-btn"
                onClick={() => setMonth((current) => addMonths(current, 1))}
                aria-label={t.calendar.nextMonth}
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="events-calendar-weekdays">
              {weekdays.map((label) => (
                <div key={label} className="events-calendar-weekday">
                  {label}
                </div>
              ))}
            </div>

            <div className="events-calendar-grid">
              {monthCells.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="events-calendar-cell is-empty" />;
                }

                const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                const dayEvents = eventsByDay.get(key) || [];
                const isSelected = sameDay(day, selected);
                const isToday = sameDay(day, today);

                return (
                  <button
                    key={key}
                    type="button"
                    className={[
                      'events-calendar-cell',
                      isSelected ? 'is-selected' : '',
                      isToday ? 'is-today' : '',
                      dayEvents.length ? 'has-events' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelected(day)}
                  >
                    <span className="events-calendar-day-number">{day.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="events-calendar-dots" aria-hidden="true">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span key={event.id} className="events-calendar-dot" />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="events-calendar-today-btn"
              onClick={() => {
                const now = new Date();
                setMonth(startOfMonth(now));
                setSelected(now);
              }}
            >
              {t.calendar.today}
            </button>
          </motion.div>

          <motion.aside
            className="events-calendar-aside"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="events-calendar-aside-title">{t.calendar.upcoming}</h3>
            <p className="events-calendar-aside-date">
              {formatEventDate(selected.toISOString(), locale, false)}
            </p>

            {selectedEvents.length === 0 ? (
              <p className="events-calendar-empty">{t.calendar.noEventsDay}</p>
            ) : (
              <ul className="events-calendar-event-list">
                {selectedEvents.map((event) => (
                  <li key={event.id} className="events-calendar-event">
                    <p className="events-calendar-event-time">
                      {formatEventTime(event, locale, t.calendar.allDay)}
                    </p>
                    <h4 className="events-calendar-event-title">{event.title}</h4>
                    {event.location ? (
                      <p className="events-calendar-event-meta">
                        {t.calendar.location}: {event.location}
                      </p>
                    ) : null}
                    {event.description ? (
                      <p className="events-calendar-event-description">{event.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}

            {monthEvents.length === 0 && (
              <p className="events-calendar-empty events-calendar-empty-month">{t.calendar.noEvents}</p>
            )}
          </motion.aside>
        </div>
      )}
    </section>
  );
}
