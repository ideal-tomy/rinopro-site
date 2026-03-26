import type { LogPhase } from "@/lib/experience/restaurant-dashboard/types";

/** ホールド中の視線誘導・演出タイミング（ms） */
export const CUE_SHIFT_MS = {
  /** 承認待ちカードに注目 */
  toLog: 2600,
  /** メインに戻し「承認待ち」を見せる（②テロップの直前） */
  toMainBeforeBulkTelop: 4600,
  /** ②テロップ（一括承認の説明）を重ねる */
  toBulkApproveTelop: 5600,
  /** ②テロップ終了後: ボタン表示 → 押下 → 確定 までの間隔（ms） */
  afterShowToPressing: 1800,
  afterPressingToDone: 1800,
} as const;

export const CUE_TRAFFIC_MS = {
  /** 棒が伸び始める */
  barsRevealDelay: 520,
  /** グラフ→ログ */
  toLog: 4400,
} as const;

export const CUE_RECEIPTS_MS = {
  /** アップロード→一覧 */
  toList: 3400,
  /** カード→ログ */
  toLog: 6800,
} as const;

export const CUE_EXPENSES_MS = {
  toLog: 4400,
} as const;

export function scaleCueMs(ms: number, reduceMotion: boolean): number {
  if (!reduceMotion) return ms;
  return Math.max(180, Math.round(ms * 0.38));
}

export type DemoSpotlight = "off" | "main" | "log";

/** ログ強調: 現在のデモステップに対応する「ステップN」の trigger/process */
export function logEmphasisForDemoStep(
  spotlight: DemoSpotlight,
  stepIndex: number
): { stepNumber: number; phases: LogPhase[] } | null {
  if (spotlight !== "log") return null;
  const m: Record<number, [number, LogPhase[]]> = {
    0: [1, ["trigger", "process"]],
    2: [3, ["trigger", "process"]],
    3: [4, ["trigger", "process"]],
    5: [6, ["trigger", "process"]],
  };
  const row = m[stepIndex];
  if (!row) return null;
  return { stepNumber: row[0], phases: row[1] };
}
