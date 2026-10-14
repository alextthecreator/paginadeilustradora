import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export function generateMetadata({ params }: { params: { locale: 'en' | 'pl' | 'es' } }): Metadata {
  return generatePageMetadata('calendar', params.locale);
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
