/**
 * /experience ギャラリーページ用コピー・構成。
 * 外部デプロイdemoは implementation-showcase と同一データを参照する。
 */

import {
  getFeaturedShowcaseItems,
  getGalleryShowcaseItems,
  getV1FlagshipShowcaseItems,
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
      "ビル管理・農業・介護・M&A・建設・不動産など、業種の異なる実装例をご覧いただけます。気になるものを触って、自社への応用イメージを膨らませてください。",
  },
  flagshipSection: {
    title: "おすすめの実装例",
    lead: "クライアントの現場に近い6つのプロダクト例です。カードからデモ環境へ進めます。",
  },
  listSection: {
    title: "その他の事例",
    lead: "ほかにも業種・用途の異なるデモをご用意しています。業種で絞り込めます。",
    filterLabel: "業種で絞り込み",
    filteredTitle: "絞り込み結果",
    filteredLead: "選択した業種に該当するデモです。",
  },
  ctaSection: {
    title: "うちの業界でも作れる?",
    lead:
      "M&A・農業・医療・人事など、業界を問わず対応可能です。課題感をざっくりお話しいただければ、貴社向けに最適なデモを提案します。",
    buttonLabel: "お問い合わせ・デモを提案",
    href: "/contact",
  },
} as const;

/** おすすめ6本の業種バッジ（読み取り専用） */
export const V1_FLAGSHIP_INDUSTRY_BADGES = [
  "ビル管理",
  "農業",
  "介護",
  "M&A",
  "建設",
  "不動産",
] as const;

/** @deprecated LIVE セクションは FEATURED に統合。互換用 */
export function getExternalShowcaseItemsForGallery(): readonly ImplementationShowcaseItem[] {
  return getGalleryShowcaseItems();
}

export { getFeaturedShowcaseItems, getGalleryShowcaseItems, getV1FlagshipShowcaseItems };
