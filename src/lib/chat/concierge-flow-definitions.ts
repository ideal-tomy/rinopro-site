/**
 * トップページ AIコンシェルジュ用の分岐定義（定数・型のみ）。
 * 概算テキスト生成は concierge-flow.ts。
 */

import {
  createFactEmission,
  createQuestionChoice,
  createQuestionStep,
  findQuestionChoiceByOptionId,
  type QuestionChoiceDefinition,
  type QuestionStepDefinition,
} from "@/lib/chat/question-definition";
import type { FreeformInputEnvelope } from "@/lib/freeform/freeform-input";

export type ConciergeTrack = "A" | "B" | "C" | "D" | "E";

export interface FlowChoice extends QuestionChoiceDefinition {
  id: string;
}

export interface FlowStepDef extends QuestionStepDefinition {
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
  freeformInput?: Pick<
    FreeformInputEnvelope,
    "source" | "rawText" | "normalizedText"
  >;
}

function toFlowChoice(choice: QuestionChoiceDefinition): FlowChoice {
  return {
    ...choice,
    id: choice.optionId,
  };
}

function toFlowStep(step: QuestionStepDefinition): FlowStepDef {
  return {
    ...step,
    choices: step.choices.map(toFlowChoice),
  };
}

const ROOT_STEP = createQuestionStep(
  "ROOT",
  "Step 1",
  "いま一番ほしい状態に近いものは？",
  [
    createQuestionChoice(
      "root_need_touchpoint",
      "お客様との接点を作りたい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ],
      { analyticsKey: "root_need_touchpoint", routingKey: "A" }
    ),
    createQuestionChoice(
      "root_need_management",
      "顧客・案件管理を楽にしたい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ],
      { analyticsKey: "root_need_management", routingKey: "CDE" }
    ),
    createQuestionChoice(
      "root_need_automation",
      "社内作業を減らしたい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ],
      { analyticsKey: "root_need_automation", routingKey: "A" }
    ),
    createQuestionChoice(
      "root_need_reception",
      "予約・受付を自動化したい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ],
      { analyticsKey: "root_need_reception", routingKey: "D" }
    ),
    createQuestionChoice(
      "root_need_new_service",
      "独自サービスを形にしたい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ],
      { analyticsKey: "root_need_new_service", routingKey: "B" }
    ),
    createQuestionChoice(
      "root_need_clarify",
      "まだうまく言えないので整理したい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("inquiryIntent", "candidate"),
      ],
      { analyticsKey: "root_need_clarify", routingKey: "E" }
    ),
  ],
  "CDE_PICK"
);

export const ROOT_CHOICES: FlowChoice[] = ROOT_STEP.choices.map(toFlowChoice);

/** C/D/E を入口でまとめたあとの中間ステップ */
export const CDE_PICK_STEP: FlowStepDef = toFlowStep(
  createQuestionStep("CDE_PICK", "Step 2", "次に深掘りしたい観点はどれですか？", [
    createQuestionChoice(
      "cde_pick_c",
      "技術の方向性・スタック",
      [createFactEmission("productCategory", "candidate")],
      { routingKey: "C" }
    ),
    createQuestionChoice(
      "cde_pick_d",
      "つくれるツールのイメージ",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ],
      { routingKey: "D" }
    ),
    createQuestionChoice(
      "cde_pick_e",
      "依頼・相談の進め方",
      [createFactEmission("entryIntent", "candidate")],
      { routingKey: "E" }
    ),
  ])
);

