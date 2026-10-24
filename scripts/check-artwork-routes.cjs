const assert = require('node:assert/strict');
const artwork = require('../src/data/artwork.json');
const origin = process.argv[2] || 'http://localhost:3102';
(async () => {
  for (const [prefix, lang, missing] of [['', 'en', 'Page Not Found'], ['/pl', 'pl', 'Nie znaleziono strony'], ['/es', 'es', 'Página no encontrada']]) {
    for (const id of ['qa-missing-20261024', 'qa.missing.20261024']) {
      const response = await fetch(`${origin}${prefix}/work/${id}`);
      const html = await response.text();
      assert.equal(response.status, 404, `${prefix}/work/${id}`);
      assert.ok(html.includes(missing), `${lang} missing-page copy`);
      assert.match(html, /name="robots" content="noindex"/);
    }
    const response = await fetch(`${origin}${prefix}/work/${artwork[0].id}`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes(artwork[0].title));
    assert.ok(html.includes(`<html lang="${lang}"`));
  }
  console.log('PASS: 6 missing artwork URLs return 404/noindex/localized copy; 3 valid URLs return 200.');
})().catch(error => { console.error(error); process.exitCode = 1; });
