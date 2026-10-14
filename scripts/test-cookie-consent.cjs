const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function moduleFixture(file, imports, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, ...globals, require(name) {
    assert.ok(name in imports, `Unexpected import: ${name}`);
    return imports[name];
  } });
  return exports;
}

function consentFixture() {
  let config;
  let valid = false;
  let categories = [];
  let runs = 0;
  const window = { location: { protocol: 'https:' } };
  const api = moduleFixture('src/lib/cookie-consent.ts', {
    'vanilla-cookieconsent': {
      run(options) { config = options; runs++; return Promise.resolve(); },
      validConsent: () => valid,
      acceptedCategory: (name) => categories.includes(name),
      setLanguage() {}, showPreferences() {},
    },
    '@/i18n/cookie-consent': { cookieTranslations: {} },
    '@/lib/analytics-config': { analyticsConfig: { measurementId: 'G-TEST123' } },
  }, { window, document: { createElement: () => ({}), body: { appendChild() {} } } });
  return { api, window, get config() { return config; }, get runs() { return runs; },
    choose(next, isValid = true) { valid = isValid; categories = next; config.onChange(); } };
}

test('optional services start denied, including invalid or absent stored consent', async () => {
  const f = consentFixture();
  assert.equal(f.api.getConsent().analytics, false);
  assert.equal(f.api.getConsent().maps, false);
  await f.api.initializeConsent('en');
  f.choose(['analytics', 'maps'], false);
  assert.equal(f.api.getConsent().analytics, false);
  assert.equal(f.api.getConsent().maps, false);
  assert.equal(f.window['ga-disable-G-TEST123'], true);
});

test('initialization is shared; accept and reject have equal weight and necessary stays enabled', async () => {
  const f = consentFixture();
  const a = f.api.initializeConsent('pl');
  const b = f.api.initializeConsent('es');
  assert.equal(a, b);
  await a;
  assert.equal(f.runs, 1);
  assert.equal(f.config.mode, 'opt-in');
  assert.equal(f.config.guiOptions.consentModal.equalWeightButtons, true);
  assert.equal(f.config.categories.necessary.readOnly, true);
  assert.equal(f.config.cookie.path, '/');
  assert.equal(f.config.cookie.secure, true);
});

test('selective map consent does not enable analytics; withdrawal disables loaded GA immediately', async () => {
  const f = consentFixture();
  await f.api.initializeConsent('en');
  let changes = 0;
  f.api.subscribeConsent(() => changes++);
  f.choose(['necessary', 'maps']);
  assert.equal(f.api.getConsent().maps, true);
  assert.equal(f.api.getConsent().analytics, false);
  f.choose(['necessary', 'maps', 'analytics']);
  assert.equal(f.window['ga-disable-G-TEST123'], false);
  f.choose(['necessary']);
  assert.equal(f.api.getConsent().maps, false);
  assert.equal(f.api.getConsent().analytics, false);
  assert.equal(f.window['ga-disable-G-TEST123'], true);
  assert.equal(changes, 3);
});

test('analytics events stop after withdrawal even when gtag is still loaded', () => {
  let analytics = false;
  const calls = [];
  const api = moduleFixture('src/lib/analytics.ts', {
    './analytics-config': { analyticsConfig: { measurementId: 'G-TEST123' }, hasMeasurementId: () => true },
    './cookie-consent': { getConsent: () => ({ analytics }) },
  }, { window: { gtag: (...args) => calls.push(args) } });
  api.trackEvent('before_choice');
  api.trackConversion('before_choice');
  assert.equal(calls.length, 0);
  analytics = true;
  api.trackEvent('allowed');
  assert.equal(calls.length, 1);
  analytics = false;
  api.trackEvent('withdrawn');
  api.trackConversion('withdrawn');
  assert.equal(calls.length, 1);
});

