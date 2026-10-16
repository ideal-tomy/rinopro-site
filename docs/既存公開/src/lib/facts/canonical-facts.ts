import { z } from "zod";

export const canonicalFactKeySchema = z.enum([
  "industryBundle",
  "productCategory",
  "productArchetype",
  "problemSummary",
  "targetSummary",
  "teamSize",
  "timeline",
  "integration",
  "usageSurface",
  "audienceScope",
  "dataSensitivity",
  "inquiryIntent",
]);

export type CanonicalFactKey = z.infer<typeof canonicalFactKeySchema>;

export const factCollectionStateSchema = z.enum([
  "direct",
  "approx",
  "candidate",
  "missing",
]);

export type FactCollectionState = z.infer<typeof factCollectionStateSchema>;

export const factOwnerSchema = z.enum([
  "visitorJourney",
  "estimateFormDraft",
  "inquiryBrief",
]);

export type FactOwner = z.infer<typeof factOwnerSchema>;

export const candidateFactKeySchema = z.enum([
  "freeformMemo",
  "currentPain",
  "desiredReply",
  "entryIntent",
  "constraints",
  "decisionTimeline",
  "decisionMaker",
  "whyNow",
]);

export type CandidateFactKey = z.infer<typeof candidateFactKeySchema>;

export const estimateReadinessFactKeySchema = z.enum([
  "problemSummary",
  "targetSummary",
  "teamSize",
  "timeline",
  "integration",
  "usageSurface",
  "audienceScope",
  "dataSensitivity",
]);

export type EstimateReadinessFactKey = z.infer<
  typeof estimateReadinessFactKeySchema
>;

export const inquiryReadinessFactKeySchema = z.enum([
  "problemSummary",
  "targetSummary",
  "timeline",
  "integration",
  "usageSurface",
  "audienceScope",
  "dataSensitivity",
  "inquiryIntent",
]);

export type InquiryReadinessFactKey = z.infer<typeof inquiryReadinessFactKeySchema>;

export const CANONICAL_FACT_KEYS = canonicalFactKeySchema.options;
export const CANDIDATE_FACT_KEYS = candidateFactKeySchema.options;
export const ESTIMATE_MINIMUM_FACTS = estimateReadinessFactKeySchema.options;
export const INQUIRY_MINIMUM_FACTS = inquiryReadinessFactKeySchema.options;

export const FACT_OWNER_MAP: Record<CanonicalFactKey, FactOwner> = {
  industryBundle: "visitorJourney",
  productCategory: "visitorJourney",
  productArchetype: "estimateFormDraft",
  problemSummary: "estimateFormDraft",
  targetSummary: "inquiryBrief",
  teamSize: "estimateFormDraft",
  timeline: "estimateFormDraft",
  integration: "estimateFormDraft",
  usageSurface: "estimateFormDraft",
  audienceScope: "estimateFormDraft",
  dataSensitivity: "estimateFormDraft",
  inquiryIntent: "inquiryBrief",
};

export const FACT_LABELS: Record<CanonicalFactKey, string> = {
  industryBundle: "業種文脈",
  productCategory: "欲しいものの大カテゴリ",
  productArchetype: "作りたいものの型",
  problemSummary: "いま困っていること・変えたいこと",
  targetSummary: "誰のどの業務か",
  teamSize: "人数感",
  timeline: "時期",
  integration: "連携有無",
  usageSurface: "主な使い方・載せる場所",
  audienceScope: "誰が使う・見るか",
  dataSensitivity: "個人情報の有無",
  inquiryIntent: "今回いちばん知りたいこと",
};

export const CANDIDATE_FACT_LABELS: Record<CandidateFactKey, string> = {
  freeformMemo: "自由記述メモ",
  currentPain: "うまくいっていないこと",
  desiredReply: "今回ほしい返信",
  entryIntent: "入口意図",
  constraints: "制約条件",
  decisionTimeline: "意思決定時期",
  decisionMaker: "最終判断者",
  whyNow: "なぜ今進めたいか",
};

export type FactValueMap = Partial<Record<CanonicalFactKey | CandidateFactKey, string>>;

export const factEnvelopeSchema = z.object({
  key: z.union([canonicalFactKeySchema, candidateFactKeySchema]),
  state: factCollectionStateSchema,
  owner: factOwnerSchema.optional(),
  value: z.string().min(1).max(700),
  source: z.string().min(1).max(120),
});

export type FactEnvelope = z.infer<typeof factEnvelopeSchema>;

export function hasMeaningfulFactValue(value: string | null | undefined): boolean {
  if (value == null) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed !== "unknown";
}

export function pickFilledFacts<TFactKey extends string>(
  keys: readonly TFactKey[],
  values: Partial<Record<TFactKey, string | null | undefined>>
): TFactKey[] {
  return keys.filter((key) => hasMeaningfulFactValue(values[key]));
}

export function areRequiredFactsFilled<TFactKey extends string>(
  keys: readonly TFactKey[],
  values: Partial<Record<TFactKey, string | null | undefined>>
): boolean {
  return pickFilledFacts(keys, values).length === keys.length;
}
