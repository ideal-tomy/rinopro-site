export * from "./concierge-flow-definitions";
import {
  CONCIERGE_NEXT_STEPS_HEADING,
  CONCIERGE_RESULT_DISCLAIMER,
  SHORTCUT_PANELS,
  type ConciergeTrack,
  type FlowSelection,
} from "./concierge-flow-definitions";

const DISCLAIMER = CONCIERGE_RESULT_DISCLAIMER;

const DEFAULT_EMPATHY_FALLBACK =
  "ご選択内容を踏まえ、次の一歩から進めやすいよう整理しました。";

/** 寄り添いブロック（見出し＋本文1ブロック） */
function formatEmpathySection(bodyLine: string): string {
  const line = bodyLine.trim() || DEFAULT_EMPATHY_FALLBACK;
  return line;
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
      "まずは小さく試す進め方で大丈夫です。最初の段階では、完璧な設計よりも「実際に使ってどう感じるか」を確認することが一番の近道になります。対象業務を1つに絞って短期間で回すと、効果の有無や改善ポイントを早く掴めますし、社内説明もしやすくなります。無理に広げず、手応えが見えた部分から次の一歩を決めていきましょう。",
    build_auto:
      "いきなり全体を変える必要はありません。自動化は、日々の手間が大きい作業から順に着手するだけでも十分に効果が出ます。まずは現場で繰り返し発生している定型処理を1つ選び、前後の運用を崩さない形で導入すると、抵抗感なく使われやすくなります。小さな成功を先に作ることで、次にどこを自動化するかも自然に判断しやすくなります。",
    build_chatbot:
      "難しく考えなくて大丈夫です。社内チャットボットは、最初から何でも答えさせるより「質問が集中する場面」を1つに絞ると、現場で実際に使われる形になりやすくなります。例えば問い合わせの一次回答や社内ルール確認など、目的を明確にすると回答品質も安定します。まずは小さく始めて、使われ方を見ながら範囲を広げる進め方が安心です。",
    build_inquiry:
      "問い合わせ対応の自動化は、最初から完璧を目指さなくて問題ありません。まずは一次受付だけを整えるだけでも、担当者の負荷は大きく下がります。特に、よくある質問の振り分けや必要情報の回収を先に自動化すると、後段の対応品質が安定しやすくなります。例外対応は人が見る前提で設計しておくと、安心感を保ちながら段階的に改善していけます。",
    build_platform:
      "部門横断の業務基盤は、最初から全社導入にしなくても大丈夫です。まずは1部門で使える型を作り、運用ルールや画面構成を実地で固めると、あとから横展開する際の手戻りが減ります。最初に「誰がどのタイミングで使うか」を明確にしておくと、必要機能の優先順位も整理しやすくなります。無理なく広げる前提で進めるのが安全です。",
    build_other:
      "要件がまだ曖昧でも心配いりません。最初の段階では、細かな仕様を固めることより「何が改善できれば成功か」を一緒に決めることが重要です。まずは小さく試せる範囲で進めて、現場の反応や効果を確認しながら要件を整えると、無理のない計画にできます。進めながら整理していく形でも十分に前進できるので、安心して進めていきましょう。",
  };
  let line =
    byBuild[buildId] ??
    "要件がまだ曖昧でも心配いりません。最初の段階では、細かな仕様を固めることより「何が改善できれば成功か」を一緒に決めることが重要です。まずは小さく試せる範囲で進めて、現場の反応や効果を確認しながら要件を整えると、無理のない計画にできます。進めながら整理していく形でも十分に前進できるので、安心して進めていきましょう。";
  line = appendFreeformTail(line, a3);
  return line;
}