test('GA component renders only with consent and a real configured ID', () => {
  for (const analytics of [false, true]) {
    const api = moduleFixture('src/components/GoogleAnalytics.tsx', {
      'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: 'fragment' },
      'next/script': { default: 'script' },
      '@/hooks/useCookieConsent': { useCookieConsent: () => ({ analytics }) },
      '@/lib/analytics-config': { hasMeasurementId: (id) => id === 'G-TEST123' },
    });
    assert.equal(api.default({ measurementId: 'G-XXXXXXXXXX' }), null);
    assert.equal(api.default({ measurementId: '' }), null);
    const result = api.default({ measurementId: 'G-TEST123' });
    assert.equal(result === null, !analytics);
  }
});

test('shop boundaries use document navigation; ordinary pages retain Next links', () => {
  const paths = moduleFixture('src/lib/shop-path.ts', {});
  for (const pathname of ['/shop', '/shop/', '/shop/Cup-p123', '/shop/cart', '/shopping', '/about', '/contact']) {
    const api = moduleFixture('src/components/ShopSafeLink.tsx', {
      'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
      'react': { useRef: () => ({current:false}), useState: () => ['idle', () => {}] },
      '@/i18n/LanguageContext': { useLanguage: () => ({locale:'en'}) },
      '@/lib/ecwid-cart-navigation': { prepareCartForNavigation: () => Promise.resolve() },
      '@/lib/shop-path': paths,
      'next/link': { default: 'NextLink' },
      'next/navigation': { usePathname: () => pathname },
    });
    for (const href of ['/shop', '/shop#!/~/cart', '/shop/cart', '/shop/Cup-p123', '/shop?category=1', '/shopping', '/about', '/contact', '/']) {
      const isShop = (path) => /^\/shop(?:[\/?#]|$)/.test(path);
      const native = isShop(pathname) || isShop(href);
      const link = api.default({ href, children: 'Go' });
      assert.equal(link.type, native ? 'a' : 'NextLink');
    }
  }
});

test('Ecwid history changes keep one storefront transition key', () => {
  const paths = moduleFixture('src/lib/shop-path.ts', {});
  for (const path of ['/shop', '/shop/Cup-p123', '/shop/cart', '/shop/checkout/shipping']) {
    assert.equal(paths.pageTransitionKey(path), '/shop');
  }
  assert.equal(paths.pageTransitionKey('/about'), '/about');
  assert.equal(paths.pageTransitionKey('/shopping'), '/shopping');
});

function cartNavigationFixture(calculateTotal) {
  let timeout;
  let cleared = false;
  const window = {
    Ecwid: calculateTotal ? { Cart: { calculateTotal } } : {},
    setTimeout(fn) { timeout = fn; return 1; },
    clearTimeout() { cleared = true; },
  };
  const api = moduleFixture('src/lib/ecwid-cart-navigation.ts', {}, { window });
  return { api, expire: () => timeout(), cleared: () => cleared };
}

test('navigation waits for the cart calculation callback instead of the visible count', async () => {
  let callback;
  const f = cartNavigationFixture((fn) => { callback = fn; });
  let done = false;
  const waiting = f.api.prepareCartForNavigation().then(() => { done = true; });
  await Promise.resolve();
  assert.equal(done, false);
  callback({ cart: { productsQuantity: 1 } });
  await waiting;
  assert.equal(done, true);
  assert.equal(f.cleared(), true);
});

test('failed or stalled cart confirmation rejects so the page can keep the cart open', async () => {
  const failed = cartNavigationFixture(() => { throw new Error('offline'); });
  await assert.rejects(failed.api.prepareCartForNavigation(), /confirmation failed/);
  const stalled = cartNavigationFixture(() => {});
  const waiting = stalled.api.prepareCartForNavigation();
  stalled.expire();
  await assert.rejects(waiting, /timed out/);
});

test('leaving before the shop API loads does not block navigation', async () => {
  const f = cartNavigationFixture();
  await f.api.prepareCartForNavigation();
});
