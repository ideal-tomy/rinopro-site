/**
 * トップページ AIコンシェルジュ用の分岐定義（定数・型のみ）。
 * 概算テキスト生成は concierge-flow.ts。
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
  { id: "root_a", label: "開発コストの概算を知りたい" },
  { id: "root_b", label: "コンサル・伴走の概算を知りたい" },
  { id: "root_cde", label: "技術・ツール・進め方を知りたい" },
  { id: "root_e", label: "まず相談・窓口の進め方を知りたい" },
];

/** C/D/E を入口でまとめたあとの中間ステップ */
export const CDE_PICK_STEP: FlowStepDef = {
  stepKey: "CDE_PICK",
  stepLabel: "Step 2",
  question: "どの内容に近いですか？",
  choices: [
    { id: "cde_pick_c", label: "技術の方向性・スタック" },
    { id: "cde_pick_d", label: "つくれるツールのイメージ" },
    { id: "cde_pick_e", label: "依頼・相談の進め方" },
  ],
};

export const A_STEP_BUILD: FlowStepDef = {
  stepKey: "A3",
  stepLabel: "Step 2",
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

/** 旧 A2+A4 を統合（規模と連携のイメージ） */
export const A_STEP_SCOPE: FlowStepDef = {
  stepKey: "A_SCOPE",
  stepLabel: "Step 3",
  question: "想定する規模と、既存システム連携のイメージは？",
  choices: [
    { id: "scope_s_standalone", label: "まずは小さく・単体でよい（〜50人前後）" },
    { id: "scope_m_flex", label: "11〜200人・連携はできるとよい" },
    { id: "scope_l_required", label: "大規模・連携は必須に近い" },
    { id: "scope_unknown", label: "まだ未定 / 分からない" },
    { id: "scope_other", label: "その他（自由記述）" },
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

/** 旧 B3+B4 を統合（規模と改善テーマ） */
export const B_STEP_SCOPE: FlowStepDef = {
  stepKey: "B_SCOPE",
  stepLabel: "Step 3",
  question: "想定する規模と、いちばん改善したいことに近いものは？",
  choices: [
    { id: "bs_m_work", label: "11〜50人・工数・手作業を減らしたい" },
    { id: "bs_m_silo", label: "11〜50人・属人化・暗黙知を減らしたい" },
    { id: "bs_m_quality", label: "11〜50人・品質や判断のブレを減らしたい" },
    { id: "bs_m_speed", label: "11〜50人・スピード（リードタイム）を上げたい" },
    { id: "bs_m_vis", label: "11〜50人・可視化・意思決定を早めたい" },
    { id: "bs_l_silo", label: "51人以上・属人化・暗黙知を減らしたい" },
    { id: "bs_unknown", label: "まだ未定 / 複数ある" },
    { id: "bs_other", label: "その他（自由記述）" },
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
export const CTA_ADJUST_LABEL = "条件変更";
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

/** 固定結果テキスト末尾の免責（検証・フォールバックでも同一文言を参照） */
export const CONCIERGE_RESULT_DISCLAIMER =
  "※ ここに示す金額・内容は**本見積もりではなく**、チャット上の選択に基づく**初期検討向けの概算・たたき台**です。正式なお見積もりはヒアリング後に精緻化します。";

export const CONCIERGE_EMPATHY_HEADING = "";
export const CONCIERGE_NEXT_STEPS_HEADING = "**次の一歩**";

