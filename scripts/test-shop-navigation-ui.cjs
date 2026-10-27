const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const paths = load('src/i18n/paths.ts');
const shopPaths = load('src/lib/shop-path.ts', { '@/i18n/paths': paths });

function fixture() {
  let state = 'idle';
  let resolveCart, rejectCart, destination;
  const pending = new Promise((resolve, reject) => { resolveCart = resolve; rejectCart = reject; });
  const ref = { current: false };
  let confirmations = 0;
  const jsx = (type, props) => ({ type, props });
  const api = load('src/components/ShopSafeLink.tsx', {
    'next/link': { default: 'NextLink' },
    'next/navigation': { usePathname: () => '/pl/shop' },
    react: { useRef: () => ref, useState: () => [state, next => { state = next; }] },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '@/i18n/LanguageContext': { useLanguage: () => ({ locale: 'pl' }) },
    '@/lib/ecwid-cart-navigation': { prepareCartForNavigation: () => { confirmations++; return pending; } },
    '@/lib/shop-path': shopPaths,
    '@/i18n/paths': paths,
  }, { window: { location: { assign: url => { destination = url; } } } });
  return {
    render: () => api.default({ href: '/about', children: 'O mnie' }),
    click: node => node.props.onClick({ button: 0, preventDefault() {} }),
    resolveCart, rejectCart,
    get destination() { return destination; },
    get confirmations() { return confirmations; },
  };
}

test('cart confirmation stays accessible without adding visible content to the navigation', async () => {
  const f = fixture();
  const idle = f.render();
  f.click(idle);
  const saving = f.render();
  assert.equal(saving.props['aria-busy'], true);
  const status = saving.props.children.find(child => child?.props?.role === 'status');
  assert.equal(status.props.className, 'sr-only');
  assert.equal(f.destination, undefined);
  f.click(saving);
  assert.equal(f.confirmations, 1);
  f.resolveCart();
  await new Promise(setImmediate);
  assert.equal(f.destination, '/pl/about');
});

test('failed cart confirmation stays on the page and presents a retryable error outside layout flow', async () => {
  const f = fixture();
  f.click(f.render());
  f.rejectCart(new Error('Unavailable'));
  await new Promise(setImmediate);
  const failed = f.render();
  const alert = failed.props.children.find(child => child?.props?.role === 'alert');
  assert.equal(alert.props.className, 'shop-navigation-error');
  assert.equal(failed.props['aria-busy'], false);
  assert.equal(f.destination, undefined);
});
