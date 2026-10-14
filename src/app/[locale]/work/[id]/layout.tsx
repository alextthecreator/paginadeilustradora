import artwork from '@/data/artwork.json';
import { generatePageMetadata } from '@/lib/seo-config';
import { languageAlternates, localizeHref } from '@/i18n/paths';
import { seoConfig } from '@/lib/seo-config';
import type { Locale } from '@/i18n';

export function generateMetadata({ params }: { params: { locale: Locale; id: string } }) {
  const base = generatePageMetadata('work', params.locale);
  const path = `/work/${params.id}`;
  const url = `${seoConfig.site.url}${localizeHref(path, params.locale)}`;
  const item = artwork.find(item => String(item.id) === params.id);
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
