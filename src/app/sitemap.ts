import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo-config';
import { languageAlternates, localizeHref } from '@/i18n/paths';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = seoConfig.site.url;
  return ['/', '/about', '/work', '/shop', '/calendar', '/contact'].flatMap(path =>
    locales.map(locale => ({
      url: `${origin}${localizeHref(path, locale)}`,
      lastModified: new Date(),
      changeFrequency: path === '/shop' || path === '/work' || path === '/calendar' ? 'weekly' as const : 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages: languageAlternates(path, origin) },
    }))
  );
}
