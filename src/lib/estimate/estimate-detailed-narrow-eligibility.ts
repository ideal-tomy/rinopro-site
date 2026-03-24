const UNKNOWN_LABEL_SUBSTRINGS = [
  "わからない",
  "未定",
  "まだ決めていない",
  "相談したい",
  "これから決める",
];

function isUnknownAnswer(value: string | undefined): boolean {
  if (!value || !String(value).trim()) return true;
  const s = String(value).trim();
  return UNKNOWN_LABEL_SUBSTRINGS.some((frag) => s.includes(frag));
}

/**
 * 回答が「絞り込み可能」とみなせるとき true。
 * プロンプトの「幅100万円以内を目標」と同じ条件をコードでも表す。
 */
export function isNarrowRangeEligible(answers: Record<string, string>): boolean {
  const summary = answers["いまいちばんやりたいこと・課題"]?.trim() ?? "";
  if (summary.length < 8) return false;

  const keys: (keyof typeof answers | string)[] = [
    "今お使いのツールや、他のシステムとのつなぎ",
    "主な使い方・載せる場所",
    "扱う情報に個人情報は含まれますか",
    "誰が使う・見るか（社内・外部）",
    "いまの情報の扱い方（中心）",
    "情報の更新の頻度",
    "見た目・デザインの期待",
    "ログインの使い方",
  ];

  for (const k of keys) {
    if (isUnknownAnswer(answers[k])) return false;
  }

  return true;
}

export function estimateRangeWidthMan(lo: number, hi: number): number {
  return Math.abs(hi - lo);
}
