import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo-config';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!['en', 'pl', 'es'].includes(locale)) notFound();
  return generatePageMetadata('home', locale);
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  if (!['en', 'pl', 'es'].includes((await params).locale)) notFound();
  return children;
}
