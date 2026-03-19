import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(100),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z.string().min(1, "お問い合わせ内容を入力してください").max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;
