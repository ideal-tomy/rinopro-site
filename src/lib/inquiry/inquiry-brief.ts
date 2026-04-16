import { z } from "zod";
import {
  FACT_OWNER_MAP,
  INQUIRY_MINIMUM_FACTS,
  type CanonicalFactKey,
  type CandidateFactKey,
  type FactEnvelope,
  areRequiredFactsFilled,
  hasMeaningfulFactValue,
} from "@/lib/facts/canonical-facts";
import {
  visitorJourneyDepthSchema,
  visitorJourneyInterestBiasSchema,
  visitorJourneySummarySchema,
} from "@/lib/journey/visitor-journey";

export const inquiryIntentSchema = z.enum([
  "estimate",
  "requirements",
  "implementation",
  "consulting",
  "fit_check",
]);

export type InquiryIntent = z.infer<typeof inquiryIntentSchema>;

export const INQUIRY_INTENT_LABELS: Record<InquiryIntent, string> = {
  estimate: "費用感を知りたい",
  requirements: "要件を整理したい",
  implementation: "開発の進め方を知りたい",
  consulting: "コンサル内容を相談したい",
  fit_check: "相談先として合うか確認したい",
};

export const inquiryDesiredReplySchema = z.enum([
  "rough_estimate",
  "scope_advice",
  "implementation_plan",
  "consulting_plan",
  "reply_with_next_steps",
]);

export type InquiryDesiredReply = z.infer<typeof inquiryDesiredReplySchema>;

export const INQUIRY_DESIRED_REPLY_LABELS: Record<InquiryDesiredReply, string> = {
  rough_estimate: "概算レンジを知りたい",
  scope_advice: "何を決めるべきか知りたい",
  implementation_plan: "開発の進め方を知りたい",
  consulting_plan: "相談や伴走の進め方を知りたい",
  reply_with_next_steps: "最初に何から進めるべきか知りたい",
};

export const inquiryReadinessSchema = z.enum([
  "ready",
  "ready_with_gaps",
  "not_ready",
]);

export type InquiryReadiness = z.infer<typeof inquiryReadinessSchema>;

export const INQUIRY_READINESS_LABELS: Record<InquiryReadiness, string> = {
  ready: "このまま送信できます",
  ready_with_gaps: "あと数問でかなり具体化できます",
  not_ready: "送信前にもう少し整理が必要です",
};

export const inquiryFollowUpQuestionSchema = z.object({
  id: z.string().min(1).max(80),
  question: z.string().min(1).max(160),
  helpText: z.string().max(240).optional(),
  placeholder: z.string().max(160).optional(),
  required: z.boolean().default(true),
});

export type InquiryFollowUpQuestion = z.infer<typeof inquiryFollowUpQuestionSchema>;

export const inquiryBriefSchema = z.object({
  readiness: inquiryReadinessSchema,
  inquiryIntent: inquiryIntentSchema,
  inquiryIntentLabel: z.string().min(1).max(80),
  desiredReply: inquiryDesiredReplySchema,
  desiredReplyLabel: z.string().min(1).max(80),
  problemSummary: z.string().min(1).max(700),
  requestedReplySummary: z.string().min(1).max(500),
  targetSummary: z.string().min(1).max(300),
  timelineSummary: z.string().min(1).max(220),
  constraintsSummary: z.string().min(1).max(400),
  scopeSummary: z.string().min(1).max(600),
  unresolvedPoints: z.array(z.string().max(280)).max(8).default([]),
  replyFocus: z.array(z.string().max(280)).max(5).default([]),
  visitorJourney: visitorJourneySummarySchema.optional(),
  interestBias: visitorJourneyInterestBiasSchema.optional(),
  journeyDepth: visitorJourneyDepthSchema.optional(),
  journeySummary: z.string().max(600).optional(),
});

export type InquiryBrief = z.infer<typeof inquiryBriefSchema>;

export const estimateInquiryPreparationSchema = z.object({
  inquiryIntent: inquiryIntentSchema,
  desiredReply: inquiryDesiredReplySchema,
  followUpQuestions: z.array(inquiryFollowUpQuestionSchema).max(6).default([]),
  followUpAnswers: z.record(z.string(), z.string()).default({}),
  brief: inquiryBriefSchema,
});

export type EstimateInquiryPreparation = z.infer<
  typeof estimateInquiryPreparationSchema
>;

export const inquiryPreparationRequestSchema = z.object({
  inquiryIntent: inquiryIntentSchema,
  desiredReply: inquiryDesiredReplySchema,
  followUpAnswers: z.record(z.string(), z.string()).default({}),
});

export type InquiryPreparationRequest = z.infer<
  typeof inquiryPreparationRequestSchema
>;

