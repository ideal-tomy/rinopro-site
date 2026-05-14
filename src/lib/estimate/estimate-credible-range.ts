import { computeMarketFloorFromAnswers } from "@/lib/estimate/estimate-market-floor";
import type { EstimateDetailedAiOutput } from "@/lib/estimate/estimate-snapshot";

/**
 * 詳細見積 API の最終段でかける「下限ガード」。
 *
 * 設計意図:
 * - AXEON のメインターゲット（中堅〜大企業）に対し、AI が業種・規模・連携などから
 *   構造的に低すぎる金額を出した場合、市場相場ベースのフロアまで持ち上げる。
 * - フロアの算出ロジックは `estimate-market-floor.ts` に集約（市場相場 × 0.80）。
 * - 「市場相場」「2 割引き」「AI 駆動開発」「効率化」のような表現は、ここで追加する
 *   assumptions・estimateDrivers・plainCustomerSummary のいずれにも書かない。
 *   ユーザーには「規模・対象範囲・データの扱いに基づくレンジ」とだけ伝える。
 */

const MIN_RANGE_WIDTH_MAN = 40;

const CLAMP_DRIVER_FACTOR =
  "ご回答の規模・対象範囲・連携やデータの扱いに基づき、現実的な工数の前提でレンジを調整しました";

const CLAMP_ASSUMPTION =
  "ご回答の規模・対象範囲・連携や情報の扱いを踏まえ、業務として現実的な工数の前提でレンジを調整しています。";

/**
 * 後方互換: 数値（万円）の下限のみを返す。
 * 内部は新しい市場フロア計算に委譲する。
 */
export function computeCredibleFloorManFromAnswers(
  answers: Record<string, string>
): number {
  const { floor } = computeMarketFloorFromAnswers(answers);
  return floor.lo;
}

/**
 * AI が出したレンジが、市場相場ベースの下限を割っている場合に持ち上げる。
 * 下限・上限の両方を `computeMarketFloorFromAnswers` の値で守る。
 * 希望予算はここでは使わない（プロンプト段階で既に除外済み）。
 */
export function applyCredibleMinimumRangeToEstimate(
  output: EstimateDetailedAiOutput,
  answers: Record<string, string>
): { output: EstimateDetailedAiOutput; didClamp: boolean } {
  const { floor } = computeMarketFloorFromAnswers(answers);
  let lo = output.estimateLoMan;
  let hi = output.estimateHiMan;

  const needsLoClamp = lo < floor.lo;
  const needsHiClamp = hi < floor.hi;

  if (!needsLoClamp && !needsHiClamp) {
    return { output, didClamp: false };
  }

  if (needsLoClamp) {
    lo = floor.lo;
  }
  if (needsHiClamp) {
    hi = floor.hi;
  }
  // 下限が上限を上回らないように
  if (hi < lo) {
    hi = lo;
  }
  // 最小幅を確保
  if (hi - lo < MIN_RANGE_WIDTH_MAN) {
    hi = lo + MIN_RANGE_WIDTH_MAN;
  }

  let assumptions = [...output.assumptions];
  if (!assumptions.some((a) => a.includes("現実的な工数の前提"))) {
    assumptions = [CLAMP_ASSUMPTION, ...assumptions].slice(0, 10);
  }

  let estimateDrivers = [...(output.estimateDrivers ?? [])];
  if (!estimateDrivers.some((d) => d.factor.includes("現実的な工数の前提"))) {
    estimateDrivers = [
      { factor: CLAMP_DRIVER_FACTOR, effect: "up" as const },
      ...estimateDrivers,
    ].slice(0, 8);
  }

  return {
    output: {
      ...output,
      estimateLoMan: lo,
      estimateHiMan: hi,
      assumptions,
      estimateDrivers,
    },
    didClamp: true,
  };
}
