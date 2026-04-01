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

export const estimateDriverEffectSchema = z.enum(["up", "down", "wide"]);

export const estimateDetailedEstimateDriverSchema = z.object({
  factor: z.string().max(280),
  effect: estimateDriverEffectSchema,
});

export const estimateDetailedAiOutputSchema = z.object({
  requirementTitle: z.string(),
  /** 見積・社内共有用の要件定義書本文（Markdown） */
  requirementDefinitionDocument: z.string().max(12000),
  /** 今回のスコープに含める想定（箇条書きレベル） */
  scopeIn: z.array(z.string().max(400)).max(12).default([]),
  /** 今回含めない想定 */
  scopeOut: z.array(z.string().max(400)).max(12).default([]),
  /** まだ決まっていない点（followUpItems より短文でもよい） */
  openQuestions: z.array(z.string().max(320)).max(10).default([]),
  /** 規制・個人情報・記録まわりの注意（該当時） */
  regulatoryNotes: z.array(z.string().max(400)).max(6).default([]),
  /** 金額レンジに効く前提。短文の箇条書きのみ（1行程度） */
  assumptions: z.array(z.string()).min(1).max(10),
  /** 確認したいことと「曖昧だとずれやすい点」を統合 */
  followUpItems: z.array(estimateDetailedFollowUpItemSchema).max(12),
  /** レンジの主な要因（表示用） */
  estimateDrivers: z.array(estimateDetailedEstimateDriverSchema).max(8).default([]),
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

  const scopeIn = output.scopeIn ?? [];
  const scopeOut = output.scopeOut ?? [];
  const openQuestions = output.openQuestions ?? [];
  const regulatoryNotes = output.regulatoryNotes ?? [];
  const estimateDrivers = output.estimateDrivers ?? [];

  if (scopeIn.length > 0) {
    lines.push("## スコープ（含む）", ...scopeIn.map((s) => `- ${s}`), "");
  }
  if (scopeOut.length > 0) {
    lines.push("## スコープ（含まない）", ...scopeOut.map((s) => `- ${s}`), "");
  }
  if (openQuestions.length > 0) {
    lines.push("## 未確定の点", ...openQuestions.map((s) => `- ${s}`), "");
  }
  if (regulatoryNotes.length > 0) {
    lines.push(
      "## 規制・セキュリティまわりの注意",
      ...regulatoryNotes.map((s) => `- ${s}`),
      ""
    );
  }
  if (estimateDrivers.length > 0) {
    lines.push(
      "## 金額レンジの主な要因",
      ...estimateDrivers.map(
        (d) => `- **${d.factor}**（${d.effect === "up" ? "上限寄与" : d.effect === "down" ? "下限寄与" : "幅拡大"}）`
      ),
      ""
    );
  }

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
