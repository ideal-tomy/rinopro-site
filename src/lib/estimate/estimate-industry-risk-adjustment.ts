import type { FlowSelection } from "@/lib/chat/concierge-flow-definitions";

/** 業種・文脈テキストから、規制・個人情報まわりで手厚めに見積るべきか */
export function isRegulatedIndustryText(text: string): boolean {
  if (!text.trim()) return false;
  return /士業|医療|福祉|コンサル・事務所|弁護|司法書士|税理|会計|行政書士/.test(text);
}

export function profileFromEstimateAnswers(answers: Record<string, string>): {
  regulated: boolean;
  largeOrg: boolean;
} {
  const industry = answers["業種"] ?? "";
  const team = answers["会社やチームの人数のイメージ"] ?? "";
  const regulated = isRegulatedIndustryText(industry);
  const largeOrg =
    team.includes("201人以上") ||
    team.includes("51〜200人") ||
    team.includes("51～200人");
  return { regulated, largeOrg };
}

/** コンシェルジュ選択の表示文言から規制業種っぽさを検出（業種ステップが無いトラック向け） */
export function regulatedHintFromConciergePath(path: FlowSelection[]): boolean {
  for (const s of path) {
    const blob = `${s.label} ${s.freeform ?? ""} ${s.stepTitle ?? ""}`;
    if (isRegulatedIndustryText(blob)) return true;
  }
  return false;
}

/**
 * 詳細見積API: AI の万円レンジへ、士業・医療福祉・大規模の下振れを防ぐ調整
 */
export function applyIndustryRiskToEstimateRange(
  loMan: number,
  hiMan: number,
  profile: { regulated: boolean; largeOrg: boolean }
): { loMan: number; hiMan: number } {
  if (!profile.regulated) {
    return { loMan, hiMan };
  }
  let lo = Math.round(loMan * 1.12);
  let hi = Math.round(hiMan * 1.22);
  if (profile.largeOrg) {
    lo = Math.max(lo, 120);
    hi = Math.max(hi, 420);
  } else {
    lo = Math.max(lo, 70);
    hi = Math.max(hi, 240);
  }
  if (hi < lo + 30) hi = lo + 30;
  return { loMan: lo, hiMan: hi };
}

export const INDUSTRY_RISK_ASSUMPTION_LINE =
  "士業・医療・福祉など、個人情報や記録まわりを慎重に扱う前提の工数を、ざっくりレンジに含めています。";
