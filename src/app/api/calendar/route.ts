import { NextResponse } from 'next/server';
import { fetchCalendarEvents } from '@/lib/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await fetchCalendarEvents();

  if (!result.configured) {
    return NextResponse.json(result);
  }

  if (result.error) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
