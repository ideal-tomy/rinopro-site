import { z } from "zod";
import { getOrderedAnswerPairs } from "@/lib/estimate/estimate-detailed-answer-order";
import {
  ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING,
  ESTIMATE_PHILOSOPHY_UI_PARAGRAPH,
} from "@/lib/estimate/estimate-output-philosophy";

/** 見積もりページから問い合わせへ同封する構造化データ（API・メール・ログ用） */
export const ESTIMATE_SNAPSHOT_SCHEMA_VERSION = 1 as const;

export const estimateDetailedFollowUpItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const estimateDetailedAiOutputSchema = z.object({
  requirementTitle: z.string(),
  /** 見積・社内共有用の要件定義書本文（Markdown） */
  requirementDefinitionDocument: z.string().max(12000),
  /** 金額レンジに効く前提。短文の箇条書きのみ（1行程度） */
  assumptions: z.array(z.string()).min(1).max(10),
  /** 確認したいことと「曖昧だとずれやすい点」を統合 */
  followUpItems: z.array(estimateDetailedFollowUpItemSchema).max(12),
  /** お客様向けの概略（専門用語は避ける） */
  plainCustomerSummary: z.string().max(1100),
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

export function formatRequirementDocMarkdown(
  output: EstimateDetailedAiOutput,
  answers: Record<string, string>
): string {
  const lines: string[] = [`# ${output.requirementTitle}`, ""];

  lines.push("## 概略", output.plainCustomerSummary, "");

  lines.push("## 要件定義（本格）", output.requirementDefinitionDocument.trim(), "");

  lines.push("## 選択した内容");
  const pairs = getOrderedAnswerPairs(answers);
  if (pairs.length === 0) {
    lines.push("（なし）", "");
  } else {
    for (const { question, answer } of pairs) {
      lines.push(`- **${question}**: ${answer}`);
    }
    lines.push("");
  }

  lines.push("## 前提・仮定", ...output.assumptions.map((a) => `- ${a}`), "");

  if (output.followUpItems.length > 0) {
    lines.push("## 詳しく確認が必要なこと");
    for (const item of output.followUpItems) {
      lines.push(`### ${item.title}`, item.description, "");
    }
  }

  lines.push(`## ${ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING}`, "", ESTIMATE_PHILOSOPHY_UI_PARAGRAPH, "");
  return lines.join("\n");
}

export function buildAnswersSummaryLines(answers: Record<string, string>): string {
  return getOrderedAnswerPairs(answers)
    .map(({ question, answer }) => `${question}: ${answer}`)
    .join("\n");
}
