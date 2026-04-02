export const ESTIMATE_QUESTION_LABELS = {
  industry: "業種",
  summary: "いまいちばんやりたいこと・課題",
  teamSize: "会社やチームの人数のイメージ",
  timeline: "いつ頃までに、という希望",
  integration: "今お使いのツールや、他のシステムとのつなぎ",
  /** インフラ・到達範囲のたたき台（「使用環境」という語は UI では使わない） */
  hostingContext: "データやシステムの置き場所のイメージ",
  usageSurface: "主な使い方・載せる場所",
  dataSensitivity: "扱う情報に個人情報は含まれますか",
  audienceScope: "誰が使う・見るか（社内・外部）",
  currentWorkflow: "いまの情報の扱い方（中心）",
  updateFrequency: "情報の更新の頻度",
  designExpectation: "見た目・デザインの期待",
  loginModel: "ログインの使い方",
  budgetBand: "ご予算のイメージ",
  pain: "うまくいっていないこと",
  budgetFeel: "予算の補足",
  constraints: "気になること・制約",
} as const;

export type EstimateQuestionId = keyof typeof ESTIMATE_QUESTION_LABELS;
export type EstimateQuestionLabel = (typeof ESTIMATE_QUESTION_LABELS)[EstimateQuestionId];

export const ESTIMATE_QUESTION_ORDER: readonly EstimateQuestionId[] = [
  "industry",
  "summary",
  "teamSize",
  "timeline",
  "integration",
  "hostingContext",
  "usageSurface",
  "dataSensitivity",
  "audienceScope",
  "currentWorkflow",
  "updateFrequency",
  "designExpectation",
  "loginModel",
  "budgetBand",
  "pain",
  "budgetFeel",
  "constraints",
] as const;

const LABEL_TO_ID = new Map<EstimateQuestionLabel, EstimateQuestionId>(
  Object.entries(ESTIMATE_QUESTION_LABELS).map(([id, label]) => [
    label as EstimateQuestionLabel,
    id as EstimateQuestionId,
  ])
);

export function answerLabelFromQuestionId(id: EstimateQuestionId): EstimateQuestionLabel {
  return ESTIMATE_QUESTION_LABELS[id];
}

export function questionIdFromAnswerLabel(
  label: string
): EstimateQuestionId | null {
  return LABEL_TO_ID.get(label as EstimateQuestionLabel) ?? null;
}

export function buildAnsweredQuestionIdSet(
  answers: Record<string, string>
): Set<EstimateQuestionId> {
  const out = new Set<EstimateQuestionId>();
  for (const [label, value] of Object.entries(answers)) {
    if (!String(value ?? "").trim()) continue;
    const id = questionIdFromAnswerLabel(label);
    if (id) out.add(id);
  }
  return out;
}

export function shouldAskEstimateQuestion(args: {
  questionId: EstimateQuestionId;
  prefilledQuestionIds?: Iterable<EstimateQuestionId>;
  answeredQuestionIds?: Iterable<EstimateQuestionId>;
}): boolean {
  const { questionId, prefilledQuestionIds, answeredQuestionIds } = args;
  if (prefilledQuestionIds) {
    for (const id of prefilledQuestionIds) {
      if (id === questionId) return false;
    }
  }
  if (answeredQuestionIds) {
    for (const id of answeredQuestionIds) {
      if (id === questionId) return false;
    }
  }
  return true;
}
