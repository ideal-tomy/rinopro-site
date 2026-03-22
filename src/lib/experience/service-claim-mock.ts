export type ServiceClaimVariant = {
  key: string;
  label: string;
  body: string;
};

export type ServiceClaimMockResult = {
  variants: ServiceClaimVariant[];
  internal: string;
};

export function buildClaimMock(input: string): ServiceClaimMockResult {
  const topic = input.trim() || "配送遅延のお詫び";
  return {
    variants: [
      {
        key: "polite",
        label: "丁寧",
        body: `この度はご不便をおかけし、誠に申し訳ございません。${topic}につきまして、担当より本日中に改めてご連絡いたします。再配送のご希望時間帯がございましたらお知らせください。`,
      },
      {
        key: "brief",
        label: "簡潔",
        body: `お待たせしており申し訳ありません。${topic}について、本日中に状況と次の手順をご連絡します。`,
      },
      {
        key: "firm",
        label: "事実ベース",
        body: `ご指摘の件、配送ステータスを確認いたしました。${topic}に関する事実関係を整理のうえ、本日中にご報告と対応案を送付します。`,
      },
    ],
    internal: `エスカレ不要想定。遅延理由: 拠点積み遅れ（ログ#4821）。顧客感情: やや強め。次アクション: 再配送枠 明日14–16時を第一候補で提案。\n（入力要約: ${topic.slice(0, 60)}${topic.length > 60 ? "…" : ""}）`,
  };
}
