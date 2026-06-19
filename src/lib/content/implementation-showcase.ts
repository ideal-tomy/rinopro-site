/**
 * メインLP「Industry Showcase」（実装事例カード）用データ。
 * 外部デプロイURLは NEXT_PUBLIC_SHOWCASE_* を優先し、未設定時は
 * 指定済み公開URLまたは `/experience#demo-{slug}` にフォールバック。
 */

export type ImplementationShowcaseItem = {
  slug: string;
  brandName: string;
  productTitle: string;
  catchCopy: string;
  industryLabel: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  /** カード用スライド（3枚想定）。未指定時は thumbnailSrc を単一表示 */
  thumbnailSlides?: readonly string[];
  /** 環境変数キー（NEXT_PUBLIC_ プレフィックスは resolve で付与） */
  externalEnvKey?:
    | "NEXT_PUBLIC_SHOWCASE_GEMPO_URL"
    | "NEXT_PUBLIC_SHOWCASE_RECRUIT_URL"
    | "NEXT_PUBLIC_SHOWCASE_SHIFT_URL";
  /** 自サイト内パス（カード・LP導線。flagship 時は詳細LP） */
  internalPath?: string;
  /** 固定外部URL（externalEnvKey 未使用で直接リンクしたいとき） */
  externalUrl?: string;
  openInNewTab: boolean;
  liveDemo?: boolean;
  /** 注目キュレーション＋サイト内LP（ハイブリッド） */
  featured?: boolean;
  flagship?: boolean;
};

/** サイト内LP（CaseStudyDetailView）を出す slug */
export const FLAGSHIP_CASE_STUDY_SLUGS = [
  "restaurant-ops-dashboard-demo",
  "gempo",
  "recruit-cockpit",
  "shift-auto",
  "internal-knowledge-bot",
  "ma-dd-valueup",
  "smart-agri-copilot",
  "hr-evaluation-support",
  "handover-ai-charting",
  "property-matching",
] as const;

export type FlagshipCaseStudySlug = (typeof FLAGSHIP_CASE_STUDY_SLUGS)[number];

