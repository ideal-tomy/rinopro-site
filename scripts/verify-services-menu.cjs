const fs = require('fs');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const out = 'docs/services-menu-2026-10-07';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ hasTouch: true, reducedMotion: 'reduce' });
  const errors = [], results = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  for (const width of [320, 375, 390, 430, 768, 1023, 1024, 1122, 1280, 1440]) {
    await page.setViewportSize({ width, height: 926 });
    await page.goto('http://127.0.0.1:3103/services', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const region = page.locator('#service-menu [role="region"]');
    assert.equal(await region.locator('article').count(), 4);
    assert.equal(await page.locator('#service-menu a').count(), 0);
    const metrics = await region.evaluate(e => ({ width: innerWidth, pageWidth: document.documentElement.scrollWidth, cards: [...e.children].map(c => ({ x: c.getBoundingClientRect().x, width: c.getBoundingClientRect().width })), snap: getComputedStyle(e).scrollSnapType }));
    assert(metrics.pageWidth <= width);
    if (width < 768) {
      assert.equal(metrics.cards[0].x, 20);
      assert(Math.abs(metrics.cards[0].width - width * .8) < 1);
      assert(Math.abs(metrics.cards[1].x - metrics.cards[0].x - metrics.cards[0].width - 12) < 1);
      assert(metrics.cards[1].x < width);
      assert.equal(metrics.snap, 'x mandatory');
      await page.getByRole('button', { name: 'DX戦略設計を表示', exact: true }).click();
      await page.waitForTimeout(300);
      assert(Math.abs(await region.locator('article').nth(3).evaluate(e => e.getBoundingClientRect().x) - 20) < 1);
      assert.equal(await page.getByRole('button', { name: 'DX戦略設計を表示', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: 'AI業務アプリ開発を表示', exact: true }).click();
      await page.waitForTimeout(200);
      await region.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
      assert(await region.evaluate(e => e.scrollLeft) > 0);
      await page.getByRole('button', { name: 'AI業務アプリ開発を表示', exact: true }).click();
      if (width === 390) {
        await page.locator('#service-menu').scrollIntoViewIfNeeded();
        await page.screenshot({ path: out + '/sp-menu.png' });
        const box = await region.boundingBox(), cdp = await page.context().newCDPSession(page);
        const y = box.y + 100;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 330, y }] });
        for (let x = 310; x >= 80; x -= 23) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }); await page.waitForTimeout(25); }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(900);
        assert(await region.evaluate(e => e.scrollLeft) > 200);
        await page.screenshot({ path: out + '/sp-swiped.png' });
        const settled = await region.evaluate(e => e.scrollLeft);
        await page.waitForTimeout(1500);
        assert.equal(await region.evaluate(e => e.scrollLeft), settled);
        await cdp.detach();
      }
    } else if (width >= 1024) assert(metrics.cards.every(c => Math.abs(c.x - metrics.cards[0].x) > 0 || c === metrics.cards[0]));
    if ([390, 1122, 1440].includes(width)) await page.screenshot({ path: out + `/full-${width}.png`, fullPage: true });
    results.push(metrics);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 600 });
  await page.addInitScript(() => {
    window.revealCalls = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) { if (this.dataset.scrollReveal === 'target') window.revealCalls.push({ className: this.className, options }); return animate.call(this, frames, options); };
  });
  await page.goto('http://127.0.0.1:3103/services', { waitUntil: 'networkidle' });
  await page.locator('#service-menu').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const calls = await page.evaluate(() => window.revealCalls);
  assert(calls.some(c => c.options.duration === 900 && c.options.delay === 125));
  const count = calls.length;
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('#service-menu').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  assert.equal((await page.evaluate(() => window.revealCalls)).length, count);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#service-menu').scrollIntoViewIfNeeded();
  assert.equal((await page.evaluate(() => window.revealCalls)).length, 0);
  assert.equal(errors.length, 0);
  fs.writeFileSync(out + '/verification.json', JSON.stringify({ results, calls, errors, physicalIPhoneSafari: '未確認' }, null, 2));
  await browser.close();
  console.log('PASS: 10 widths, final-card alignment, dots, keyboard, touch swipe, no autoplay, reveal once, reduced motion, errors0');
})().catch(e => { console.error(e); process.exit(1); });
