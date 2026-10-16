/** 外部デモ URL（Ideal TOP §03 と同型） */
export const EXTERNAL_DEMO_URLS = {
  construction: "https://construction-demo-six.vercel.app/",
  manufacturingIdeal: "https://axeonmanufacturing02.vercel.app/",
  approvalDiagram: "https://approval-diagram.vercel.app/",
  childcare: "https://childcare-demo-six.vercel.app/",
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
    lead: "サンプル写真で、分類から報告下書きまでの流れを体験できます。",
    before: "写真がIMGのまま散在し、退勤後に手作業で報告",
    after: "意味ある名前に整理され、報告まで一気につながる",
    tags: ["建設", "写真", "報告書"],
    showcase: "construction-record",
    tryHref: EXTERNAL_DEMO_URLS.construction,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "サンプルで完走できます（実データは不要です）",
  },
  {
    id: "manufacturing-judgment",
    title: "現場の判断が、根拠付きで揃う。",
    lead: "サンプル質問で、回答と出典がセットで返る流れを体験できます。",
    before: "資料探しと属人判断で、現場が止まりやすい",
    after: "回答と根拠が同時に揃い、次の手が決まる",
    tags: ["製造", "ナレッジ", "判断"],
    showcase: "manufacturing-judgment",
    tryHref: EXTERNAL_DEMO_URLS.manufacturingIdeal,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "サンプルで完走できます（実データは不要です）",
  },
  {
    id: "approval-double-check",
    title: "ダブルチェックは、AI×人で早く確実に。",
    lead: "サンプル図面と証明書で、突合せから承認まで体験できます。",
    before: "突合せが属人化し、後から範囲を絞れない",
    after: "一致・要確認・記載なしが分かれ、承認に残る",
    tags: ["製造", "品質", "承認"],
    showcase: "approval-double-check",
    tryHref: EXTERNAL_DEMO_URLS.approvalDiagram,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "サンプルで完走できます（実データは不要です）",
  },
  {
    id: "childcare-support",
    title: "子どものために働く、裏方AI。",
    lead: "サンプルシナリオで、記録から報告書下書きまで体験できます。",
    before: "事案記録と保護者連絡が、後回しになりやすい",
    after: "ルール引用付きの下書きまで、一気に揃う",
    tags: ["保育", "報告", "ナレッジ"],
    showcase: "childcare-support",
    tryHref: EXTERNAL_DEMO_URLS.childcare,
    tryLabel: "サンプルで体験 ↗",
    tryExternal: true,
    sampleNote: "サンプルで完走できます（実データは不要です）",
  },
];

export function getTopFeaturedDemos(): TopFeaturedDemo[] {
  return TOP_FEATURED_DEMOS;
}
