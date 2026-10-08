const fs = require("node:fs"),
  assert = require("node:assert/strict");
require("tsx/cjs");
const {
  FLOW_TRACK_ORDER,
  flowDetailPageCopyByTrack,
} = require("../src/lib/content/site-copy.ts");
const {
  chromium,
} = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
const sharp = require("sharp");
const base = process.argv[2] || "http://localhost:3000";
const out = "docs/enablement-v1-2026-10-09";
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ reducedMotion: "reduce" }),
    errors = [],
    results = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1024, 1440]) {
    console.log("width", width);
    await page.setViewportSize({ width, height: 960 });
    const res = await page.goto(base + "/services/insourcing-enablement", {
      waitUntil: "networkidle",
    });
    assert.equal(res.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("main h1").innerText(), "半内製化");
    assert.deepEqual(await page.locator("main h2").allTextContents(), [
      "支援の進め方",
      "支援を始める前に確認すること",
      "自社で進める際の課題と支援",
      "開発の進め方",
      "ご相談について",
    ]);
    const main = await page.locator("main").innerText();
    assert(
      !/なぜ内製化|得られる状態・将来像|データの流れと役割|改善サイクル（イメージ）|内製化までの流れ|関連する入口|開発・実装についてよくある質問/.test(
        main,
      ),
    );
    assert.equal(await page.locator('main img[src*="services01"]').count(), 1);
    assert.equal(await page.locator('main a[href^="#"]').count(), 4);
    const checks = page.locator("#checks button");
    assert.equal(await checks.count(), 5);
    assert.equal(await checks.first().getAttribute("aria-pressed"), "true");
    assert(
      (await page.locator("#checks [role=region]").innerText()).includes(
        "どこまで自社で対応し、どこを外部に任せるかを確認します。",
      ),
    );
    for (let i = 0; i < 5; i++) {
      await checks.nth(i).click();
      assert.equal(await checks.nth(i).getAttribute("aria-pressed"), "true");
      assert(
        (await page.locator('#checks [role="region"]').innerText()).includes(
          await checks.nth(i).innerText(),
        ),
      );
      assert((await checks.nth(i).boundingBox()).height >= 44);
    }
    const tabs = page.getByRole("tab");
    assert.equal(await tabs.count(), 4);
    for (let i = 0; i < 4; i++) {
      console.log("track", FLOW_TRACK_ORDER[i]);
      await tabs.nth(i).click();
      await page.waitForTimeout(100);
      assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
      const copy = flowDetailPageCopyByTrack[FLOW_TRACK_ORDER[i]];
      const text = await page.locator("#development").innerText();
      assert(text.includes(copy.intro.replaceAll("**", "")));
      for (const step of copy.steps) {
        assert(text.includes(step.body));
        for (const tag of step.deliverables) assert(text.includes(tag));
      }
      assert(
        !/権限とデータの境界を早い段階で固定し|安定性と安全性|認証・権限・監査を設計に組み込み/.test(
          text,
        ),
      );
      const imgs = page.locator("#development img:visible");
      assert.equal(await imgs.count(), 4);
      for (let j = 0; j < 4; j++) {
        await imgs.nth(j).scrollIntoViewIfNeeded();
        // Headless Chrome may defer a lazy image until a painted frame after scrolling.
        await page.screenshot({ animations: "disabled" });
        await imgs
          .nth(j)
          .evaluate((e) =>
            Promise.race([
              e.decode(),
              new Promise((_, reject) =>
                setTimeout(
                  () =>
                    reject(new Error("Image decode timeout: " + e.currentSrc)),
                  15000,
                ),
              ),
            ]),
          );
        assert(
          (await imgs.nth(j).getAttribute("src")).includes(
            `${FLOW_TRACK_ORDER[i]}-${copy.steps[j].step}.png`,
          ),
        );
      }
      if ([390, 1440].includes(width)) {
        const hidden = await page.addStyleTag({
          content:
            "body > header, header.fixed, header.sticky { visibility: hidden !important; }",
        });
        await page.locator("#development").screenshot({
          path: `${out}/development-${FLOW_TRACK_ORDER[i]}-${width}.png`,
        });
        await hidden.evaluate((e) => e.remove());
      }
    }
    await tabs.first().click();
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert(!overflow, `overflow ${width}`);
    for (const id of ["approach", "checks", "support", "development"]) {
      await page.locator(`main a[href="#${id}"]`).click();
      await page.waitForTimeout(100);
      assert((await page.locator("#" + id).boundingBox()).y >= 60);
    }
    assert.equal(
      await page
        .locator("main a")
        .filter({ hasText: "お問い合わせ" })
        .getAttribute("href"),
      "/contact",
    );
    if ([390, 1440].includes(width)) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `${out}/full-${width}.png`,
        fullPage: true,
      });
      const hero = await page.locator("main section").first().boundingBox();
      const cta = await page.locator("main section").last().boundingBox();
      const meta = await sharp(`${out}/full-${width}.png`).metadata();
      for (const [label, box] of [
        ["hero", hero],
        ["cta", cta],
      ]) {
        await sharp(`${out}/full-${width}.png`)
          .extract({
            left: 0,
            top: Math.round(box.y),
            width: meta.width,
            height: Math.round(box.height),
          })
          .toFile(`${out}/${label}-${width}.png`);
      }
      for (const id of ["approach", "checks", "support", "development"]) {
        const box = await page.locator("#" + id).boundingBox();
        await sharp(`${out}/full-${width}.png`)
          .extract({
            left: 0,
            top: Math.max(0, Math.round(box.y)),
            width: meta.width,
            height: Math.min(
              Math.round(box.height),
              meta.height - Math.round(box.y),
            ),
          })
          .toFile(`${out}/${id}-${width}.png`);
      }
    }
    results.push({ width, tabs: 4, checks: 5, workflowImages: 16, overflow });
  }
  for (const route of [
    "/services/consulting",
    "/services/development",
    "/contact",
  ]) {
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(res.status(), 200, route);
    if (route === "/services/consulting")
      assert.equal(
        await page.locator("main h1").innerText(),
        "コンサルティング",
      );
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    out + "/verification.json",
    JSON.stringify({ base, results, errors }, null, 2),
  );
  await browser.close();
  console.log(JSON.stringify(results));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
