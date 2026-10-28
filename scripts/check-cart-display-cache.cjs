const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3102';

// Synthetic display cookies only; never changes Ecwid cart contents.
(async () => {
  for (const [path, quantity, display, suffix] of [['/about', 2, '2', ''], ['/pl/work', 0, '0', ''], ['/es/contact', 12, '12', ''], ['/es/work', 120, '99+', ' header-cart-quantity--compact']]) {
    const response = await fetch(`${origin}${path}`, { headers: { Cookie: `toska-cart-quantity=${encodeURIComponent(`${quantity}:${Date.now()}`)}` } });
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes(`<span class="header-cart-quantity${suffix}" aria-hidden="true">${display}</span>`), `${path}: quantity must already exist before client scripts run`);
    assert.match(response.headers.get('cache-control') || '', /private|no-store/);
  }
  const response = await fetch(`${origin}/about`, { headers: { Cookie: 'toska-cart-quantity=invalid' } });
  assert.doesNotMatch(await response.text(), /<span class="header-cart-quantity"/);
  console.log('PASS: 4 initial-HTML quantity hints, private responses and invalid-cookie fallback. No cart mutation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