export const inquiryPreparationApiResponseSchema = z.object({
  readiness: inquiryReadinessSchema,
  followUpQuestions: z.array(inquiryFollowUpQuestionSchema).max(6).default([]),
  brief: inquiryBriefSchema,
});

export type InquiryPreparationApiResponse = z.infer<
  typeof inquiryPreparationApiResponseSchema
>;

export function inquiryIntentLabel(intent: InquiryIntent): string {
  return INQUIRY_INTENT_LABELS[intent];
}

export function inquiryDesiredReplyLabel(
  desiredReply: InquiryDesiredReply
): string {
  return INQUIRY_DESIRED_REPLY_LABELS[desiredReply];
}

export function inquiryReadinessLabel(readiness: InquiryReadiness): string {
  return INQUIRY_READINESS_LABELS[readiness];
}

export type InquiryBriefFactValueMap = Partial<
  Record<CanonicalFactKey | CandidateFactKey, string>
>;

export function buildInquiryBriefFactValues(
  brief: InquiryBrief
): InquiryBriefFactValueMap {
  return {
    problemSummary: brief.problemSummary,
    targetSummary: brief.targetSummary,
    inquiryIntent: brief.inquiryIntent,
    desiredReply: brief.desiredReply,
    decisionTimeline: brief.timelineSummary,
  };
}

export function buildInquiryBriefFactEnvelopes(brief: InquiryBrief): FactEnvelope[] {
  const values = buildInquiryBriefFactValues(brief);
  const entries = Object.entries(values) as [CanonicalFactKey | CandidateFactKey, string][];

  return entries
    .filter(([, value]) => hasMeaningfulFactValue(value))
    .map(([key, value]) => ({
      key,
      state: "direct" as const,
      owner:
        key in FACT_OWNER_MAP ? FACT_OWNER_MAP[key as CanonicalFactKey] : "inquiryBrief",
      value,
      source: "inquiryBrief",
    }));
}

export function hasMinimumInquiryFacts(
  values: Partial<Record<CanonicalFactKey, string | null | undefined>>
): boolean {
  return areRequiredFactsFilled(INQUIRY_MINIMUM_FACTS, values);
}

export type InquiryGateStatus = "sendable" | "needs_follow_up" | "blocked";

export type InquiryGateRequirement =
  | "problem_summary"
  | "target_summary"
  | "timeline_summary"
  | "brief_confirmation"
  | "estimate_confirmation"
  | "required_follow_up"
  | "readiness";

export type InquiryGateEvaluation = {
  status: InquiryGateStatus;
  missingRequirements: InquiryGateRequirement[];
  unresolvedRequiredCount: number;
};

export function countUnresolvedRequiredFollowUps(args: {
  followUpQuestions?: readonly InquiryFollowUpQuestion[] | null;
  followUpAnswers?: Readonly<Record<string, string>> | null;
}): number {
  const questions = args.followUpQuestions ?? [];
  const answers = args.followUpAnswers ?? {};
  return questions.filter((question) => {
    if (!question.required) return false;
    return !answers[question.id]?.trim();
  }).length;
}

export function evaluateInquiryGate(args: {
  brief?: InquiryBrief | null;
  problemSummary?: string | null;
  targetSummary?: string | null;
  timelineSummary?: string | null;
  followUpQuestions?: readonly InquiryFollowUpQuestion[] | null;
  followUpAnswers?: Readonly<Record<string, string>> | null;
  hasViewedEstimateOrEquivalent: boolean;
  hasReviewedGeneratedBrief: boolean;
}): InquiryGateEvaluation {
  const missing = new Set<InquiryGateRequirement>();
  const unresolvedRequiredCount = countUnresolvedRequiredFollowUps({
    followUpQuestions: args.followUpQuestions,
    followUpAnswers: args.followUpAnswers,
  });

  if (!args.problemSummary?.trim()) missing.add("problem_summary");
  if (!args.targetSummary?.trim()) missing.add("target_summary");
  if (!args.timelineSummary?.trim()) missing.add("timeline_summary");
  if (!args.hasReviewedGeneratedBrief) missing.add("brief_confirmation");
  if (!args.hasViewedEstimateOrEquivalent) missing.add("estimate_confirmation");
  if (unresolvedRequiredCount > 0) missing.add("required_follow_up");
  if (args.brief?.readiness === "not_ready") missing.add("readiness");

  const missingRequirements = Array.from(missing);
  const hasHardBlock =
    missing.has("problem_summary") ||
    missing.has("target_summary") ||
    missing.has("timeline_summary") ||
    missing.has("brief_confirmation") ||
    missing.has("estimate_confirmation") ||
    missing.has("readiness");

  return {
    status: hasHardBlock
      ? "blocked"
      : missing.has("required_follow_up")
        ? "needs_follow_up"
        : "sendable",
    missingRequirements,
    unresolvedRequiredCount,
  };
}
