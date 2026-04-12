import { z } from "zod";
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
