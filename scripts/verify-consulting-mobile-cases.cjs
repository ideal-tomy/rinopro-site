const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  sharp = require("sharp");
const {
  chromium,
} = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3000",
  out = "docs/consulting-mobile-cases-2026-10-09";
fs.mkdirSync(out, { recursive: true });
async function captureSection(page, section, path) {
  const style = await page.addStyleTag({
    content: "header.sticky { visibility: hidden !important; }",
  });
  const rect = await section.evaluate((e) => ({
    top: e.getBoundingClientRect().top + scrollY,
    height: e.getBoundingClientRect().height,
  }));
  await page.evaluate(() => document.fonts.ready);
  const full = await page.screenshot({ fullPage: true });
  await sharp(full)
    .extract({
      left: 0,
      top: Math.round(rect.top),
      width: page.viewportSize().width,
      height: Math.round(rect.height),
    })
    .toFile(path);
  await style.evaluate((e) => e.remove());
}
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" }),
      errors = [],
      results = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const width of [320, 372, 390, 430, 767, 768, 1440]) {
      await page.setViewportSize({ width, height: width === 372 ? 614 : 960 });
      await page.goto(base + "/services/consulting", {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator("#consulting-examples");
      if (width < 768) {
        assert.equal(await section.getByRole("tab").count(), 0);
        const track = section.locator("ol");
        const cards = track.locator("li");
        const dots = section.getByRole("button");
        assert.equal(await cards.count(), 3);
        assert.equal(await dots.count(), 3);
        const card0 = await cards.first().boundingBox(),
          card1 = await cards.nth(1).boundingBox();
        assert(card1.x < width && card1.x > width - 32);
        if (width <= 430)
          assert(card0.width / width >= 0.83 && card0.width / width <= 0.9);
        for (let i = 0; i < 3; i++) {
          await dots.nth(i).click();
          await page.waitForTimeout(150);
          assert.equal(await dots.nth(i).getAttribute("aria-current"), "true");
          assert((await section.innerText()).includes(`${i + 1} / 3`));
          const box = await cards.nth(i).boundingBox();
          assert(Math.abs(box.x - (width < 360 ? 16 : 20)) < 2);
          assert((await dots.nth(i).boundingBox()).height >= 44);
          const body = await cards
            .nth(i)
            .locator("dd")
            .first()
            .evaluate((e) => ({
              font: getComputedStyle(e).fontSize,
              scroll: e.scrollHeight,
              client: e.clientHeight,
            }));
          assert.equal(body.font, "16px");
          assert(body.scroll <= body.client + 1);
          if (width === 372) {
            await section.evaluate((e) =>
              scrollTo(0, e.getBoundingClientRect().top + scrollY - 64),
            );
            const end = await dots.nth(i).boundingBox();
            assert(end.y + end.height <= 614, JSON.stringify(end));
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(100);
            await page.screenshot({
              path: `${out}/mobile-372-case-${i + 1}.png`,
            });
          }
        }
        await track.evaluate((e) =>
          e.scrollTo({ left: 0, behavior: "instant" }),
        );
        await page.waitForTimeout(150);
        assert.equal(await dots.first().getAttribute("aria-current"), "true");
        await track.evaluate((e) =>
          e.scrollTo({ left: e.scrollWidth, behavior: "instant" }),
        );
        await page.waitForTimeout(150);
        assert.equal(await dots.last().getAttribute("aria-current"), "true");
        await dots.first().focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(150);
        assert.equal(await dots.nth(1).getAttribute("aria-current"), "true");
        assert.equal(
          (await section.innerText()).split(
            "相談内容に応じた検討例です。実績ではありません。",
          ).length - 1,
          1,
        );
        await page.setViewportSize({
          width: width === 767 ? 766 : width + 1,
          height: 960,
        });
        await page.waitForTimeout(150);
        assert.equal(await dots.nth(1).getAttribute("aria-current"), "true");
        await page.setViewportSize({ width, height: 960 });
        await page.waitForTimeout(150);
      } else {
        const tabs = section.getByRole("tab");
        assert.equal(await tabs.count(), 3);
        assert.equal(await section.getByRole("button").count(), 0);
        for (let i = 0; i < 3; i++) {
          await tabs.nth(i).click();
          assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
          assert(
            (await section.getByRole("tabpanel").innerText()).includes(
              "相談の状況",
            ),
          );
        }
        await tabs.first().click();
        if (width === 1440)
          await captureSection(page, section, out + "/desktop-1440.png");
      }
      assert(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        `overflow ${width}`,
      );
      results.push({ width, passed: true });
    }
    // Text enlargement must grow cards without clipping.
    await page.setViewportSize({ width: 372, height: 614 });
    await page.goto(base + "/services/consulting", {
      waitUntil: "networkidle",
    });
    const cards = page.locator("#consulting-examples ol li");
    const before = (await cards.first().boundingBox()).height;
    await page.addStyleTag({
      content:
        "#consulting-examples article :is(h3,p,dt,dd){font-size:150% !important}",
    });
    const after = (await cards.first().boundingBox()).height;
    assert(after > before);
    assert(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
    );
    await page
      .locator("#consulting-examples")
      .screenshot({ path: out + "/text-enlarged.png" });
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      out + "/verification.json",
      JSON.stringify(
        { base, results, textEnlargement: { before, after }, errors },
        null,
        2,
      ),
    );
    console.log(results);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
