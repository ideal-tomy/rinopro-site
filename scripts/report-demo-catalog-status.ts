/**
 * 全 aiDemo の listedOnCatalog・体験レジストリ照会を出力（社内用）。
 * npx tsx scripts/report-demo-catalog-status.ts
 * npx tsx scripts/report-demo-catalog-status.ts --csv
 *
 * 必要: .env.local に SANITY_PROJECT_ID / SANITY_DATASET（または NEXT_PUBLIC_*）
 */
import { config } from "dotenv";

config({ path: ".env.local" });

import { fetchAllAiDemos } from "../src/lib/sanity/fetch";
import { getDemoSlugsLinkedToExperienceRegistry } from "../src/lib/experience/prototype-registry";

function escCsv(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const csv = process.argv.includes("--csv");
  const demos = await fetchAllAiDemos();
  const exp = getDemoSlugsLinkedToExperienceRegistry();

  if (demos.length === 0) {
    console.error("aiDemo が0件、または Sanity の取得に失敗しました（環境変数を確認）。");
    process.exit(1);
  }

  const rows = demos.map((d) => {
    const slug = d.slug ?? "";
    const listed = d.listedOnCatalog !== false;
    const inRegistry = Boolean(slug && exp.has(slug));
    return {
      slug,
      title: d.title ?? "",
      listedOnCatalog: listed,
      primaryPortfolioTrack: d.primaryPortfolioTrack ?? "",
      runMode: d.runMode ?? "",
      industry: d.industry ?? "",
      experienceRegistry: inRegistry,
    };
  });

  if (csv) {
    const header =
      "slug,title,listedOnCatalog,primaryPortfolioTrack,runMode,industry,experienceRegistry";
    console.log(header);
    for (const r of rows) {
      console.log(
        [
          escCsv(r.slug),
          escCsv(r.title),
          r.listedOnCatalog,
          escCsv(r.primaryPortfolioTrack),
          escCsv(r.runMode),
          escCsv(r.industry),
          r.experienceRegistry,
        ].join(",")
      );
    }
    return;
  }

  const w = { slug: 28, title: 36, listed: 8, track: 18, run: 14, ind: 12, exp: 6 };
  console.log(
    `${"slug".padEnd(w.slug)} ${"listed".padEnd(w.listed)} ${"expReg".padEnd(w.exp)} ${"track".padEnd(w.track)} ${"runMode".padEnd(w.run)} ${"industry".padEnd(w.ind)} title`
  );
  for (const r of rows) {
    console.log(
      `${r.slug.slice(0, w.slug).padEnd(w.slug)} ${String(r.listedOnCatalog).padEnd(w.listed)} ${String(r.experienceRegistry).padEnd(w.exp)} ${(r.primaryPortfolioTrack || "—").slice(0, w.track).padEnd(w.track)} ${(r.runMode || "—").slice(0, w.run).padEnd(w.run)} ${(r.industry || "—").slice(0, w.ind).padEnd(w.ind)} ${r.title}`
    );
  }
  console.log(`\n合計 ${rows.length} 件（listedOnCatalog=true 相当: ${rows.filter((r) => r.listedOnCatalog).length}）`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
