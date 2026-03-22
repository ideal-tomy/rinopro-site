/**
 * docs/demo-titles-and-purpose.md を生成
 * 実行: npx tsx scripts/generate-demo-titles-md.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEMO_CATALOG_PURPOSES } from "./demo-catalog-purposes";
import { nextMockDemos } from "./demo-batches";

const existingMeta: { title: string; description: string }[] = [
  {
    title: "現場監督の影武者",
    description:
      "写真1枚＋音声メモから、点検報告書と協力会社への指示メールを自動生成。スマホだけで完結し、帰社後の事務作業が半減します。",
  },
  {
    title: "10年分の記憶を持つ秘書",
    description:
      "曖昧な質問から契約書・メール・チャットを横断検索し要約。探す時間0秒体験を実演し、再現性を示します。",
  },
  {
    title: "クレームをファンに変える返信下書き",
    description:
      "問い合わせ文を解析し、怒りのポイントを分解。丁寧かつポリシー準拠の返信案を即提示。担当者の負担減と炎上予防を同時に実現します。",
  },
  {
    title: "議事録を3秒で",
    description:
      "会議音声から議事録とアクション項目を自動抽出。議事録作成の手間をゼロにします。",
  },
  {
    title: "受注書を即作成",
    description:
      "受注内容を入力するだけで、受注書と社内メモを即生成。入力ミスを防ぎ、業務を効率化します。",
  },
  {
    title: "プレゼン資料の骨子作成",
    description:
      "テーマと目的を入力するだけで、プレゼンの骨子と時間配分を即提示。資料作成の時間を半減します。",
  },
  {
    title: "契約書レビューサマリ",
    description:
      "契約書の要点を入力すると、重要条項のサマリと確認推奨事項を即提示。法務負荷を軽減します。",
  },
  {
    title: "見積書ドラフト",
    description:
      "見積内容を入力するだけで、見積書ドラフトを即生成。営業の事務作業を効率化します。",
  },
  {
    title: "日報・週報の要約",
    description:
      "日報・週報の要点を入力すると、サマリと共有メモを即生成。報告業務の負荷を軽減します。",
  },
  {
    title: "写真から点検報告",
    description:
      "写真1枚＋メモから、点検報告書と次アクションを即生成。現場の記録業務を効率化します。",
  },
];

const fromBatches = nextMockDemos.map((d) => ({
  title: d.title,
  description: d.description ?? "",
}));

const all = [...existingMeta, ...fromBatches];

if (all.length !== DEMO_CATALOG_PURPOSES.length) {
  console.error(
    `件数不一致: デモ ${all.length} 本 / 目的文 ${DEMO_CATALOG_PURPOSES.length} 本。demo-catalog-purposes.ts を更新してください。`,
  );
  process.exit(1);
}

const titleList = all.map((r, i) => `${i + 1}. ${r.title}`).join("\n");

const detail = all
  .map((r, i) => {
    const n = i + 1;
    const purpose = DEMO_CATALOG_PURPOSES[i]!;
    return `### ${n}. ${r.title}

- **説明（seed の description）**: ${r.description}
- **このツールデモの目的**: ${purpose}
`;
  })
  .join("\n");

const md = `# デモタイトル一覧とツールとしての目的

- **生成元**: \`scripts/seed-ai-demos.ts\` の \`existingDemos\`（10本）＋ \`scripts/demo-batches/index.ts\` の \`nextMockDemos\`（90本）＝計 **${all.length}** 本
- **目的文の編集元**: \`scripts/demo-catalog-purposes.ts\`（説明文を踏まえた1行ラベル。改善時はここを直してから本ファイルを再生成）
- **再生成コマンド**: \`npx tsx scripts/generate-demo-titles-md.ts\`

---

## 1. タイトル一覧（${all.length}本）

${titleList}

---

## 2. タイトル・説明・ツールとしての目的（全${all.length}本）

${detail}

---

## 3. 改善メモ（タイトル／説明／モックのズレ）

- **コピーと入力UI**: 例として「現場監督の影武者」は説明が「写真＋音声」だが \`inputType\` は \`audio_text\` のみ。ユーザーが「何を入力すればいいデモか」が分からなくなる典型です。
- **業種タグ（\`industry\`）とタイトル**: 不動産・医療っぽいタイトルで \`industry: legal\` のまま、などスキーマ上の業種と見た目がずれると、フィルタやコンシェルジュ推薦が弱くなります。
- **モック出力と systemPrompt**: タイトルは「秘書」でもモックが別シナリオ、など返答がタイトルと無関係に見える場合は、\`mockOutput*\` / \`sampleData\` / \`systemPrompt\` の三者をセットで揃えると改善しやすいです。
`;

writeFileSync(join(process.cwd(), "docs", "demo-titles-and-purpose.md"), md, "utf8");
console.log(`Wrote docs/demo-titles-and-purpose.md (${all.length} demos)`);
