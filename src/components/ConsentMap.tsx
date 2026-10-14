'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useLanguage } from '@/i18n/LanguageContext';
import { cookieCopy } from '@/i18n/cookie-consent';
import { showCookiePreferences } from '@/lib/cookie-consent';

export default function ConsentMap({ src, title, directionsUrl }: { src: string; title: string; directionsUrl: string }) {
  const { maps } = useCookieConsent();
  const { locale } = useLanguage();
  const copy = cookieCopy[locale];
  if (maps) {
    return <iframe title={title} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="contact-map-frame" />;
  }
  return (
    <div className="contact-map-frame consent-map-placeholder">
      <p>{copy.mapBlocked}</p>
      <button type="button" onClick={showCookiePreferences}>{copy.mapSettings}</button>
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">{copy.mapLink}</a>
    </div>
  );
}
