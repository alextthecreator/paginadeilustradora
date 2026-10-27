const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const load = require('./ts-fixture.cjs');
const localePaths = load('src/i18n/paths.ts');
const shopPaths = load('src/lib/shop-path.ts', { '@/i18n/paths': localePaths });

// Exercise the actual TypeScript loader without downloading Ecwid or requiring
// a browser. The double rejects initialisation of a missing storefront host.
function fixture() {
  const scripts = [];
  const hosts = new Map();
  const timers = [];
  const warnings = [];
  const calls = { cart: 0, store: 0, destroy: 0 };
  const cartHosts = [];
  const cartContainer = { replaceChildren(node) { cartHosts.push(node); } };
  const document = {
    querySelectorAll(selector) {
      assert.equal(selector, '.ecwid-header-cart');
      return [cartContainer];
    },
    querySelector(selector) {
      if (selector === 'script[data-ecwid-script]') return scripts[0] || null;
      if (selector === '.ec-cart-widget') return { isConnected: true };
      throw new Error(`Unexpected selector: ${selector}`);
    },
    getElementById(id) { return hosts.get(id) || null; },
    createElement(tag) {
      if (tag === 'div') return { dataset: {} };
      assert.equal(tag, 'script');
      const script = { dataset: {}, remove() { scripts.splice(scripts.indexOf(script), 1); } };
      return script;
    },
    body: { appendChild(script) { scripts.push(script); } },
  };
  const window = {
    location: { origin: 'https://example.test' },
    setTimeout(fn) { timers.push(fn); },
    Ecwid: {
      init() {
        if (!(window._xnext_initialization_scripts || []).length) calls.cart += 1;
        // This is the warning reported by Trello if a queue survives teardown.
        for (const widget of window._xnext_initialization_scripts || []) {
          assert.ok(hosts.has(widget.id), `No such element: ${widget.id}`);
          assert.ok(hosts.get(widget.id)?.isConnected);
          assert.equal(widget.widgetType, 'ProductBrowser');
          assert.ok(widget.arg.includes(`id=${widget.id}`));
          calls.store += 1;
        }
      },
      destroy() { calls.destroy += 1; },
    },
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/ecwid-loader.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window, document,
    console: { warn: (...args) => warnings.push(args) },
    require(name) {
      if (name === '@/i18n/paths') return localePaths;
      assert.equal(name, '@/lib/site-config');
      return { siteConfig: { shopPath: '/shop' }, getEcwidScriptUrl: (locale) => `https://example.test/ecwid?lang=${locale}` };
    },
  });
  function host(id = 'my-store-138778502') {
    const node = { id, isConnected: true };
    hosts.set(id, node);
    return node;
  }
  return { api: exports, window, scripts, hosts, host, calls, warnings, cartHosts,
    flushTimers() { while (timers.length) timers.shift()(); } };
}

test('store and cart share the same in-flight locale load', async () => {
  const f = fixture();
  const first = f.api.ensureEcwidScript('en');
  const second = f.api.ensureEcwidScript('en');
  assert.equal(first, second);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.window.ecwid_script_defer, true);
  assert.equal(f.window.ecwid_dynamic_widgets, true);
  assert.equal(f.window.ec.config.tracking.ask_consent, true);
  assert.equal(f.window.ec.config.tracking.user_response, 'DECLINED');
  assert.equal(f.window.ec.config.store_main_page_url, 'https://example.test/shop');
  assert.equal(f.window.ec.config.baseUrl, '/shop/');
  assert.equal(f.window.ec.config.storefrontUrls.cleanUrls, true);
  assert.equal(f.window.ec.config.storefrontUrls.slugsWithoutIds, false);
  assert.equal(f.window.ecwid_ProductBrowserURL, 'https://example.test/shop');
  f.scripts[0].onload();
  await first;
  assert.equal(f.api.ensureEcwidScript('en'), first);
});

test('a locale change waits for the current script before replacing it', async () => {
  const f = fixture();
  const en = f.api.ensureEcwidScript('en');
  const pl = f.api.ensureEcwidScript('pl');
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].dataset.ecwidScript, 'en');
  f.scripts[0].onload();
  await en;
  await new Promise(setImmediate);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].dataset.ecwidScript, 'pl');
  f.scripts[0].onload();
  await pl;
});

test('a failed download is removed and a subsequent request can retry', async () => {
  const f = fixture();
  const failure = f.api.ensureEcwidScript('en');
  f.scripts[0].onerror();
  await assert.rejects(failure, /Failed to load Ecwid script/);
  assert.equal(f.scripts.length, 0);
  const retry = f.api.ensureEcwidScript('en');
  f.scripts[0].onload();
  await retry;
});

test('localized storefront and cart share their language-specific base URL', async () => {
  const f = fixture();
  const loaded = f.api.ensureEcwidScript('pl');
  assert.equal(f.window.ecwid_ProductBrowserURL, 'https://example.test/pl/shop');
  assert.equal(f.window.ec.config.baseUrl, '/pl/shop/');
  f.scripts[0].onload();
  await loaded;
});

test('EN → PL → EN during download does not reload the obsolete PL script', async () => {
  const f = fixture();
  const en = f.api.ensureEcwidScript('en');
  const pl = f.api.ensureEcwidScript('pl');
  const latest = f.api.ensureEcwidScript('en');
  f.scripts[0].onload();
  await Promise.all([en, pl, latest]);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].dataset.ecwidScript, 'en');
  assert.equal(f.calls.destroy, 0);
});

