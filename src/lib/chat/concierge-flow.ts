/**
 * トップページ AIコンシェルジュ用の分岐定義と概算テキスト生成。
 * 金額は初期検討向けの目安であり、確定見積もりではない。
 */

export type ConciergeTrack = "A" | "B" | "C" | "D" | "E";

export interface FlowChoice {
  id: string;
  label: string;
}

export interface FlowStepDef {
  stepKey: string;
  stepLabel: string;
  question: string;
  choices: FlowChoice[];
}

export interface FlowSelection {
  stepKey: string;
  optionId: string;
  /** 選択肢の表示文言 */
  label: string;
  /** サマリ行用の見出し（例: 想定ユーザー規模） */
  stepTitle: string;
  freeform?: string;
}

export const ROOT_CHOICES: FlowChoice[] = [
  { id: "root_a", label: "開発コストを知りたい" },
  { id: "root_b", label: "契約・コンサル費用を知りたい" },
  { id: "root_c", label: "具体的な開発技術を知りたい" },
  { id: "root_d", label: "実際に得られるツール内容を知りたい" },
  { id: "root_e", label: "依頼方法を知りたい" },
];

export const A_STEP_TEAM: FlowStepDef = {
  stepKey: "A2",
  stepLabel: "Step 2",
  question: "想定ユーザー規模（利用人数）は？",
  choices: [
    { id: "team_1_10", label: "1〜10人" },
    { id: "team_11_50", label: "11〜50人" },
    { id: "team_51_200", label: "51〜200人" },
    { id: "team_201_plus", label: "201人以上" },
    { id: "team_unknown", label: "まだ未定 / その他" },
  ],
};

export const A_STEP_BUILD: FlowStepDef = {
  stepKey: "A3",
  stepLabel: "Step 3",
  question: "いま作りたいイメージに近いものは？",
  choices: [
    { id: "build_poc", label: "小さく試す（PoC / 1業務）" },
    { id: "build_auto", label: "既存業務を自動化したい" },
    { id: "build_chatbot", label: "社内チャットボットを作りたい" },
    { id: "build_inquiry", label: "問い合わせ・受付を自動化したい" },
    { id: "build_platform", label: "部門横断の業務基盤を作りたい" },
    { id: "build_other", label: "その他（自由記述）" },
  ],
};

export const A_STEP_INTEGRATION: FlowStepDef = {
  stepKey: "A4",
  stepLabel: "Step 4",
  question: "既存システムやツールとの連携は必要ですか？",
  choices: [
    { id: "int_required", label: "必須（社内システムと連携したい）" },
    { id: "int_maybe", label: "できれば連携したい" },
    { id: "int_standalone", label: "まずは単体でよい" },
    { id: "int_unknown", label: "まだ分からない" },
    { id: "int_other", label: "その他（自由記述）" },
  ],
};

export const B_STEP_SUPPORT: FlowStepDef = {
  stepKey: "B2",
  stepLabel: "Step 2",
  question: "どの支援に近いですか？",
  choices: [
    { id: "b_diag", label: "現状診断だけ頼みたい" },
    { id: "b_req", label: "要件整理を伴走してほしい" },
    { id: "b_plan", label: "導入計画を一緒に作りたい" },
    { id: "b_adopt", label: "社内定着まで支援してほしい" },
    { id: "b_devset", label: "開発とセットで依頼したい" },
    { id: "b_other", label: "その他（自由記述）" },
  ],
};

export const B_STEP_TEAM: FlowStepDef = {
  ...A_STEP_TEAM,
  stepKey: "B3",
  stepLabel: "Step 3",
  question: "想定ユーザー規模（対象範囲）は？",
};

export const B_STEP_CHALLENGE: FlowStepDef = {
  stepKey: "B4",
  stepLabel: "Step 4",
  question: "いちばん改善したいことに近いものは？",
  choices: [
    { id: "ch_workload", label: "工数・手作業を減らしたい" },
    { id: "ch_silo", label: "属人化・暗黙知を減らしたい" },
    { id: "ch_quality", label: "品質や判断のブレを減らしたい" },
    { id: "ch_speed", label: "スピード（リードタイム）を上げたい" },
    { id: "ch_visibility", label: "可視化・意思決定を早めたい" },
    { id: "ch_other", label: "その他（自由記述）" },
  ],
};

