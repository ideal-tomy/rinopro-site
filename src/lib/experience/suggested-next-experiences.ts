import { DEMO_HUB_PURPOSE_GROUPS } from "@/lib/demo/demo-hub-sections";
import {
  EXPERIENCE_PROTOTYPES,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";

/**
 * 体験ページの「ほかに試す」候補。目的別グループ内の兄弟を優先し、無ければ同一 tier の先頭から最大件数。
 */
export function getSuggestedNextExperiences(
  currentSlug: string,
  limit = 2
): { slug: string; title: string }[] {
  if (!currentSlug) return [];

  for (const group of DEMO_HUB_PURPOSE_GROUPS) {
    if (!group.experienceSlugs.includes(currentSlug)) continue;
    const out: { slug: string; title: string }[] = [];
    for (const s of group.experienceSlugs) {
      if (s === currentSlug) continue;
      const m = getExperiencePrototypeBySlug(s);
      if (m) out.push({ slug: m.slug, title: m.title });
      if (out.length >= limit) return out;
    }
    return out;
  }

  const self = getExperiencePrototypeBySlug(currentSlug);
  if (!self) return [];

  return EXPERIENCE_PROTOTYPES.filter(
    (p) => p.tier === self.tier && p.slug !== currentSlug
  )
    .slice(0, limit)
    .map((p) => ({ slug: p.slug, title: p.title }));
}
