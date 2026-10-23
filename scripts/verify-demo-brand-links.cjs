// Run from rinopro-site: node scripts/verify-demo-brand-links.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const workspace = path.resolve(__dirname, '../../..');

// Exercise the actual TypeScript URL helpers without installing a test runner.
function loader(repo, env = {}) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(repo, relative.endsWith('.ts') ? relative : `${relative}.ts`);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env', JSON.stringify(env));
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    new Function('require', 'module', 'exports', outputText)(
      name => load(path.resolve(path.dirname(filename), name)), module, module.exports,
    );
    return module.exports;
  }
  return load;
}

const demo = loader(path.join(workspace, 'construction_demo'));
const { parseDemoBrand, demoHref, consumeDemoFrom, getContactUrl } = demo('lib/demo-brand');
const { getRoiSimulatorUrl } = demo('lib/roiLink');
for (const invalid of [undefined, null, '', 'unknown', ['axeon', 'ideal']]) {
  assert.equal(parseDemoBrand(invalid), 'ideal');
}
for (const brand of ['axeon', 'ideal']) {
  assert.equal(parseDemoBrand(brand), brand);
  const linked = new URL(demoHref('/report?from=photo&keep=1#result', brand), 'https://demo.invalid');
  assert.equal(linked.searchParams.get('from'), 'photo');
  assert.equal(linked.searchParams.get('brand'), brand);
  assert.equal(linked.hash, '#result');
  const consumed = new URL(consumeDemoFrom(linked.pathname + linked.search + linked.hash, brand), linked.origin);
  assert.equal(consumed.searchParams.has('from'), false);
  assert.equal(consumed.searchParams.get('keep'), '1');
  assert.equal(consumed.searchParams.get('brand'), brand);
  assert.equal(consumed.hash, '#result');
  assert.equal(getRoiSimulatorUrl(brand), null);
  const roi = new URL(getRoiSimulatorUrl(brand, 'https://roi.invalid/?brand=wrong&keep=1'));
  for (const [key, value] of Object.entries({ kit: 'report-auto', industry: 'construction', cat: 'internal', from: 'construction-demo', brand, keep: '1' })) {
    assert.equal(roi.searchParams.get(key), value);
  }
  assert.equal(new URL(getContactUrl(brand)).hostname, brand === 'axeon' ? 'www.axeon.jp' : 'ideal-official-three.vercel.app');
}
assert.throws(() => demoHref('https://other.invalid/', 'axeon'));
assert.throws(() => demoHref('//other.invalid/', 'axeon'));

// An explicit AXEON URL must survive even when the simulator defaults to ideal.
const roi = loader(path.join(workspace, 'roi-simulator'), { VITE_DEFAULT_BRAND: 'ideal' });
const { readUrl, writeUrl, shareUrl, embedSnippet } = roi('src/lib/url');
const inputs = { people: 3, cases: 10, minutes: 20, reduction: 40, wage: 2500, other: 0, initial: 100000, monthly: 5000 };
for (const brand of ['axeon', 'ideal']) {
  const location = new URL(`https://roi.invalid/?kit=report-auto&industry=construction&cat=internal&from=construction-demo&brand=${brand}&a_users=small`);
  global.window = { location, history: { replaceState(_state, _title, url) { window.location = new URL(url, window.location); } } };
  assert.equal(readUrl().brand, brand);
  const args = { industry: 'construction', category: 'internal', inputs, kit: 'report-auto', answers: { users: 'small' }, from: 'construction-demo', brand };
  writeUrl(args);
  assert.equal(window.location.searchParams.get('brand'), brand);
  assert.equal(readUrl().brand, brand);
  const shared = new URL(shareUrl(args));
  assert.equal(shared.searchParams.get('brand'), brand);
  assert.equal(shared.searchParams.get('a_users'), 'small');
  assert.ok(embedSnippet(args).includes(`brand=${brand}`));
  writeUrl({ ...args, kit: null, answers: {} });
  assert.equal(readUrl().kit, null);
  assert.deepEqual(readUrl().answers, {});
  assert.equal(readUrl().from, 'construction-demo');
  assert.equal(readUrl().brand, brand);
  assert.equal(readUrl().industry, 'construction');
}
delete global.window;

const content = loader(path.resolve(__dirname, '..'));
assert.equal(new URL(content('src/lib/content/top-featured-demos').EXTERNAL_DEMO_URLS.construction).searchParams.get('brand'), 'axeon');
const industry = content('src/lib/content/industry-lp/external-demos').INDUSTRY_EXTERNAL_DEMOS;
for (const href of [industry.construction, industry.ocrConstruction]) {
  assert.equal(new URL(href).searchParams.get('brand'), 'axeon');
}
console.log('PASS: construction brand, handoff queries, contacts, ROI URL round-trip/share/embed, AXEON entry URLs');
