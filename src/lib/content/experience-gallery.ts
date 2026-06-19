/**
 * /experience ギャラリーページ用コピー・構成。
 * 外部デプロイdemoは implementation-showcase と同一データを参照する。
 */

import {
  getFeaturedShowcaseItems,
  getGalleryShowcaseItems,
  IMPLEMENTATION_SHOWCASE_ITEMS,
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
    { value: String(IMPLEMENTATION_SHOWCASE_ITEMS.length), label: "DEMO PRODUCTS" },
    { value: "8+", label: "INDUSTRIES" },
    { value: "3分", label: "平均体験時間" },
  ],
  featuredSection: {
    kicker: "FEATURED",
    title: "注目の実装プロダクト",
    lead:
      "サイト内で詳しくご紹介している主力デモです。課題の整理から操作感の確認まで、短時間でご覧いただけます。",
  },
  gallerySection: {
    kicker: "DEMO GALLERY",
    title: "その他の業界別プロダクト",
    lead:
      "詳細ページからデモ環境へ進めます。外部サイトで開くものは、別タブで自由にお試しください。",
  },
  ctaSection: {
    title: "うちの業界でも作れる?",
    lead:
      "M&A・農業・医療・人事など、業界を問わず対応可能です。課題感をざっくりお話しいただければ、貴社向けに最適なデモを提案します。",
    buttonLabel: "お問い合わせ・デモを提案",
    href: "/contact",
  },
} as const;

/** @deprecated LIVE セクションは FEATURED に統合。互換用 */
export function getExternalShowcaseItemsForGallery(): readonly ImplementationShowcaseItem[] {
  return getGalleryShowcaseItems();
}

export { getFeaturedShowcaseItems, getGalleryShowcaseItems };
