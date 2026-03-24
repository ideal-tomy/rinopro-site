export type ExperiencePrototypeTier = "track3" | "track2";

export interface ExperiencePrototypeMeta {
  slug: string;
  title: string;
  tier: ExperiencePrototypeTier;
  /** 対応する文章デモ slug（同一の場合もある） */
  demoSlug: string;
  shortDescription: string;
  inputHint: string;
}

/** ③を先、②を後（一覧・静的パラメータの順序） */
export const EXPERIENCE_PROTOTYPES: ExperiencePrototypeMeta[] = [
  {
    slug: "legal-memory-secretary",
    title: "10年分の記憶を持つ秘書",
    tier: "track3",
    demoSlug: "legal-memory-secretary",
    shortDescription:
      "過去文書を引用付きで探し、要約と次アクションまで一画面で整理します。",
    inputHint: "例: 港区の賃貸、3年前の契約で解約条項は？",
  },
  {
    slug: "service-claim-reply-assist",
    title: "クレーム返信下書き",
    tier: "track3",
    demoSlug: "service-claim-reply-assist",
    shortDescription:
      "お客様向け返信案と社内メモを並べ、承認の流れをイメージできます。",
    inputHint: "例: 配送が1日遅れ、お詫びと再配送希望",
  },
  {
    slug: "internal-knowledge-share-bot",
    title: "社内ナレッジ共有BOT（業種別・二画面）",
    tier: "track3",
    demoSlug: "internal-knowledge-share-bot",
    shortDescription:
      "ステップガイドとチャットの両方から、同じルールで回答。業種別の出典・ポリシーを体験できます。",
    inputHint: "業種を選び、ガイドまたはチャットから質問してください。",
  },
  {
    slug: "restaurant-ops-dashboard-demo",
    title: "飲食店オペレーション・ダッシュボード（シナリオ再生）",
    tier: "track3",
    demoSlug: "restaurant-ops-dashboard-demo",
    shortDescription:
      "白基調の業務UIで、シフト承認・入客分析・レシート経費・給与試算・精算状況を1本のログで追体験できます。",
    inputHint: "「最初から再生」で自動化の流れを確認してください。",
  },
  {
    slug: "inquiry-intake-triage-demo",
    title: "問い合わせ受付トリアージ（分類・返信草案）",
    tier: "track3",
    demoSlug: "inquiry-intake-triage-demo",
    shortDescription:
      "問い合わせ本文からカテゴリ・優先度・タグを付与し、顧客向け返信案と社内メモをモック生成します。",
    inputHint: "例: 配送が遅れている／商品が破損／解約の手続きを知りたい",
  },
  {
    slug: "workflow-approval-lite-demo",
    title: "承認・通知フロー（ライト）",
    tier: "track3",
    demoSlug: "workflow-approval-lite-demo",
    shortDescription:
      "承認待ち一覧からワンタップで承認・差し戻しするUIの体験。通知・アラート連携のイメージ用です。",
    inputHint: "各行のボタンで状態を更新して操作感を確認してください。",
  },
  {
    slug: "ops-report-metrics-demo",
    title: "数値メモから週次レポート草案",
    tier: "track3",
    demoSlug: "ops-report-metrics-demo",
    shortDescription:
      "箇条書きの数値・メモから、KPIカードと要約・次アクション案をモック生成します。",
    inputHint: "例: 売上320万 / 欠品3SKU / 客訴2件 などを改行で入力",
  },
  {
    slug: "property-exterior-photo-memo",
    title: "外観・共用部の写真メモ",
    tier: "track2",
    demoSlug: "property-exterior-photo-memo",
    shortDescription: "写真から状況タグと記録メモ、次アクションをまとめます。",
    inputHint: "例: 共用廊下の照明が1基消灯、管理会社へ連絡予定",
  },
  {
    slug: "receipt-photo-expense-memo",
    title: "領収書から経費メモ",
    tier: "track2",
    demoSlug: "receipt-photo-expense-memo",
    shortDescription: "領収書から項目抽出と精算前チェックを一覧化します。",
    inputHint: "例: 出張タクシー、領収書のみ手元",
  },
  {
    slug: "driver-voice-incident-draft",
    title: "配送インシデント報告",
    tier: "track2",
    demoSlug: "driver-voice-incident-draft",
    shortDescription:
      "書き起こしをレーンへ振り分け、報告ドラフトと荷主連絡メモをモックで組み立てます。",
    inputHint:
      "例: 積み忘れ1箱、15時着予定が17時に変更連絡済み（分割後にドラッグでレーンへ）",
  },
];

const PROTOTYPE_SLUGS = new Set(EXPERIENCE_PROTOTYPES.map((p) => p.slug));

/** トップ・/demo で最上段に置く注力プロトタイプ（順序固定） */
export const FEATURED_EXPERIENCE_SLUGS = [
  "internal-knowledge-share-bot",
  "restaurant-ops-dashboard-demo",
] as const;

export type FeaturedExperienceSlug =
  (typeof FEATURED_EXPERIENCE_SLUGS)[number];

const FEATURED_SLUG_SET = new Set<string>(FEATURED_EXPERIENCE_SLUGS);

export function getFeaturedExperiencePrototypes(): ExperiencePrototypeMeta[] {
  return FEATURED_EXPERIENCE_SLUGS.map((slug) => {
    const meta = EXPERIENCE_PROTOTYPES.find((p) => p.slug === slug);
    if (!meta) {
      throw new Error(`Featured prototype missing from registry: ${slug}`);
    }
    return meta;
  });
}

export function getOtherExperiencePrototypes(): ExperiencePrototypeMeta[] {
  return EXPERIENCE_PROTOTYPES.filter((p) => !FEATURED_SLUG_SET.has(p.slug));
}

export function getExperiencePrototypeBySlug(
  slug: string
): ExperiencePrototypeMeta | undefined {
  return EXPERIENCE_PROTOTYPES.find((p) => p.slug === slug);
}

/** Sanity に experienceUrl が無い場合でも、体験ページへ誘導するホワイトリスト */
export function getExperienceUrlForDemoSlug(
  demoSlug: string | undefined
): string | undefined {
  if (!demoSlug || !PROTOTYPE_SLUGS.has(demoSlug)) return undefined;
  return `/experience/${demoSlug}`;
}
