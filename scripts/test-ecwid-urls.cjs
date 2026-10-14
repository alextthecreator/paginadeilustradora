const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const load = require('./ts-fixture.cjs');
const localePaths = load('src/i18n/paths.ts');

function fixture(reply, status = 200) {
  const calls = [];
  const exports = {};
  const source = fs.readFileSync(`${__dirname}/../src/lib/ecwid-product-metadata.ts`, 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports, URL, AbortSignal,
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (reply instanceof Error) throw reply;
      return { ok: status === 200, json: async () => reply };
    },
    require(name) {
      if (name === '@/i18n/paths') return localePaths;
      if (name === '@/lib/site-config') return { siteConfig: { shopPath: '/shop', ecwidStoreId: '138778502' } };
      if (name === '@/lib/seo-config') return {
        seoConfig: { site: { url: 'https://toska-artproject.com' } },
        generatePageMetadata: () => ({ title: 'Shop', openGraph: { title: 'Shop' } }),
      };
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return { get: exports.getEcwidProductMetadata, calls };
}

const product = {
  title: 'Cup & saucer',
  canonicalUrl: 'https://toska-artproject.com/shop/Cup-p123',
  jsonLDHtml: `<script type="application/ld+json">${JSON.stringify({
    '@type': 'Product', name: 'Cup', description: 'Handcrafted cup',
    image: [{ contentUrl: 'https://example.test/cup.jpg' }],
  })}</script>`,
};

test('product metadata includes specific server-side title, description, image and clean canonical', async () => {
  const f = fixture(product);
  const metadata = await f.get(['Cup-p123']);
  assert.equal(metadata.title.absolute, 'Cup & saucer');
  assert.equal(metadata.description, 'Handcrafted cup');
  assert.equal(metadata.openGraph.images[0].url, 'https://example.test/cup.jpg');
  assert.equal(metadata.twitter.images[0], 'https://example.test/cup.jpg');
  assert.equal(metadata.alternates.canonical, product.canonicalUrl);
  assert.equal(f.calls[0].url.pathname, '/product-page/138778502/123/static-code');
  assert.equal(f.calls[0].url.searchParams.get('clean_urls'), 'true');
  assert.equal(f.calls[0].url.searchParams.get('base_url'), 'https://toska-artproject.com/shop');
  assert.equal(f.calls[0].options.next.revalidate, 3600);
});

test('cart and checkout are not indexable and never request product metadata', async () => {
  const f = fixture(product);
  for (const slug of [['cart'], ['checkout', 'shipping'], ['account']]) {
    const metadata = await f.get(slug);
    assert.equal(metadata.robots.index, false);
  }
  await f.get([]);
  await f.get(['category-c123']);
  await f.get(['Cup-p123', 'unexpected']);
  assert.equal(f.calls.length, 0);
});

test('vendor failure or malformed data does not prevent the shop from loading', async () => {
  for (const reply of [new Error('timeout'), {}, { jsonLDHtml: '<script>invalid json</script>' }]) {
    const f = fixture(reply);
    const metadata = await f.get(['Cup-p123']);
    assert.equal(metadata.alternates.canonical, product.canonicalUrl);
    assert.equal(metadata.title, 'Shop');
  }
  assert.equal((await fixture({}, 404).get(['Cup-p123'])).title, 'Shop');
});

test('canonical cannot point outside this store or to another product', async () => {
  for (const canonicalUrl of ['https://other.test/shop/Cup-p123', 'https://toska-artproject.com/about-p123', 'https://toska-artproject.com/shop/Cup-p999']) {
    const metadata = await fixture({ ...product, canonicalUrl }).get(['Cup-p123']);
    assert.equal(metadata.alternates.canonical, product.canonicalUrl);
  }
});

test('localized product metadata preserves the prefixed canonical and requests its language', async () => {
  const f = fixture({ ...product, canonicalUrl: 'https://toska-artproject.com/pl/shop/Cup-p123' });
  const metadata = await f.get(['Cup-p123'], 'pl');
  assert.equal(metadata.alternates.canonical, 'https://toska-artproject.com/pl/shop/Cup-p123');
  assert.equal(metadata.alternates.languages.es, 'https://toska-artproject.com/es/shop/Cup-p123');
  assert.equal(f.calls[0].url.searchParams.get('lang'), 'pl');
  assert.equal(f.calls[0].url.searchParams.get('base_url'), 'https://toska-artproject.com/pl/shop');
});
