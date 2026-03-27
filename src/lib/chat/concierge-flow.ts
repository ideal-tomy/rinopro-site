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

const DISCLAIMER = CONCIERGE_RESULT_DISCLAIMER;

export const CONCIERGE_EMPATHY_HEADING = "**ひとことの整理**";
export const CONCIERGE_NEXT_STEPS_HEADING = "**次の一歩**";

const DEFAULT_EMPATHY_FALLBACK =
  "ご選択内容を踏まえ、次の一歩から進めやすいよう整理しました。";

/** 寄り添いブロック（見出し＋本文1ブロック） */
function formatEmpathySection(bodyLine: string): string {
  const line = bodyLine.trim() || DEFAULT_EMPATHY_FALLBACK;
  return [CONCIERGE_EMPATHY_HEADING, line].join("\n");
}

function appendFreeformTail(
  base: string,
  sel: FlowSelection | undefined
): string {
  if (!sel?.freeform?.trim()) return base;
  const note = sel.freeform.trim();
  const short = note.length > 100 ? `${note.slice(0, 97)}…` : note;
  return `${base}（ご記入「${short}」も前提に、進め方を一緒に整えられます。）`;
}

/** A: 開発コストトラックの寄り添い（1〜2文想定・空禁止） */
export function buildEmpathyLineA(path: FlowSelection[]): string {
  const a3 = selectionByStep(path, "A3");
  const buildId = a3?.optionId ?? "build_other";
  const byBuild: Record<string, string> = {
    build_poc:
      "小さく試す前提なら、まずは効果検証に集中できる進め方が合います。",
    build_auto:
      "既存業務の自動化は、優先順位を付けて段階的に進めると扱いやすくなります。",
    build_chatbot:
      "社内チャットボットは、まず利用シーンを絞ると定着しやすいです。",
    build_inquiry:
      "問い合わせ・受付の自動化は、例外処理の設計が品質に直結します。",
    build_platform:
      "部門横断の基盤は、最初の範囲設計が後工程の手戻りを抑えます。",
    build_other:
      "今回の条件だと、まずは小さく効果を確認しながら進めるのが安全です。",
  };
  let line =
    byBuild[buildId] ??
    "今回の条件だと、まずは小さく効果を確認しながら進めるのが安全です。";
  line = appendFreeformTail(line, a3);
  return line;
}

/** B: 契約・コンサルトラックの寄り添い */
export function buildEmpathyLineB(path: FlowSelection[]): string {
  const b2 = selectionByStep(path, "B2");
  const supportId = b2?.optionId ?? "b_other";
  const bySupport: Record<string, string> = {
    b_diag:
      "現状診断から始めるなら、観測ポイントを揃えたうえで優先課題を決めやすくなります。",
    b_req:
      "要件整理を伴走する場面では、意思決定の前提を共有することが成果に直結します。",
    b_plan:
      "導入計画を一緒に作る場合は、マイルストーンの切り方が実行可能性を左右します。",
    b_adopt:
      "定着支援は、現場の運用ルールと習慣づくりが中心になります。",
    b_devset:
      "開発とセットでは、スコープのつなぎ目を最初に明示しておくとスムーズです。",
    b_other:
      "今回は「診断から意思決定を早めたい」という目的が明確なので、最初の範囲設定が成果に直結します。",
  };
  let line =
    bySupport[supportId] ??
    "今回は「診断から意思決定を早めたい」という目的が明確なので、最初の範囲設定が成果に直結します。";
  line = appendFreeformTail(line, b2);
  return line;
}

/** C: 技術トラック */
export function buildEmpathyLineC(path: FlowSelection[]): string {
  const c2 = selectionByStep(path, "C2");
  const id = c2?.optionId ?? "c_other";
  const byChoice: Record<string, string> = {
    c_eff:
      "「手作業を減らす」方向なら、まずは効果が出やすい業務から順に当てはめます。",
    c_auto:
      "定型処理の自動化は、例外ルールの整理が後からの手戻りを抑えます。",
    c_kb:
      "技術選定は“今の業務に無理なく乗ること”を優先すると、導入後の定着が進みやすいです。",
    c_wf:
      "ワークフローは、承認者と完了条件の定義が最初の設計の核になります。",
    c_text:
      "テキスト生成は、入力の品質とガイドラインの共有が出力の安定に効きます。",
    c_other:
      "技術選定は“今の業務に無理なく乗ること”を優先すると、導入後の定着が進みやすいです。",
  };
  let line =
    byChoice[id] ??
    "技術選定は“今の業務に無理なく乗ること”を優先すると、導入後の定着が進みやすいです。";
  line = appendFreeformTail(line, c2);
  return line;
}

