import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import artwork from './data/artwork.json';

const localize = createMiddleware(routing);
const artworkIds = new Set(artwork.map(item => String(item.id)));

export default function middleware(request: NextRequest) {
  const response = localize(request);
  const match = request.nextUrl.pathname.match(/^\/(?:en\/|pl\/|es\/)?work\/([^/]+)\/?$/);
  // notFound() renders the right page, but a streamed App Router response can
  // already have status 200. Set the status before the locale rewrite streams.
  if (match && !artworkIds.has(match[1]) && !response.headers.has('location')) {
    return new NextResponse(response.body, { status: 404, headers: response.headers });
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/shop/:path*', '/(en|pl|es)/shop/:path*', '/work/:path*', '/(en|pl|es)/work/:path*'],
};
