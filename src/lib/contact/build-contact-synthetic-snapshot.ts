import { buildEstimateDetailedAnswersRecord } from "@/lib/estimate/build-estimate-detailed-answers";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import {
  ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
  buildAnswersSummaryLines,
  formatRequirementDocMarkdown,
  type EstimateDetailedAiOutput,
  type EstimateSnapshot,
} from "@/lib/estimate/estimate-snapshot";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";

/** 問い合わせフォームのみで作ったスナップショットであることを識別するためのタイトル */
export const CONTACT_SYNTHETIC_SNAPSHOT_TITLE =
  "問い合わせフォーム経由の整理（目安未生成）" as const;

function buildPlainSummaryFromContactForm(
  form: EstimateFormDraft,
  answers: Record<string, string>
): string {
  const lines = buildAnswersSummaryLines(answers);
  const head = [form.productArchetype.trim(), form.problemSummary.trim()]
    .filter(Boolean)
    .join(" / ");
  const body = lines.trim();
  if (head && body) return `${head}\n\n${body}`;
  return head || body || "問い合わせフォームのヒアリング内容をもとに整理中です。";
}

function buildSyntheticAiOutput(
  form: EstimateFormDraft,
  answers: Record<string, string>
): EstimateDetailedAiOutput {
  const plain = buildPlainSummaryFromContactForm(form, answers);
  return {
    requirementTitle: CONTACT_SYNTHETIC_SNAPSHOT_TITLE,
    requirementDefinitionDocument:
      "このデータは問い合わせページのヒアリング回答から自動生成されたたたき台です。詳細見積APIによる本整理ではありません。",
    scopeIn: [],
    scopeOut: [],
    openQuestions: [],
    regulatoryNotes: [],
    assumptions: [
      "問い合わせフォームの選択・記述のみを根拠にしています。金額レンジは未算出です。",
    ],
    followUpItems: [],
    estimateDrivers: [],
    plainCustomerSummary: plain.slice(0, 1100),
    estimateLoMan: 0,
    estimateHiMan: 0,
  };
}

/**
 * 詳細見積APIを経由せず、問い合わせヒアリングだけから `EstimateSnapshot` 互換オブジェクトを作る。
 * `/api/inquiry-brief` の入力として利用する。
 */
export function buildContactSyntheticEstimateSnapshot(args: {
  form: EstimateFormDraft;
  visitorJourney?: VisitorJourneySummary | null;
  priorContext?: string;
}): EstimateSnapshot {
  const answers = buildEstimateDetailedAnswersRecord(args.form);
  const ai = buildSyntheticAiOutput(args.form, answers);
  return {
    schemaVersion: ESTIMATE_SNAPSHOT_SCHEMA_VERSION,
    source: "estimate_detailed",
    createdAt: new Date().toISOString(),
    priorContext: args.priorContext?.trim() || undefined,
    answers,
    ai,
    visitorJourney: args.visitorJourney ?? undefined,
    requirementDocMarkdown: formatRequirementDocMarkdown(ai, answers),
  };
}

export function isContactSyntheticEstimateSnapshot(
  snapshot: EstimateSnapshot | null | undefined
): boolean {
  return snapshot?.ai.requirementTitle === CONTACT_SYNTHETIC_SNAPSHOT_TITLE;
}
