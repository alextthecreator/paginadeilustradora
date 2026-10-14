import type { Locale } from './index';

export function localeFromPath(path: string): Locale {
  const first = path.split(/[/?#]/)[1];
  return first === 'pl' || first === 'es' ? first : 'en';
}

export function stripLocale(path: string) {
  return path.replace(/^\/(en|pl|es)(?=\/|[?#]|$)/, '') || '/';
}

/** English keeps the existing URLs; external links are unchanged. */
export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const path = stripLocale(href);
  if (locale === 'en') return path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${path === '/' ? '' : path.startsWith('/') ? path : `/${path}`}`;
}

export function languageAlternates(path: string, origin: string) {
  return Object.fromEntries(['en', 'pl', 'es'].map(locale => [locale, `${origin}${localizeHref(path, locale as Locale)}`]).concat([['x-default', `${origin}${localizeHref(path, 'en')}`]]));
}
