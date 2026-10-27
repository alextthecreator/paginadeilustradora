const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const paths = load('src/i18n/paths.ts');
const sections = load('src/lib/work-sections.ts');

test('four translated skill labels map to the three actual portfolio sections', () => {
  assert.equal(Array.from(sections.skillSections).join(','), 'graphic,graphic,pottery,macrame');
  for (const section of sections.workSections) assert.equal(sections.workSectionFromHash(`#${section}`), section);
  for (const hash of ['', '#unknown', '#pottery/extra', '#%3Cscript%3E']) assert.equal(sections.workSectionFromHash(hash), null);
});

test('section selection preserves router history state; repeated selection reopens without another history entry', () => {
  const routerState = { __NA: true, tree: 'existing router state' };
  const pushes = [], events = [];
  const window = {
    location: { hash: '#graphic' },
    history: { state: routerState, pushState(state, title, hash) { pushes.push({ state, hash }); window.location.hash = hash; } },
    dispatchEvent(event) { events.push(event.type); },
  };
  const api = load('src/lib/work-sections.ts', {}, { window, Event });
  api.selectWorkSection('pottery');
  api.selectWorkSection('pottery');
  assert.equal(pushes.length, 1);
  assert.equal(pushes[0].state, routerState);
  assert.equal(pushes[0].hash, '#pottery');
  assert.deepEqual(events, ['hashchange', 'hashchange']);
});

test('same-page links open an accordion through hash navigation while modified clicks keep native behavior', () => {
  const calls = [];
  let pathname = '/pl/work';
  const api = load('src/components/WorkSectionLink.tsx', {
    'next/navigation': { usePathname: () => pathname },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    './ShopSafeLink': { default: 'ShopSafeLink' },
    '@/i18n/paths': paths,
    '@/lib/work-sections': { selectWorkSection: value => calls.push(value) },
  });
  const click = (options = {}) => {
    let prevented = false;
    const link = api.default({ section: 'pottery', children: 'Ceramika' });
    assert.equal(link.props.href, '/work#pottery');
    link.props.onClick({ button: 0, defaultPrevented: false, preventDefault() { prevented = true; }, ...options });
    return prevented;
  };
  assert.equal(click(), true);
  assert.equal(click({ metaKey: true }), false);
  assert.equal(click({ ctrlKey: true }), false);
  assert.equal(click({ button: 1 }), false);
  pathname = '/pl/shop';
  assert.equal(click(), false);
  assert.deepEqual(calls, ['pottery']);
});
