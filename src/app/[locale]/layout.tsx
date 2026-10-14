import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo-config';
import type { Locale } from '@/i18n';

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  if (!['en', 'pl', 'es'].includes(params.locale)) notFound();
  return generatePageMetadata('home', params.locale);
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!['en', 'pl', 'es'].includes(params.locale)) notFound();
  return children;
}
