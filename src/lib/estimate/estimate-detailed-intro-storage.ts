/** 詳細見積モバイル・オープニング（①〜③）を既に見終えたか */
export const ESTIMATE_DETAILED_INTRO_DONE_KEY = "rinopro_estimate_detailed_intro_done";

export function readEstimateDetailedIntroDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ESTIMATE_DETAILED_INTRO_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeEstimateDetailedIntroDone(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ESTIMATE_DETAILED_INTRO_DONE_KEY, "1");
  } catch {
    // quota
  }
}

export function clearEstimateDetailedIntroDone(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ESTIMATE_DETAILED_INTRO_DONE_KEY);
  } catch {
    // ignore
  }
}
