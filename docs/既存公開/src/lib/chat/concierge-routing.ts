/**
 * トップコンシェルジュ分岐から、体験プロトタイプ直リンクへのマッピング。
 * slug は prototype-registry の EXPERIENCE_PROTOTYPES と一致させる。
 */

import {
  getBChallengeIdForDemoRouting,
  type ConciergeTrack,
  type FlowSelection,
} from "@/lib/chat/concierge-flow";

export function experienceHref(slug: string): string {
  return `/experience/${slug}`;
}

/** C2: 技術方向 → 既存/新規プロトタイプ */
const MAP_C2: Record<string, string> = {
  c_eff: "receipt-photo-expense-memo",
  c_auto: "restaurant-ops-dashboard-demo",
  c_kb: "internal-knowledge-share-bot",
  c_wf: "service-claim-reply-assist",
  c_text: "legal-memory-secretary",
};

/** D2: UIイメージ → プロトタイプ */
const MAP_D2: Record<string, string> = {
  d_dash: "restaurant-ops-dashboard-demo",
  d_chatui: "internal-knowledge-share-bot",
  d_alert: "workflow-approval-lite-demo",
  d_integrate: "receipt-photo-expense-memo",
  d_report: "ops-report-metrics-demo",
};

/** E2: 依頼の進め方 → デモで見せられるものがあれば直リンク */
const MAP_E2: Record<string, string> = {
  e_demo: "internal-knowledge-share-bot",
  e_project: "restaurant-ops-dashboard-demo",
  e_compare: "service-claim-reply-assist",
  e_talk: "internal-knowledge-share-bot",
  e_vague: "internal-knowledge-share-bot",
};

/** A3: 成果物の型（product archetype）→ プロトタイプ */
const MAP_A3: Record<string, string> = {
  build_chatbot: "internal-knowledge-share-bot",
  build_inquiry: "inquiry-intake-triage-demo",
  build_auto: "restaurant-ops-dashboard-demo",
  build_poc: "receipt-photo-expense-memo",
  build_platform: "restaurant-ops-dashboard-demo",
};

/** B_SCOPE: 改善テーマ（challenge）→ 近い体験 */
const MAP_B4: Record<string, string> = {
  ch_workload: "restaurant-ops-dashboard-demo",
  ch_silo: "internal-knowledge-share-bot",
  ch_quality: "service-claim-reply-assist",
  ch_speed: "restaurant-ops-dashboard-demo",
  ch_visibility: "restaurant-ops-dashboard-demo",
};

function selectionByStep(
  path: FlowSelection[],
  stepKey: string
): FlowSelection | undefined {
  return path.find((p) => p.stepKey === stepKey);
}

/**
 * C/D/E の最終選択（2問目）からデモ slug を決定。
 * その他・自由記述は null（一覧フォールバック）。
 */
export function getDemoSlugForCdeTrack(
  track: ConciergeTrack,
  path: FlowSelection[]
): string | null {
  if (track !== "C" && track !== "D" && track !== "E") return null;
  const stepKey = track === "C" ? "C2" : track === "D" ? "D2" : "E2";
  const sel = selectionByStep(path, stepKey);
  if (!sel) return null;
  const id = sel.optionId;
  if (id.endsWith("_other")) return null;
  const map =
    track === "C" ? MAP_C2 : track === "D" ? MAP_D2 : MAP_E2;
  return map[id] ?? null;
}

/** A/B 完了時：おすすめデモ slug */
export function getDemoSlugForAbTrack(
  track: "A" | "B",
  path: FlowSelection[]
): string | null {
  if (track === "A") {
    const a3 = selectionByStep(path, "A3");
    if (!a3 || a3.optionId === "build_other") return null;
    return MAP_A3[a3.optionId] ?? null;
  }
  const ch = getBChallengeIdForDemoRouting(path);
  if (!ch) return null;
  return MAP_B4[ch] ?? null;
}
