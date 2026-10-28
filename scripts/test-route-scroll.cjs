const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const paths = load('src/i18n/paths.ts');
const shop = load('src/lib/shop-path.ts', { '@/i18n/paths': paths });

function fixture() {
  let pathname = '/pl/about', cursor = 0;
  const refs = [], dependencies = [], cleanups = [], effects = [], calls = [], listeners = new Map();
  const window = { location: { pathname, hash: '' }, scrollTo: options => calls.push(options),
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const { default: Component } = load('src/components/RouteScrollReset.tsx', {
    react: {
      useRef(value) { const i = cursor++; return refs[i] ||= { current: value }; },
      useEffect(fn, deps) {
        const i = cursor++;
        if (!dependencies[i] || deps.some((value, j) => value !== dependencies[i][j])) {
          cleanups[i]?.(); dependencies[i] = deps;
          effects.push(() => { cleanups[i] = fn(); });
        }
      },
    },
    'next/navigation': { usePathname: () => pathname },
    '@/lib/shop-path': shop,
  }, { window });
  const render = () => { cursor = 0; Component(); while (effects.length) effects.shift()(); };
  render();
  return { calls, navigate(path, hash = '', history = false) {
    window.location = { pathname: path, hash };
    if (history) listeners.get('popstate')?.();
    pathname = path; render();
  } };
}

test('fresh routes start at document top without overriding initial or Ecwid scroll', () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  f.navigate('/pl/contact');
  assert.equal(f.calls[0].top, 0);
  assert.equal(f.calls[0].behavior, 'instant');
  f.navigate('/pl/shop');
  f.navigate('/pl/shop/cart');
  assert.equal(f.calls.length, 1);
});

test('Back/Forward and portfolio section links retain their own positioning', () => {
  const f = fixture();
  f.navigate('/pl/contact');
  f.navigate('/pl/about', '', true);
  f.navigate('/pl/contact', '', true);
  f.navigate('/pl/work', '#pottery');
  assert.equal(f.calls.length, 1);
  f.navigate('/pl/work', '#graphic', true);
  f.navigate('/pl/calendar');
  assert.equal(f.calls.length, 2);
});
