import {
  ESTIMATE_QUESTION_ORDER,
  answerLabelFromQuestionId,
} from "@/lib/estimate-core/question-model";

/**
 * 詳細見積フォームの質問ラベル（= answers のキー）の表示順。
 * 質問IDは estimate-core/question-model.ts で固定し、
 * 表示ラベルのみ本定数で出力する。
 */
export const ESTIMATE_DETAILED_ANSWER_KEY_ORDER = ESTIMATE_QUESTION_ORDER.map(
  answerLabelFromQuestionId
) as readonly string[];

export type EstimateDetailedAnswerKey = (typeof ESTIMATE_DETAILED_ANSWER_KEY_ORDER)[number];

/** 順序付きで、空でない Q&A のペアだけ返す */
export function getOrderedAnswerPairs(
  answers: Record<string, string>
): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];
  for (const key of ESTIMATE_DETAILED_ANSWER_KEY_ORDER) {
    const v = answers[key];
    if (v != null && String(v).trim()) {
      out.push({ question: key, answer: String(v).trim() });
    }
  }
  return out;
}
