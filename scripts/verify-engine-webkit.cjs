const fs = require('node:fs');
// Point to a temporary Playwright installation; no project dependency is needed.
const { webkit, chromium, devices } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const chrome = process.argv.includes('--chrome');
  const browser = await (chrome ? chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}) : webkit.launch());
  const page = await browser.newPage({ ...(process.argv.includes('--desktop') ? {viewport:{width:1280,height:900}} : devices['iPhone 13']), ignoreHTTPSErrors: true, reducedMotion:process.argv.includes('--reduced')?'reduce':'no-preference' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => {if(e.type()==='error') errors.push(e.text());});
  await page.goto(process.argv[2] || 'https://axeon.jp', {waitUntil:'networkidle'});
  const diagram = page.locator('[role="img"][aria-label^="現場の知恵"]');
  await diagram.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3500);
  const result = await diagram.evaluate(async el => {
    const g = [...el.querySelectorAll('g')].find(e => e.textContent.includes('意思決定'));
    const rect = g.getBoundingClientRect();
    const intersection = await new Promise(resolve => { const io = new IntersectionObserver(es => {resolve({ratio:es[0].intersectionRatio,intersects:es[0].isIntersecting});io.disconnect();});io.observe(g);});
    return {opacity:getComputedStyle(g).opacity,transform:getComputedStyle(g).transform,rect:rect.toJSON(),intersection,html:g.outerHTML};
  });
  if (process.argv.includes('--diagnose')) {
    result.withoutTransform = await diagram.evaluate(async el => {
      const g = [...el.querySelectorAll('g')].find(e => e.textContent.includes('意思決定'));
      g.style.transform = 'none';
      return await new Promise(resolve => { const io = new IntersectionObserver(es => {resolve({ratio:es[0].intersectionRatio,intersects:es[0].isIntersecting});io.disconnect();});io.observe(g);});
    });
  }
  const tag = process.argv[3] || 'before';
  result.errors = errors;
  fs.writeFileSync(`docs/engine-diagram-2026-10-06/${tag}-webkit.json`, JSON.stringify(result,null,2));
  await diagram.screenshot({path:`docs/engine-diagram-2026-10-06/${tag}-webkit.png`});
  console.log(JSON.stringify(result));
  await browser.close();
})();
