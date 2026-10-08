const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright",
);
const base = process.argv[2] || "http://127.0.0.1:3104";
const out = process.argv[3] || "docs/consulting-v2-2026-10-08";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({
    reducedMotion: "reduce",
    hasTouch: true,
  });
  const errors = [],
    results = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    const response = await page.goto(base + "/services/consulting", {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("main figure img").evaluate((image) => image.decode());
    assert.equal(await page.locator("main h1").count(), 1);
    assert.deepEqual(await page.locator("main h2").allTextContents(), [
      "支援範囲",
      "相談例",
      "支援内容・成果物",
      "支援体制",
      "ご相談から契約まで",
    ]);
    assert.equal(await page.locator("main br").count(), 0);
    const metrics = await page.evaluate(() => {
      const main = document.querySelector("main"),
        image = main.querySelector("figure img");
      const rect = image.getBoundingClientRect();
      const headings = [...main.querySelectorAll("h2")].map((e) => ({
        text: e.textContent,
        size: getComputedStyle(e).fontSize,
        color: getComputedStyle(e).color,
      }));
      return {
        width: innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        image: { width: rect.width, height: rect.height, src: image.src },
        headings,
        frames: [...image.parentElement.querySelectorAll("span")].map((e) => {
          const b = e.getBoundingClientRect();
          return {
            left: ((b.left - rect.left) / rect.width) * 100,
            top: ((b.top - rect.top) / rect.height) * 100,
            width: (b.width / rect.width) * 100,
            height: (b.height / rect.height) * 100,
            color: getComputedStyle(e).borderColor,
          };
        }),
        overflow: [...main.querySelectorAll("*")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.width && (r.right > innerWidth + 1 || r.left < -1);
          })
          .map((e) => e.tagName + ":" + e.className),
      };
    });
    assert(metrics.pageWidth <= width, JSON.stringify(metrics));
    assert.equal(metrics.overflow.length, 0, JSON.stringify(metrics.overflow));
    assert(
      Math.abs(metrics.image.width / metrics.image.height - 1672 / 941) < 0.005,
    );
    assert(metrics.image.src.includes("services01.jpg"));
    metrics.frames.forEach((frame, i) => {
      assert(Math.abs(frame.left - [1.2, 20.8][i]) < 0.1);
      assert(Math.abs(frame.top - 14.2) < 0.1);
      assert(Math.abs(frame.width - 18.4) < 0.1);
      assert(Math.abs(frame.height - 61.8) < 0.1);
      assert.equal(frame.color, "rgb(234, 88, 12)");
    });
    assert.equal(new Set(metrics.headings.map((h) => h.size)).size, 1);
    assert(metrics.headings.every((h) => h.color === "rgb(17, 17, 17)"));
    const tabs = page.getByRole("tab");
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click();
      assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
      assert.equal(await page.getByRole("tabpanel").count(), 1);
      assert(
        await page
          .getByRole("tabpanel")
          .innerText()
          .then(
            (t) =>
              t.includes("実績ではありません。") &&
              t.includes("比較する対応方法"),
          ),
      );
      assert((await tabs.nth(i).boundingBox()).height >= 44);
    }
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    await page.keyboard.press("End");
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
    const details = page.locator("main details");
    assert.equal(await details.first().getAttribute("open"), "");
    for (let i = 0; i < 4; i++) {
      const row = details.nth(i),
        before = await row.evaluate((e) => e.open);
      await row.locator("summary").focus();
      await page.keyboard.press("Enter");
      assert.equal(await row.evaluate((e) => e.open), !before);
      await row.locator("summary").click();
      assert.equal(await row.evaluate((e) => e.open), before);
    }
    const samples = page.locator('main button[aria-haspopup="dialog"]');
    for (let i = 0; i < 4; i++) {
      await samples.nth(i).click();
      const modal = page.getByRole("dialog");
      assert(await modal.isVisible());
      assert(
        await modal
          .innerText()
          .then((t) => t.includes("実際の納品物・顧客データではありません。")),
      );
      assert(
        await page
          .getByRole("button", { name: "閉じる ×" })
          .evaluate((e) => e === document.activeElement),
      );
      await page.keyboard.press("Shift+Tab");
      assert(await modal.evaluate((e) => e.contains(document.activeElement)));
      assert(
        await modal
          .locator("td")
          .first()
          .evaluate((e) => parseFloat(getComputedStyle(e).fontSize) >= 14),
      );
      assert(await modal.evaluate((e) => e.scrollWidth <= e.clientWidth));
      if ([390, 1440].includes(width) && i === 2)
        await page.screenshot({ path: `${out}/modal-${width}.png` });
      if (i === 0) await page.keyboard.press("Escape");
      else if (i === 1) await page.mouse.click(3, 3);
      else await page.getByRole("button", { name: "閉じる ×" }).click();
      assert.equal(await modal.isVisible(), false);
      assert(
        await samples.nth(i).evaluate((e) => e === document.activeElement),
      );
    }
    for (const id of ["scope", "examples", "support", "team", "contract"]) {
      await page.locator(`a[href="#consulting-${id}"]`).click();
      await page.waitForTimeout(150);
      assert(
        await page
          .locator(`#consulting-${id} h2`)
          .evaluate((e) => e.getBoundingClientRect().top >= 63),
      );
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/full-${width}.png`, fullPage: true });
    if ([390, 1440].includes(width)) {
      for (const id of ["scope", "examples", "support", "team", "contract"]) {
        const box = await page.locator(`#consulting-${id}`).evaluate((e) => {
          const b = e.getBoundingClientRect();
          return {
            left: Math.round(b.left),
            top: Math.round(b.top + scrollY),
            width: Math.round(b.width),
            height: Math.floor(b.height),
          };
        });
        await require("sharp")(`${out}/full-${width}.png`)
          .extract(box)
          .toFile(`${out}/${id}-${width}.png`);
      }
    }
    results.push(metrics);
    console.log("PASS width", width);
  }
  await page.emulateMedia({
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  await page.reload({ waitUntil: "networkidle" });
  assert(
    await page
      .locator("main h2")
      .first()
      .evaluate((e) => getComputedStyle(e).color === "rgb(17, 17, 17)"),
  );
  assert.equal(
    await page
      .locator("main")
      .evaluate((e) => e.getAnimations({ subtree: true }).length),
    0,
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const plain = await noJs.newPage();
  await plain.goto(base + "/services/consulting");
  assert.equal(await plain.locator("#consulting-scope:visible").count(), 1);
  assert.equal(await plain.locator("#consulting-contract:visible").count(), 1);
  await noJs.close();
  const destinations = [];
  for (const path of [
    "/contact",
    "/services/insourcing-enablement",
    "/services",
  ]) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    destinations.push({ path, status: response.status() });
  }
  fs.writeFileSync(
    `${out}/verification.json`,
    JSON.stringify(
      {
        results,
        destinations,
        errors,
        darkMode: "pass",
        reducedMotion: "pass",
        noJavaScript: "pass",
      },
      null,
      2,
    ),
  );
  await browser.close();
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log(
    "PASS all interactions, keyboard, focus, links, dark mode, no-JS",
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
