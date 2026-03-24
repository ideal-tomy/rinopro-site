import { z } from "zod";
import { estimateSnapshotSchema } from "@/lib/estimate/estimate-snapshot";

export const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(100),
  email: z.string().email("正しいメールアドレスを入力してください"),
  triedExperience: z
    .string()
    .max(200, "触れた体験名は200文字以内で入力してください")
    .optional(),
  /** 見積ページからの場合に同封（任意） */
  estimateSnapshot: estimateSnapshotSchema.optional(),
  message: z
    .string()
    .min(1, "ご相談内容を入力してください")
    .max(12000, "12000文字以内で入力してください"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