/** B: 契約・コンサルトラックの寄り添い */
export function buildEmpathyLineB(path: FlowSelection[]): string {
  const b2 = selectionByStep(path, "B2");
  const supportId = b2?.optionId ?? "b_other";
  const bySupport: Record<string, string> = {
    b_diag:
      "まず現状を見える化する進め方で大丈夫です。今どこで時間やコストがかかっているかを整理するだけでも、次に着手すべき課題がはっきりします。特に、関係者ごとに認識がずれている部分を揃えると、その後の判断や合意形成が進みやすくなります。最初は大きな結論を急がず、判断材料を揃えることをゴールにすると安心して進められます。",
    b_req:
      "要件整理は、専門的な資料を作り込まなくても十分効果があります。まずは目的・対象・優先度を同じ言葉で共有するだけで、社内のすれ違いが減り、合意が取りやすくなります。判断基準が揃うと、見積もりやスケジュールも現実的に組み立てやすくなります。最初の段階では、完璧さより「迷わず決められる状態」を作ることが大切です。",
    b_plan:
      "導入計画は、細かく作ることより実行しやすい構成にすることが大切です。短い区切りで成果確認を入れながら進めると、途中で止まりにくく、現場の納得感も得やすくなります。特に、最初に優先順位と担当範囲を明確にしておくと、進行管理の負担を減らせます。背伸びした計画より、着実に回せる計画の方が結果につながります。",
    b_adopt:
      "定着支援では、特別な仕組みより日々の使い方を整えることが鍵になります。現場の業務リズムに合わせて運用ルールを設計すると、無理なく継続しやすくなります。使う場面と責任範囲を明確にしておくと、導入後の迷いが減り、活用が自然に広がります。最初から完璧を目指さず、小さな改善を積み重ねる前提で進めるのが効果的です。",
    b_devset:
      "開発と伴走をセットで進める場合は、最初に役割と範囲の切り分けを決めておくと安心です。誰が何を判断し、どこまでを今回の対象にするかが明確だと、進行中の迷いや手戻りを減らせます。特に、成果物の粒度を先に揃えておくと、途中の認識ズレを防ぎやすくなります。初期の整理に少し時間をかけることが、全体のスムーズさにつながります。",
    b_other:
      "まだ相談段階でもまったく問題ありません。最初に範囲を小さく定めて、何を先に決めるかだけ整理するだけでも、意思決定のスピードは大きく上がります。特に、関係者が多い案件ほど「今決めること」と「後で決めること」を分けるのが有効です。無理に結論を急がず、合意しやすい順で進める方が結果的に早く前に進めます。",
  };
  let line =
    bySupport[supportId] ??
    "まだ相談段階でもまったく問題ありません。最初に範囲を小さく定めて、何を先に決めるかだけ整理するだけでも、意思決定のスピードは大きく上がります。特に、関係者が多い案件ほど「今決めること」と「後で決めること」を分けるのが有効です。無理に結論を急がず、合意しやすい順で進める方が結果的に早く前に進めます。";
  line = appendFreeformTail(line, b2);
  return line;
}

