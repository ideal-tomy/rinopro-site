/**
 * メインLP「Industry Showcase」（実装事例カード）用データ。
 * 外部デプロイURLは NEXT_PUBLIC_SHOWCASE_* を優先し、未設定時は
 * 指定済み公開URL（gempo / recruit-cockpit）または `/experience#demo-{slug}` にフォールバック。
 */

export type ImplementationShowcaseItem = {
  slug: string;
  brandName: string;
  productTitle: string;
  catchCopy: string;
  industryLabel: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  /** 環境変数キー（NEXT_PUBLIC_ プレフィックスは resolve で付与） */
  externalEnvKey?:
    | "NEXT_PUBLIC_SHOWCASE_GEMPO_URL"
    | "NEXT_PUBLIC_SHOWCASE_SHAKEN_URL"
    | "NEXT_PUBLIC_SHOWCASE_RECRUIT_URL"
    | "NEXT_PUBLIC_SHOWCASE_SALES_URL"
    | "NEXT_PUBLIC_SHOWCASE_SHIFT_URL";
  /** 自サイト内パス（externalEnvKey より優先） */
  internalPath?: string;
  /** 固定外部URL（externalEnvKey 未使用で直接リンクしたいとき） */
  externalUrl?: string;
  openInNewTab: boolean;
  liveDemo?: boolean;
};

function pickExternalUrl(
  envKey: NonNullable<ImplementationShowcaseItem["externalEnvKey"]>,
  slug: string
): string {
  const v = process.env[envKey]?.trim();
  if (v) return v;
  if (slug === "gempo") return "https://kanri-kensetsu.vercel.app/";
  if (slug === "recruit-cockpit") return "https://saiyou-demo0420.vercel.app/";
  if (slug === "sales-pipeline")
    return "https://leaning-dashboard.vercel.app/?industry=sales";
  if (slug === "shift-auto") return "https://thunderous-crepe-b5a4e3.netlify.app/";
  return `/experience#demo-${slug}`;
}

/** LP・詳細ページから slug で参照 */
export function getImplementationShowcaseBySlug(
  slug: string
): ImplementationShowcaseItem | undefined {
  return IMPLEMENTATION_SHOWCASE_ITEMS.find((i) => i.slug === slug);
}

export function resolveImplementationShowcaseHref(
  item: ImplementationShowcaseItem
): string {
  if (item.internalPath) return item.internalPath;
  if (item.externalUrl) return item.externalUrl;
  if (item.externalEnvKey) return pickExternalUrl(item.externalEnvKey, item.slug);
  return `/experience#demo-${item.slug}`;
}

/** 表示順固定の10件（外部デモ8 + サイト内LIVE2） */
export const IMPLEMENTATION_SHOWCASE_ITEMS: readonly ImplementationShowcaseItem[] =
  [
    {
      slug: "gempo",
      brandName: "GEMPO",
      productTitle: "建設業向け 現場ポケット",
      catchCopy: "現場・事務所、どこからでもアクセス",
      industryLabel: "建設・工事",
      thumbnailSrc: "/images/genbakanri_admin.webp",
      thumbnailAlt: "GEMPO 現場ポケットの管理画面スクリーンショット",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_GEMPO_URL",
      openInNewTab: true,
    },
    {
      slug: "shaken-notify",
      brandName: "Shaken Notify",
      productTitle: "車検管理ダッシュボード",
      catchCopy: "車検期限と通知運用を一元管理",
      industryLabel: "整備・車両管理",
      thumbnailSrc: "/images/kurumakanri_pc.webp",
      thumbnailAlt: "車検管理ダッシュボードのスクリーンショット",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_SHAKEN_URL",
      openInNewTab: true,
    },
    {
      slug: "recruit-cockpit",
      brandName: "採用コックピット",
      productTitle: "採用・選考パイプライン管理",
      catchCopy: "候補者・選考・KPIを1画面で",
      industryLabel: "人事・採用",
      thumbnailSrc: "/images/saiyoumaching_pc.webp",
      thumbnailAlt: "採用・選考パイプライン管理のスクリーンショット",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_RECRUIT_URL",
      openInNewTab: true,
    },
    {
      slug: "sales-pipeline",
      brandName: "営業ダッシュボード",
      productTitle: "営業パイプライン テンプレート",
      catchCopy: "商談進行・受注見込みを一覧で",
      industryLabel: "営業・経営支援",
      thumbnailSrc: "/images/salesdashboard_pc.webp",
      thumbnailAlt: "営業パイプラインのダッシュボード画面",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_SALES_URL",
      openInNewTab: true,
    },
    {
      slug: "shift-auto",
      brandName: "SHIFT AUTO",
      productTitle: "シフト自動くん",
      catchCopy: "スタッフの希望から最適シフトを生成",
      industryLabel: "飲食・サービス",
      thumbnailSrc: "/images/shiftkanri_pc.mp4",
      thumbnailAlt: "シフト自動くんのデモ動画",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_SHIFT_URL",
      openInNewTab: true,
    },
    {
      slug: "restaurant-ops-dashboard-demo",
      brandName: "Restaurant Ops",
      productTitle: "飲食店オペレーション・ダッシュボード",
      catchCopy:
        "売上・シフト・入金などオペレーションを、業務UIで短時間に体感",
      industryLabel: "飲食・サービス",
      thumbnailSrc: "/images/top07_restauland.png",
      thumbnailAlt: "飲食店オペレーション・ダッシュボードの画面イメージ",
      internalPath: "/experience/restaurant-ops-dashboard-demo",
      openInNewTab: false,
      liveDemo: true,
    },
    {
      slug: "internal-knowledge-bot",
      brandName: "AI Knowledge Bot",
      productTitle: "社内ナレッジ共有BOT",
      catchCopy: "業種別ナレッジに即答するAI",
      industryLabel: "横断（AIアシスタント）",
      thumbnailSrc: "/media/showcase/internal-knowledge-share-bot.mp4",
      thumbnailAlt: "社内ナレッジ共有BOTのデモ動画",
      internalPath: "/experience/internal-knowledge-share-bot",
      openInNewTab: false,
      liveDemo: true,
    },
    {
      slug: "hr-evaluation-support",
      brandName: "人事評価サポートAIツール",
      productTitle: "評価コメント・面談準備サポート",
      catchCopy: "評価プロセスを整理して、判断のムラを減らす",
      industryLabel: "人事・組織開発",
      thumbnailSrc: "/images/hyouka_pc.png",
      thumbnailAlt: "人事評価サポートAIツールの画面イメージ",
      externalUrl: "https://kouken-demo.vercel.app/",
      openInNewTab: true,
    },
    {
      slug: "handover-ai-charting",
      brandName: "申し送りAI",
      productTitle: "自動カルテ作成サポート",
      catchCopy: "音声メモから申し送り内容を素早く構造化",
      industryLabel: "医療・介護",
      thumbnailSrc: "/images/voicememo.png",
      thumbnailAlt: "申し送りAI（自動カルテ作成）の画面イメージ",
      externalUrl: "https://lambent-smakager-7bcf0a.netlify.app/",
      openInNewTab: true,
    },
    {
      slug: "property-matching",
      brandName: "物件マッチング",
      productTitle: "条件整理と提案候補の可視化",
      catchCopy: "希望条件に合わせて提案候補を素早く比較",
      industryLabel: "不動産",
      thumbnailSrc: "/images/hudousan_pc.png",
      thumbnailAlt: "物件マッチングの画面イメージ",
      externalUrl: "https://candid-salmiakki-22e9c7.netlify.app/",
      openInNewTab: true,
    },
  ];
