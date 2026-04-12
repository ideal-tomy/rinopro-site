import { z } from "zod";
import { estimateSnapshotSchema } from "@/lib/estimate/estimate-snapshot";
import { visitorJourneySummarySchema } from "@/lib/journey/visitor-journey";
import {
  inquiryBriefSchema,
  inquiryDesiredReplySchema,
  inquiryIntentSchema,
} from "@/lib/inquiry/inquiry-brief";

export const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(100),
  email: z.string().email("正しいメールアドレスを入力してください"),
  triedExperience: z
    .string()
    .max(200, "触れた体験名は200文字以内で入力してください")
    .optional(),
  visitorJourney: visitorJourneySummarySchema.optional(),
  /** 見積ページからの場合に同封（任意） */
  estimateSnapshot: estimateSnapshotSchema.optional(),
  inquiryBrief: inquiryBriefSchema.optional(),
  inquiryIntent: inquiryIntentSchema,
  desiredReply: inquiryDesiredReplySchema,
  problemStatement: z
    .string()
    .min(12, "困っていることをもう少し具体的に入力してください")
    .max(1200, "1200文字以内で入力してください"),
  targetSummary: z
    .string()
    .min(4, "対象業務や利用者のイメージを入力してください")
    .max(600, "600文字以内で入力してください"),
  decisionTimeline: z
    .string()
    .min(2, "判断したい時期を入力してください")
    .max(200, "200文字以内で入力してください"),
  constraintsSummary: z.string().max(1000, "1000文字以内で入力してください").optional(),
  additionalNote: z.string().max(6000, "6000文字以内で入力してください").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
