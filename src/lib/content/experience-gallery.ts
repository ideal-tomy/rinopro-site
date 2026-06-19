/**
 * /experience ギャラリーページ用コピー・構成。
 * 外部デプロイdemoは implementation-showcase と同一データを参照する。
 */

import {
  getFeaturedShowcaseItems,
  getGalleryShowcaseItems,
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
    title: "触って探す、AI活用のヒント",
    lead:
      "業界別の実装プロダクトとデモを一覧でご覧いただけます。気になるものを実際に触って、自社への応用イメージを膨らませてください。",
  },
  listSection: {
    title: "デモ・実装事例一覧",
    lead: "業種で絞り込めます。気になるカードからデモ環境へ進めます。",
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
