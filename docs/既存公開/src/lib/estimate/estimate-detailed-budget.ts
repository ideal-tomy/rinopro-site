import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateDetailedFlowState } from "@/lib/estimate/estimate-detailed-session";

const NUMERIC_BANDS = new Set(["under50", "50to150", "150to300", "over300"]);

/** 概算チャットの ctx 付き URL から戻るときなど、下書きが無い古いセッション向け */
export function resolveBudgetBandFromFlow(flow: EstimateDetailedFlowState): string | undefined {
  const fromDraft = flow.formDraft?.budgetBand;
  if (fromDraft && NUMERIC_BANDS.has(fromDraft)) return fromDraft;

  const label = flow.answers["ご予算のイメージ"];
  if (!label) return undefined;
  const match = estimateDetailedCopy.budgetBandOptions.find((o) => o.label === label);
  if (match && NUMERIC_BANDS.has(match.value)) return match.value;
  return undefined;
}

export type BudgetVsEstimate = "within" | "outside" | "neutral";

/**
 * 任意の予算帯を選んだとき、見積レンジ上限がその帯の「目安の上限」以下なら within。
 * outside は特別文言は出さず従来どおり（neutral と同じ見え方）。
 */
export function compareEstimateToBudgetBand(
  estimateHiMan: number,
  budgetBand: string | undefined
): BudgetVsEstimate {
  if (!budgetBand) return "neutral";

  if (budgetBand === "under50") {
    if (estimateHiMan <= 50) return "within";
    return "outside";
  }
  if (budgetBand === "50to150") {
    if (estimateHiMan <= 150) return "within";
    return "outside";
  }
  if (budgetBand === "150to300") {
    if (estimateHiMan <= 300) return "within";
    return "outside";
  }
  if (budgetBand === "over300") {
    const generousCeilingMan = 2000;
    if (estimateHiMan <= generousCeilingMan) return "within";
    return "neutral";
  }

  return "neutral";
}
