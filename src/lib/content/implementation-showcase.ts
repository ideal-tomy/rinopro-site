/**
 * メインLP「Industry Showcase」（実装事例6カード）用データ。
 * 外部デプロイURLは NEXT_PUBLIC_SHOWCASE_* が未設定のとき `/case-studies#{slug}` にフォールバック。
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
  openInNewTab: boolean;
  liveDemo?: boolean;
};

function pickExternalUrl(
  envKey: NonNullable<ImplementationShowcaseItem["externalEnvKey"]>,
  slug: string
): string {
  const v = process.env[envKey]?.trim();
  if (v) return v;
  return `/case-studies/${slug}#try-demo`;
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
  if (item.externalEnvKey) return pickExternalUrl(item.externalEnvKey, item.slug);
  return `/case-studies#${item.slug}`;
}

/** 表示順固定の6件 */
export const IMPLEMENTATION_SHOWCASE_ITEMS: readonly ImplementationShowcaseItem[] =
  [
    {
      slug: "gempo",
      brandName: "GEMPO",
      productTitle: "〇〇工業向け 現場ポケット",
      catchCopy: "現場・事務所、どこからでもアクセス",
      industryLabel: "建設・工事",
      thumbnailSrc: "/images/genbakanri_admin.png",
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
      thumbnailSrc: "/images/kurumakanri_pc.png",
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
      thumbnailSrc: "/images/saiyoumaching_pc.png",
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
      thumbnailSrc: "/images/salesdashboard_pc.png",
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
  ];
