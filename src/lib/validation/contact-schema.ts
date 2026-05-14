import { z } from "zod";
import { estimateSnapshotSchema } from "@/lib/estimate/estimate-snapshot";
import { visitorJourneySummarySchema } from "@/lib/journey/visitor-journey";
import {
  inquiryBriefSchema,
  inquiryDesiredReplySchema,
  inquiryIntentSchema,
} from "@/lib/inquiry/inquiry-brief";

/** 問い合わせ API 受信。シンプル版は name / email / message のみ必須。 */
export const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(100),
  email: z.string().email("正しいメールアドレスを入力してください"),
  company: z.string().max(200, "会社名は200文字以内で入力してください").optional(),
  message: z
    .string()
    .min(8, "ご相談内容をもう少し具体的に入力してください（8文字以上）")
    .max(1200, "1200文字以内で入力してください"),
  triedExperience: z
    .string()
    .max(200, "最も近かった体験・デモは200文字以内で入力してください")
    .optional(),
  visitorJourney: visitorJourneySummarySchema.optional(),
  estimateSnapshot: estimateSnapshotSchema.optional(),
  inquiryBrief: inquiryBriefSchema.optional(),
  inquiryIntent: inquiryIntentSchema.optional(),
  desiredReply: inquiryDesiredReplySchema.optional(),
  /** 旧クライアント互換（message が無い場合は API 側で message に寄せる） */
  problemStatement: z.string().max(1200, "1200文字以内で入力してください").optional(),
  targetSummary: z.string().max(600, "600文字以内で入力してください").optional(),
  decisionTimeline: z.string().max(200, "200文字以内で入力してください").optional(),
  constraintsSummary: z.string().max(1000, "1000文字以内で入力してください").optional(),
  additionalNote: z.string().max(6000, "6000文字以内で入力してください").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
