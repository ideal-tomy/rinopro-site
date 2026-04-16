import { z } from "zod";
import {
  FACT_OWNER_MAP,
  type CanonicalFactKey,
  type CandidateFactKey,
  type FactCollectionState,
  type FactEnvelope,
  hasMeaningfulFactValue,
} from "@/lib/facts/canonical-facts";
import { extractFreeformFactEnvelopes } from "@/lib/freeform/extract-freeform-facts";
import { freeformInputSourceSchema } from "@/lib/freeform/freeform-input";
import { summarizeFreeformMemo } from "@/lib/freeform/freeform-memo";
import type { InquiryIntent } from "@/lib/inquiry/inquiry-brief";

export const VISITOR_JOURNEY_VERSION = 1 as const;

export const visitorJourneyPageKindSchema = z.enum([
  "top",
  "demo_hub",
  "demo_list",
  "demo_detail",
  "services",
  "consulting",
  "flow",
  "estimate",
  "contact",
  "other",
]);

export type VisitorJourneyPageKind = z.infer<typeof visitorJourneyPageKindSchema>;

export const visitorJourneyInterestBiasSchema = z.enum([
  "mixed",
  "demo_first",
  "consulting_first",
  "development_first",
]);

export type VisitorJourneyInterestBias = z.infer<
  typeof visitorJourneyInterestBiasSchema
>;

export const visitorJourneyDepthSchema = z.enum([
  "light",
  "exploring",
  "estimate_ready",
  "contact_ready",
]);

export type VisitorJourneyDepth = z.infer<typeof visitorJourneyDepthSchema>;

export const visitorJourneyIndustryBundleSchema = z.object({
  domainId: z.string().min(1).max(80),
  domainDetailId: z.string().max(120).nullable().optional(),
  note: z.string().max(240).nullable().optional(),
});

export type VisitorJourneyIndustryBundle = z.infer<
  typeof visitorJourneyIndustryBundleSchema
>;

export const visitorJourneyEstimateSignalsSchema = z.object({
  teamSize: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  integration: z.string().max(80).optional(),
  usageSurface: z.string().max(80).optional(),
  audienceScope: z.string().max(80).optional(),
});

export type VisitorJourneyEstimateSignals = z.infer<
  typeof visitorJourneyEstimateSignalsSchema
>;

export const visitorJourneySummarySchema = z.object({
  visitorId: z.string().min(1).max(80),
  interestBias: visitorJourneyInterestBiasSchema,
  journeyDepth: visitorJourneyDepthSchema,
  latestEntryIntent: z
    .enum(["learn", "compare", "consult", "estimate"])
    .optional(),
  industryBundle: visitorJourneyIndustryBundleSchema.optional(),
  viewedDemoSlugs: z.array(z.string().min(1).max(120)).max(8).default([]),
  recentPageKinds: z.array(visitorJourneyPageKindSchema).max(6).default([]),
  lastFreeformSummary: z.string().max(280).optional(),
  lastFreeformSource: freeformInputSourceSchema.optional(),
  lastFreeformRawText: z.string().max(700).optional(),
  lastFreeformNormalizedText: z.string().max(700).optional(),
  estimateSignals: visitorJourneyEstimateSignalsSchema.optional(),
  journeySummary: z.string().max(600),
});

export type VisitorJourneySummary = z.infer<typeof visitorJourneySummarySchema>;

export const visitorJourneyProfileSchema = z.object({
  version: z.literal(VISITOR_JOURNEY_VERSION),
  visitorId: z.string().min(1).max(80),
  firstSeenAt: z.string(),
  lastSeenAt: z.string(),
  pageViews: z.record(z.string(), z.number().int().min(0)).default({}),
  recentPageKinds: z.array(visitorJourneyPageKindSchema).max(12).default([]),
  viewedDemoSlugs: z.array(z.string().min(1).max(120)).max(12).default([]),
  latestEntryIntent: z
    .enum(["learn", "compare", "consult", "estimate"])
    .optional(),
  industryBundle: visitorJourneyIndustryBundleSchema.optional(),
  lastFreeformSummary: z.string().max(280).optional(),
  lastFreeformSource: freeformInputSourceSchema.optional(),
  lastFreeformRawText: z.string().max(700).optional(),
  lastFreeformNormalizedText: z.string().max(700).optional(),
  estimateSignals: visitorJourneyEstimateSignalsSchema.optional(),
  estimateReachedCount: z.number().int().min(0).default(0),
  contactReachedCount: z.number().int().min(0).default(0),
});

export type VisitorJourneyProfile = z.infer<typeof visitorJourneyProfileSchema>;

export type VisitorJourneyFactValueMap = Partial<
  Record<CanonicalFactKey | CandidateFactKey, string>
>;

