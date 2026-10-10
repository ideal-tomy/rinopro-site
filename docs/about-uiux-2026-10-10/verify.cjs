const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
const base = process.argv[2] || "http://127.0.0.1:3000";
const out = "docs/about-uiux-2026-10-10";
const parse = (s) => {
  const b = s.slice(s.indexOf("export const aboutCopy"), s.indexOf("// --- 詳細見積もり"));
  return Function("return (" + b.replace("export const aboutCopy =", "").replace(/as const;\s*$/, "") + ")")();
};
const expected = parse(fs.readFileSync(out + "/before-copy.ts.txt", "utf8"));
assert.deepEqual(parse(fs.readFileSync("src/lib/content/site-copy.ts", "utf8")), expected);
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const consoleErrors = [], pageErrors = [], results = [];
    page.on("pageerror", e => pageErrors.push(e.message));
    page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
    for (const width of [1440, 1920, 768, 1024, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 960 });
      const response = await page.goto(base + "/about", { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const root = page.locator(".about-page-content");
      assert.equal(await root.locator("section").count(), 8);
      assert.equal(await root.locator("img, image, picture").count(), 0);
      assert.equal(await page.locator('[aria-labelledby="about-leaders-heading"] article > div').last().locator("p").count(), 5);
      assert.deepEqual(await page.locator('[aria-labelledby="about-leaders-heading"] article > div').last().locator("p").allTextContents(), expected.leaderProfiles.profiles[0].body);
      assert.equal(await page.locator("#about-leaders-heading").innerText(), expected.leaderProfiles.heading);
      const body = await root.textContent();
      for (const text of [expected.hero.headline, expected.hero.sub, ...expected.founding.paragraphs, ...expected.principles.items.flatMap(x => [x.title, x.lead, x.body]), expected.approach.intro, expected.teamModel.intro, expected.teamModel.footnote, expected.cta.sub]) assert.ok(body.includes(text), text);
      assert.equal(await page.locator('[aria-labelledby="about-principles-heading"] li').count(), 3);
      assert.equal(await page.locator('[aria-labelledby="about-team-heading"] li').count(), 2);
      assert.equal(await root.locator("table tbody tr").count(), 7);
      const layout = await page.evaluate(() => {
        const root = document.querySelector(".about-page-content");
        const sections = [...root.querySelectorAll("section")];
        const overflowing = [...root.querySelectorAll("*")].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width && (r.right > innerWidth + 1 || r.left < -1);
        }).map(el => el.tagName + "." + el.className);
        const grid = selector => [...document.querySelectorAll(selector)].map(el => ({x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y)}));
        return { overflow: document.documentElement.scrollWidth > innerWidth, overflowing, sectionHeights: sections.map(el => Math.round(el.getBoundingClientRect().height)), principles: grid('[aria-labelledby="about-principles-heading"] li'), team: grid('[aria-labelledby="about-team-heading"] li'), activeAnimations: root.getAnimations({subtree:true}).length };
      });
      assert.equal(layout.overflow, false);
      assert.deepEqual(layout.overflowing, []);
      assert.equal(layout.activeAnimations, 0);
      if (width >= 1024) {
        assert.equal(layout.principles[0].y, layout.principles[2].y);
        assert.equal(layout.team[0].y, layout.team[1].y);
      }
      if (width <= 430) {
        assert.equal(layout.principles[0].x, layout.principles[2].x);
        assert.equal(layout.team[0].x, layout.team[1].x);
      }
      await page.screenshot({ path: out + "/about-" + width + ".png", fullPage: true });
      if(width===1440)await root.locator("section").first().screenshot({path:out+"/hero-1440.png"});
      results.push({width,status:response.status(),...layout});
    }
    await page.locator('.about-page-content a[href="/services"]').first().click();
    await page.waitForURL("**/services");
    await page.goto(base + "/about");
    await page.locator('.about-page-content a[href="/contact"]').click();
    await page.waitForURL("**/contact");
    await page.goto(base + "/about");
    assert.equal(await page.locator('.about-page-content a[href="mailto:contact@axeon.jp"]').count(),1);
    assert.equal(await page.locator('.about-page-content a[href="https://axeon.jp"]').count(),1);
    const motionPage=await browser.newPage({reducedMotion:"no-preference",viewport:{width:1440,height:960}});
    motionPage.on("pageerror",e=>pageErrors.push(e.message));
    motionPage.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text());});
    await motionPage.addInitScript(()=>{
      window.aboutMotion=[];
      const original=Element.prototype.animate;
      Element.prototype.animate=function(frames,options){
        if(this.closest(".about-page-content"))window.aboutMotion.push({duration:options.duration,delay:options.delay,iterations:options.iterations||1});
        return original.call(this,frames,options);
      };
    });
    await motionPage.goto(base+"/about",{waitUntil:"networkidle"});
    const height=await motionPage.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=400){await motionPage.evaluate(y=>scrollTo(0,y),y);await motionPage.waitForTimeout(100);}
    const motion=await motionPage.evaluate(()=>window.aboutMotion);
    assert.ok(motion.length>0,"No one-shot reveal animation fired");
    assert.ok(motion.every(a=>a.iterations===1&&a.duration===500));
    await motionPage.emulateMedia({reducedMotion:"reduce"});
    await motionPage.waitForFunction(()=>document.querySelector(".about-page-content").getAnimations({subtree:true}).length===0);
    await motionPage.close();
    const devErrors=consoleErrors.filter(e=>e.includes("webpack-hmr"));
    const applicationErrors=consoleErrors.filter(e=>!e.includes("webpack-hmr"));
    fs.writeFileSync(out + "/verification.json",JSON.stringify({base,results,pageErrors,applicationErrors,devErrors,motion,copyUnchanged:true,links:["/services","/contact","mailto:contact@axeon.jp","https://axeon.jp"]},null,2));
    console.log(JSON.stringify({widths:results.map(x=>x.width),pageErrors,applicationErrors,devErrorCount:devErrors.length,motionSamples:motion.flat().length,copyUnchanged:true}));
    assert.deepEqual(pageErrors,[]);
    assert.deepEqual(applicationErrors,[]);
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
