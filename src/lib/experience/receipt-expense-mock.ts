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
  void _text;
  return {
    fields: [
      { id: "date", label: "日付", value: "2025-03-18" },
      { id: "amount", label: "金額", value: "¥4,820（税込）" },
      { id: "merchant", label: "店名・摘要", value: "〇〇交通 タクシー" },
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
        ok: false,
        label: "社内規程の上限チェック（要確認）",
        relatedFieldId: "amount",
      },
      {
        ok: true,
        label: "交通費の内訳メモあり",
        relatedFieldId: "merchant",
      },
    ],
  };
}