export function detectVisitorJourneyPageKind(
  pathname: string
): VisitorJourneyPageKind {
  if (pathname === "/") return "top";
  if (pathname === "/demo") return "demo_hub";
  if (pathname === "/demo/list") return "demo_list";
  if (/^\/demo\/[^/]+$/.test(pathname)) return "demo_detail";
  if (pathname === "/services") return "services";
  if (pathname === "/consulting") return "consulting";
  if (pathname === "/flow") return "flow";
  if (pathname.startsWith("/estimate-detailed")) return "estimate";
  if (pathname === "/contact") return "contact";
  return "other";
}

export function summarizeFreeformText(text: string): string {
  return summarizeFreeformMemo(text);
}

function pushUnique<T>(current: T[], next: T, max: number): T[] {
  const filtered = current.filter((item) => item !== next);
  return [next, ...filtered].slice(0, max);
}

export function recordRecentPageKind(
  current: VisitorJourneyPageKind[],
  next: VisitorJourneyPageKind,
  max = 12
): VisitorJourneyPageKind[] {
  return pushUnique(current, next, max);
}

export function recordViewedDemoSlug(
  current: string[],
  next: string,
  max = 12
): string[] {
  return pushUnique(current, next, max);
}

export function inferInterestBias(
  pageViews: Record<string, number>
): VisitorJourneyInterestBias {
  const demoScore =
    (pageViews.demo_hub ?? 0) +
    (pageViews.demo_list ?? 0) +
    (pageViews.demo_detail ?? 0);
  const consultingScore = (pageViews.consulting ?? 0) + (pageViews.services ?? 0);
  const developmentScore = (pageViews.flow ?? 0) + (pageViews.services ?? 0);
  const maxScore = Math.max(demoScore, consultingScore, developmentScore);
  if (maxScore <= 1) return "mixed";
  const leaders = [
    demoScore === maxScore ? "demo_first" : null,
    consultingScore === maxScore ? "consulting_first" : null,
    developmentScore === maxScore ? "development_first" : null,
  ].filter(Boolean);
  if (leaders.length !== 1) return "mixed";
  return leaders[0] as VisitorJourneyInterestBias;
}

export function inferJourneyDepth(
  profile: Pick<
    VisitorJourneyProfile,
    "estimateReachedCount" | "contactReachedCount" | "pageViews"
  >
): VisitorJourneyDepth {
  if (profile.contactReachedCount > 0) return "contact_ready";
  if (profile.estimateReachedCount > 0) return "estimate_ready";
  const touched =
    Object.values(profile.pageViews).reduce((sum, count) => sum + count, 0) > 1;
  return touched ? "exploring" : "light";
}

export function buildVisitorJourneySummary(
  profile: VisitorJourneyProfile
): VisitorJourneySummary {
  const interestBias = inferInterestBias(profile.pageViews);
  const journeyDepth = inferJourneyDepth(profile);
  const pageLabel = profile.recentPageKinds
    .slice(0, 4)
    .map((kind) => kind.replace(/_/g, " "))
    .join(" / ");
  const demosLabel =
    profile.viewedDemoSlugs.length > 0
      ? `demo: ${profile.viewedDemoSlugs.slice(0, 3).join(", ")}`
      : "";
  const freeformLabel = profile.lastFreeformSummary
    ? `自由記述: ${profile.lastFreeformSummary}${
        profile.lastFreeformSource ? ` (${profile.lastFreeformSource})` : ""
      }`
    : "";
  const parts = [
    `関心傾向: ${interestBias}`,
    `到達状況: ${journeyDepth}`,
    pageLabel ? `最近見た領域: ${pageLabel}` : "",
    demosLabel,
    freeformLabel,
  ].filter(Boolean);

  return {
    visitorId: profile.visitorId,
    interestBias,
    journeyDepth,
    ...(profile.latestEntryIntent
      ? { latestEntryIntent: profile.latestEntryIntent }
      : {}),
    ...(profile.industryBundle ? { industryBundle: profile.industryBundle } : {}),
    viewedDemoSlugs: profile.viewedDemoSlugs.slice(0, 8),
    recentPageKinds: profile.recentPageKinds.slice(0, 6),
    ...(profile.lastFreeformSummary
      ? { lastFreeformSummary: profile.lastFreeformSummary }
      : {}),
    ...(profile.lastFreeformSource
      ? { lastFreeformSource: profile.lastFreeformSource }
      : {}),
    ...(profile.lastFreeformRawText
      ? { lastFreeformRawText: profile.lastFreeformRawText }
      : {}),
    ...(profile.lastFreeformNormalizedText
      ? { lastFreeformNormalizedText: profile.lastFreeformNormalizedText }
      : {}),
    ...(profile.estimateSignals
      ? { estimateSignals: profile.estimateSignals }
      : {}),
    journeySummary: parts.join(" / "),
  };
}

