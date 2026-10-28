const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');

test('explicit calendar refresh bypasses feed cache while normal loads keep it', async () => {
  const requests = [];
  const { fetchCalendarEvents } = load('src/lib/calendar.ts', {
    './calendar-feed': { parseCalendarFeed: () => [] },
    '@/lib/calendar-types': load('src/lib/calendar-types.ts'),
    '@/lib/site-config': { getCalendarIcsUrl: () => 'https://calendar.example.test/public.ics' },
  }, { fetch: async (url, options) => {
    requests.push(options);
    return { ok: true, status: 200, text: async () => 'BEGIN:VCALENDAR\nEND:VCALENDAR' };
  } });
  await fetchCalendarEvents();
  await fetchCalendarEvents({ fresh: true });
  assert.equal(requests[0].next.revalidate, 300);
  assert.equal(requests[1].cache, 'no-store');
  assert.equal(requests[1].next, undefined);
});

test('refresh response cannot be reused from shared HTTP cache', async () => {
  const calls = [];
  const { GET } = load('src/app/api/calendar/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/calendar': { fetchCalendarEvents: async options => {
      calls.push(options.fresh);
      return { configured: true, events: [] };
    } },
  }, { URL });
  const normal = await GET(new Request('https://example.test/api/calendar'));
  const fresh = await GET(new Request('https://example.test/api/calendar?refresh=1'));
  assert.deepEqual(calls, [false, true]);
  assert.match(normal.headers.get('cache-control'), /s-maxage=300/);
  assert.equal(fresh.headers.get('cache-control'), 'no-store');
});