/** C: 技術トラック */
export function buildEmpathyLineC(path: FlowSelection[]): string {
  const c2 = selectionByStep(path, "C2");
  const id = c2?.optionId ?? "c_other";
  const byChoice: Record<string, string> = {
    c_eff:
      "手作業削減は、まず1つの業務に絞るだけでも十分に効果が見えます。毎日繰り返す作業を対象にすると、改善の手応えを早く実感しやすくなりますし、周囲にも成果を説明しやすくなります。最初に成功体験を作っておくと、次にどの業務へ広げるかの判断もスムーズです。小さく始めて確実に前進する進め方で問題ありません。",
    c_auto:
      "定型処理の自動化は、例外の扱いを先に決めるだけで安定感が大きく変わります。通常ルートと例外ルートを分けておくと、運用開始後の混乱や後戻りを減らせます。最初から複雑に作り込むより、基本フローを確実に回せる設計にする方が現場で使われやすくなります。安心して運用できる状態を先に作ることを優先しましょう。",
    c_kb:
      "ナレッジ活用は、高機能さより「迷わず使えること」が大切です。今の業務フローの中で自然に参照できる形にすると、定着しやすくなります。特に、検索しやすい粒度と更新ルールを先に決めると、情報の鮮度を保ちやすくなります。まずは利用頻度の高い情報から整備して、徐々に広げる進め方が負担も少なく効果的です。",
    c_wf:
      "ワークフローは、誰が確認して何をもって完了とするかを決めるだけで大きく前進します。承認や差し戻しの条件を先に明確にすると、導入後の混乱を防ぎやすくなります。最初から全ケースを網羅する必要はなく、主要な流れから固めれば十分です。運用しながら改善できる設計にしておくと、現場に合わせて無理なく育てられます。",
    c_text:
      "文章生成は、出したい文体や表現の見本を先に用意すると安定しやすくなります。高度な設定を増やすより、良い例と避けたい例を共有する方が早く品質を揃えられます。特に、読み手のレベルに合わせた言い回しを指定しておくと、実務で使いやすい文章に近づきます。まずは少数のテンプレから始めて、徐々に精度を上げるのがおすすめです。",
    c_other:
      "技術選びで迷っていても心配いりません。大切なのは最新技術を並べることではなく、今の業務に無理なく乗る構成を選ぶことです。使う人の習慣に合った仕組みにすると、導入後の定着が進みやすくなります。まずは要件に直結する機能を優先して選び、必要に応じて拡張する方が、コストとリスクの両面で安全に進められます。",
  };
  let line =
    byChoice[id] ??
    "技術選びで迷っていても心配いりません。大切なのは最新技術を並べることではなく、今の業務に無理なく乗る構成を選ぶことです。使う人の習慣に合った仕組みにすると、導入後の定着が進みやすくなります。まずは要件に直結する機能を優先して選び、必要に応じて拡張する方が、コストとリスクの両面で安全に進められます。";
  line = appendFreeformTail(line, c2);
  return line;
}

/** D: ツール内容トラック */
export function buildEmpathyLineD(path: FlowSelection[]): string {
  const d2 = selectionByStep(path, "D2");
  const id = d2?.optionId ?? "d_other";
  const byChoice: Record<string, string> = {
    d_dash:
      "管理画面は、表示項目を増やすよりも役割ごとに必要な情報へ絞る方が使いやすくなります。見る人の目的に合わせて画面を整理すると、操作ミスや確認漏れを減らしやすくなります。最初に「誰が何を見るか」を決めておくと、機能の優先順位も明確になります。導入後に迷わない設計を先に作ることが、定着への近道です。",
    d_chatui:
      "チャットUIは、最初に「何を聞けるか」を明確にするだけで安心感が高まります。対応範囲が曖昧なままだと、ユーザーが期待しすぎて使いづらく感じることがあります。まずは得意な質問領域を定義し、対応外は人へつなぐ流れを作ると運用が安定します。使う人が迷わず使える体験を優先して設計するのが効果的です。",
    d_alert:
      "通知は、多く出すことより「本当に重要なものだけを確実に届ける」設計が大切です。通知が多すぎると見落としが増え、かえって効果が下がってしまいます。まずは緊急度の高い条件に絞って開始し、運用しながら閾値を調整すると現場に合った仕組みになります。負担を増やさず、意思決定を助ける通知に育てていきましょう。",
    d_integrate:
      "データ連携は、最初に「どのデータを、どの頻度で、どこへ反映するか」を決めると進めやすくなります。連携先が多い場合でも、まずは重要度の高い連携から始めれば十分です。情報の流れを地図のように整理しておくと、障害時の切り分けや運用引き継ぎも楽になります。焦らず段階的に整備する進め方が安全で効果的です。",
    d_report:
      "レポート自動化は、最初に見る指標を少数へ絞ると成果が出やすくなります。項目を増やしすぎると、読む側が判断しづらくなるためです。あわせて出典や更新タイミングのルールを決めておくと、数字への信頼性を保ちやすくなります。まずは意思決定に直結する指標から整えて、必要に応じて拡張していく進め方がおすすめです。",
    d_other:
      "画面イメージは、最初はざっくりしたラフでも十分です。見える形で共有できるだけで、関係者の認識差を減らし、必要機能の優先順位を決めやすくなります。特に、利用者が多い場合は画面の初期案があると合意形成が早まります。完璧な設計を待つより、まず叩き台を作って改善する進め方の方が、実装までスムーズにつながります。",
  };
  let line =
    byChoice[id] ??
    "画面イメージは、最初はざっくりしたラフでも十分です。見える形で共有できるだけで、関係者の認識差を減らし、必要機能の優先順位を決めやすくなります。特に、利用者が多い場合は画面の初期案があると合意形成が早まります。完璧な設計を待つより、まず叩き台を作って改善する進め方の方が、実装までスムーズにつながります。";
  line = appendFreeformTail(line, d2);
  return line;
}

