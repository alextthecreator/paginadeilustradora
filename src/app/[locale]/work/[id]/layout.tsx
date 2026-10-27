import artwork from '@/data/artwork.json';
import { generatePageMetadata } from '@/lib/seo-config';
import { languageAlternates, localizeHref } from '@/i18n/paths';
import { seoConfig } from '@/lib/seo-config';
import type { Locale } from '@/i18n';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const base = generatePageMetadata('work', locale);
  const path = `/work/${id}`;
  const url = `${seoConfig.site.url}${localizeHref(path, locale)}`;
  const item = artwork.find(item => String(item.id) === id);
  if (!item) notFound();
  return {
    ...base,
    title: item ? { absolute: `${item.title} — ${base.title.absolute}` } : base.title,
    alternates: { canonical: url, languages: languageAlternates(path, seoConfig.site.url) },
    openGraph: { ...base.openGraph, url, ...(item ? { title: item.title, images: [{ url: item.image, alt: item.alt }] } : {}) },
  };
}

export default function ArtworkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
