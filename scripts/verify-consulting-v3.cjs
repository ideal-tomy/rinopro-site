const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright",
);
const base = process.argv[2] || "http://127.0.0.1:3108";
const out = process.argv[3] || "docs/consulting-v3-2026-10-09";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [],
    results = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    const response = await page.goto(base + "/services/consulting", {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("main img").evaluate((e) => e.decode());
    await page.waitForTimeout(1000);
    assert.deepEqual(await page.locator("main h2").allTextContents(), [
      "支援範囲",
      "相談例",
      "支援内容",
      "ご相談について",
    ]);
    assert.equal(await page.locator("main h1").count(), 1);
    assert.equal(
      await page.locator("main br, main details, main dialog").count(),
      0,
    );
    assert.equal(await page.locator('main a[href^="#"]').count(), 3);
    assert(
      !/資料の見本|支援体制|ご相談から契約まで|支援内容・成果物/.test(
        await page.locator("main").innerText(),
      ),
    );
    const tabs = page.getByRole("tab");
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click();
      await page.waitForFunction(
        (index) =>
          document
            .querySelector("#example-tab-" + index)
            ?.getAttribute("aria-selected") === "true",
        i,
      );
      assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
      assert.equal(await page.getByRole("tabpanel").count(), 1);
      assert(
        (await page.getByRole("tabpanel").innerText()).includes(
          "実績ではありません",
        ),
      );
      assert((await tabs.nth(i).boundingBox()).height >= 44);
      if ([390, 1440].includes(width))
        await page
          .getByRole("tabpanel")
          .screenshot({ path: out + "/example-" + i + "-" + width + ".png" });
    }
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    await page.keyboard.press("End");
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
    for (const id of ["scope", "examples", "support"]) {
      await page.locator('a[href="#consulting-' + id + '"]').click();
      await page.waitForTimeout(150);
      assert(
        await page
          .locator("#consulting-" + id)
          .evaluate((e) => e.getBoundingClientRect().top >= 63),
      );
    }
    await page.evaluate(() => {
      document.activeElement?.blur();
      scrollTo(0, 0);
    });
    const metrics = await page.evaluate(() => {
      const main = document.querySelector("main");
      const image = main.querySelector("img"),
        r = image.getBoundingClientRect();
      const stepList = main.querySelector('[id="consulting-support"] ul');
      const steps = [...stepList.children].map((e) => {
        const b = e.getBoundingClientRect();
        return {
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
          font: getComputedStyle(e.querySelector("p")).fontSize,
          background: getComputedStyle(e, "::before").clipPath,
        };
      });
      return {
        width: innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        overflow: [...main.querySelectorAll("*")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return b.width > 1 && (b.right > innerWidth + 1 || b.left < -1);
          })
          .map((e) => e.tagName + ":" + e.className),
        image: { width: r.width, height: r.height },
        frames: [...image.parentElement.querySelectorAll("span")].map((e) => {
          const b = e.getBoundingClientRect();
          return {
            left: ((b.left - r.left) / r.width) * 100,
            top: ((b.top - r.top) / r.height) * 100,
            width: (b.width / r.width) * 100,
            height: (b.height / r.height) * 100,
          };
        }),
        steps,
        tabRows: [...main.querySelectorAll('[role="tab"]')].map(
          (e) => e.getBoundingClientRect().top,
        ),
      };
    });
    assert(metrics.pageWidth <= width, JSON.stringify(metrics));
    assert.equal(metrics.overflow.length, 0, JSON.stringify(metrics.overflow));
    assert(
      Math.abs(metrics.image.width / metrics.image.height - 1672 / 941) < 0.005,
    );
    assert.equal(metrics.frames.length, 2);
    metrics.frames.forEach((f, i) => {
      assert(Math.abs(f.left - [1.2, 20.8][i]) < 0.1);
      assert(Math.abs(f.top - 14.2) < 0.1);
      assert(Math.abs(f.width - 18.4) < 0.1);
      assert(Math.abs(f.height - 61.8) < 0.1);
    });
    assert.equal(new Set(metrics.tabRows).size, 1);
    assert.equal(metrics.steps.length, 4);
    assert(
      metrics.steps.every(
        (s) => parseFloat(s.font) >= 16 && s.background !== "none",
      ),
    );
    assert.equal(
      new Set(metrics.steps.map((s) => s.y)).size,
      width >= 1024 ? 1 : 4,
    );
    await page.screenshot({
      path: out + "/full-" + width + ".png",
      fullPage: true,
    });
    if ([390, 1440].includes(width)) {
      for (const id of ["scope", "examples", "support"]) {
        const bounds = await page.locator("#consulting-" + id).evaluate((e) => {
          const r = e.getBoundingClientRect();
          return {
            left: Math.round(r.left),
            top: Math.round(r.top + scrollY),
            width: Math.round(r.width),
            height: Math.floor(r.height),
          };
        });
        await require("sharp")(out + "/full-" + width + ".png")
          .extract(bounds)
          .toFile(out + "/" + id + "-" + width + ".png");
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
  assert.equal(
    await page.locator("main h1").evaluate((e) => getComputedStyle(e).color),
    "rgb(11, 25, 51)",
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const plain = await noJs.newPage();
  await plain.goto(base + "/services/consulting", { waitUntil: "networkidle" });
  assert.equal(await plain.locator("#consulting-scope:visible").count(), 1);
  assert.equal(await plain.locator("#consulting-support:visible").count(), 1);
  assert.equal(await plain.locator("main details, main dialog").count(), 0);
  await noJs.close();
  const contact = await page.goto(base + "/contact", {
    waitUntil: "networkidle",
  });
  assert.equal(contact.status(), 200);
  assert.equal(errors.length, 0, JSON.stringify(errors));
  fs.writeFileSync(
    out + "/verification.json",
    JSON.stringify(
      { results, errors, darkMode: "pass", noJavaScript: "pass", contact: 200 },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("PASS tabs, keyboard, anchors, contact, dark mode, no-JS");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
