import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";

/** 詳細見積フォームの初期値と同一（問い合わせ専用ヒアリングの出発点） */
export const CONTACT_INTAKE_INITIAL_FORM: EstimateFormDraft = {
  industry: "unknown",
  productArchetype: "",
  problemSummary: "",
  pain: "",
  teamSize: "11-50",
  timeline: "3m",
  integration: "nice",
  hostingContext: "unknown",
  usageSurface: "unknown",
  dataSensitivity: "unknown",
  audienceScope: "unknown",
  currentWorkflow: "unknown",
  updateFrequency: "unknown",
  designExpectation: "unknown",
  loginModel: "unknown",
  budgetBand: "unknown",
  budgetFeel: "",
  constraints: "",
};

export function mergeEstimateFormDraft(
  base: EstimateFormDraft,
  patch: Partial<EstimateFormDraft>
): EstimateFormDraft {
  return { ...base, ...patch };
}
