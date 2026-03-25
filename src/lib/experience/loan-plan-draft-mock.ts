import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function pickIndustry(raw: string): string {
  const n = norm(raw);
  if (n.includes("エステ") || n.includes("美容") || n.includes("サロン"))
    return "エステサロン";
  if (n.includes("カフェ") || n.includes("飲食") || n.includes("レストラン"))
    return "飲食店";
  if (n.includes("it") || n.includes("ソフト") || n.includes("開発"))
    return "IT・ソフトウェア";
  if (n.includes("小売") || n.includes("店舗")) return "小売・店舗";
  return "サービス業";
}

function pickArea(raw: string): string {
  const n = norm(raw);
  if (n.includes("銀座")) return "東京都中央区銀座周辺";
  if (n.includes("渋谷")) return "東京都渋谷区";
  if (n.includes("大阪")) return "大阪府大阪市";
  if (n.includes("福岡")) return "福岡県福岡市";
  return "（エリアは入力に基づく想定立地）";
}

function pickAmountHint(raw: string): string {
  const nums = raw.match(/\d{2,4}/g);
  if (nums?.length) {
    const n = parseInt(nums[nums.length - 1]!, 10);
    if (!Number.isNaN(n) && n >= 100 && n <= 9999)
      return `${n}万円規模の設備・内装を想定`;
  }
  return "設備・内装・運転資金のバランスを想定";
}

/**
 * 雑な事業メモから、融資面談・事業計画のたたき台（モック）を決定論的に生成する。
 * 特定の金融機関・制度を名指ししない。
 */
export function buildLoanPlanDraftMock(raw: string): DocumentShellMockResult {
  const input = raw.trim() || "開業に向けて融資の計画書が必要";
  const industry = pickIndustry(input);
  const area = pickArea(input);
  const amountHint = pickAmountHint(input);

  return {
    documentTitle: "事業計画・資金計画（たたき台・体験用）",
    blocks: [
      {
        type: "paragraph",
        text:
          "以下は、一般的な融資・事業計画書の体裁を模したデモ出力です。実際の申請では金融機関・担当者の指定フォーマットに合わせてください。",
      },
      { type: "heading", text: "1. 事業概要" },
      {
        type: "paragraph",
        text: `事業内容: ${industry}の新規開業（入力メモに基づく要約）。想定エリア: ${area}。開業時期は入力に明記がなければ「開業後12か月以内」を仮置きしています。`,
      },
      { type: "heading", text: "2. 市場・顧客" },
      {
        type: "bullets",
        items: [
          `ターゲット: ${industry}の利用需要（周辺商圏・客単価は要ヒアリングで確定）`,
          "競合: 同一商圏内の同業他社2〜3社との差別化ポイントを面談前に整理推奨",
          "集客: 予約・紹介・Webのいずれを主軸にするかを開業前に数値目標化",
        ],
      },
      { type: "heading", text: "3. 収支のたたき台（デモ数値）" },
      {
        type: "kpis",
        items: [
          { label: "初年度売上高（試算）", value: "2,400万円", note: "月200万円×12か月の例" },
          { label: "粗利率（目標）", value: "62%", note: industry.includes("エステ") ? "サービス原価中心" : "業種平均を参考にした仮置き" },
          { label: "損益分岐（目安）", value: "月商約95万円", note: "固定費構造により変動" },
        ],
      },
      {
        type: "table",
        caption: "資金用途の例（単位: 万円・すべてデモ）",
        headers: ["項目", "金額", "備考"],
        rows: [
          ["内装・設備", "480", amountHint],
          ["運転資金", "320", "開業後6か月分の目安"],
          ["開業広告・PR", "120", "立ち上げ期集中"],
          ["その他・予備費", "80", "未確定費用のバッファ"],
        ],
      },
      { type: "heading", text: "4. 返済・キャッシュフロー上の論点" },
      {
        type: "bullets",
        items: [
          "返済原資: 営業CFの安定化時期（開業後何か月で黒字化するか）をシナリオ化",
          "売上ドリフト: 楽観・標準・保守の3ケースで返済余力を確認",
          "追加資金需要: 内装超過・売上遅れが出た場合の手当て",
        ],
      },
      { type: "heading", text: "5. 面談で想定されやすい質問（準備メモ）" },
      {
        type: "bullets",
        items: [
          "自己資金の額と出所、開業までのタイムライン",
          "過去の同種事業経験・主要スタッフの役割",
          "主要仕入・外注の契約状況と単価の根拠",
        ],
      },
    ],
  };
}

export const LOAN_PLAN_DRAFT_SAMPLES: string[] = [
  "エステを銀座で開業したい。融資の計画書を作りたい。内装800万くらいのイメージ。",
  "渋谷で小さなカフェを開業。運転資金も含めて相談したい。",
  "IT受託で法人化したばかり。今後3年の事業計画の骨子が欲しい。",
];
