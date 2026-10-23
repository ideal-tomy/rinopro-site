const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../ideal_official/node_modules/playwright'));
const results = [];
const output = path.resolve(__dirname, '../docs/demo-brand-verification/other-external-local-results.json');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    context.setDefaultTimeout(30000);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    async function checkRoi(link, brand) {
      const href = await link.evaluate(a => a.href);
      assert.equal(new URL(href).searchParams.get('brand'), brand);
      const [popup] = await Promise.all([context.waitForEvent('page'), link.click()]);
      await popup.waitForLoadState('networkidle');
      await popup.waitForFunction(value => document.body.dataset.brand === value, brand);
      await popup.reload({ waitUntil: 'networkidle' });
      assert.equal(new URL(popup.url()).searchParams.get('brand'), brand);
      await popup.close();
      return href;
    }
    for (const [brand, port] of [['axeon', 3191], ['ideal', 3193]]) {
      const origin = `http://127.0.0.1:${port}`;
      const expectedHost = brand === 'axeon' ? 'www.axeon.jp' : 'ideal-official-three.vercel.app';
      await page.goto(origin + '/manufacturing', { waitUntil: 'networkidle' });
      assert.equal(await page.title(), brand === 'axeon' ? 'AXEON' : 'ideal');
      const consultation = page.getByRole('link', { name: '導入を相談する', exact: true });
      assert.equal(new URL(await consultation.evaluate(a => a.href)).hostname, expectedHost);
      const roi = await checkRoi(page.getByRole('link', { name: '投資回収の目安', exact: true }), brand);
      await page.goto(origin + '/play/minato-factory', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'スキップして触る', exact: true }).click();
      // Numbered guide uses bundled sample answers, not a live provider.
      const guide = page.locator('ol').filter({ has: page.getByRole('button', { name: /ピーク温度/ }) }).locator('button');
      await guide.first().waitFor();
      const count = await guide.count();
      assert.ok(count > 0);
      for (let i = 0; i < count; i++) {
        await guide.nth(i).click();
        await page.waitForFunction(() => !document.querySelector('ol button[disabled]'));
      }
      const completionContact = page.getByRole('link', { name: '相談', exact: true });
      await completionContact.waitFor();
      const completionHref = await completionContact.evaluate(a => a.href);
      assert.equal(new URL(completionHref).hostname, expectedHost);
      await page.goto(origin + '/lp', { waitUntil: 'networkidle' });
      const contact = page.getByRole('link', { name: brand === 'axeon' ? '自社文書での活用を相談する' : '導入を相談する', exact: true });
      await contact.waitFor();
      if (brand === 'ideal') assert.equal(new URL(page.url()).pathname, '/manufacturing');
      const contactHref = await contact.evaluate(a => a.href);
      assert.equal(new URL(contactHref).hostname, expectedHost);
      assert.equal(await page.locator('a[href*="example.com"]').count(), 0);
      let destination = page;
      if (await contact.getAttribute('target') === '_blank') {
        [destination] = await Promise.all([context.waitForEvent('page'), contact.click()]);
        await destination.waitForLoadState('domcontentloaded');
      } else {
        await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), contact.click()]);
      }
      await destination.waitForURL(url => url.hostname === expectedHost);
      assert.equal(new URL(destination.url()).hostname, expectedHost);
      await destination.locator('form').first().waitFor();
      results.push({ demo: 'manufacturing', brand, title: brand === 'axeon' ? 'AXEON' : 'ideal', roi, completionHref, contactHref, contactDestination: destination.url(), formVisible: true });
      if (destination !== page) await destination.close();
      console.log(`PASS manufacturing ${brand}: hub, guide completion, ROI, LP consultation destination`);
    }

    for (const brand of ['axeon', 'ideal']) {
      await page.goto(`http://127.0.0.1:3192/?brand=${brand}`, { waitUntil: 'networkidle' });
      await page.getByRole('link', { name: 'デモを体験する ↗', exact: true }).click();
      await page.getByRole('button', { name: '設定', exact: true }).click();
      assert.equal(new URL(page.url()).searchParams.get('brand'), brand);
      const href = await checkRoi(page.getByRole('link', { name: '投資回収の目安を見る', exact: true }), brand);
      await page.keyboard.press('Escape');
      await page.getByRole('link', { name: '紹介', exact: true }).click();
      assert.equal(new URL(page.url()).searchParams.get('brand'), brand);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).searchParams.get('brand'), brand);
      await page.goto(`http://127.0.0.1:3192/?brand=${brand}&from=axeon-demo-selection#demo`, { waitUntil: 'networkidle' });
      assert.equal(await page.getByRole('link', { name: '厳選版へ戻る', exact: true }).count(), brand === 'axeon' ? 1 : 0);
      results.push({ demo: 'knowledge', brand, roi: href, preservesQueryOnIntroAndReload: true, selectionReturnVisible: brand === 'axeon' });
      console.log(`PASS knowledge ${brand}: intro, settings ROI, reload, selection return`);
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(output, JSON.stringify({ results, pageErrors: errors }, null, 2) + '\n');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
