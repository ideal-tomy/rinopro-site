/**
 * UP Forward /service — Computed Style 一括採寸
 * 使い方: Chromeで https://upforward.co.jp/service を開き、DevTools Console に貼り付けて実行。
 * 表示中のビューポート（PC/SPは Device Toolbar で切り替え）の計測結果を JSON でダウンロードする。
 */
(function captureUpForwardStyles() {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      padding: cs.padding,
      margin: cs.margin,
      borderRadius: cs.borderRadius,
      position: cs.position,
      display: cs.display,
      width: Math.round(r.width),
      height: Math.round(r.height),
      left: Math.round(r.left),
      top: Math.round(r.top + window.scrollY),
    };
  };

  const qa = (sel) => [...document.querySelectorAll(sel)];

  const mediaQueries = [];
  try {
    for (const sheet of [...document.styleSheets]) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      if (!rules) continue;
      for (const rule of rules) {
        if (rule.type === CSSRule.MEDIA_RULE) {
          const cond = rule.conditionText || rule.media?.mediaText;
          if (cond) mediaQueries.push(cond);
        }
      }
    }
  } catch {
    /* ignore */
  }

  const h1 = document.querySelector("h1");
  const h2Concept = qa("h2")[0];
  const h3Service = qa("h3").find((h) => h.textContent.includes("人事評価"));
  const header = document.querySelector("header");
  const stickyMenu = qa("*").find(
    (e) =>
      getComputedStyle(e).position === "sticky" &&
      e.textContent.includes("サービス一覧"),
  );

  const gapBetween = (a, b) => {
    if (!a || !b) return null;
    return Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom);
  };
  const findH = (inc) =>
    qa("h1,h2,h3").find((h) => h.textContent.includes(inc));
  const breadcrumb = qa("*").find((e) => {
    const t = e.textContent.trim();
    return t.startsWith("TOP") && t.includes("サービス") && t.length < 25;
  });
  const upEngine = qa("*").find(
    (e) =>
      e.textContent.trim() === "UP ENGINE" &&
      parseFloat(getComputedStyle(e).fontSize) > 30,
  );
  const h3Service01 = findH("人事評価制度");
  const h3Support = qa("h3").find((h) => h.textContent === "主な支援内容");
  const h3Concerns = qa("h3").find((h) =>
    h.textContent.includes("こんな課題"),
  );
  const concernsWrap = qa("div").find(
    (d) => d.textContent.trim() === "こんな課題ありませんか？",
  );

  const serviceArts = qa("img")
    .filter((i) => /1240x536|585x804/.test(i.currentSrc || i.src || ""))
    .map((i) => ({
      asset: (i.currentSrc || i.src).split("/").pop(),
      display: getComputedStyle(i).display,
      width: Math.round(i.getBoundingClientRect().width),
      height: Math.round(i.getBoundingClientRect().height),
    }));

  const payload = {
    capturedAt: new Date().toISOString(),
    url: location.href,
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      devicePixelRatio: window.devicePixelRatio,
    },
    mediaQueries: [...new Set(mediaQueries)].sort(),
    colors: {
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      textPrimary: pick(h1)?.color,
      accentOrange: pick(
        qa("p").find((p) => p.textContent.trim() === "01"),
      )?.color,
    },
    layout: {
      header: pick(header),
      stickyLocalMenu: pick(stickyMenu),
      h1Left: h1 ? Math.round(h1.getBoundingClientRect().left) : null,
    },
    typography: {
      h1: pick(h1),
      h2Concept: pick(h2Concept),
      h3Service: pick(h3Service),
      h3SupportSection: pick(
        qa("h3").find((h) => h.textContent === "主な支援内容"),
      ),
      upEngine: pick(
        qa("*").find(
          (e) =>
            e.textContent.trim() === "UP ENGINE" &&
            parseFloat(getComputedStyle(e).fontSize) > 30,
        ),
      ),
      leadConcept: pick(qa("p").find((p) => p.textContent.includes("成長企業"))),
      supportItemTitle: pick(
        qa("p").find((p) => p.textContent.trim() === "等級制度の設計"),
      ),
      serviceNumber01: pick(
        qa("p").find(
          (p) =>
            p.textContent.trim() === "01" &&
            parseFloat(getComputedStyle(p).fontSize) > 30,
        ),
      ),
      menuLabel: pick(qa("*").find((e) => e.textContent.trim() === "MENU")),
      beforeLabel: pick(
        qa("*").find((e) => e.textContent.trim() === "BEFORE"),
      ),
      afterLabel: pick(qa("*").find((e) => e.textContent.trim() === "AFTER")),
      flowStepTitle: pick(
        qa("*").find((e) => e.textContent.trim() === "現状診断"),
      ),
      h2Voice: pick(qa("h2").find((h) => h.textContent.includes("お客様"))),
      h2Flow: pick(qa("h2").find((h) => h.textContent.includes("ご支援"))),
      h2RelatedCases: pick(
        qa("h2").find((h) => h.textContent.trim() === "導入事例"),
      ),
      testimonialBody: pick(
        qa("p").find((p) => p.textContent.includes("UP Forwardさん")),
      ),
    },
    components: {
      ctaHeader: pick(
        qa("header a").find((a) =>
          getComputedStyle(a).backgroundColor.includes("255, 122"),
        ),
      ),
      serviceArtVariants: serviceArts,
    },
    margins: {
      textComputed: {
        h1: pick(h1),
        h2Concept: pick(h2Concept),
        h3Service01: pick(h3Service01),
        h3Support: pick(h3Support),
      },
      visualGapsPx: {
        breadcrumb_to_h1: gapBetween(breadcrumb, h1),
        h1_to_upEngine: gapBetween(h1, upEngine),
        h2Concept_to_lead: gapBetween(
          h2Concept,
          qa("p").find((p) => p.textContent.includes("成長企業")),
        ),
        service01_h3_to_supportH3: gapBetween(h3Service01, h3Support),
        service01_concerns_to_before: gapBetween(
          h3Concerns,
          qa("*").find((e) => e.textContent.trim() === "BEFORE"),
        ),
        voice_h2_to_quote: gapBetween(
          qa("h2").find((h) => h.textContent.includes("お客様")),
          qa("p").find((p) => p.textContent.includes("UP Forwardさん")),
        ),
      },
      wrapperSample: concernsWrap
        ? {
            margin: getComputedStyle(concernsWrap).margin,
            marginTop: getComputedStyle(concernsWrap).marginTop,
          }
        : null,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `upforward-service-styles-${window.innerWidth}px.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  console.log("[UP Forward capture]", payload);
  return payload;
})();
