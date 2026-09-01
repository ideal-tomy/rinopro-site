/** 外部デモ URL（Ideal TOP §03 と同型） */
export const EXTERNAL_DEMO_URLS = {
  construction: "https://construction-demo-two.vercel.app",
  manufacturingIdeal: "https://product-flowideal.vercel.app/manufacturing",
  approvalDiagram: "https://approvaldiagram.vercel.app/",
  childcare: "https://childcaredemo.vercel.app/",
} as const;

export type TopFeaturedDemoId =
  | "construction-record"
  | "manufacturing-judgment"
  | "approval-double-check"
  | "childcare-support";

export type TopFeaturedDemo = {
  id: TopFeaturedDemoId;
  title: string;
  lead: string;
  before: string;
  after: string;
  tags: string[];
  showcase: TopFeaturedDemoId;
  tryHref: string;
  tryLabel: string;
  tryExternal?: boolean;
  sampleNote?: string;
};

export const TOP_FEATURED_DEMOS: TopFeaturedDemo[] = [
  {
    id: "construction-record",
    title: "現場写真が、報告までつながる。",
    lead: "サンプル写真で、分類から報告書の下書きまで流れを辿れます。",
    before: "IMGのまま散在し、退勤後に手作業で報告",
    after: "意味のある名前に整理され、報告までつながる",
    tags: ["建設", "写真", "報告書"],
    showcase: "construction-record",
    tryHref: EXTERNAL_DEMO_URLS.construction,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "実ファイルのアップロードは不要です（サンプルで体験できます）",
  },
  {
    id: "manufacturing-judgment",
    title: "現場の判断が、根拠付きで揃う。",
    lead: "サンプルの質問から、回答と出典がセットで返る流れを体験できます。",
    before: "資料を探し回り、判断が属人化する",
    after: "回答と根拠が同時に得られ、次の手が揃う",
    tags: ["製造", "ナレッジ", "判断"],
    showcase: "manufacturing-judgment",
    tryHref: EXTERNAL_DEMO_URLS.manufacturingIdeal,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "サンプル質問で完走できます（実データ不要）",
  },
  {
    id: "approval-double-check",
    title: "ダブルチェックは、AI×人で早く確実に。",
    lead: "図面と証明書の突合せが、承認に残る。",
    before: "突合せが属人化し、後から範囲を絞れない",
    after: "一致・要確認・記載なしが分かれ、根拠が承認に残る",
    tags: ["製造", "品質", "承認"],
    showcase: "approval-double-check",
    tryHref: EXTERNAL_DEMO_URLS.approvalDiagram,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "操作は「次へ」だけです（約1分・サンプル）",
  },
  {
    id: "childcare-support",
    title: "子どものために働く、裏方AI。",
    lead: "園の出来事が、根拠付きの報告になる。",
    before: "事案記録と保護者連絡が後回しになる",
    after: "ルール引用付きの報告書下書きまで一気に揃う",
    tags: ["保育", "報告", "ナレッジ"],
    showcase: "childcare-support",
    tryHref: EXTERNAL_DEMO_URLS.childcare,
    tryLabel: "デモシナリオで体験 ↗",
    tryExternal: true,
    sampleNote: "マイク実録音は不要です（デモシナリオで体験できます）",
  },
];

export function getTopFeaturedDemos(): TopFeaturedDemo[] {
  return TOP_FEATURED_DEMOS;
}