/** D: ツール内容トラック */
export function buildEmpathyLineD(path: FlowSelection[]): string {
  const d2 = selectionByStep(path, "D2");
  const id = d2?.optionId ?? "d_other";
  const byChoice: Record<string, string> = {
    d_dash:
      "管理画面は、ロールと権限の想定が固まるほど、必要機能の優先順位が付けやすくなります。",
    d_chatui:
      "チャットUIは、会話の目的とエスカレーション先を決めると運用が安定しやすいです。",
    d_alert:
      "通知・自動化は、誤検知の扱いと閾値の見直しサイクルが設計の核になります。",
    d_integrate:
      "データ連携は、データの所在と更新頻度の合意が最初の成功条件になります。",
    d_report:
      "レポート自動作成は、指標の定義と出典のルールが品質を左右します。",
    d_other:
      "画面イメージが固まるほど、必要機能の優先順位が付けやすくなります。",
  };
  let line =
    byChoice[id] ??
    "画面イメージが固まるほど、必要機能の優先順位が付けやすくなります。";
  line = appendFreeformTail(line, d2);
  return line;
}

/** E: 依頼方法トラック */
export function buildEmpathyLineE(path: FlowSelection[]): string {
  const e2 = selectionByStep(path, "E2");
  const id = e2?.optionId ?? "e_other";
  const byChoice: Record<string, string> = {
    e_talk:
      "まず相談だけでも、目的と制約を言語化すると次の選択肢が見えやすくなります。",
    e_vague:
      "要件が曖昧でも問題ありません。最初に目的を整理すれば、進め方は自然に決まります。",
    e_compare:
      "相見積もり前提でも、比較軸（範囲・成果物・サポート）を揃えると判断がしやすいです。",
    e_demo:
      "操作感を先に掴むと、必要機能の取捨選択がしやすくなります。",
    e_project:
      "具体案件として進める場合は、マイルストーンと成功条件の合意が最初の一歩です。",
    e_other:
      "要件が曖昧でも問題ありません。最初に目的を整理すれば、進め方は自然に決まります。",
  };
  let line =
    byChoice[id] ??
    "要件が曖昧でも問題ありません。最初に目的を整理すれば、進め方は自然に決まります。";
  line = appendFreeformTail(line, e2);
  return line;
}

/** 次の行動は最大2つ（メモ・引き継ぎ用。画面上のタップ導線は HomeConciergeFlow のカード） */
export function buildNextActionLines(
  _track: ConciergeTrack,
  _path: FlowSelection[]
): string {
  void _track;
  void _path;
  return [
    CONCIERGE_NEXT_STEPS_HEADING,
    "- まずは**体験demo**で操作感を掴む（`/demo/list` またはおすすめの体験ページ）",
    "- **詳細見積もり**で要件のたたき台をつくる（`/estimate-detailed`）",
  ].join("\n");
}

/** 必須セクションの有無（ホーム固定結果・組み合わせ検証用） */
export function validateConciergeResultBody(body: string): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const t = body.trim();
  if (!t) issues.push("empty_body");
  if (!t.includes(CONCIERGE_EMPATHY_HEADING)) issues.push("missing_empathy");
  if (!t.includes(CONCIERGE_NEXT_STEPS_HEADING)) issues.push("missing_next_steps");
  if (!t.includes("※ ここに示す金額・内容は")) issues.push("missing_disclaimer");
  return { ok: issues.length === 0, issues };
}

function ensureConciergeBodySections(body: string): string {
  let out = body.trim();
  const { issues } = validateConciergeResultBody(out);
  if (issues.includes("missing_empathy")) {
    out = `${out}\n\n${formatEmpathySection(DEFAULT_EMPATHY_FALLBACK)}`;
  }
  if (issues.includes("missing_next_steps")) {
    out = `${out}\n\n${buildNextActionLines("A", [])}`;
  }
  if (issues.includes("missing_disclaimer")) {
    out = `${out}\n\n${DISCLAIMER}`;
  }
  if (!out.trim()) {
    return [
      formatEmpathySection(DEFAULT_EMPATHY_FALLBACK),
      "",
      buildNextActionLines("A", []),
      "",
      DISCLAIMER,
    ].join("\n");
  }
  return out;
}

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

/** A_SCOPE（旧 A2+A4 統合）→ 概算用の team / int 近似 */
const A_SCOPE_TO_TEAM_INT: Record<string, { team: string; int: string }> = {
  scope_s_standalone: { team: "team_1_10", int: "int_standalone" },
  scope_m_flex: { team: "team_11_50", int: "int_maybe" },
  scope_l_required: { team: "team_201_plus", int: "int_required" },
  scope_unknown: { team: "team_unknown", int: "int_unknown" },
  scope_other: { team: "team_unknown", int: "int_unknown" },
};

