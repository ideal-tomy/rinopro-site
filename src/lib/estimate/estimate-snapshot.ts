import { z } from "zod";

/** 見積もりページから問い合わせへ同封する構造化データ（API・メール・ログ用） */
export const ESTIMATE_SNAPSHOT_SCHEMA_VERSION = 1 as const;

export const estimateDetailedAiOutputSchema = z.object({
  requirementTitle: z.string(),
  requirementSections: z
    .array(
      z.object({
        heading: z.string(),
        bullets: z.array(z.string()),
      })
    )
    .max(5),
  assumptions: z.array(z.string()),
  risks: z.array(z.string()),
  /** お客様向けのやさしい要約（専門用語は避ける） */
  plainCustomerSummary: z.string().max(900),
  /** 追加で確認したいこと（箇条書き用） */
  openQuestions: z.array(z.string()).max(8),
  estimateLoMan: z.number().int().min(0),
  estimateHiMan: z.number().int().min(0),
});

export type EstimateDetailedAiOutput = z.infer<typeof estimateDetailedAiOutputSchema>;

export const estimateSnapshotSchema = z.object({
  schemaVersion: z.literal(ESTIMATE_SNAPSHOT_SCHEMA_VERSION),
  source: z.literal("estimate_detailed"),
  createdAt: z.string(),
  priorContext: z.string().max(8000).optional(),
  /** フォームの質問キー → 表示用の答え文言 */
  answers: z.record(z.string(), z.string()),
  ai: estimateDetailedAiOutputSchema,
  /** 社内共有・メール用のMarkdown（ai から組み立てた本文） */
  requirementDocMarkdown: z.string().max(20000),
});

export type EstimateSnapshot = z.infer<typeof estimateSnapshotSchema>;

export function formatRequirementDocMarkdown(output: EstimateDetailedAiOutput): string {
  const lines: string[] = [`# ${output.requirementTitle}`, ""];
  lines.push(
    ...output.requirementSections.flatMap((s) => [
      `## ${s.heading}`,
      ...s.bullets.map((b) => `- ${b}`),
      "",
    ])
  );
  lines.push("## 前提・仮定", ...output.assumptions.map((a) => `- ${a}`), "");
  if (output.openQuestions.length > 0) {
    lines.push(
      "## 確認してほしいこと",
      ...output.openQuestions.map((q) => `- ${q}`),
      ""
    );
  }
  lines.push("## 注意点・リスク", ...output.risks.map((x) => `- ${x}`));
  return lines.join("\n");
}

export function buildAnswersSummaryLines(answers: Record<string, string>): string {
  return Object.entries(answers)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${String(v).trim()}`)
    .join("\n");
}
