import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested === 'pl' || requested === 'es' ? requested : 'en';
  // Typed dictionaries are passed through our existing LanguageProvider.
  return { locale, messages: {} };
});
