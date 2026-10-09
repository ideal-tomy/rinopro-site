const fs = require("node:fs");
const assert = require("node:assert/strict");
const {
  chromium,
} = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 614 },
      reducedMotion: "no-preference",
    });
    await page.goto("http://127.0.0.1:3109/services/insourcing-enablement", {
      waitUntil: "networkidle",
    });
    await page.locator("#development ol > li").last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.getByRole("tab").nth(1).click();
    await page.waitForTimeout(1200);
    const controls = await page.getByRole("tablist").boundingBox(),
      panel = await page.getByRole("tabpanel").boundingBox();
    console.log({ controls, panel });
    assert(
      panel.y >= controls.y + controls.height - 1 &&
        panel.y < controls.y + controls.height + 60,
    );
    const nav = page.getByRole("navigation", {
      name: "半内製化のページ内リンク",
      exact: true,
    });
    const link = nav.locator('[aria-current="location"]');
    const a = await link.boundingBox(),
      v = await nav.boundingBox();
    assert(a.x >= v.x - 1 && a.x + a.width <= v.x + v.width + 1);
    fs.writeFileSync(
      "docs/service-navigation-2026-10-09/normal-motion.json",
      JSON.stringify(
        { passed: true, controls, panel, currentLinkVisible: true },
        null,
        2,
      ),
    );
    console.log("Normal motion and active link visibility passed");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