/** E: 依頼方法トラック */
export function buildEmpathyLineE(path: FlowSelection[]): string {
  const e2 = selectionByStep(path, "E2");
  const id = e2?.optionId ?? "e_other";
  const byChoice: Record<string, string> = {
    e_talk:
      "まずは相談だけで問題ありません。初回の段階で必要なのは、完璧な要件書ではなく「何を良くしたいか」を短く共有することです。目的が一文で言えるようになるだけでも、次に確認すべき事項や進め方が見えやすくなります。話しながら整理していく前提で進めてよいので、準備不足を気にせず気軽に始めてください。",
    e_vague:
      "要件が曖昧な状態でも大丈夫です。最初の打ち合わせでは、細部を決めるより「何ができると助かるか」を一緒に整理することが重要です。目的と優先度が見えてくると、必要な機能や進め方は自然に定まっていきます。最初から完璧を求めず、段階的に具体化する形で進めれば、無理なく前に進められます。",
    e_compare:
      "比較前提で進める場合でも安心してください。価格だけでなく、対象範囲・成果物・サポート体制を同じ観点で比べると、納得感のある判断がしやすくなります。最初に比較軸を揃えておくと、後から条件差に悩む時間を減らせます。迷ったときは「導入後に現場で使えるか」を基準にすると、選択のブレを抑えやすくなります。",
    e_demo:
      "先に触って確認する進め方はとても有効です。実際の操作感を見ると、必要な機能と不要な機能を整理しやすくなり、検討が前に進みます。特に、関係者間で認識を揃えたいときは、デモを共通の判断材料にするのが効果的です。まずは近いユースケースの体験を見て、そこから自社向けの調整ポイントを決めていきましょう。",
    e_project:
      "具体案件として進めるなら、最初にゴールと完了条件を揃えると安心です。はじめに小さなマイルストーンを設定しておくと、進行中の迷いを減らし、関係者の合意も取りやすくなります。特に、途中確認のタイミングを決めておくと品質とスピードの両立がしやすくなります。無理のない計画で着実に進めることを優先しましょう。",
    e_other:
      "どこから始めるか迷っていても大丈夫です。最初の段階では、やりたいことをすべて決める必要はありません。まずは目的を短く整理し、優先度の高い項目から順に進めるだけでも十分に前進できます。話しながら条件を揃える進め方でも問題ないので、準備が整っていなくても安心して相談してください。必要な整理は伴走しながら進められます。",
  };
  let line =
    byChoice[id] ??
    "どこから始めるか迷っていても大丈夫です。最初の段階では、やりたいことをすべて決める必要はありません。まずは目的を短く整理し、優先度の高い項目から順に進めるだけでも十分に前進できます。話しながら条件を揃える進め方でも問題ないので、準備が整っていなくても安心して相談してください。必要な整理は伴走しながら進められます。";
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
  if (!t.includes(CONCIERGE_NEXT_STEPS_HEADING)) issues.push("missing_next_steps");
  if (!t.includes("※ ここに示す金額・内容は")) issues.push("missing_disclaimer");
  return { ok: issues.length === 0, issues };
}

function ensureConciergeBodySections(body: string): string {
  let out = body.trim();
  const { issues } = validateConciergeResultBody(out);
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
  return `約${lo}万円〜${hi}万円程度`;
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
  const lines: string[] = ["**選択した内容**"];
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
    "**前提条件**",
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
    "**前提条件**",
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
