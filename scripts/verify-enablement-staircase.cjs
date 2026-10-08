const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  sharp = require("sharp");
const {
  chromium,
} = require("C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3000",
  out = "docs/enablement-staircase-2026-10-09";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    const p = await b.newPage({ reducedMotion: "reduce" }),
      results = [],
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "/services/insourcing-enablement", {
        waitUntil: "networkidle",
      });
      const section = p.locator("#approach");
      await section.scrollIntoViewIfNeeded();
      await p.evaluate(() => document.fonts.ready);
      const cards = section.locator("ol > li");
      assert.equal(await cards.count(), 4);
      const metrics = await cards.evaluateAll((es) =>
        es.map((e) => {
          const r = e.getBoundingClientRect(),
            h = e.querySelector("h3"),
            n = h.firstElementChild,
            t = n.nextElementSibling;
          const line = getComputedStyle(e, "::after"),
            connector = getComputedStyle(e, "::before");
          return {
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            height: r.height,
            lineDisplay: line.display,
            lineBottom: parseFloat(line.bottom),
            lineBorder: parseFloat(line.borderBottomWidth),
            connectorDisplay: connector.display,
            connectorHeight: parseFloat(connector.height),
            connectorLeft: parseFloat(connector.left),
            number: n.getBoundingClientRect().toJSON(),
            title: t.getBoundingClientRect().toJSON(),
            bodyFont: getComputedStyle(e.querySelector("p")).fontSize,
            body: e.querySelector("p").textContent,
          };
        }),
      );
      for (const m of metrics) {
        assert(m.title.x > m.number.x);
        assert(Math.abs(m.title.y - m.number.y) < 2);
        assert(parseFloat(m.bodyFont) >= 16);
      }
      if (width >= 1024) {
        for (let i = 1; i < 4; i++) {
          assert(Math.abs(metrics[i - 1].top - metrics[i].top - 28) < 1);
          assert(Math.abs(metrics[i - 1].bottom - metrics[i].bottom - 28) < 1);
          assert(Math.abs(metrics[i].height - metrics[0].height) < 1);
        }
        for (let i = 0; i < 4; i++) {
          assert.equal(metrics[i].lineBottom, -12);
          assert.equal(metrics[i].lineBorder, 2);
          if (i < 3) {
            assert.equal(metrics[i].connectorHeight, 28);
            const x = metrics[i].left + metrics[i].connectorLeft;
            assert(x > metrics[i].right && x < metrics[i + 1].left);
          }
        }
        const note = await section.locator("ol + div p").boundingBox();
        assert(Math.abs(note.y - (metrics[0].bottom + 12) - 28) < 2);
      } else {
        for (let i = 1; i < 4; i++)
          assert(metrics[i].top > metrics[i - 1].bottom);
        for (const m of metrics) assert.equal(m.lineDisplay, "none");
      }
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
      );
      if ([390, 1024, 1280, 1440].includes(width)) {
        const style = await p.addStyleTag({
          content: "header.sticky{visibility:hidden !important}",
        });
        const rect = await section.evaluate((e) => ({
          top: e.getBoundingClientRect().top + scrollY,
          height: e.getBoundingClientRect().height,
        }));
        const full = await p.screenshot({ fullPage: true });
        await sharp(full)
          .extract({
            left: 0,
            top: Math.round(rect.top),
            width,
            height: Math.round(rect.height),
          })
          .toFile(`${out}/approach-${width}.png`);
        await style.evaluate((e) => e.remove());
      }
      results.push({ width, metrics });
    }
    await p.setViewportSize({ width: 320, height: 900 });
    await p.goto(base + "/services/insourcing-enablement", {
      waitUntil: "networkidle",
    });
    await p.addStyleTag({
      content: "#approach :is(h3,p){font-size:150% !important}",
    });
    assert(
      !(await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
    );
    await p
      .locator("#approach")
      .screenshot({ path: out + "/text-enlarged.png" });
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      out + "/verification.json",
      JSON.stringify({ base, results, errors }, null, 2),
    );
    console.log(results.map((r) => ({ width: r.width, passed: true })));
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
