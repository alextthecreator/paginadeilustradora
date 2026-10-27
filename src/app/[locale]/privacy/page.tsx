import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { privacyCopy } from '@/i18n/privacy';
import { languageAlternates, localizeHref } from '@/i18n/paths';
import { seoConfig } from '@/lib/seo-config';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = privacyCopy[locale];
  return {
    title: { absolute: `${copy.title} — ${copy.status} | Toska Art Project` },
    description: copy.body, robots: { index: false, follow: true },
    alternates: { canonical: `${seoConfig.site.url}${localizeHref('/privacy', locale)}`, languages: languageAlternates('/privacy', seoConfig.site.url) },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const copy = privacyCopy[locale];
  return <section className="page-shell privacy-page">
    <div className="privacy-copy">
      <h1 className="type-display font-temeraire-display">{copy.title}</h1>
      <p className="privacy-status">{copy.status}</p>
      <p>{copy.body}</p>
      <p>{copy.next}</p>
      <a href={localizeHref('/contact', locale)}>{copy.contact}</a>
    </div>
  </section>;
}