export function visitorJourneySummaryToPriorContext(
  summary: VisitorJourneySummary
): string {
  const lines = [
    "【サイト内で把握できている文脈】",
    `- 関心傾向: ${summary.interestBias}`,
    `- 到達状況: ${summary.journeyDepth}`,
  ];
  if (summary.latestEntryIntent) {
    lines.push(`- 直近の意図: ${summary.latestEntryIntent}`);
  }
  if (summary.industryBundle) {
    const industryLine = [
      summary.industryBundle.domainId,
      summary.industryBundle.domainDetailId ?? "",
    ]
      .filter(Boolean)
      .join(" / ");
    lines.push(`- 業種文脈: ${industryLine}`);
  }
  if (summary.viewedDemoSlugs.length > 0) {
    lines.push(`- 見た demo: ${summary.viewedDemoSlugs.join(", ")}`);
  }
  if (summary.lastFreeformSummary) {
    lines.push(
      `- 自由記述メモ: ${summary.lastFreeformSummary}${
        summary.lastFreeformSource ? ` (${summary.lastFreeformSource})` : ""
      }`
    );
  }
  return lines.join("\n");
}

export function updateEstimateSignalsFromAnswers(
  current: VisitorJourneyEstimateSignals | undefined,
  answers: Record<string, string>
): VisitorJourneyEstimateSignals | undefined {
  const next: VisitorJourneyEstimateSignals = {
    ...current,
  };
  if (answers["会社やチームの人数のイメージ"]) {
    next.teamSize = answers["会社やチームの人数のイメージ"];
  }
  if (answers["いつ頃までに、という希望"]) {
    next.timeline = answers["いつ頃までに、という希望"];
  }
  if (answers["今お使いのツールや、他のシステムとのつなぎ"]) {
    next.integration = answers["今お使いのツールや、他のシステムとのつなぎ"];
  }
  if (answers["主な使い方・載せる場所"]) {
    next.usageSurface = answers["主な使い方・載せる場所"];
  }
  if (answers["誰が使う・見るか（社内・外部）"]) {
    next.audienceScope = answers["誰が使う・見るか（社内・外部）"];
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export function buildVisitorJourneyFactValues(
  summary: VisitorJourneySummary | null | undefined
): VisitorJourneyFactValueMap {
  if (!summary) return {};

  const values: VisitorJourneyFactValueMap = {};

  if (summary.industryBundle) {
    values.industryBundle = [
      summary.industryBundle.domainId,
      summary.industryBundle.domainDetailId ?? "",
      summary.industryBundle.note ?? "",
    ]
      .filter(Boolean)
      .join(" / ");
  }
  if (summary.lastFreeformSummary) {
    values.freeformMemo = summary.lastFreeformSummary;
  }
  if (summary.estimateSignals?.teamSize) values.teamSize = summary.estimateSignals.teamSize;
  if (summary.estimateSignals?.timeline) values.timeline = summary.estimateSignals.timeline;
  if (summary.estimateSignals?.integration) {
    values.integration = summary.estimateSignals.integration;
  }
  if (summary.estimateSignals?.usageSurface) {
    values.usageSurface = summary.estimateSignals.usageSurface;
  }
  if (summary.estimateSignals?.audienceScope) {
    values.audienceScope = summary.estimateSignals.audienceScope;
  }

  return values;
}

export function buildVisitorJourneyFactEnvelopes(
  summary: VisitorJourneySummary | null | undefined
): FactEnvelope[] {
  const values = buildVisitorJourneyFactValues(summary);
  const envelopes: FactEnvelope[] = [];

  (Object.entries(values) as [CanonicalFactKey | CandidateFactKey, string][]).forEach(
    ([key, value]) => {
      if (!hasMeaningfulFactValue(value)) return;
      const isCanonicalOwner = key in FACT_OWNER_MAP;
      const isFreeformDerivedCanonical =
        key === "problemSummary" && Boolean(summary?.lastFreeformSummary);
      const isFreeformDerivedCandidate = key === "freeformMemo";
      const state: FactCollectionState =
        isFreeformDerivedCandidate
          ? "candidate"
          : isFreeformDerivedCanonical
            ? "candidate"
            : "approx";
      envelopes.push({
        key,
        state,
        owner: isCanonicalOwner
          ? FACT_OWNER_MAP[key as CanonicalFactKey]
          : "visitorJourney",
        value,
        source:
          (isFreeformDerivedCanonical || isFreeformDerivedCandidate) &&
          summary?.lastFreeformSource
            ? `visitorJourney:${summary.lastFreeformSource}`
            : "visitorJourney",
      });
    }
  );

  if (summary?.lastFreeformNormalizedText && summary.lastFreeformSource) {
    const extracted = extractFreeformFactEnvelopes({
      source: summary.lastFreeformSource,
      rawText: summary.lastFreeformRawText ?? summary.lastFreeformNormalizedText,
      normalizedText: summary.lastFreeformNormalizedText,
    });
    for (const envelope of extracted) {
      const exists = envelopes.some(
        (current) => current.key === envelope.key && current.value === envelope.value
      );
      if (!exists) envelopes.push(envelope);
    }
  }

  return envelopes;
}

export function inferJourneyIntentFromInquiry(
  inquiryIntent: InquiryIntent
): "learn" | "compare" | "consult" | "estimate" {
  switch (inquiryIntent) {
    case "estimate":
      return "estimate";
    case "consulting":
      return "consult";
    default:
      return "learn";
  }
}