test('cart-only pages have no ProductBrowser initialisation', () => {
  const f = fixture();
  f.api.initEcwidCartWidget();
  assert.equal(f.calls.store, 0);
  assert.equal(f.calls.cart, 1);
  assert.equal(f.window._xnext_initialization_scripts.length, 0);
});

test('destroy gives the cart renderer a fresh mount with its layout preserved', () => {
  const f = fixture();
  f.api.destroyEcwidSafely();
  f.api.destroyEcwidSafely();
  assert.equal(f.cartHosts.length, 2);
  assert.notEqual(f.cartHosts[0], f.cartHosts[1]);
  assert.equal(f.cartHosts[1].className, 'ec-cart-widget');
  assert.equal(f.cartHosts[1].dataset.layout, 'SIMPLE_ICON_COUNTER');
});

test('repeated shop → other page → shop transitions discard stale targets', () => {
  const f = fixture();
  for (let i = 0; i < 5; i += 1) {
    const node = f.host();
    f.api.initEcwidStore(node, [`id=${node.id}`]);
    const cartBefore = f.calls.cart;
    f.api.initEcwidCartWidget();
    assert.equal(f.calls.cart, cartBefore, 'header must not reinitialise the store');
    // Ecwid is allowed to remove its own node before React unmounts the shell.
    node.isConnected = false;
    f.hosts.delete(node.id);
    f.api.releaseEcwidStore(node);
    assert.equal(f.window._xnext_initialization_scripts.length, 0);
    f.flushTimers();
  }
  assert.equal(f.calls.store, 5);
  assert.equal(f.warnings.length, 0);
});

test('a stale cleanup and delayed cart callback cannot destroy a new store', () => {
  const f = fixture();
  const old = f.host();
  f.api.initEcwidStore(old, [`id=${old.id}`]);
  f.api.releaseEcwidStore(old);
  const current = f.host();
  f.api.initEcwidStore(current, [`id=${current.id}`]);
  const before = { ...f.calls };
  f.api.releaseEcwidStore(old);
  f.flushTimers();
  assert.deepEqual(f.calls, before);
  assert.equal(f.window._xnext_initialization_scripts[0].id, current.id);
});

test('a late initialisation is ignored once its host is detached or replaced', () => {
  const f = fixture();
  const old = f.host();
  old.isConnected = false;
  f.api.initEcwidStore(old, [`id=${old.id}`]);
  old.isConnected = true;
  f.host(); // Different element with the same ID.
  f.api.initEcwidStore(old, [`id=${old.id}`]);
  assert.equal(f.calls.store, 0);
  assert.equal(f.calls.destroy, 0);
});

function titleFixture(pathname, ecwidLoaded = true) {
  const source = fs.readFileSync(path.join(__dirname, '../src/components/PageTransition.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const document = { title: 'Shop product title', head: {} };
  let observer;
  let cleanup;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, document, window: ecwidLoaded ? { Ecwid: {} } : {},
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observer = this; }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
    require(name) {
      if (name === 'react') return { useEffect: (fn) => { cleanup = fn(); } };
      if (name === 'react/jsx-runtime') return { jsx: () => ({}) };
      if (name === 'framer-motion') return { motion: { div: 'div' } };
      if (name === 'next/navigation') return { usePathname: () => pathname };
      if (name === '@/lib/seo-config') return { getPageSeo: (page) => ({ title: page === 'about' ? 'About title' : 'Home title' }) };
      if (name === '@/i18n/privacy') return load('src/i18n/privacy.ts');
      if (name === '@/i18n/paths') return localePaths;
      if (name === '@/i18n/LanguageContext') return { useLanguage: () => ({ locale: localePaths.localeFromPath(pathname) }) };
      if (name === '@/lib/shop-path') return shopPaths;
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  exports.default({ children: null });
  return { document, observer, cleanup };
}

test('leaving the shop restores the route title and rejects late Ecwid writes', () => {
  const f = titleFixture('/about');
  assert.equal(f.document.title, 'About title');
  f.document.title = 'Late shop title';
  f.observer.callback();
  assert.equal(f.document.title, 'About title');
  f.cleanup();
  assert.equal(f.observer.disconnected, true);
});

test('title protection starts before a delayed Ecwid script has loaded', () => {
  const f = titleFixture('/about', false);
  f.document.title = 'Late shop title';
  f.observer.callback();
  assert.equal(f.document.title, 'About title');
});

test('privacy placeholder restores its localized title after cart-only Ecwid initialization', () => {
  const { privacyCopy } = load('src/i18n/privacy.ts');
  for (const pathname of ['/privacy', '/pl/privacy', '/es/privacy']) {
    const f = titleFixture(pathname);
    const copy = privacyCopy[localePaths.localeFromPath(pathname)];
    const title = `${copy.title} — ${copy.status} | Toska Art Project`;
    assert.equal(f.document.title, title);
    f.document.title = 'Late shop title';
    f.observer.callback();
    assert.equal(f.document.title, title);
  }
});

test('product titles on /shop and artwork detail titles stay under their own metadata handling', () => {
  for (const pathname of ['/shop', '/shop/Cup-p123', '/shop/cart', '/pl/shop/Cup-p123', '/es/shop/cart', '/work/1']) {
    const f = titleFixture(pathname);
    assert.equal(f.document.title, 'Shop product title');
    assert.equal(f.observer, undefined);
  }
});
