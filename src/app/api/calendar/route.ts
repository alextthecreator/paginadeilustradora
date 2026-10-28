import { NextResponse } from 'next/server';
import { fetchCalendarEvents } from '@/lib/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.get('refresh') === '1';
  const result = await fetchCalendarEvents({ fresh });

  if (!result.configured) {
    return NextResponse.json(result);
  }

  if (result.error) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': fresh ? 'no-store' : 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