export const C_STEP2: FlowStepDef = {
  stepKey: "C2",
  stepLabel: "Step 2",
  question: "知りたい技術の方向性に近いものは？",
  choices: [
    { id: "c_eff", label: "業務効率化（手作業削減）" },
    { id: "c_auto", label: "業務自動化（定型処理）" },
    { id: "c_kb", label: "社内ナレッジ共有" },
    { id: "c_wf", label: "ワークフロー構築" },
    { id: "c_text", label: "テキスト自動生成" },
    { id: "c_other", label: "その他（自由記述）" },
  ],
};

export const D_STEP2: FlowStepDef = {
  stepKey: "D2",
  stepLabel: "Step 2",
  question: "イメージに近いツールの形は？",
  choices: [
    { id: "d_dash", label: "管理画面（ダッシュボード）" },
    { id: "d_chatui", label: "社内向けチャットUI" },
    { id: "d_alert", label: "自動通知・アラート" },
    { id: "d_integrate", label: "データ連携（既存SaaS / API）" },
    { id: "d_report", label: "レポート自動作成" },
    { id: "d_other", label: "その他（自由記述）" },
  ],
};

export const E_STEP2: FlowStepDef = {
  stepKey: "E2",
  stepLabel: "Step 2",
  question: "依頼の進め方に近いものは？",
  choices: [
    { id: "e_talk", label: "まず相談だけしたい" },
    { id: "e_vague", label: "要件が曖昧なまま相談したい" },
    { id: "e_compare", label: "相見積もり前提で相談したい" },
    { id: "e_demo", label: "まずデモを見て判断したい" },
    { id: "e_project", label: "具体案件として進めたい" },
    { id: "e_other", label: "その他（自由記述）" },
  ],
};

export const COMMON_FINISH_BODY =
  "ご入力ありがとうございます。いただいた内容をもとに、**初期検討用の「仮要件定義」と「概算見積もり（前提条件つき）」**を約30秒で作成できます。社内共有用のたたき台としてご活用ください。";

export const CTA_PRIMARY_LABEL = "無料で仮見積もり・要件定義を作成する";
/** 詳細見積もりページ（多段質問 + AI 要件定義）へ */
export const CTA_DETAILED_ESTIMATE_LABEL = "より詳しい見積もりを希望の方はコチラ";
export const CTA_DEMO_DIRECT_LABEL = "この内容に近いdemoを直接体験する";
export const CTA_CONTACT_SIMPLE_LABEL = "問い合わせフォームへ（選択内容を送る）";
export const CTA_ADJUST_LABEL = "条件を調整する";
export const CTA_FREEFORM_LABEL = "自由記述で相談する";

export interface ShortcutPanel {
  intro: string;
  links: { label: string; href: string }[];
}

export const SHORTCUT_PANELS: Record<"C" | "D" | "E", ShortcutPanel> = {
  C: {
    intro:
      "弊社では Next.js や Supabase、最新の LLM を活用し、セキュリティと表示速度を意識した開発を行っています。スタックの詳細とデモで操作感もご確認いただけます。",
    links: [
      { label: "開発スタックを見る", href: "/services/development" },
      { label: "ツールDemoを見る", href: "/demo/list" },
    ],
  },
  D: {
    intro:
      "管理画面やチャットUI、通知・レポートなど、実際の画面イメージはデモで確認いただけます。貴社のイメージに近いものをお選びください。",
    links: [{ label: "ツールDemo一覧を見る", href: "/demo/list" }],
  },
  E: {
    intro:
      "まずは短いヒアリングで要件を言語化し、開発・コンサルのどちらから入るかも一緒に整理できます。流れは各ページでご確認ください。",
    links: [
      { label: "相談・サービスの流れを見る", href: "/consulting" },
      { label: "開発の流れを見る", href: "/flow" },
    ],
  },
};

const DISCLAIMER =
  "※ ここに示す金額・内容は**本見積もりではなく**、チャット上の選択に基づく**初期検討向けの概算・たたき台**です。正式なお見積もりはヒアリング後に精緻化します。";

const BUILD_BASE_MAN: Record<string, [number, number]> = {
  build_poc: [50, 160],
  build_auto: [120, 380],
  build_chatbot: [80, 280],
  build_inquiry: [90, 300],
  build_platform: [220, 680],
  build_other: [100, 400],
};

const TEAM_MULT: Record<string, number> = {
  team_1_10: 0.9,
  team_11_50: 1,
  team_51_200: 1.15,
  team_201_plus: 1.3,
  team_unknown: 1.05,
};