/** B_SCOPE（旧 B3+B4 統合）→ 概算用の team / challenge */
const B_SCOPE_TO_TEAM_CH: Record<string, { team: string; challenge: string }> = {
  bs_m_work: { team: "team_11_50", challenge: "ch_workload" },
  bs_m_silo: { team: "team_11_50", challenge: "ch_silo" },
  bs_m_quality: { team: "team_11_50", challenge: "ch_quality" },
  bs_m_speed: { team: "team_11_50", challenge: "ch_speed" },
  bs_m_vis: { team: "team_11_50", challenge: "ch_visibility" },
  bs_l_silo: { team: "team_51_200", challenge: "ch_silo" },
  bs_unknown: { team: "team_unknown", challenge: "ch_other" },
  bs_other: { team: "team_unknown", challenge: "ch_other" },
};

/** 体験デモ直リンク用（B4 相当の challengeId） */
export function getBChallengeIdForDemoRouting(
  path: FlowSelection[]
): string | null {
  const bScope = selectionByStep(path, "B_SCOPE");
  if (!bScope) return null;
  const cid =
    B_SCOPE_TO_TEAM_CH[bScope.optionId]?.challenge ?? "ch_other";
  if (cid === "ch_other") return null;
  return cid;
}

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

/** 結果の末尾に置く。主役は概算レンジ・ご案内のため「参考」扱い */
export function buildSelectionReferenceLines(path: FlowSelection[]): string[] {
  const lines: string[] = ["**選択内容（参考）**"];
  for (const s of path) {
    lines.push(`- **${s.stepTitle}**: ${labelForDisplay(s)}`);
  }
  return lines;
}

export function buildEstimateBlockA(path: FlowSelection[]): string {
  const a3 = selectionByStep(path, "A3");
  const scope = selectionByStep(path, "A_SCOPE");
  const buildId = a3?.optionId ?? "build_other";
  const mapped = scope?.optionId
    ? A_SCOPE_TO_TEAM_INT[scope.optionId]
    : undefined;
  const teamId = mapped?.team ?? "team_unknown";
  const intId = mapped?.int ?? "int_unknown";

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

  return ensureConciergeBodySections(
    [
      formatManRange(lo, hi),
      "",
      formatEmpathySection(buildEmpathyLineA(path)),
      "",
      ...premise,
      "",
      buildNextActionLines("A", path),
      "",
      ...buildSelectionReferenceLines(path),
      "",
      DISCLAIMER,
    ].join("\n")
  );
}

export function buildEstimateBlockB(path: FlowSelection[]): string {
  const b2 = selectionByStep(path, "B2");
  const bScope = selectionByStep(path, "B_SCOPE");
  const supportId = b2?.optionId ?? "b_other";
  const bm = bScope?.optionId
    ? B_SCOPE_TO_TEAM_CH[bScope.optionId]
    : undefined;
  const teamId = bm?.team ?? "team_unknown";
  const challengeId = bm?.challenge ?? "ch_other";

  const base = SUPPORT_BASE_MAN[supportId] ?? SUPPORT_BASE_MAN.b_other;
  const mult = TEAM_MULT[teamId] ?? 1;
  const challengeBoost: [number, number] =
    challengeId === "ch_other" ? [20, 80] : [10, 40];
  const [lo, hi] = scaleRange(base, mult, challengeBoost);

  const premise = [
    "**前提条件（例）**",
    "- 支援範囲（診断のみ / 伴走期間 / 定着支援）により変動します。",
    "- 対象部門数・キックオフ回数・成果物の粒度はヒアリングで確定します。",
    "- 開発とセットの場合は、別途開発側のスコープ見積もりと合算します。",
  ];

  return ensureConciergeBodySections(
    [
      formatManRange(lo, hi),
      "",
      formatEmpathySection(buildEmpathyLineB(path)),
      "",
      ...premise,
      "",
      buildNextActionLines("B", path),
      "",
      ...buildSelectionReferenceLines(path),
      "",
      DISCLAIMER,
    ].join("\n")
  );
}

export function buildCdeSummaryBlock(track: "C" | "D" | "E", path: FlowSelection[]): string {
  const panel = SHORTCUT_PANELS[track];
  const empathyLine =
    track === "C"
      ? buildEmpathyLineC(path)
      : track === "D"
        ? buildEmpathyLineD(path)
        : buildEmpathyLineE(path);
  return ensureConciergeBodySections(
    [
      `**ご案内**`,
      panel.intro,
      "",
      formatEmpathySection(empathyLine),
      "",
      buildNextActionLines(track, path),
      "",
      ...buildSelectionReferenceLines(path),
      "",
      DISCLAIMER,
    ].join("\n")
  );
}
