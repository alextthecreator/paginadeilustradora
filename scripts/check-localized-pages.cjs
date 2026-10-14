// Run against a built local server or production; checks real HTML without JS.
const assert = require('node:assert/strict');
const load = require('./ts-fixture.cjs');
const paths = load('src/i18n/paths.ts');
const seo = load('src/lib/seo-config.ts', { '@/i18n/paths': paths });
const origin = process.argv[2] || 'http://127.0.0.1:3102';
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[char]);

async function check() {
  for (const locale of ['en', 'pl', 'es']) {
    for (const page of ['home', 'about', 'work', 'shop', 'calendar', 'contact']) {
      const route = paths.localizeHref(page === 'home' ? '/' : `/${page}`, locale);
      const response = await fetch(`${origin}${route}`);
      assert.equal(response.status, 200, route);
      const html = await response.text();
      const head = html.split('</head>')[0];
      const metadata = seo.generatePageMetadata(page, locale);
      assert(html.includes(`<html lang="${locale}"`), `HTML language: ${route}`);
      assert(head.includes(`<title>${escapeHtml(metadata.title.absolute)}</title>`), `Title: ${route}`);
      assert(head.includes(`content="${escapeHtml(metadata.description)}"`), `Description: ${route}`);
      const canonical = head.match(/rel="canonical" href="([^"]+)"/)?.[1];
      assert(canonical, `Canonical exists: ${route}`);
      assert.equal(new URL(canonical).href, new URL(metadata.alternates.canonical).href, `Canonical: ${route}`);
      assert.equal((head.match(/hrefLang=/g) || []).length, 4, `Language alternates: ${route}`);
      assert(head.includes('name="google-site-verification"'), `Verification tag: ${route}`);
      if (page === 'contact') {
        const address = html.match(/<address\b[^>]*>([\s\S]*?)<\/address>/)?.[1] || '';
        assert(address.includes(locale === 'pl' ? 'Polska' : locale === 'es' ? 'Polonia' : 'Poland'), `Address country: ${route}`);
        assert(address.includes(locale === 'pl' ? 'Lokal 322' : locale === 'es' ? 'Local 322' : 'Unit 322'), `Address unit: ${route}`);
      }
      console.log(`Passed ${route}`);
    }
  }
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, 18);
  console.log('Passed sitemap: 18 localized URLs');
  const alias = await fetch(`${origin}/en/contact`, { redirect: 'manual' });
  assert([307, 308].includes(alias.status));
  assert.equal(new URL(alias.headers.get('location'), origin).pathname, '/contact');
  console.log('Passed English alias redirect');
}

check().catch(error => { console.error(error.message); process.exitCode = 1; });
