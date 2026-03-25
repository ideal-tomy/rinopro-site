export type ReceiptFieldId = "date" | "amount" | "merchant" | "invoice";

export type ReceiptHighlightRegion = {
  topPct: number;
  leftPct: number;
  widthPct: number;
  heightPct: number;
};

/** 領収書レイアウト想定の固定％矩形（モック） */
export const RECEIPT_HIGHLIGHT_REGIONS: Record<
  ReceiptFieldId,
  ReceiptHighlightRegion
> = {
  date: { topPct: 8, leftPct: 6, widthPct: 28, heightPct: 12 },
  amount: { topPct: 52, leftPct: 58, widthPct: 36, heightPct: 14 },
  merchant: { topPct: 22, leftPct: 6, widthPct: 62, heightPct: 14 },
  invoice: { topPct: 72, leftPct: 6, widthPct: 88, heightPct: 12 },
};

export type ReceiptFieldRow = {
  id: ReceiptFieldId;
  label: string;
  value: string;
};

export type ReceiptCheckRow = {
  ok: boolean;
  label: string;
  /** 選択中フィールドとの連動用（null は全体・非特定） */
  relatedFieldId: ReceiptFieldId | null;
};

export type ReceiptExpenseMockResult = {
  fields: ReceiptFieldRow[];
  checks: ReceiptCheckRow[];
  compliance: {
    upperLimitYen: number;
    ok: boolean;
    label: string;
    advice: string;
    extractedAmountYen: number;
  };
};

export const FIELD_HINTS: Record<ReceiptFieldId, string> = {
  date:
    "日付は申請期間と照合してください。跨月の場合は精算ルールを確認します（モック）。",
  amount:
    "金額は税込表示と精算システム入力の桁・消費税区分をダブルチェックしてください。",
  merchant:
    "店名・摘要は交通費か会議費かなど、経費科目との整合を確認してください。",
  invoice:
    "インボイス登録番号の桁数と適格請求書の要否を確認してください（モック）。",
};

export const RECEIPT_HINT_DEFAULT =
  "項目を選ぶと、領収書上の該当箇所が強調されます（モック・固定座標）。";

export function buildReceiptExpenseMock(_text: string): ReceiptExpenseMockResult {
  const text = _text.trim();
  const isMeal =
    /飲食|4名|会議/i.test(text) ||
    /ランチ|ディナー/i.test(text);

  const upperLimitYen = 2000;
  const extractedAmountYen = isMeal ? 2480 : 1680;
  const ok = extractedAmountYen <= upperLimitYen;

  const amountValue = isMeal ? "¥2,480（税込）" : "¥1,680（税込）";
  const merchantValue = isMeal
    ? "〇〇会議室（飲食費）"
    : "〇〇交通 タクシー";

  const advice = ok
    ? "金額は社内規定の範囲内です。次に、日付・店名・インボイス情報の整合を確認してください。"
    : "金額が社内規定の上限（2000円）を超過しています。例外扱いの理由（会食目的・人数・代替手段の有無）を確認してください。";

  const label = ok
    ? `社内規定（上限${upperLimitYen}円）に適合`
    : `社内規定（上限${upperLimitYen}円）を超過`;

  return {
    fields: [
      { id: "date", label: "日付", value: "2025-03-18" },
      { id: "amount", label: "金額", value: amountValue },
      { id: "merchant", label: "店名・摘要", value: merchantValue },
      {
        id: "invoice",
        label: "インボイス登録番号",
        value: "T1234567890123（例）",
      },
    ],
    checks: [
      { ok: true, label: "日付が申請期間内", relatedFieldId: "date" },
      { ok: true, label: "金額と領収書一致", relatedFieldId: "amount" },
      {
        ok,
        label: ok
          ? `社内規定（上限${upperLimitYen}円）に適合`
          : "社内規程の上限チェック（要確認）",
        relatedFieldId: "amount",
      },
      {
        ok: true,
        label: isMeal ? "会食目的メモあり" : "交通費の内訳メモあり",
        relatedFieldId: "merchant",
      },
    ],
    compliance: {
      upperLimitYen,
      ok,
      label,
      advice,
      extractedAmountYen,
    },
  };
}
