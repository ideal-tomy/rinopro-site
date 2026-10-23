const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../ideal_official/node_modules/playwright'));
const demoOrigin = process.env.DEMO_ORIGIN || 'http://127.0.0.1:3180';
const roiOrigin = process.env.ROI_ORIGIN || 'http://127.0.0.1:3181';
const siteOrigin = process.env.SITE_ORIGIN || 'http://127.0.0.1:3182';
const report = [];

async function links(page) {
  return page.locator('a:visible').evaluateAll(nodes => nodes.map(a => ({ text: a.textContent.trim(), href: a.href })));
}
async function brandUrl(page, brand) {
  await page.waitForFunction(value => new URL(location.href).searchParams.get('brand') === value, brand);
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    for (const [brand, mobile] of [['axeon', false], ['ideal', false], ['axeon', true]]) {
      const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
        reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'],
      });
      const page = await context.newPage();
      context.setDefaultTimeout(30000);
      page.setDefaultTimeout(30000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${demoOrigin}/?brand=${brand}`, { waitUntil: 'networkidle', timeout: 120000 });
      const brandName = brand === 'axeon' ? 'AXEON' : 'ideal';
      assert.ok((await page.locator('.hubEyebrow').textContent()).includes(brandName));
      const hubLinks = await links(page);
      const contact = new URL(await page.getByRole('link', { name: '相談する', exact: true }).getAttribute('href'));
      assert.equal(contact.hostname, brand === 'axeon' ? 'www.axeon.jp' : 'ideal-official-three.vercel.app');
      for (const item of hubLinks.filter(l => l.href.startsWith(demoOrigin))) {
        assert.equal(new URL(item.href).searchParams.get('brand'), brand);
      }
      assert.ok(await page.getByRole('link', { name: '投資回収の目安 ↗', exact: true }).isVisible());
      await page.locator('a.hubCard').first().click();
      await page.waitForURL(url => url.pathname === '/photo');
      await brandUrl(page, brand);
      assert.ok((await page.locator('.photoStep').textContent()).includes(brandName));
      await page.getByRole('button', { name: '整理する', exact: true }).click();
      const reportLink = page.locator('a.photoPrimaryLink');
      await reportLink.waitFor();
      assert.equal(new URL(await reportLink.evaluate(a => a.href)).searchParams.get('from'), 'photo');
      await reportLink.click();
      await page.getByRole('button', { name: 'AIで下書き', exact: true }).first().waitFor();
      await brandUrl(page, brand);
      assert.ok((await page.locator('.demoHubBar').textContent()).includes(brandName));
      assert.equal(new URL(page.url()).searchParams.has('from'), false);
      await page.getByRole('button', { name: 'AIで下書き', exact: true }).first().click();
      await page.getByRole('button', { name: /^確認する/ }).first().click();
      await page.getByRole('button', { name: '提出する', exact: true }).first().click();
      const estimateLink = page.getByRole('link', { name: '投資回収の目安を見る', exact: true }).first();
      await estimateLink.waitFor();
      fs.mkdirSync(path.resolve(__dirname, '../docs/demo-brand-verification'), { recursive: true });
      await page.screenshot({ path: path.resolve(__dirname, `../docs/demo-brand-verification/${brand}-${mobile ? 'mobile' : 'desktop'}-submitted.png`) });
      const href = await estimateLink.evaluate(a => a.href);
      const target = new URL(href);
      assert.equal(target.origin, roiOrigin);
      for (const [key, value] of Object.entries({ brand, kit: 'report-auto', industry: 'construction', cat: 'internal', from: 'construction-demo' })) {
        assert.equal(target.searchParams.get(key), value);
      }
      const [popup] = await Promise.all([context.waitForEvent('page'), estimateLink.click()]);
      console.log(`Checking ${brand} ${mobile ? 'mobile' : 'desktop'} ROI popup`);
      await popup.bringToFront();
      await popup.waitForLoadState('networkidle');
      await popup.waitForFunction(value => document.body.dataset.brand === value, brand);
      assert.ok((await popup.locator('header .brand').textContent()).includes(brandName));
      await popup.getByRole('button', { name: '〜50人', exact: true }).click();
      await brandUrl(popup, brand);
      await popup.getByRole('button', { name: 'この試算をリンクで送る', exact: true }).click();
      const shared = await popup.evaluate(() => navigator.clipboard.readText());
      assert.equal(new URL(shared).searchParams.get('brand'), brand);
      const restored = await context.newPage();
      await restored.goto(shared, { waitUntil: 'networkidle' });
      await restored.waitForFunction(value => document.body.dataset.brand === value, brand);
      await restored.close();
      await popup.bringToFront();
      await popup.getByRole('button', { name: '見積もりを閉じる', exact: true }).click();
      await popup.waitForFunction(() => !new URL(location.href).searchParams.has('kit'));
      await brandUrl(popup, brand);
      assert.equal(new URL(popup.url()).searchParams.get('from'), 'construction-demo');
      await popup.reload({ waitUntil: 'networkidle' });
      await popup.waitForFunction(value => document.body.dataset.brand === value, brand);
      await popup.getByRole('button', { name: '概算見積もりへ', exact: true }).first().click();
      await popup.getByRole('button', { name: '見積もりを閉じる', exact: true }).first().waitFor();
      await brandUrl(popup, brand);
      await popup.close();
      await page.getByRole('button', { name: /管理画面で確認/ }).first().click();
      await page.locator('.opsBack').waitFor();
      assert.ok((await page.locator('.opsBrand').textContent()).includes(brandName));
      await brandUrl(page, brand);
      assert.equal(new URL(page.url()).searchParams.has('from'), false);
      const opsLinks = await links(page);
      await page.locator('.opsBack').click();
      await page.waitForURL(url => url.pathname === '/');
      await brandUrl(page, brand);
      assert.equal(new URL(page.url()).pathname, '/');
      assert.deepEqual(errors, []);
      const [contactResponse] = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
        page.getByRole('link', { name: '相談する', exact: true }).click(),
      ]);
      assert.equal(new URL(page.url()).hostname, contact.hostname);
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ''), '/contact');
      assert.ok(contactResponse?.ok());
      await page.locator('form').first().waitFor();
      report.push({ brand, mobile, passed: true, hubLinks, completionEstimate: href, opsLinks, errors, contactDestination: { url: page.url(), title: await page.title(), status: contactResponse.status() } });
      console.log(`PASS: ${brand} ${mobile ? 'mobile' : 'desktop'} complete flow`);
      await context.close();
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    const otherTab = await context.newPage();
    await page.goto(`${demoOrigin}/?brand=axeon`, { waitUntil: 'networkidle' });
    await otherTab.goto(`${demoOrigin}/?brand=ideal`, { waitUntil: 'networkidle' });
    assert.equal(new URL(await page.locator('a.hubCard').first().evaluate(a => a.href)).searchParams.get('brand'), 'axeon');
    assert.equal(new URL(await otherTab.locator('a.hubCard').first().evaluate(a => a.href)).searchParams.get('brand'), 'ideal');
    await otherTab.close();
    for (const query of ['', '?brand=unknown']) {
      await page.goto(demoOrigin + '/' + query, { waitUntil: 'networkidle' });
      assert.equal(new URL(await page.getByRole('link', { name: '相談する', exact: true }).getAttribute('href')).hostname, 'ideal-official-three.vercel.app');
      assert.equal(new URL(await page.locator('a.hubCard').first().evaluate(a => a.href)).searchParams.get('brand'), 'ideal');
    }
    for (const route of ['/photo', '/report', '/ops']) {
      await page.goto(`${demoOrigin}${route}?brand=axeon`, { waitUntil: 'networkidle' });
      const back = page.getByRole('link', { name: /ハブ/ }).first();
      assert.equal(new URL(await back.evaluate(a => a.href)).searchParams.get('brand'), 'axeon');
    }
    await page.goto(`${demoOrigin}/?embed=intro&view=stage&brand=axeon`, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('main.ki-embed-stage').isVisible());
    for (const route of ['/', '/industries/construction']) {
      await page.goto(siteOrigin + route, { waitUntil: 'networkidle', timeout: 120000 });
      const entries = (await links(page)).filter(a => a.href.includes('construction-demo-six.vercel.app'));
      assert.ok(entries.length > 0);
      for (const a of entries) assert.equal(new URL(a.href).searchParams.get('brand'), 'axeon');
      report.push({ siteRoute: route, constructionEntries: entries });
    }
    await context.close();
    fs.mkdirSync(path.resolve(__dirname, '../docs/demo-brand-verification'), { recursive: true });
    fs.writeFileSync(path.resolve(__dirname, '../docs/demo-brand-verification/browser-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log('PASS: desktop AXEON/IDEAL, mobile AXEON, photo→report→submit→ROI→ops→hub, share/reload/close/reopen, legacy entries, direct routes, embed, AXEON site entries');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
