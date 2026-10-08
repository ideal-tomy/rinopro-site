const fs = require('fs'), assert = require('node:assert/strict');
const { chromium } = require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const out = 'docs/consulting-2026-10-07';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ hasTouch: true, reducedMotion: 'reduce' });
  const errors = [], results = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  for (const width of [375, 390, 430, 768, 1023, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 926 });
    const response = await page.goto('http://127.0.0.1:3103/services/consulting', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('figure img').evaluate(image => image.decode());
    await page.waitForTimeout(200);
    assert.equal(await page.locator('main h1').count(), 1);
    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('[aria-labelledby="consulting-heading"]'), figure = hero.querySelector('figure'), image = figure.querySelector('img');
      const box = e => e.getBoundingClientRect().toJSON();
      const wrapper = image.parentElement;
      return { width: innerWidth, pageWidth: document.documentElement.scrollWidth, hero: box(hero), image: box(image), imageFit: getComputedStyle(image).objectFit, naturalRatio: image.naturalWidth / image.naturalHeight, imageSrc: image.getAttribute('src'), frames: [...figure.querySelector('[aria-hidden]').children].slice(0, 2).map(e => ({ left: (e.getBoundingClientRect().left - wrapper.getBoundingClientRect().left) / wrapper.getBoundingClientRect().width * 100, top: (e.getBoundingClientRect().top - wrapper.getBoundingClientRect().top) / wrapper.getBoundingClientRect().height * 100, width: e.getBoundingClientRect().width / wrapper.getBoundingClientRect().width * 100, height: e.getBoundingClientRect().height / wrapper.getBoundingClientRect().height * 100, color: getComputedStyle(e).borderColor, background: getComputedStyle(e).backgroundColor })), tracks: [...document.querySelectorAll('main [role="region"]')].map(e => ({ x: box(e).x, width: box(e).width, snap: getComputedStyle(e).scrollSnapType, cards: [...e.children].map(box) })) };
    });
    assert(metrics.pageWidth <= width);
    assert(metrics.imageSrc.includes('services01.jpg'));
    assert.equal(metrics.imageFit, 'contain');
    // srcsetによるnaturalWidth/Heightは密度補正後に整数化されるため、元素材の比率で確認。
    assert(Math.abs(metrics.image.width / metrics.image.height - 1672 / 941) < .005, JSON.stringify({width, image:metrics.image, natural:metrics.naturalRatio}));
    metrics.frames.forEach((frame, i) => {
      assert(Math.abs(frame.left - [1.2, 20.8][i]) < .1);
      assert(Math.abs(frame.top - 14.2) < .1);
      assert(Math.abs(frame.width - 18.4) < .1);
      assert(Math.abs(frame.height - 61.8) < .1);
      assert.equal(frame.color, 'rgb(234, 88, 12)');
      assert(frame.background.includes('0.12'));
    });
    for (let i = 0; i < 2; i++) {
      const track = page.locator('main [role="region"]').nth(i);
      assert.equal(await track.locator('article').count(), 3);
      if (width < 768) {
        const metric = metrics.tracks[i];
        assert.equal(metric.snap, 'x mandatory');
        assert(Math.abs(metric.cards[0].width / metric.width - .86) < .005);
        assert(metric.cards[1].x < metric.x + metric.width);
        const name = i === 0 ? '実行・検証の計画を表示' : '実行・検証計画を表示';
        await page.getByRole('button', { name, exact: true }).click();
        await page.waitForTimeout(300);
        assert.equal(await page.getByRole('button', { name, exact: true }).getAttribute('aria-pressed'), 'true');
        const offset = await track.evaluate(e => e.children[2].getBoundingClientRect().left - e.getBoundingClientRect().left);
        assert(Math.abs(offset) < 1);
        await page.getByRole('button', { name: i === 0 ? '現状・課題の整理を表示' : '課題整理表を表示', exact: true }).click();
      } else assert(metrics.tracks[i].cards.every(card => Math.abs(card.y - metrics.tracks[i].cards[0].y) < 1));
    }
    for (const id of ['consulting-support', 'consulting-process', 'consulting-deliverables']) {
      await page.locator(`a[href="#${id}"]`).click();
      await page.waitForTimeout(500);
      assert(await page.locator(`#${id} h2`).evaluate(e => e.getBoundingClientRect().top >= 63));
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(500);
    if ([390, 768, 1024, 1440].includes(width)) await page.screenshot({ path: out + `/after-${width}-full.png`, fullPage: true });
    if (width === 390) {
      await page.screenshot({ path: out + '/sp-top.png' });
      await page.locator('#consulting-support').scrollIntoViewIfNeeded();
      await page.screenshot({ path: out + '/sp-support.png' });
      const track = page.locator('main [role="region"]').first(), box = await track.boundingBox(), cdp = await page.context().newCDPSession(page);
      const y = box.y + 80;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y }] });
      for (let x = 290; x >= 70; x -= 22) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }); await page.waitForTimeout(25); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(800);
      assert(await track.evaluate(e => e.scrollLeft) > 100);
      await cdp.detach();
      await page.locator('#consulting-deliverables').scrollIntoViewIfNeeded();
      await page.screenshot({ path: out + '/sp-deliverables.png' });
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await page.screenshot({ path: out + '/sp-bottom.png' });
    }
    results.push(metrics);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 600 });
  await page.addInitScript(() => {
    window.consultingReveals = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) {
      if (this.dataset.scrollReveal === 'target') window.consultingReveals.push({ id: this.id, options });
      return animate.call(this, frames, options);
    };
  });
  await page.goto('http://127.0.0.1:3103/services/consulting', { waitUntil: 'networkidle' });
  await page.locator('#consulting-support').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  const reveals = await page.evaluate(() => window.consultingReveals);
  assert(reveals.some(item => item.id === 'consulting-support' && item.options.duration === 900));
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('#consulting-support').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  assert.equal((await page.evaluate(() => window.consultingReveals)).filter(item => item.id === 'consulting-support').length, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#consulting-support').scrollIntoViewIfNeeded();
  assert.equal((await page.evaluate(() => window.consultingReveals)).length, 0);
  const consultingErrors = [...errors];
  assert.equal(consultingErrors.length, 0, JSON.stringify(consultingErrors));
  errors.length = 0;
  for (const path of ['/services', '/services/insourcing-enablement', '/experience', '/contact', '/about']) {
    const response = await page.goto('http://127.0.0.1:3103' + path, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    if (path === '/services') assert.equal(await page.locator('#service-menu article').count(), 4);
  }
  fs.writeFileSync(out + '/verification.json', JSON.stringify({ results, reveals, consultingErrors, destinationErrors: errors, physicalIPhoneSafari: '未確認' }, null, 2));
  await browser.close();
  console.log('PASS: 8 widths, complete hero, original orange frames, 3-card swipe/dots/final alignment, touch input, anchors, destination HTTP200, consulting errors0. Destination errors:', errors);
})().catch(e => { console.error(e); process.exit(1); });