export const A_STEP_BUILD: FlowStepDef = toFlowStep(
  createQuestionStep(
    "A3",
    "Step 2",
    "まずつくるものの「かたち」に近いものは？（目的はすでに選んでいる前提です）",
    [
    createQuestionChoice(
      "build_poc",
      "まず1業務だけ試したい（PoC）",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "build_auto",
      "社内の繰り返し作業を自動化したい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ]
    ),
    createQuestionChoice(
      "build_chatbot",
      "社内の質問・ナレッジをチャットで扱いたい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ]
    ),
    createQuestionChoice(
      "build_inquiry",
      "顧客向けの問い合わせ・受付を仕組み化したい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ]
    ),
    createQuestionChoice(
      "build_platform",
      "部門をまたぐ業務基盤・共通画面から運用したい",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ]
    ),
    createQuestionChoice(
      "build_other",
      "その他（自由記述）",
      [
        createFactEmission("freeformMemo", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ],
      { allowsFreeform: true }
    ),
  ])
);

/** 旧 A2+A4 を統合（規模と連携のイメージ） */
export const A_STEP_SCOPE: FlowStepDef = toFlowStep(
  createQuestionStep(
    "A_SCOPE",
    "Step 3",
    "想定する規模と、既存システム連携のイメージは？",
    [
      createQuestionChoice(
        "scope_s_standalone",
        "まずは小さく・単体でよい（〜50人前後）",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("integration", "approx"),
          createFactEmission("desiredReply", "candidate"),
        ]
      ),
      createQuestionChoice(
        "scope_m_flex",
        "11〜200人・連携はできるとよい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("integration", "approx"),
        ]
      ),
      createQuestionChoice(
        "scope_l_required",
        "大規模・連携は必須に近い",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("integration", "approx"),
        ]
      ),
      createQuestionChoice(
        "scope_unknown",
        "まだ未定 / 分からない",
        [
          createFactEmission("teamSize", "candidate"),
          createFactEmission("integration", "candidate"),
        ]
      ),
      createQuestionChoice(
        "scope_other",
        "その他（自由記述）",
        [
          createFactEmission("freeformMemo", "candidate"),
          createFactEmission("teamSize", "candidate"),
          createFactEmission("integration", "candidate"),
        ],
        { allowsFreeform: true }
      ),
    ]
  )
);

