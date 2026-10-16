/** 問い合わせトリアージのモック（API 不使用） */

export type InquiryPriorityLevel = "高" | "中" | "低";

export interface InquiryIntakeMockResult {
  category: string;
  priority: InquiryPriorityLevel;
  /** なぜその優先度か（1行） */
  priorityReason: string;
  /** 担当部署 */
  department: string;
  tags: string[];
  draftReply: string;
  internalNote: string;
}

export function buildInquiryIntakeMock(text: string): InquiryIntakeMockResult {
  const hasRefund = /返金|キャンセル|解約/.test(text);
  const hasShip = /配送|遅延|届/.test(text);
  const hasDamage = /傷|破損|潰れ|壊れ/.test(text);
  const hasTech = /ログイン|接続|エラー|不具合/.test(text);
  const hasBilling = /請求|課金|支払い/.test(text);

  let category = "一般問い合わせ";
  if (hasRefund) category = "解約・返金";
  else if (hasBilling) category = "請求";
  else if (hasShip || hasDamage) category = "物流・商品";
  else if (hasTech) category = "技術・利用方法";

  let priority: InquiryPriorityLevel = "低";
  let priorityReason = "定型対応でクローズ見込みのため。";
  let department = "カスタマーサポート第1";

  if (hasRefund) {
    priority = "高";
    priorityReason = "返金・解約の要求が含まれるため、ポリシー確認と上長エスカレの可能性あり。";
    department = "カスタマーサクセス（契約）";
  } else if (hasDamage) {
    priority = "中";
    priorityReason = "商品状態のクレームは交換フローへ繋ぐため、在庫・物流と連携が必要。";
    department = "CS / 物流連携デスク";
  } else if (hasShip) {
    priority = "中";
    priorityReason = "配送トラブルは追跡とキャリア照会が必要なため。";
    department = "物流デスク";
  } else if (hasTech) {
    priority = "低";
    priorityReason = "既知のFAQで案内可能な見込み。再現手順の確認のみ。";
    department = "テクニカルサポート";
  }

  const tags = [
    category,
    hasShip || hasDamage ? "物流系" : "",
    hasTech ? "サポート系" : "",
    hasRefund ? "契約リスク" : "",
  ].filter(Boolean);

  return {
    category,
    priority,
    priorityReason,
    department,
    tags,
    draftReply: `【モック返信案】\nお問い合わせありがとうございます。${category}に関する内容で承りました。担当部署（${department}）より○営業日以内にご連絡いたします。\n\n※ 実装ではテンプレとナレッジを組み合わせて生成します。`,
    internalNote:
      "【社内メモ】類似チケット: 過去30日で同カテゴリ推定12件。SLA: 優先度に応じて24h/72h。",
  };
}
