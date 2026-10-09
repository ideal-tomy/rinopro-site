const fs = require("node:fs"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3000",
  out = "docs/service-navigation-2026-10-09";
fs.mkdirSync(out, { recursive: true });
async function settle(p) {
  await p.waitForTimeout(400);
  await p.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((i) => {
          const r = i.getBoundingClientRect();
          return r.bottom > 0 && r.top < innerHeight;
        })
        .map((i) =>
          Promise.race([
            i.decode().catch(() => {}),
            new Promise((r) => setTimeout(r, 5000)),
          ]),
        ),
    );
  });
}
(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    const p = await b.newPage({ reducedMotion: "reduce" }),
      errors = [],
      results = [];
    p.on("pageerror", (e) => errors.push(e.message));
    for (const width of [320, 390, 768, 1024, 1440]) {
      await p.setViewportSize({ width, height: width === 390 ? 614 : 900 });
      await p.goto(base + "/services/insourcing-enablement", {
        waitUntil: "networkidle",
      });
      console.log("width", width);
      if (width < 768) {
        const trigger = p.locator("#mobile-menu-trigger");
        await trigger.click();
        const dialog = p.getByRole("dialog");
        const children = dialog.getByRole("list", { name: "ご支援内容の詳細" });
        await children.getByRole("link").first().waitFor({ state: "visible" });
        assert.equal(await children.getByRole("link").count(), 2);
        assert.equal(
          await children
            .getByRole("link", { name: "半内製化", exact: true })
            .getAttribute("aria-current"),
          "page",
        );
        assert.equal(await trigger.getAttribute("aria-expanded"), "true");
        await settle(p);
        await p.screenshot({ path: `${out}/menu-${width}.png` });
        await p.keyboard.press("Escape");
        await dialog.waitFor({ state: "hidden" });
        assert.equal(await trigger.getAttribute("aria-expanded"), "false");
        assert.equal(
          await p.evaluate(() => document.activeElement.id),
          "mobile-menu-trigger",
        );
        await trigger.click();
        await dialog
          .getByRole("link", { name: "コンサルティング", exact: true })
          .click();
        await p.waitForURL("**/services/consulting");
        await dialog.waitFor({ state: "hidden" });
        assert.equal(
          await p.locator("main h1").innerText(),
          "コンサルティング",
        );
      }
      for (const [route, navLabel, target] of [
        ["/services/consulting", "ページ内リンク", "consulting-support"],
        [
          "/services/insourcing-enablement",
          "半内製化のページ内リンク",
          "development",
        ],
      ]) {
        await p.goto(base + route, { waitUntil: "networkidle" });
        const nav = p.getByRole("navigation", { name: navLabel, exact: true });
        await nav.locator(`a[href="#${target}"]`).click();
        await p.waitForTimeout(200);
        const nb = await nav.boundingBox(),
          heading = await p.locator("#" + target).boundingBox();
        assert(Math.abs(nb.y - 64) < 2, JSON.stringify(nb));
        assert(heading.y >= nb.y + nb.height - 1);
        assert.equal(
          await nav.locator(`[href="#${target}"]`).getAttribute("aria-current"),
          "location",
        );
        assert.equal(
          await p
            .getByRole("navigation", {
              name: "ご支援内容のページ移動",
              exact: true,
            })
            .locator('a[href="/services"]')
            .count(),
          1,
        );
        assert.equal(
          await p
            .getByRole("navigation", {
              name: "ご支援内容のページ移動（末尾）",
              exact: true,
            })
            .locator('a[href="/services"]')
            .count(),
          1,
        );
      }
      const nav = p.getByRole("navigation", {
        name: "半内製化のページ内リンク",
        exact: true,
      });
      const tabs = p.getByRole("tab");
      assert.equal(await tabs.count(), 4);
      for (let i = 0; i < 4; i++) {
        await p.locator("#development ol > li").last().scrollIntoViewIfNeeded();
        await p.waitForTimeout(100);
        const tablist = await p.getByRole("tablist").boundingBox(),
          n = await nav.boundingBox();
        assert(tablist.y >= n.y + n.height - 1);
        assert(tablist.y + tablist.height < 614 || width !== 390);
        await tabs.nth(i).click();
        await p.waitForTimeout(200);
        assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
        const controls = await p.getByRole("tablist").boundingBox(),
          panel = await p.getByRole("tabpanel").boundingBox();
        assert(
          panel.y >= controls.y + controls.height - 1,
          JSON.stringify({ width, i, panel, controls }),
        );
        assert(panel.y < controls.y + controls.height + 60);
        assert.equal(await p.locator("#development img:visible").count(), 4);
      }
      if ([390, 1440].includes(width)) {
        await p.locator("#development ol > li").last().scrollIntoViewIfNeeded();
        await settle(p);
        await p.screenshot({ path: `${out}/development-reading-${width}.png` });
        await tabs.first().click();
        await p.waitForTimeout(200);
        await settle(p);
        await p.screenshot({
          path: `${out}/development-switched-${width}.png`,
        });
      }
      await tabs.first().focus();
      await p.keyboard.press("ArrowRight");
      await p.waitForTimeout(150);
      assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
      await p.keyboard.press("Home");
      assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
      await p.goto(base + "/services/consulting", { waitUntil: "networkidle" });
      if (width >= 768) {
        const t = p.getByRole("tab");
        await p
          .locator("#consulting-examples [role=tabpanel]:not([hidden])")
          .scrollIntoViewIfNeeded();
        for (let i = 0; i < 3; i++) {
          await t.nth(i).click();
          await p.waitForTimeout(100);
          assert.equal(await t.nth(i).getAttribute("aria-selected"), "true");
          const tab = await p.getByRole("tablist").boundingBox(),
            panel = await p.getByRole("tabpanel").boundingBox();
          assert(panel.y >= tab.y + tab.height - 1);
        }
        if (width === 1440) await settle(p);
        await p.screenshot({ path: out + "/consulting-tabs-1440.png" });
      } else {
        const track = p.getByRole("list", { name: "相談例の一覧" });
        await track.focus();
        await p.keyboard.press("ArrowRight");
        await p.waitForTimeout(150);
        assert.equal(
          await p
            .getByRole("button", { name: "AI導入の検討を表示" })
            .getAttribute("aria-current"),
          "true",
        );
      }
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
      );
      results.push({ width, passed: true });
    }
    // Follow both directions and the explicit parent route from a direct landing.
    await p.goto(base + "/services/consulting", { waitUntil: "networkidle" });
    await p
      .getByRole("navigation", { name: "ご支援内容のページ移動", exact: true })
      .getByRole("link", { name: "半内製化を見る" })
      .click();
    await p.waitForURL("**/services/insourcing-enablement");
    await p
      .getByRole("navigation", {
        name: "ご支援内容のページ移動（末尾）",
        exact: true,
      })
      .getByRole("link", { name: "コンサルティングを見る" })
      .click();
    await p.waitForURL("**/services/consulting");
    await p
      .getByRole("navigation", { name: "ご支援内容のページ移動", exact: true })
      .getByRole("link", { name: "ご支援内容へ戻る", exact: false })
      .click();
    await p.waitForURL("**/services");
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      out + "/verification.json",
      JSON.stringify({ base, results, errors }, null, 2),
    );
    console.log(results);
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
