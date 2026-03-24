/** 問い合わせトリアージのモック（API 不使用） */

export interface InquiryIntakeMockResult {
  category: string;
  priority: "通常" | "要確認" | "緊急";
  tags: string[];
  draftReply: string;
  internalNote: string;
}

export function buildInquiryIntakeMock(text: string): InquiryIntakeMockResult {
  const t = text.toLowerCase();
  const hasRefund = /返金|キャンセル|解約/.test(text);
  const hasShip = /配送|遅延|破損/.test(text);
  const hasTech = /ログイン|接続|エラー|不具合/.test(text);

  let category = "一般問い合わせ";
  if (hasRefund) category = "契約・解約・返金";
  else if (hasShip) category = "物流・配送";
  else if (hasTech) category = "技術・利用方法";

  const priority: InquiryIntakeMockResult["priority"] = hasRefund
    ? "要確認"
    : hasTech
      ? "通常"
      : "通常";

  const tags = [
    category,
    hasShip ? "配送系" : "",
    hasTech ? "サポート系" : "",
  ].filter(Boolean);

  return {
    category,
    priority,
    tags,
    draftReply: `【モック返信案】\nお問い合わせありがとうございます。${category}に関する内容と承りました。担当より○営業日以内にご連絡いたします。\n\n※ 実装ではテンプレとナレッジを組み合わせて生成します。`,
    internalNote:
      "【社内メモ（モック）】類似チケット: 過去30日で同カテゴリ12件。エスカレ条件: 返金希望かつ金額明示あり。",
  };
}
