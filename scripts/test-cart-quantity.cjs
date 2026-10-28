const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const cache = load('src/lib/cart-quantity.ts');

test('fresh display quantity includes zero and is safe to render in initial server HTML', () => {
  const now = Date.now();
  assert.equal(cache.readCachedCartQuantity(encodeURIComponent(`2:${now}`), now), 2);
  assert.equal(cache.readCachedCartQuantity(`0:${now}`, now), 0);
});

test('expired, future, malformed and unsafe quantity cookies are ignored', () => {
  const now = Date.now();
  for (const raw of [undefined, '', '%invalid', `-1:${now}`, `1.5:${now}`, `9007199254740992:${now}`, `2:${now - 86400001}`, `2:${now + 120000}`]) assert.equal(cache.readCachedCartQuantity(raw, now), null);
});

test('display cache is limited to one day, site-wide and secure on HTTPS', () => {
  const document = { cookie: '' };
  const api = load('src/lib/cart-quantity.ts', {}, { document, window: { location: { protocol: 'https:' } } });
  api.cacheCartQuantity(2);
  assert.match(document.cookie, /^toska-cart-quantity=2%3A\d+; Path=\/; Max-Age=86400; SameSite=Lax; Secure$/);
});

test('restricted cookie storage does not break the live counter', () => {
  const document = {};
  Object.defineProperty(document, 'cookie', { set() { throw new Error('Blocked'); } });
  const api = load('src/lib/cart-quantity.ts', {}, { document, window: { location: { protocol: 'https:' } } });
  assert.doesNotThrow(() => api.cacheCartQuantity(2));
});

function fixture(initial) {
  let text = initial, callback, disconnected = false;
  const values = [];
  const api = load('src/lib/cart-quantity.ts', {}, {
    MutationObserver: class {
      constructor(fn) { callback = fn; }
      observe() {}
      disconnect() { disconnected = true; }
    },
  });
  const cleanup = api.observeCartQuantity({ querySelector: () => text === null ? null : { textContent: text } }, value => values.push(value));
  return { values, cleanup, change(value) { text = value; callback(); }, get disconnected() { return disconnected; } };
}

test('cart badge mirrors confirmed quantities and ignores duplicate notifications', () => {
  const f = fixture('1');
  f.change('1'); f.change('2'); f.change('0'); f.change('120');
  assert.deepEqual(f.values, [1, 2, 0, 120]);
});

test('Ecwid host replacement retains the last quantity until a new valid counter exists', () => {
  const f = fixture('3');
  for (const text of [null, '', 'Loading', '-1', '1.5', '9007199254740992']) f.change(text);
  assert.deepEqual(f.values, [3]);
  f.change(' 4 ');
  assert.deepEqual(f.values, [3, 4]);
});

test('unknown initial cart is not presented as empty and stale callbacks cannot update after cleanup', () => {
  const f = fixture(null);
  assert.deepEqual(f.values, []);
  f.cleanup(); f.change('5');
  assert.equal(f.disconnected, true);
  assert.deepEqual(f.values, []);
});
