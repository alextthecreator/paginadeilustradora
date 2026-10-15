const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ical = require('node-ical');
const load = require('./ts-fixture.cjs');
const types = load('src/lib/calendar-types.ts');
const utils = load('src/lib/calendar-event-utils.ts', { './calendar-types': types }, { URL, URLSearchParams, TextEncoder });
const feed = load('src/lib/calendar-feed.ts', { 'node-ical': { default: ical }, htmlparser2: require('htmlparser2'), './calendar-event-utils': utils });
const source = fs.readFileSync(`${__dirname}/fixtures/calendar-complete.ics`, 'utf8');
const events = feed.parseCalendarFeed(source);
const workshop = events.find(event => event.id === 'local-complete-workshop@toska.test');
const allDay = events.find(event => event.allDay);

test('fully populated ICS reaches the event model with description, location, price and booking URL', () => {
  assert.equal(events.length, 3);
  assert.equal(workshop.location, 'Lelewela 4, Wrocław, Polska');
  assert.equal(workshop.price, '150 zł');
  assert.equal(workshop.bookingUrl, 'https://example.com/book?event=ceramics&lang=pl');
  assert.equal(workshop.url, 'https://example.com/workshop');
  assert(workshop.description.includes('Paint a ceramic cup & learn glazing.'));
  assert(!workshop.description.includes('<p>'));
  assert(!workshop.description.includes('Cena:'));
});

test('HTML and unsafe links cannot become executable description content', () => {
  const text = feed.descriptionText('<p>Safe</p><script>alert(1)</script><a href="javascript:alert(2)">Link</a><a href="https://example.com/?a=1&amp;b=2">More</a>');
  assert(!text.includes('alert'));
  assert(!text.includes('javascript:'));
  assert(text.includes('https://example.com/?a=1&b=2'));
  assert.equal(utils.safeCalendarUrl('javascript:alert(1)'), undefined);
  assert.equal(utils.safeCalendarUrl('https://example.com/\r\nATTENDEE:bad'), undefined);
});

test('empty feed details stay empty and do not invent a price or booking link', () => {
  const event = events.find(event => event.id === 'local-past@toska.test');
  assert.equal(event.description, '');
  assert.equal(event.location, '');
  assert.equal(event.price, undefined);
  assert.equal(event.bookingUrl, undefined);
});

test('all languages show 24-hour Warsaw time', () => {
  for (const locale of ['en', 'pl', 'es']) {
    assert.equal(utils.formatEventWhen(workshop, locale, 'All day'), '16:00 – 19:30');
  }
});

test('Warsaw daylight saving time is respected', () => {
  const winter = { ...workshop, start: '2026-10-25T14:00:00Z', end: '2026-10-25T15:00:00Z' };
  assert.equal(utils.formatEventWhen(winter, 'pl', ''), '15:00 – 16:00');
});

test('Google template contains the exact UTC times and all booking information', () => {
  const url = new URL(utils.googleCalendarUrl(workshop));
  assert.equal(url.origin, 'https://calendar.google.com');
  assert.equal(url.searchParams.get('dates'), '20261017T140000Z/20261017T173000Z');
  assert.equal(url.searchParams.get('text'), workshop.title);
  assert.equal(url.searchParams.get('location'), workshop.location);
  assert(url.searchParams.get('details').includes('150 zł'));
  assert(url.searchParams.get('details').includes(workshop.bookingUrl));
});

test('ICS round-trip preserves title, UTC times, location, price and signup', () => {
  const result = Object.values(ical.sync.parseICS(utils.calendarIcs(workshop))).find(event => event.type === 'VEVENT');
  assert.equal(result.summary, workshop.title);
  assert.equal(result.start.toISOString(), workshop.start);
  assert.equal(result.end.toISOString(), workshop.end);
  assert.equal(result.location, workshop.location);
  assert(result.description.includes('150 zł'));
  assert(result.description.includes(workshop.bookingUrl));
});

test('all-day exports retain date-only values and their exclusive end', () => {
  const result = utils.calendarIcs(allDay);
  assert(result.includes('DTSTART;VALUE=DATE:20261018\r\n'));
  assert(result.includes('DTEND;VALUE=DATE:20261020\r\n'));
  assert.equal(new URL(utils.googleCalendarUrl(allDay)).searchParams.get('dates'), '20261018/20261020');
  assert.deepEqual(Array.from(types.eventDayKeys(allDay)), ['2026-10-18', '2026-10-19']);
});

test('ICS safely escapes special characters and folds UTF-8 lines within 75 bytes', () => {
  const title = 'Łódź, Wrocław; café 🌷 '.repeat(20);
  const value = utils.calendarIcs({ ...workshop, title, description: 'Line one\nLine two; commas, backslash \\' });
  for (const line of value.split('\r\n')) assert(Buffer.byteLength(line, 'utf8') <= 75);
  const parsed = Object.values(ical.sync.parseICS(value)).find(event => event.type === 'VEVENT');
  assert.equal(parsed.summary, title);
  assert(parsed.description.includes('Line one\nLine two; commas, backslash \\'));
});

test('past status uses event end and Warsaw dates for all-day events', () => {
  assert.equal(utils.isPastEvent(workshop, new Date('2026-10-17T16:00:00Z')), false);
  assert.equal(utils.isPastEvent(workshop, new Date('2026-10-17T17:30:00Z')), true);
  assert.equal(utils.isPastEvent(allDay, new Date('2026-10-19T12:00:00Z')), false);
  assert.equal(utils.isPastEvent(allDay, new Date('2026-10-19T22:00:00Z')), true);
});

test('events ending at midnight do not spill into the next day', () => {
  const event = { ...workshop, start: '2026-10-17T20:00:00Z', end: '2026-10-17T22:00:00Z' };
  assert.deepEqual(Array.from(types.eventDayKeys(event)), ['2026-10-17']);
});

test('cancelled events are excluded from the published feed', () => {
  assert.equal(feed.parseCalendarFeed(source.replace('SUMMARY:LOCAL TEST — Past market', 'STATUS:CANCELLED\nSUMMARY:LOCAL TEST — Past market')).length, 2);
});
