const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../ideal_official/node_modules/playwright'));
const results = [];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    async function record(stage) {
      const links = await page.locator('a:visible').evaluateAll(nodes => nodes.map(a => ({ text: a.textContent.trim(), href: a.href })));
      assert.ok(!links.some(a => /ideal-official|brand=ideal/.test(a.href)), `${stage}: unexpected ideal link`);
      results.push({ stage, url: page.url(), links });
      fs.mkdirSync(path.resolve(__dirname, '../docs/demo-brand-verification'), { recursive: true });
      fs.writeFileSync(path.resolve(__dirname, '../docs/demo-brand-verification/other-demo-results.json'), JSON.stringify(results, null, 2) + '\n');
    }
    await page.goto('https://axeonmanufacturing02.vercel.app/', { waitUntil: 'networkidle' });
    await record('manufacturing entry');
    await page.getByRole('button', { name: 'コンソールを開く', exact: true }).click();
    await record('manufacturing dashboard');
    await page.locator('[data-action="incident"]').first().click();
    await record('manufacturing incident');
    await page.locator('[data-action="root-cause"]').first().click();
    await record('manufacturing root cause');
    await page.locator('[data-action="corrective"]').first().click();
    await record('manufacturing corrective / completion');
    const submit = page.locator('[data-action="submit"]');
    if (await submit.count()) {
      await submit.click();
      await record('manufacturing submitted');
    }

    await page.goto('https://approval-diagram.vercel.app/', { waitUntil: 'networkidle' });
    await record('approval entry');
    await page.getByRole('link', { name: /体験|照合/ }).first().click();
    for (const name of ['照合', '保留一覧', '承認', '基準改定']) {
      const tab = page.getByRole('tab', { name, exact: true });
      if (await tab.count()) await tab.click();
      await record(`approval screen: ${name}`);
    }
    await page.goto('https://approval-diagram.vercel.app/story-mode.html', { waitUntil: 'networkidle' });
    await record('approval explanation');

    await page.goto('https://childcare-demo-six.vercel.app/', { waitUntil: 'networkidle' });
    await record('childcare entry');
    await page.goto('https://childcare-demo-six.vercel.app/dashboard.html', { waitUntil: 'networkidle' });
    await record('childcare dashboard');
    await page.getByRole('button', { name: '＋ 記録する', exact: true }).click();
    await page.locator('#mic-btn').click();
    // The recording button pulses continuously; stop it with its keyboard action.
    await page.locator('#mic-btn').press('Enter');
    await page.getByRole('button', { name: 'あおとくんの転倒を記録する', exact: true }).click();
    await page.locator('#report-output').waitFor({ state: 'visible', timeout: 30000 });
    await record('childcare generated report');
    await page.locator('.nav-item[onclick="showPage(\'reports\')"]').click();
    await page.locator('.ledger-item').first().click();
    await record('childcare report detail');
    await page.locator('.nav-item[onclick="showPage(\'chat\')"]').click();
    await page.getByRole('button', { name: 'この対応で、園の決まりは大丈夫ですか？', exact: true }).click();
    await page.locator('#staff-msgs .msg').last().waitFor();
    await record('childcare questions / policy reference');
    await context.close();
    fs.mkdirSync(path.resolve(__dirname, '../docs/demo-brand-verification'), { recursive: true });
    fs.writeFileSync(path.resolve(__dirname, '../docs/demo-brand-verification/other-demo-results.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(`PASS: ${results.length} published demo stages; no visible IDEAL destination links`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
