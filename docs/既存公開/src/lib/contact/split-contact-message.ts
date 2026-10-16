/** estimate-handoff の buildContactMessageDraft と同期 */
export const CONTACT_AUTO_MEMO_MARKER = "--- 以下は自動メモです ---";
export const CONTACT_ESTIMATE_HANDOFF_HEADER = "【詳細見積もりページからのお問い合わせ】";
export const CONTACT_CONCIERGE_HANDOFF_HEADER = "【AIコンシェルジュからの引き継ぎ】";

const ESTIMATE_BOILERPLATE_LINES = new Set([
  CONTACT_ESTIMATE_HANDOFF_HEADER,
  "（この上に、追加で伝えたいことを書いてください）",
]);

const CONCIERGE_TAIL_MARKER =
  "上記はチャット上の選択に基づくたたき台です。追加のご要望があれば続けてご記入ください。";

export type SplitContactMessageResult = {
  userAdded: string;
  autoMemo: string | null;
  hadEstimateHandoff: boolean;
  hadConciergeHandoff: boolean;
};

function stripBoilerplateLines(lines: string[]): string[] {
  return lines.filter((line) => {
    const t = line.trim();
    if (!t) return true;
    if (ESTIMATE_BOILERPLATE_LINES.has(t)) return false;
    return true;
  });
}

function splitEstimateHandoff(message: string): SplitContactMessageResult {
  const idx = message.indexOf(CONTACT_AUTO_MEMO_MARKER);
  const before = idx >= 0 ? message.slice(0, idx) : message;
  const after = idx >= 0 ? message.slice(idx + CONTACT_AUTO_MEMO_MARKER.length).trim() : null;

  const userLines = stripBoilerplateLines(before.split("\n"));
  const userAdded = userLines.join("\n").trim();

  return {
    userAdded,
    autoMemo: after && after.length > 0 ? after : null,
    hadEstimateHandoff: true,
    hadConciergeHandoff: false,
  };
}

function splitConciergeHandoff(message: string): SplitContactMessageResult {
  const headerIdx = message.indexOf(CONTACT_CONCIERGE_HANDOFF_HEADER);
  if (headerIdx < 0) {
    return {
      userAdded: message.trim(),
      autoMemo: null,
      hadEstimateHandoff: false,
      hadConciergeHandoff: false,
    };
  }

  const tailIdx = message.indexOf(CONCIERGE_TAIL_MARKER);
  if (tailIdx < 0) {
    return {
      userAdded: message.trim(),
      autoMemo: null,
      hadEstimateHandoff: false,
      hadConciergeHandoff: true,
    };
  }

  const afterTail = message.slice(tailIdx + CONCIERGE_TAIL_MARKER.length).trim();
  const autoBody = message
    .slice(headerIdx, tailIdx + CONCIERGE_TAIL_MARKER.length)
    .trim();

  return {
    userAdded: afterTail,
    autoMemo: autoBody.length > 0 ? autoBody : null,
    hadEstimateHandoff: false,
    hadConciergeHandoff: true,
  };
}

/** フォーム message を手入力分と自動メモに分離 */
export function splitContactMessage(message: string): SplitContactMessageResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      userAdded: "",
      autoMemo: null,
      hadEstimateHandoff: false,
      hadConciergeHandoff: false,
    };
  }

  if (trimmed.includes(CONTACT_AUTO_MEMO_MARKER)) {
    return splitEstimateHandoff(trimmed);
  }

  if (trimmed.includes(CONTACT_CONCIERGE_HANDOFF_HEADER)) {
    return splitConciergeHandoff(trimmed);
  }

  if (trimmed.startsWith(CONTACT_ESTIMATE_HANDOFF_HEADER)) {
    return splitEstimateHandoff(trimmed);
  }

  return {
    userAdded: trimmed,
    autoMemo: null,
    hadEstimateHandoff: false,
    hadConciergeHandoff: false,
  };
}

/** 顧客向け：追記が空のときの説明 */
export function customerMessageDisplay(
  split: SplitContactMessageResult
): string {
  if (split.userAdded.length > 0) return split.userAdded;
  if (split.hadEstimateHandoff) {
    return "詳細見積もりで整理した内容をもとに送信されました。";
  }
  return "（追記なし）";
}

/** 社内向け：追記が空のとき */
export function adminUserAddedDisplay(split: SplitContactMessageResult): string {
  if (split.userAdded.length > 0) return split.userAdded;
  return "（お客様による追記はありません）";
}
