import { getLocale } from 'next-intl/server';
import { localizeHref } from '@/i18n/paths';
import type { Locale } from '@/i18n';

const copy = {
  en: { title: 'Page Not Found', description: "The page you're looking for doesn't exist or has been moved.", home: 'Go Home' },
  pl: { title: 'Nie znaleziono strony', description: 'Ta strona nie istnieje lub została przeniesiona.', home: 'Strona główna' },
  es: { title: 'Página no encontrada', description: 'La página que buscas no existe o se ha movido.', home: 'Ir al inicio' },
};

export default async function NotFound() {
  const locale = await getLocale() as Locale;
  const text = copy[locale] || copy.en;
  return (
    <div className="min-h-[60vh] bg-[#0f2e1f] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-8xl md:text-9xl font-bold mb-8 text-[#FF8A9D]">404</h1>
        <h2 className="text-3xl md:text-4xl font-mencken-bold mb-6 text-[#FBEAD5]">{text.title}</h2>
        <p className="text-lg mb-8 text-[#FBEAD5]">{text.description}</p>
        <a href={localizeHref('/', locale)} className="inline-flex min-h-11 items-center bg-[#FF8A9D] text-[#1a4d3a] px-8 py-4 rounded-full font-mencken-bold text-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FBEAD5]">{text.home}</a>
      </div>
    </div>
  );
}
