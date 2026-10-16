import type { IndustryLpConfig, IndustryLpSlug } from "./types";
import { constructionIndustryLp } from "./construction";
import { manufacturingIndustryLp } from "./manufacturing";

const REGISTRY: Record<IndustryLpSlug, IndustryLpConfig> = {
  construction: constructionIndustryLp,
  manufacturing: manufacturingIndustryLp,
};

export const INDUSTRY_LP_SLUGS = Object.keys(REGISTRY) as IndustryLpSlug[];

export function getIndustryLp(slug: string): IndustryLpConfig | null {
  if (slug === "construction" || slug === "manufacturing") {
    return REGISTRY[slug];
  }
  return null;
}

export function getAllIndustryLpSlugs(): IndustryLpSlug[] {
  return [...INDUSTRY_LP_SLUGS];
}

export { constructionIndustryLp } from "./construction";
export { manufacturingIndustryLp } from "./manufacturing";
export { INDUSTRY_EXTERNAL_DEMOS } from "./external-demos";
export type { IndustryLpConfig, IndustryLpSlug } from "./types";
