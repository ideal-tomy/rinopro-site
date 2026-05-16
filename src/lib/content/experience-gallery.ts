/**
 * /experience ギャラリーページ用コピー・構成。
 * 外部デプロイdemoは implementation-showcase と同一データを参照する。
 */

import {
  IMPLEMENTATION_SHOWCASE_ITEMS,
  resolveImplementationShowcaseHref,
  type ImplementationShowcaseItem,
} from "@/lib/content/implementation-showcase";

/** 公開するインタラクティブ体験（設計書: LIVE EXPERIENCE のみ） */
export const ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS = [
  "internal-knowledge-share-bot",
  "restaurant-ops-dashboard-demo",
] as const;

export type AllowedInteractiveExperienceSlug =
  (typeof ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS)[number];

export function isAllowedInteractiveExperienceSlug(
  slug: string
): slug is AllowedInteractiveExperienceSlug {
  return (ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS as readonly string[]).includes(
    slug
  );
}

export const experienceGalleryCopy = {
  hero: {
    kicker: "EXPERIENCE",
    title: "課題を、3分で体感",
    lead:
      "各業界向けの実装プロダクトを、実際に触ってご確認いただけます。商談・授業・ヒアリングの場で、リアルな操作感をお見せします。",
  },
  stats: [
    { value: "5", label: "DEMO PRODUCTS" },
    { value: "5+", label: "INDUSTRIES" },
    { value: "3分", label: "平均体験時間" },
  ],
  liveSection: {
    kicker: "LIVE EXPERIENCE",
    title: "その場で動く、対話型デモ",
    lead: "当サイト内で、実際にAIが反応するデモを体験できます。",
  },
  gallerySection: {
    kicker: "DEMO GALLERY",
    title: "業界別の、実装プロダクト",
    lead: "別ウィンドウで開いて、自由にお試しください。",
  },
  ctaSection: {
    title: "うちの業界でも作れる?",
    lead:
      "建設・物流・製造以外の業界にも対応可能です。業界・課題感をざっくりお話しいただければ、貴社向けに最適なデモを提案します。",
    buttonLabel: "お問い合わせ・デモを提案",
    href: "/contact",
  },
} as const;

export type LiveGalleryDemo = {
  slug: AllowedInteractiveExperienceSlug;
  title: string;
  industryLabel: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

export const LIVE_EXPERIENCE_DEMOS: readonly LiveGalleryDemo[] = [
  {
    slug: "restaurant-ops-dashboard-demo",
    title: "飲食店オペレーション・ダッシュボード",
    industryLabel: "飲食・サービス",
    description:
      "売上推定や設定・シフト状況・入金リクエスト・客先設定・客単価状況などを 3 分でご体感できます。",
    imageSrc: "/images/top07_restauland.png",
    imageAlt: "飲食店オペレーション・ダッシュボードの画面イメージ",
    href: "/experience/restaurant-ops-dashboard-demo",
  },
  {
    slug: "internal-knowledge-share-bot",
    title: "社内ナレッジ共有BOT（業種別・二画面）",
    industryLabel: "横断・AIアシスタント",
    description:
      "ステップガイドかチャットの両方から、リアルなナレッジ参照と検索、業種別の出典・ポリシーまでを体験できます。",
    imageSrc: "/media/showcase/internal-knowledge-share-bot.mp4",
    imageAlt: "社内ナレッジ共有BOTのデモ動画",
    href: "/experience/internal-knowledge-share-bot",
  },
];

/** 外部URLへ遷移する showcase 項目（ギャラリー DEMO GALLERY 用） */
export function getExternalShowcaseItemsForGallery(): readonly ImplementationShowcaseItem[] {
  return IMPLEMENTATION_SHOWCASE_ITEMS.filter(
    (i) => (i.externalEnvKey != null || i.externalUrl != null) && !i.internalPath
  );
}

export function resolveGalleryExternalHref(
  item: ImplementationShowcaseItem
): string {
  return resolveImplementationShowcaseHref(item);
}