const INT_ADD_MAN: Record<string, [number, number]> = {
  int_required: [50, 150],
  int_maybe: [20, 80],
  int_standalone: [0, 0],
  int_unknown: [25, 90],
  int_other: [30, 100],
};

const SUPPORT_BASE_MAN: Record<string, [number, number]> = {
  b_diag: [35, 120],
  b_req: [90, 260],
  b_plan: [110, 320],
  b_adopt: [140, 420],
  b_devset: [250, 900],
  b_other: [90, 320],
};

function roundNice(n: number): number {
  if (n < 100) return Math.round(n / 5) * 5;
  return Math.round(n / 10) * 10;
}

function scaleRange(
  base: [number, number],
  mult: number,
  add: [number, number]
): [number, number] {
  const lo = roundNice(base[0] * mult + add[0]);
  const hi = roundNice(base[1] * mult + add[1]);
  return [lo, Math.max(lo + 20, hi)];
}

function formatManRange(lo: number, hi: number): string {
  return `**概算レンジ（目安）**: 約${lo}万円〜${hi}万円程度`;
}

function selectionByStep(path: FlowSelection[], stepKey: string): FlowSelection | undefined {
  return path.find((p) => p.stepKey === stepKey);
}

function labelForDisplay(s: FlowSelection | undefined): string {
  if (!s) return "（未選択）";
  if (s.freeform) return `${s.label}（${s.freeform}）`;
  return s.label;
}

export function buildSelectionSummaryLines(path: FlowSelection[]): string[] {
  const lines: string[] = ["**選択内容サマリ**"];
  for (const s of path) {
    lines.push(`- **${s.stepTitle}**: ${labelForDisplay(s)}`);
  }
  return lines;
}

export function buildEstimateBlockA(path: FlowSelection[]): string {
  const a2 = selectionByStep(path, "A2");
  const a3 = selectionByStep(path, "A3");
  const a4 = selectionByStep(path, "A4");
  const teamId = a2?.optionId ?? "team_unknown";
  const buildId = a3?.optionId ?? "build_other";
  const intId = a4?.optionId ?? "int_unknown";

  const base = BUILD_BASE_MAN[buildId] ?? BUILD_BASE_MAN.build_other;
  const mult = TEAM_MULT[teamId] ?? 1;
  const add = INT_ADD_MAN[intId] ?? INT_ADD_MAN.int_unknown;
  const [lo, hi] = scaleRange(base, mult, add);

  const premise = [
    "**前提条件（例）**",
    "- 画面数・API数・連携先の確定前のため、幅を持ったレンジです。",
    "- 運用・権限設計・データ整備の工数は別途ヒアリングで調整します。",
    "- 外部サービス・LLM の従量課金は利用量により変動します。",
  ];

  return [
    ...buildSelectionSummaryLines(path),
    "",
    formatManRange(lo, hi),
    "",
    ...premise,
    "",
    DISCLAIMER,
  ].join("\n");
}

export function buildEstimateBlockB(path: FlowSelection[]): string {
  const b2 = selectionByStep(path, "B2");
  const b3 = selectionByStep(path, "B3");
  const b4 = selectionByStep(path, "B4");
  const supportId = b2?.optionId ?? "b_other";
  const teamId = b3?.optionId ?? "team_unknown";

  const base = SUPPORT_BASE_MAN[supportId] ?? SUPPORT_BASE_MAN.b_other;
  const mult = TEAM_MULT[teamId] ?? 1;
  const challengeBoost: [number, number] =
    b4?.optionId === "ch_other" ? [20, 80] : [10, 40];
  const [lo, hi] = scaleRange(base, mult, challengeBoost);

  const premise = [
    "**前提条件（例）**",
    "- 支援範囲（診断のみ / 伴走期間 / 定着支援）により変動します。",
    "- 対象部門数・キックオフ回数・成果物の粒度はヒアリングで確定します。",
    "- 開発とセットの場合は、別途開発側のスコープ見積もりと合算します。",
  ];

  return [
    ...buildSelectionSummaryLines(path),
    "",
    formatManRange(lo, hi),
    "",
    ...premise,
    "",
    DISCLAIMER,
  ].join("\n");
}

export function buildCdeSummaryBlock(track: "C" | "D" | "E", path: FlowSelection[]): string {
  const panel = SHORTCUT_PANELS[track];
  return [
    ...buildSelectionSummaryLines(path),
    "",
    `**ご案内**`,
    panel.intro,
    "",
    DISCLAIMER,
  ].join("\n");
}
