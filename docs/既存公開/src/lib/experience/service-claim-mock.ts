export type ServiceClaimVariant = {
  key: string;
  label: string;
  body: string;
};

export type ServiceClaimMockResult = {
  variants: ServiceClaimVariant[];
  internal: string;
  /** お客様が最も怒っている点（1行） */
  angerFocus: string;
};

export function buildClaimMock(input: string): ServiceClaimMockResult {
  const topic = input.trim() || "配送遅延のお詫び";

  let angerFocus =
    "納品・対応の遅れに対する不信感が中心です。まず事実確認と次の具体日時を明示すると安心感が上がります。";
  if (/傷|破損|壊れ/.test(topic)) {
    angerFocus =
      "商品状態への不満が強く、交換・返金の意思が読み取れます。品質責任と手続きの明確化が鍵です。";
  }
  if (/返金|キャンセル|解約/.test(topic)) {
    angerFocus =
      "金銭・契約に関する要求が含まれます。ポリシー照合とエスカレ有無を社内で先に揃える必要があります。";
  }

  return {
    variants: [
      {
        key: "standard",
        label: "標準",
        body: `お問い合わせありがとうございます。${topic}につきまして、担当より本日中に状況と次のご案内をご連絡いたします。お急ぎの場合はお手数ですが、お電話番号とご希望の連絡時間帯をお知らせください。`,
      },
      {
        key: "apology",
        label: "お詫び重視",
        body: `この度は多大なご迷惑をおかけし、心よりお詫び申し上げます。${topic}の経緯を確認し、責任をもってご説明・ご対応いたします。本日中に担当よりご連絡差し上げます。`,
      },
      {
        key: "compromise",
        label: "妥協点提示（クーポン等）",
        body: `ご不快な思いをさせてしまい申し訳ございません。${topic}について、状況確認のうえ次回ご利用分として10%オフクーポンをご案内可能です（条件あり）。ご希望であれば返信でお知らせください。改めて担当より詳細をご連絡します。`,
      },
    ],
    internal: `【社内共有】エスカレ: 返金明示ありなら上長承認。遅延理由ログ: #4821 参照。顧客感情: やや強め。\n入力要約: ${topic.slice(0, 80)}${topic.length > 80 ? "…" : ""}`,
    angerFocus,
  };
}
