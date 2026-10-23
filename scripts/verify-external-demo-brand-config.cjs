const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const workspace = path.resolve(__dirname, '../../..');
function loadRepo(name, env) {
  const root = path.join(workspace, name);
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(root, relative.endsWith('.ts') ? relative : relative + '.ts');
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} };
    cache.set(filename, mod);
    const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env', JSON.stringify(env));
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    new Function('require', 'module', 'exports', code)(p => load(path.resolve(path.dirname(filename), p)), mod, mod.exports);
    return mod.exports;
  }
  return load;
}
for (const brand of ['axeon', 'ideal']) {
  const opposite = brand === 'axeon' ? 'https://ideal-official-three.vercel.app/contact' : 'https://www.axeon.jp/contact';
  const expectedHost = brand === 'axeon' ? 'www.axeon.jp' : 'ideal-official-three.vercel.app';
  for (const override of [undefined, opposite, 'mailto:contact@example.com', 'javascript:alert(1)', 'not a URL']) {
    const load = loadRepo('product_flow', { VITE_BRAND: brand, VITE_CONTACT_URL: override, VITE_PRODUCT_INFO_URL: opposite, VITE_ROI_SIMULATOR_URL: 'https://roi.invalid/?brand=wrong&keep=1' });
    const config = load('src/config/brand.config').brandConfig;
    assert.equal(config.id, brand);
    assert.equal(config.headerBrand, brand === 'axeon' ? 'AXEON' : 'ideal');
    assert.equal(new URL(load('src/lib/contactLink').getContactUrl()).hostname, expectedHost);
    assert.equal(config.productInfoHref, brand === 'axeon' ? '/lp' : null);
    const roi = new URL(load('src/lib/roiLink').getRoiSimulatorUrl());
    assert.equal(roi.searchParams.get('brand'), brand);
    assert.equal(roi.searchParams.get('industry'), 'manufacturing');
    assert.equal(roi.searchParams.get('from'), 'product-flow');
    assert.equal(roi.searchParams.get('keep'), '1');
  }
  const contact = brand === 'axeon' ? 'https://axeon.jp/contact?demo=custom' : 'https://ideal-official-three.vercel.app/contact?demo=custom';
  const load = loadRepo('product_flow', { VITE_BRAND: brand, VITE_CONTACT_URL: contact, VITE_PRODUCT_INFO_URL: '/lp?keep=1#demo' });
  assert.equal(load('src/lib/contactLink').getContactUrl(), contact);
  assert.equal(load('src/config/brand.config').brandConfig.productInfoHref, '/lp?keep=1#demo');
  assert.equal(load('src/lib/roiLink').getRoiSimulatorUrl(), null);
  const malformed = loadRepo('product_flow', { VITE_BRAND: brand, VITE_PRODUCT_INFO_URL: '//[' });
  assert.equal(malformed('src/config/brand.config').brandConfig.productInfoHref, brand === 'axeon' ? '/lp' : null);
}
const knowledge = loadRepo('internal_knowledge_demo', { VITE_ROI_SIMULATOR_URL: 'https://roi.invalid/?brand=wrong&keep=1' });
for (const [search, brand] of [['', 'axeon'], ['?brand=axeon', 'axeon'], ['?brand=ideal', 'ideal'], ['?brand=unknown', 'axeon']]) {
  global.window = { location: { search } };
  const url = new URL(knowledge('src/lib/roiLink').getRoiSimulatorUrl());
  assert.equal(url.searchParams.get('brand'), brand);
  assert.equal(url.searchParams.get('keep'), '1');
  assert.equal(url.searchParams.get('from'), 'internal-knowledge');
}
delete global.window;
const site = loadRepo('sites/rinopro-site', {});
assert.equal(new URL(site('src/lib/content/industry-lp/external-demos').INDUSTRY_EXTERNAL_DEMOS.internalKnowledge).searchParams.get('brand'), 'axeon');
assert.ok(fs.readFileSync(path.join(workspace, 'sites/ideal_official/data/demo-first/portfolio.ts'), 'utf8').includes("internalKnowledge: 'https://internal-knowledge-demo.vercel.app/?brand=ideal'"));
console.log('PASS: manufacturing brand/contact/product links/ROI and shared knowledge entry brands');
