const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const paths = load('src/i18n/paths.ts');
const shop = load('src/lib/shop-path.ts', { '@/i18n/paths': paths });
const seo = load('src/lib/seo-config.ts', { '@/i18n/paths': paths });

test('locale URLs preserve queries, hashes and product IDs without duplicate prefixes', () => {
  assert.equal(paths.localizeHref('/contact', 'pl'), '/pl/contact');
  assert.equal(paths.localizeHref('/pl/contact', 'es'), '/es/contact');
  assert.equal(paths.localizeHref('/es/contact', 'en'), '/contact');
  assert.equal(paths.localizeHref('/', 'es'), '/es');
  assert.equal(paths.localizeHref('/pl/shop/Cup-p123?x=1#photos', 'es'), '/es/shop/Cup-p123?x=1#photos');
  assert.equal(paths.localizeHref('https://example.test/', 'pl'), 'https://example.test/');
  assert.equal(paths.localizeHref('//example.test/', 'es'), '//example.test/');
});

test('localized shop routes retain the Ecwid navigation safeguards', () => {
  for (const path of ['/pl/shop', '/es/shop/Cup-p123', '/pl/shop/cart']) {
    assert.equal(shop.isShopPath(path), true);
    assert.equal(shop.pageTransitionKey(path), '/shop');
  }
  assert.equal(shop.isShopPath('/pl/shopping'), false);
});

test('metadata languages and canonical are deterministic for every main page', () => {
  for (const page of ['home', 'about', 'work', 'shop', 'calendar', 'contact']) {
    const titles = new Set();
    const descriptions = new Set();
    for (const locale of ['en', 'pl', 'es']) {
      const metadata = seo.generatePageMetadata(page, locale);
      titles.add(metadata.title.absolute);
      descriptions.add(metadata.description);
      const path = page === 'home' ? '/' : `/${page}`;
      assert.equal(metadata.alternates.canonical, `https://toska-artproject.com${paths.localizeHref(path, locale)}`);
      assert.equal(metadata.alternates.languages.pl, `https://toska-artproject.com${paths.localizeHref(path, 'pl')}`);
      assert.equal(metadata.alternates.languages.es, `https://toska-artproject.com${paths.localizeHref(path, 'es')}`);
      assert.equal(metadata.alternates.languages['x-default'], metadata.alternates.languages.en);
    }
    assert.equal(titles.size, 3);
    assert.equal(descriptions.size, 3);
  }
});

test('language selection navigates using the URL and does not read stale localStorage', () => {
  let destination;
  let value;
  const api = load('src/i18n/LanguageContext.tsx', {
    'react': {
      default: {}, createContext: () => ({ Provider: 'provider' }), useCallback: fn => fn,
      useMemo: fn => { value = fn(); return value; },
    },
    'react/jsx-runtime': { jsx: () => ({}) },
    './index': { defaultLocale: 'en', translations: { en: {}, pl: {}, es: {} } },
    './paths': paths,
  }, { window: { location: { pathname: '/es/shop/Cup-p123', search: '?x=1', hash: '#photos', assign: url => { destination = url; } } } });
  api.LanguageProvider({ children: null, initialLocale: 'es' });
  assert.equal(value.locale, 'es');
  value.setLocale('pl');
  assert.equal(destination, '/pl/shop/Cup-p123?x=1#photos');
});
