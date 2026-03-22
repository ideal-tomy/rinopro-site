import type { GuidedChoice } from "../types";

/** 各ガイドステップに付与する「その他」 */
export const guidedOtherChoice: GuidedChoice = {
  label: "その他（自由入力）",
  freeform: true,
};

export function withOther(choices: GuidedChoice[]): GuidedChoice[] {
  return [...choices, guidedOtherChoice];
}
