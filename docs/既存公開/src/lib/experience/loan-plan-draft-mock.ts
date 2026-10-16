import type {
  DocumentShellPresetDefinition,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import {
  pickAmountHintFromText,
  pickAreaFromText,
  pickIndustryFromText,
} from "@/lib/experience/document-shell-signals";

const INDUSTRY_OPTIONS = [
  { id: "service", label: "サービス業" },
  { id: "retail", label: "小売・店舗" },
  { id: "it", label: "IT・ソフトウェア" },
  { id: "mfg", label: "製造業" },
] as const;

const STAGE_OPTIONS = [
  { id: "preopen", label: "開業準備" },
  { id: "expand", label: "既存事業の拡張" },
  { id: "succession", label: "事業承継・譲渡を検討" },
] as const;

const URGENCY_OPTIONS = [
  { id: "soon", label: "1ヶ月以内に面談したい" },
  { id: "later", label: "情報整理・様子見" },
] as const;

export const LOAN_CHOICE_STEPS = [
  {
    id: "industry",
    title: "事業の主軸に近いものは？",
    options: [...INDUSTRY_OPTIONS],
  },
  {
    id: "stage",
    title: "いまのフェーズは？",
    options: [...STAGE_OPTIONS],
  },
  {
    id: "urgency",
    title: "面談・相談の希望は？",
    options: [...URGENCY_OPTIONS],
  },
];

function industryLabel(
  input: { rawText: string; selections: Record<string, string> }
): string {
  const sid = input.selections.industry;
  const o = INDUSTRY_OPTIONS.find((x) => x.id === sid);
  if (o) return o.label;
  return pickIndustryFromText(input.rawText);
}

function stageLabel(input: { selections: Record<string, string> }): string {
  const sid = input.selections.stage;
  const o = STAGE_OPTIONS.find((x) => x.id === sid);
  return o?.label ?? "開業準備";
}

function urgencyNote(input: { selections: Record<string, string> }): string {
  const sid = input.selections.urgency;
  if (sid === "soon") return "初回面談までの資料優先度: 高（デモ）";
  return "資料は段階的に整備で可（デモ）";
}

/**
 * 雑な事業メモ＋選択から、融資面談・事業計画のたたき台を決定論的に生成する。
 */
export function buildLoanPlanDraftMock(
  input: DocumentShellUserInput
): DocumentShellMockResult {
  const raw = input.rawText.trim() || "開業に向けて融資の計画書が必要";
  const industry = industryLabel({ ...input, rawText: raw });
  const area = pickAreaFromText(raw);
  const amountHint = pickAmountHintFromText(raw);
  const stage = stageLabel(input);
  const riskTone =
    input.selections.stage === "succession"
      ? "承継税務・従業員引継ぎの論点を早めに洗い出し推奨（デモ）"
      : "売上計画の感度分析を面談前に1パターン用意推奨（デモ）";

  const fundRows: string[][] =
    input.selections.stage === "expand"
      ? [
          ["増設・設備", "360", amountHint],
          ["運転資金", "280", "拡張期6か月分の目安"],
          ["マーケ・採用", "140", "立ち上げ集中"],
          ["予備費", "60", "バッファ"],
        ]
      : [
          ["内装・設備", "480", amountHint],
          ["運転資金", "320", "開業後6か月分の目安"],
          ["開業広告・PR", "120", "立ち上げ期集中"],
          ["その他・予備費", "80", "未確定費用のバッファ"],
        ];

  return {
    documentTitle: "事業計画・資金計画（たたき台・体験用）",
    blocks: [
      {
        type: "paragraph",
        text:
          "以下は、一般的な融資・事業計画書の体裁を模したデモ出力です。実際の申請では金融機関・担当者の指定フォーマットに合わせてください。",
      },
      {
        type: "paragraph",
        text: `選択に基づく前提: フェーズ「${stage}」。${urgencyNote(input)}`,
      },
      { type: "heading", text: "1. 事業概要" },
      {
        type: "paragraph",
        text: `事業内容: ${industry}（選択・メモに基づく要約）。想定エリア: ${area}。`,
      },
      { type: "heading", text: "2. 市場・顧客" },
      {
        type: "bullets",
        items: [
          `ターゲット: ${industry}の利用需要（周辺商圏はヒアリングで確定）`,
          "競合: 同一商圏の同業2〜3社との差別化を面談前に整理推奨",
          "集客: 予約・紹介・Webの主軸と数値目標を開業前に設定",
        ],
      },
      { type: "heading", text: "3. 収支のたたき台（デモ数値）" },
      {
        type: "kpis",
        items: [
          {
            label: "初年度売上高（試算）",
            value: input.selections.industry === "it" ? "3,000万円" : "2,400万円",
            note: "デモ用の目安",
          },
          {
            label: "粗利率（目標）",
            value: industry.includes("IT") ? "55%" : "62%",
            note: "業種別の仮置き",
          },
          { label: "損益分岐（目安）", value: "月商約95万円", note: "固定費により変動" },
        ],
      },
      {
        type: "table",
        caption: "資金用途の例（単位: 万円・すべてデモ）",
        headers: ["項目", "金額", "備考"],
        rows: fundRows,
      },
      { type: "heading", text: "4. 返済・キャッシュフロー上の論点" },
      {
        type: "bullets",
        items: [
          "返済原資: 営業CF黒字化の月次シナリオを整理",
          "売上ドリフト: 楽観・標準・保守の3ケースで返済余力を確認",
          riskTone,
        ],
      },
      { type: "heading", text: "5. 面談で想定されやすい質問（準備メモ）" },
      {
        type: "bullets",
        items: [
          "自己資金の額と出所、開業（または拡張）までのタイムライン",
          "主要スタッフの役割・採用状況",
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

const LOAN_PLAN_DRAFT_SAMPLE_LABELS: string[] = [
  "銀座エステ開業の例",
  "渋谷カフェ開業の例",
  "法人化直後のIT会社の例",
];

export const loanDocumentPreset: DocumentShellPresetDefinition = {
  choiceSteps: LOAN_CHOICE_STEPS,
  samples: LOAN_PLAN_DRAFT_SAMPLES,
  sampleLabels: LOAN_PLAN_DRAFT_SAMPLE_LABELS,
  build: buildLoanPlanDraftMock,
  leftPanelTitle: "事業メモ（雑でOK）",
  centerButtonLabel: "たたき台を生成",
  rightPanelTitle: "事業計画・資金計画（体裁イメージ）",
};
