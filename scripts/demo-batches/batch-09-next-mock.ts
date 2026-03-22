/**
 * バッチ09: 社内ナレッジ共有BOT（ツールdemoは入口、本編は /experience ）
 */

export const batch09NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "社内ナレッジ共有BOT（業種別・二画面体験）",
    slug: { _type: "slug" as const, current: "internal-knowledge-share-bot" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder:
      "※ 本デモの操作は「画面を体験する」からインタラクティブ版へ進んでください",
    mockOutputPrimary: `## 1. このデモで体験できること

- **ステップガイド**と**チャット**の両方から、**同じリゾルバ**（意図→ナレッジ参照→回答）に到達します。
- **10業種**の社内FAQモック（建設・医療事務・介護・製造・小売・不動産・金融・ITヘルプ・物流・自治体/BPO）を切り替え可能です。
- **料金・条件はナレッジ範囲のみ**／**出典付き**／**KBにない場合はエスカレ**など、ポリシーを画面に表示します。

## 2. インタラクティブ体験へ

次のURLを開いてください（業種は \`?industry=construction\` などで深リンク可能）。

- パス: \`/experience/internal-knowledge-share-bot\`
- 例: 建設 \`?industry=construction\`、小売 \`?industry=retail_ec\`、不動産 \`?industry=real_estate\``,
    mockOutputSecondary: `## 3. 補助（社内向けメモ）

- チャット欄は**キーワード一致**のモックです（実LLMではありません）。
- 実AI接続・RAGは別フェーズで \`/demo\` の \`ai_live\` やAPIに切り替え可能な設計を想定しています。`,
    systemPrompt:
      "このドキュメントはプロトタイプ説明用です。ユーザーにはインタラクティブ体験URLへ誘導してください。",
    outputStructure:
      "体験内容の説明、インタラクティブURL、社内向け補足の3ブロックで出力すること。",
    sampleData: [
      "ヘルメットのルールを知りたい（建設）",
      "返品は何日以内？（小売）",
      "この部屋の賃料は？（不動産・KB外エスカレの確認）",
    ],
    ctaTitle: "業種別ナレッジとガバナンスを、画面で確認したい場合はお問い合わせください。",
    ctaButtonText: "相談する",
    description:
      "ステップガイドとLINE風チャットを同じバックエンドで動かす社内案内BOTの体験。出典・ポリシー制御の見せ方を確認できます。",
    industryTags: ["建設", "医療", "介護", "製造", "小売", "不動産", "金融", "SaaS", "物流", "自治体"],
    functionTags: ["問い合わせ対応", "要約"],
    moduleTags: ["LLM", "RAG"],
    oneLiner: "10業種の社内ナレッジBOTを二画面で体験",
    primaryPortfolioTrack: "experience" as const,
  },
];