export function isFlagshipCaseStudySlug(
  slug: string
): slug is FlagshipCaseStudySlug {
  return (FLAGSHIP_CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}

function pickExternalUrl(
  envKey: NonNullable<ImplementationShowcaseItem["externalEnvKey"]>,
  slug: string
): string {
  const v = process.env[envKey]?.trim();
  if (v) return v;
  if (slug === "gempo") return "https://kanri-kensetsu.vercel.app/";
  if (slug === "recruit-cockpit") return "https://saiyou-demo0420.vercel.app/";
  if (slug === "shift-auto") return "https://thunderous-crepe-b5a4e3.netlify.app/";
  return `/experience#demo-${slug}`;
}

/** LP・詳細ページから slug で参照 */
export function getImplementationShowcaseBySlug(
  slug: string
): ImplementationShowcaseItem | undefined {
  return IMPLEMENTATION_SHOWCASE_ITEMS.find((i) => i.slug === slug);
}

/** 「実際に触る」用のデモURL（外部 or サイト内体験）。internalPath は無視 */
export function resolveImplementationDemoHref(
  item: ImplementationShowcaseItem
): string {
  if (item.slug === "internal-knowledge-bot") {
    return "/experience/internal-knowledge-share-bot";
  }
  if (item.slug === "restaurant-ops-dashboard-demo") {
    return "/experience/restaurant-ops-dashboard-demo?mode=live";
  }
  if (item.externalUrl) return item.externalUrl;
  if (item.externalEnvKey) return pickExternalUrl(item.externalEnvKey, item.slug);
  if (item.internalPath) return item.internalPath;
  return `/experience#demo-${item.slug}`;
}

/** 詳細LP（CaseStudyDetailView）へのパス */
export function resolveImplementationDetailHref(
  item: ImplementationShowcaseItem
): string {
  if (item.slug === "kaigo-care-dx") {
    return "/lp/kaigo-care-dx";
  }
  return `/experience/${item.slug}`;
}

/** @deprecated カードは resolveImplementationDetailHref / resolveImplementationDemoHref を使用 */
export function resolveImplementationShowcaseCardHref(
  item: ImplementationShowcaseItem
): string {
  return resolveImplementationDetailHref(item);
}

/** @deprecated カード用途は resolveImplementationShowcaseCardHref を推奨 */
export function resolveImplementationShowcaseHref(
  item: ImplementationShowcaseItem
): string {
  return resolveImplementationShowcaseCardHref(item);
}

export function getFeaturedShowcaseItems(): readonly ImplementationShowcaseItem[] {
  return IMPLEMENTATION_SHOWCASE_ITEMS.filter((i) => i.featured);
}

export function getGalleryShowcaseItems(): readonly ImplementationShowcaseItem[] {
  return IMPLEMENTATION_SHOWCASE_ITEMS.filter((i) => !i.featured);
}

const MA_SLIDES = [
  "/images/demo_images/m&a_demo01.png",
  "/images/demo_images/m&a_demo02.png",
  "/images/demo_images/m&a_demo03.png",
] as const;

const FARM_SLIDES = [
  "/images/demo_images/farm_demo01.png",
  "/images/demo_images/farm_demo02.png",
  "/images/demo_images/farm_demo03.png",
] as const;

/** 表示順固定（注目 + ギャラリー） */
export const IMPLEMENTATION_SHOWCASE_ITEMS: readonly ImplementationShowcaseItem[] =
  [
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
      featured: true,
      flagship: true,
    },
    {
      slug: "internal-knowledge-bot",
      brandName: "AI Knowledge Bot",
      productTitle: "社内ナレッジ共有BOT",
      catchCopy: "業種別ナレッジに即答するAI",
      industryLabel: "横断（AIアシスタント）",
      thumbnailSrc: "/media/showcase/internal-knowledge-share-bot.mp4",
      thumbnailAlt: "社内ナレッジ共有BOTのデモ動画",
      internalPath: "/experience/internal-knowledge-bot",
      openInNewTab: false,
      liveDemo: true,
      featured: true,
      flagship: true,
    },
    {
      slug: "gempo",
      brandName: "GEMPO",
      productTitle: "建設業向け 現場ポケット",
      catchCopy: "現場・事務所、どこからでもアクセス",
      industryLabel: "建設・工事",
      thumbnailSrc: "/images/genbakanri_admin.webp",
      thumbnailAlt: "GEMPO 現場ポケットの管理画面スクリーンショット",
      internalPath: "/experience/gempo",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_GEMPO_URL",
      openInNewTab: true,
      featured: true,
      flagship: true,
    },
    {
      slug: "ma-dd-valueup",
      brandName: "M&A バリューアップ",
      productTitle: "DD〜バリューアップ〜EXIT 一気通貫システム",
      catchCopy:
        "デューデリジェンスからバリューアップ、EXITまでを一気通貫で支援",
      industryLabel: "M&A・投資",
      thumbnailSrc: MA_SLIDES[0],
      thumbnailAlt: "M&A DDプラットフォームの画面イメージ",
      thumbnailSlides: MA_SLIDES,
      internalPath: "/experience/ma-dd-valueup",
      externalUrl: "https://dd-demo-red.vercel.app/",
      openInNewTab: true,
      featured: true,
      flagship: true,
    },
    {
      slug: "recruit-cockpit",
      brandName: "採用コックピット",
      productTitle: "採用・選考パイプライン管理",
      catchCopy: "候補者・選考・KPIを1画面で",
      industryLabel: "人事・採用",
      thumbnailSrc: "/images/saiyoumaching_pc.webp",
      thumbnailAlt: "採用・選考パイプライン管理のスクリーンショット",
      internalPath: "/experience/recruit-cockpit",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_RECRUIT_URL",
      openInNewTab: true,
      featured: true,
      flagship: true,
    },
    {
      slug: "shift-auto",
      brandName: "SHIFT AUTO",
      productTitle: "シフト自動くん",
      catchCopy: "スタッフの希望から最適シフトを生成",
      industryLabel: "飲食・サービス",
      thumbnailSrc: "/images/shiftkanri_pc.mp4",
      thumbnailAlt: "シフト自動くんのデモ動画",
      internalPath: "/experience/shift-auto",
      externalEnvKey: "NEXT_PUBLIC_SHOWCASE_SHIFT_URL",
      openInNewTab: true,
      flagship: true,
    },
    {
      slug: "smart-agri-copilot",
      brandName: "Oriza Copilot",
      productTitle: "スマート農業コパイロット",
      catchCopy: "圃場データと作業記録を、現場で素早く整理",
      industryLabel: "農業・アグリテック",
      thumbnailSrc: FARM_SLIDES[0],
      thumbnailAlt: "スマート農業デモの画面イメージ",
      thumbnailSlides: FARM_SLIDES,
      internalPath: "/experience/smart-agri-copilot",
      externalUrl: "https://oriza-copilot.vercel.app/",
      openInNewTab: true,
      flagship: true,
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
      flagship: true,
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
      flagship: true,
    },
    {
      slug: "kaigo-care-dx",
      brandName: "ケア記録DX",
      productTitle: "障害福祉・訪問看護・訪問診療 業務基盤",
      catchCopy:
        "現場は入力するだけ。報告書づくりと確認は、システムが肩代わりする。",
      industryLabel: "医療・介護",
      thumbnailSrc: "/images/demo_images/kaigo-care-dx.png",
      thumbnailAlt: "ケア記録DX提案デモの画面イメージ",
      externalUrl:
        "https://kaigo-operation-demo.vercel.app/experience/kaigo-care-dx",
      openInNewTab: true,
      liveDemo: true,
      flagship: true,
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
      flagship: true,
    },
  ];