export const B_STEP_SUPPORT: FlowStepDef = toFlowStep(
  createQuestionStep("B2", "Step 2", "どの支援に近いですか？", [
    createQuestionChoice(
      "b_diag",
      "現状診断だけ頼みたい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "b_req",
      "要件整理を伴走してほしい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "b_plan",
      "導入計画を一緒に作りたい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "b_adopt",
      "社内定着まで支援してほしい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "b_devset",
      "開発とセットで依頼したい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "b_other",
      "その他（自由記述）",
      [
        createFactEmission("freeformMemo", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ],
      { allowsFreeform: true }
    ),
  ])
);

/** 旧 B3+B4 を統合（規模と改善テーマ） */
export const B_STEP_SCOPE: FlowStepDef = toFlowStep(
  createQuestionStep(
    "B_SCOPE",
    "Step 3",
    "想定する規模と、いちばん改善したいことに近いものは？",
    [
      createQuestionChoice(
        "bs_m_work",
        "11〜50人・工数・手作業を減らしたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_m_silo",
        "11〜50人・属人化・暗黙知を減らしたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_m_quality",
        "11〜50人・品質や判断のブレを減らしたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_m_speed",
        "11〜50人・スピード（リードタイム）を上げたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_m_vis",
        "11〜50人・可視化・意思決定を早めたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_l_silo",
        "51人以上・属人化・暗黙知を減らしたい",
        [
          createFactEmission("teamSize", "approx"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_unknown",
        "まだ未定 / 複数ある",
        [
          createFactEmission("teamSize", "candidate"),
          createFactEmission("currentPain", "candidate"),
        ]
      ),
      createQuestionChoice(
        "bs_other",
        "その他（自由記述）",
        [
          createFactEmission("freeformMemo", "candidate"),
          createFactEmission("teamSize", "candidate"),
          createFactEmission("currentPain", "candidate"),
        ],
        { allowsFreeform: true }
      ),
    ]
  )
);

export const C_STEP2: FlowStepDef = toFlowStep(
  createQuestionStep("C2", "Step 2", "知りたい技術の方向性に近いものは？", [
    createQuestionChoice(
      "c_eff",
      "業務効率化（手作業削減）",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("currentPain", "candidate"),
      ]
    ),
    createQuestionChoice(
      "c_auto",
      "業務自動化（定型処理）",
      [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("currentPain", "candidate"),
      ]
    ),
    createQuestionChoice(
      "c_kb",
      "社内ナレッジ共有",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("currentPain", "candidate"),
      ]
    ),
    createQuestionChoice(
      "c_wf",
      "ワークフロー構築",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("currentPain", "candidate"),
      ]
    ),
    createQuestionChoice(
      "c_text",
      "テキスト自動生成",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "c_other",
      "その他（自由記述）",
      [
        createFactEmission("freeformMemo", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ],
      { allowsFreeform: true }
    ),
  ])
);

export const D_STEP2: FlowStepDef = toFlowStep(
  createQuestionStep("D2", "Step 2", "イメージに近いツールの形は？", [
    createQuestionChoice(
      "d_dash",
      "管理画面（ダッシュボード）",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "d_chatui",
      "社内向けチャットUI",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "d_alert",
      "自動通知・アラート",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "d_integrate",
      "データ連携（既存SaaS / API）",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("integration", "candidate"),
      ]
    ),
    createQuestionChoice(
      "d_report",
      "レポート自動作成",
      [
        createFactEmission("productArchetype", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "d_other",
      "その他（自由記述）",
      [
        createFactEmission("freeformMemo", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ],
      { allowsFreeform: true }
    ),
  ])
);

export const E_STEP2: FlowStepDef = toFlowStep(
  createQuestionStep("E2", "Step 2", "依頼の進め方に近いものは？", [
    createQuestionChoice(
      "e_talk",
      "まず相談だけしたい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("inquiryIntent", "candidate"),
      ]
    ),
    createQuestionChoice(
      "e_vague",
      "要件が曖昧なまま相談したい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("problemSummary", "candidate"),
      ]
    ),
    createQuestionChoice(
      "e_compare",
      "相見積もり前提で相談したい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]
    ),
    createQuestionChoice(
      "e_demo",
      "まずデモを見て判断したい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("productCategory", "candidate"),
      ]
    ),
    createQuestionChoice(
      "e_project",
      "具体案件として進めたい",
      [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("inquiryIntent", "candidate"),
      ]
    ),
    createQuestionChoice(
      "e_other",
      "その他（自由記述）",
      [
        createFactEmission("freeformMemo", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ],
      { allowsFreeform: true }
    ),
  ])
);

export const TOP_FLOW_STEP_DEFS: Record<string, FlowStepDef> = {
  ROOT: toFlowStep(ROOT_STEP),
  CDE_PICK: CDE_PICK_STEP,
  A3: A_STEP_BUILD,
  A_SCOPE: A_STEP_SCOPE,
  B2: B_STEP_SUPPORT,
  B_SCOPE: B_STEP_SCOPE,
  C2: C_STEP2,
  D2: D_STEP2,
  E2: E_STEP2,
};

export function getTopFlowStepDef(stepKey: string): FlowStepDef | undefined {
  return TOP_FLOW_STEP_DEFS[stepKey];
}

export function getTopFlowChoice(
  stepKey: string,
  optionId: string
): FlowChoice | undefined {
  const step = getTopFlowStepDef(stepKey);
  return step ? findQuestionChoiceByOptionId(step.choices, optionId) : undefined;
}

export const COMMON_FINISH_BODY =
  "ご入力ありがとうございます。いただいた内容をもとに、**初期検討用の「仮要件定義」と「概算見積もり（前提条件つき）」**を約30秒で作成できます。社内共有用のたたき台としてご活用ください。";

export const CTA_PRIMARY_LABEL = "仮見積もりと要件のたたき台をつくる";
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

