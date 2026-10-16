import type { IndustryLpSlug } from "@/lib/content/industry-lp";
import { INDUSTRY_EXTERNAL_DEMOS } from "@/lib/content/industry-lp";

export type HomeIndustryShowcaseCard = {
  slug: IndustryLpSlug;
  title: string;
  englishLabel: string;
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  detailHref: string;
  tryHref: string;
};

/** トップ 03 用。ideal TOP の製造・建設カードと同型の導線 */
export const HOME_INDUSTRY_SHOWCASE_CARDS: readonly HomeIndustryShowcaseCard[] =
  [
    {
      slug: "construction",
      title: "建設・設備",
      englishLabel: "Construction",
      imageSrc: "/images/lp/construction_light.png",
      imageAlt: "建設現場・記録業務のイメージ",
      tagline: "現場写真の整理から、報告書の作成まで。",
      detailHref: "/industries/construction",
      tryHref: INDUSTRY_EXTERNAL_DEMOS.construction,
    },
    {
      slug: "manufacturing",
      title: "製造",
      englishLabel: "Manufacturing",
      imageSrc: "/images/lp/manufacturing_light.png",
      imageAlt: "製造現場・判断支援のイメージ",
      tagline: "規程を探し回らず、聞けば根拠が届く。",
      detailHref: "/industries/manufacturing",
      tryHref: INDUSTRY_EXTERNAL_DEMOS.manufacturing,
    },
  ] as const;
