import { answerLabelFromQuestionId } from "@/lib/estimate-core/question-model";

/** 金額レンジ推定プロンプトから除外する（希望のアンカーを防ぐ） */
const EXCLUDED_FROM_PRICING_LABELS = [
  answerLabelFromQuestionId("budgetBand"),
  answerLabelFromQuestionId("budgetFeel"),
] as const;

/** 要約で希望との関係を説明するためだけに渡すブロック用 */
export function pickBudgetContextLines(answers: Record<string, string>): string[] {
  const lines: string[] = [];
  for (const key of EXCLUDED_FROM_PRICING_LABELS) {
    const v = answers[key];
    if (v != null && String(v).trim()) {
      lines.push(`- ${key}: ${String(v).trim()}`);
    }
  }
  return lines;
}

/** 価格推定用: 予算関連キーを除いた回答レコード（参照コピーではなく新オブジェクト） */
export function answersForPricingEstimate(answers: Record<string, string>): Record<string, string> {
  const exclude = new Set<string>(EXCLUDED_FROM_PRICING_LABELS);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(answers)) {
    if (exclude.has(k)) continue;
    if (v != null && String(v).trim()) out[k] = String(v).trim();
  }
  return out;
}

export function buildPricingAnswerLines(answers: Record<string, string>): string[] {
  const pricing = answersForPricingEstimate(answers);
  return Object.entries(pricing)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${String(v).trim()}`);
}
