/**
 * 詳細見積フォームの質問ラベル（= answers のキー）の表示順。
 * buildAnswersRecord と結果ページの Q&A で共有する。
 */
export const ESTIMATE_DETAILED_ANSWER_KEY_ORDER = [
  "業種",
  "いまいちばんやりたいこと・課題",
  "会社やチームの人数のイメージ",
  "いつ頃までに、という希望",
  "今お使いのツールや、他のシステムとのつなぎ",
  "主な使い方・載せる場所",
  "扱う情報に個人情報は含まれますか",
  "誰が使う・見るか（社内・外部）",
  "いまの情報の扱い方（中心）",
  "情報の更新の頻度",
  "見た目・デザインの期待",
  "ログインの使い方",
  "ご予算のイメージ",
  "うまくいっていないこと",
  "予算の補足",
  "気になること・制約",
] as const;

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
