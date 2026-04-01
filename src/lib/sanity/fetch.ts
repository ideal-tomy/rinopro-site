import { sanityFetch } from "./client";
import {
  aiDemoBySlugQuery,
  aiDemosAllQuery,
  aiDemosQuery,
  caseStudiesQuery,
  demoItemBySlugQuery,
  demoItemsQuery,
  teamMembersQuery,
} from "./queries";
import type { AiDemo, CaseStudy, DemoItem, TeamMember } from "./types";

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await sanityFetch<CaseStudy[]>(caseStudiesQuery);
  } catch {
    return [];
  }
}

export async function fetchDemoItems(): Promise<DemoItem[]> {
  try {
    return await sanityFetch<DemoItem[]>(demoItemsQuery);
  } catch {
    return [];
  }
}

export async function fetchDemoItemBySlug(
  slug: string
): Promise<DemoItem | null> {
  try {
    const result = await sanityFetch<DemoItem | null>(demoItemBySlugQuery, {
      slug,
    });
    return result ?? null;
  } catch {
    return null;
  }
}

/** aiDemo 一覧取得（量産用・主データソース） */
export async function fetchAiDemos(): Promise<AiDemo[]> {
  try {
    return await sanityFetch<AiDemo[]>(aiDemosQuery);
  } catch {
    return [];
  }
}

/** 全 aiDemo（listedOnCatalog 問わず）。社内レポート用 */
export async function fetchAllAiDemos(): Promise<AiDemo[]> {
  try {
    return await sanityFetch<AiDemo[]>(aiDemosAllQuery);
  } catch {
    return [];
  }
}

/**
 * デモ一覧（aiDemo 優先、demoItem を slug 非重複でマージ）。
 * demoItem に listedOnCatalog が無いため、legacy が残っていると一覧に載り得る。必要なら Studio で整理する。
 */
export async function fetchDemosForDisplay(): Promise<(AiDemo | DemoItem)[]> {
  const [aiDemos, demoItems] = await Promise.all([
    fetchAiDemos(),
    fetchDemoItems(),
  ]);
  const slugSet = new Set(aiDemos.map((d) => d.slug).filter(Boolean));
  const fallbacks = demoItems.filter((d) => {
    const s = typeof d.slug === "object" ? d.slug?.current : d.slug;
    return s && !slugSet.has(s);
  });
  return [...aiDemos, ...fallbacks];
}

/** aiDemo のみを slug で取得（API用） */
export async function fetchAiDemoBySlug(slug: string): Promise<AiDemo | null> {
  try {
    const result = await sanityFetch<AiDemo | null>(aiDemoBySlugQuery, {
      slug,
    });
    return result ?? null;
  } catch {
    return null;
  }
}

/** aiDemo を slug で取得。なければ demoItem にフォールバック */
export async function fetchDemoBySlug(
  slug: string
): Promise<AiDemo | DemoItem | null> {
  try {
    const aiDemo = await sanityFetch<AiDemo | null>(aiDemoBySlugQuery, {
      slug,
    });
    if (aiDemo) return aiDemo;
    const demoItem = await sanityFetch<DemoItem | null>(demoItemBySlugQuery, {
      slug,
    });
    return demoItem ?? null;
  } catch {
    return null;
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    return await sanityFetch<TeamMember[]>(teamMembersQuery);
  } catch {
    return [];
  }
}
