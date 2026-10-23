const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../ideal_official/node_modules/playwright'));
const origin = process.env.IDEAL_ORIGIN || 'http://127.0.0.1:3183';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  try {
    const page = await browser.newPage();
    for (const route of ['/', '/demo/w/construction-record', '/articles/construction']) {
      await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 120000 });
      const links = await page.locator('a[href*="construction-demo-six.vercel.app"]').evaluateAll(nodes => nodes.map(a => ({ text: a.textContent.trim(), href: a.href })));
      assert.ok(links.length > 0, route);
      for (const a of links) assert.equal(new URL(a.href).searchParams.get('brand'), 'ideal');
      results.push({ route, links });
    }
    const response = await page.request.get(origin + '/construction', { maxRedirects: 0 });
    assert.equal(response.status(), 307);
    assert.equal(new URL(response.headers().location).searchParams.get('brand'), 'ideal');
    results.push({ route: '/construction', status: response.status(), location: response.headers().location });
    fs.mkdirSync(path.resolve(__dirname, '../docs/demo-brand-verification'), { recursive: true });
    fs.writeFileSync(path.resolve(__dirname, '../docs/demo-brand-verification/ideal-entry-results.json'), JSON.stringify(results, null, 2) + '\n');
    console.log('PASS: IDEAL top, construction LP, article, redirect carry brand=ideal');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
