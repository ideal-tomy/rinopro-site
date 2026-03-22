/**
 * docs/demo-portfolio-triage.md のスケルトンを
 * docs/demo-mock-inventory.md の一覧表から再生成する。
 * 実行: npx tsx scripts/generate-demo-portfolio-triage-md.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const invPath = join(process.cwd(), "docs", "demo-mock-inventory.md");
const outPath = join(process.cwd(), "docs", "demo-portfolio-triage.md");

const inv = readFileSync(invPath, "utf8");
const rows: { no: number; title: string; slug: string }[] = [];
const re = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*`([^`]+)`\s*\|/g;
let m: RegExpExecArray | null;
while ((m = re.exec(inv)) !== null) {
  const no = parseInt(m[1], 10);
  if (no < 1 || no > 100) continue;
  rows.push({ no, title: m[2].trim(), slug: m[3].trim() });
}

rows.sort((a, b) => a.no - b.no);

const tableBody = rows
  .map(
    (r) =>
      `| ${r.no} | \`${r.slug}\` | ${r.title} | 未査定 |  |  |  |  |  |  |  |  |`,
  )
  .join("\n");

const md = `# デモポートフォリオ・トリアージ表

最終更新（自動生成）: スクリプト実行日時は git で確認。手編集した列がある場合、再実行すると **未査定行が上書きされる** ので、再生成前にバックアップするか、スクリプトを拡張すること。

**運用ルール**: [demo-portfolio-governance.md](demo-portfolio-governance.md)

**再生成**: \`npx tsx scripts/generate-demo-portfolio-triage-md.ts\`

## 列の意味

| 列 | 説明 |
|----|------|
| 主ラベル | \`①\` 文章カタログ / \`②\` 体験 / \`③\` プロダクト / \`④\` 保留 / \`未査定\` |
| ②URL | 体験用アプリ・外部デモの URL（②または③で使用） |
| ③メモ | プロダクト化・見積用の1行（誰が・何が減るか） |
| ④Rank | ④のとき **A〜D**（[governance](demo-portfolio-governance.md#④保留ランク-ad)）。①〜③のときは空でよい |
| 保留タグ | 例: \`需要不明\` \`成果物曖昧\` など（governance 参照） |
| 需要・難易・わかりやすさ | 高/中/低 や短文メモ |

## マスター（100本）

| No | slug | タイトル | 主ラベル | ②URL | ③メモ | ④Rank | 保留タグ | 需要 | 難易 | わかりやすさ | 備考 |
|---:|------|----------|----------|------|------|---------|----------|------|------|-------------|------|
${tableBody}

---

## 削除候補（Dランク確定）

運用: **D に確定した slug** を下に追記する（実行は governance の削除チェックリストに従う）。

- （現時点: なし）

`;

writeFileSync(outPath, md, "utf8");
console.log(`Wrote ${outPath} (${rows.length} rows)`);
