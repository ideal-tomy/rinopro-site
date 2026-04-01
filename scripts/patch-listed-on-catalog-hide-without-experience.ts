/**
 * 体験レジストリに無い aiDemo の listedOnCatalog を false にする（任意実行）。
 * 正の運用は Studio でもよい。本スクリプトは一括適用の補助。
 *
 * npx tsx scripts/patch-listed-on-catalog-hide-without-experience.ts --dry-run
 * npx tsx scripts/patch-listed-on-catalog-hide-without-experience.ts --apply
 *
 * 必要: .env.local に SANITY_API_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET
 */
import { config } from "dotenv";

config({ path: ".env.local" });

import { createClient } from "@sanity/client";
import { getDemoSlugsLinkedToExperienceRegistry } from "../src/lib/experience/prototype-registry";

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

const ROW_QUERY = `*[_type == "aiDemo"] | order(_createdAt desc) {
  _id,
  "slug": slug.current,
  listedOnCatalog
}`;

type Row = { _id: string; slug: string | null; listedOnCatalog?: boolean };

async function main() {
  const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");
  if (!projectId || !dataset) {
    console.error("SANITY_PROJECT_ID と SANITY_DATASET を設定してください");
    process.exit(1);
  }
  if (!dryRun && !token) {
    console.error("--apply には SANITY_API_TOKEN が必要です");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token: token ?? undefined,
    useCdn: false,
  });

  const rows = await client.fetch<Row[]>(ROW_QUERY);
  const exp = getDemoSlugsLinkedToExperienceRegistry();

  const targets = rows.filter((r) => {
    if (!r.slug) return false;
    if (exp.has(r.slug)) return false;
    return r.listedOnCatalog !== false;
  });

  console.log(
    dryRun
      ? "[dry-run] 以下に listedOnCatalog:false を設定します（--apply で実行）"
      : "[apply] listedOnCatalog:false を書き込みます"
  );
  for (const r of targets) {
    console.log(`${r._id}\t${r.slug}`);
  }
  console.log(`件数: ${targets.length}`);

  if (dryRun || targets.length === 0) return;

  for (const r of targets) {
    await client.patch(r._id).set({ listedOnCatalog: false }).commit();
  }
  console.log("完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
