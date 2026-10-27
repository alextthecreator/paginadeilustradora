const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3102';

// These requests cannot send a message: invalid fields or a filled honeypot.
(async () => {
  for (const [prefix, lang, title] of [['', 'en', 'In preparation'], ['/pl', 'pl', 'W przygotowaniu'], ['/es', 'es', 'En preparación']]) {
    const response = await fetch(`${origin}${prefix}/privacy`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes(`<html lang="${lang}"`));
    assert.ok(html.includes(title));
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.ok(html.includes(`${origin}${prefix}/privacy`) || html.includes(`https://toska-artproject.com${prefix}/privacy`));
  }
  for (const [body, status] of [
    [{}, 422],
    [{ email: 'invalid' }, 422],
    [{ firstName: {}, message: 'x'.repeat(5001) }, 422],
    [{ _gotcha: 'automated spam check' }, 200],
  ]) {
    const response = await fetch(`${origin}/api/contact`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body),
    });
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  const crossOrigin = await fetch(`${origin}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.invalid' }, body: '{}',
  });
  assert.equal(crossOrigin.status, 403);
  const oversized = await fetch(`${origin}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(33000) }),
  });
  assert.equal(oversized.status, 413);
  console.log('PASS: 3 localized noindex privacy placeholders and 6 safe API checks. No valid message submitted.');
})().catch(error => { console.error(error); process.exitCode = 1; });
