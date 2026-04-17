import type { EstimateDetailedAiOutput } from "@/lib/estimate/estimate-snapshot";

const CLAMP_DRIVER_FACTOR =
  "入力された規模・つなぎ・個人情報・利用範囲などから、一般的な開発の目安として妥当な下限に合わせてレンジを調整しました";

const CLAMP_PLAIN_NOTE =
  "表示の金額幅は、ご希望の予算帯ではなく、いただいた回答内容から算出した目安です。希望予算が別にあっても、まずは要件に基づくレンジをご確認ください。";

const MIN_RANGE_WIDTH_MAN = 40;

/**
 * フォーム回答（予算・予算補足は含めても無視する）から、
 * 「この条件なら最低でもこれくらいは見込む」万円下限のたたき台を返す。
 * LLM の過少出力を防ぐためのルール層（ユーザー希望予算は参照しない）。
 */
export function computeCredibleFloorManFromAnswers(answers: Record<string, string>): number {
  let floor = 42;

  const team = answers["会社やチームの人数のイメージ"] ?? "";
  if (team.includes("11〜50")) floor = Math.max(floor, 52);
  if (team.includes("51〜200")) floor = Math.max(floor, 78);
  if (team.includes("201人以上")) floor = Math.max(floor, 115);

  const integration = answers["今お使いのツールや、他のシステムとのつなぎ"] ?? "";
  if (integration.includes("つなぐ必要がある")) floor += 38;
  else if (integration.includes("できればつなぎたい")) floor += 14;

  const data = answers["扱う情報に個人情報は含まれますか"] ?? "";
  if (data.includes("はい、含まれる") || data.includes("一部だけ")) floor += 30;

  const audience = answers["誰が使う・見るか（社内・外部）"] ?? "";
  if (
    audience.includes("お客様や取引先") ||
    audience.includes("一部は外部") ||
    audience.includes("外部にも見せる")
  ) {
    floor += 20;
  }

  const usage = answers["主な使い方・載せる場所"] ?? "";
  if (
    usage.includes("LINE") ||
    usage.includes("専用アプリ") ||
    usage.includes("複数（例:")
  ) {
    floor += 24;
  }

  const hosting = answers["データやシステムの置き場所のイメージ"] ?? "";
  if (hosting.includes("社内ルールで閉じた環境")) floor += 18;

  const design = answers["見た目・デザインの期待"] ?? "";
  if (design.includes("こだわりたい")) floor += 16;

  const login = answers["ログインの使い方"] ?? "";
  if (login.includes("社員ごとにログイン")) floor += 14;

  const industry = answers["業種"] ?? "";
  if (/士業|医療|福祉/.test(industry)) floor += 22;

  const product = answers["何を作りたいですか"] ?? "";
  if (product.length > 180) floor += 12;
  if (/基盤|複数部門|全社|ERP|基幹|大規模/i.test(product)) floor += 45;

  return Math.min(Math.round(floor), 2500);
}

/**
 * AI が出したレンジが、回答から見て明らかに低すぎる場合に下限を引き上げる。
 * 希望予算はここでは使わない（既にプロンプトから除外済み）。
 */
export function applyCredibleMinimumRangeToEstimate(
  output: EstimateDetailedAiOutput,
  answers: Record<string, string>
): { output: EstimateDetailedAiOutput; didClamp: boolean } {
  const floor = computeCredibleFloorManFromAnswers(answers);
  let lo = output.estimateLoMan;
  let hi = output.estimateHiMan;

  if (lo >= floor) {
    return { output, didClamp: false };
  }

  const delta = floor - lo;
  lo = floor;
  hi = hi + delta;
  const width = hi - lo;
  if (width < MIN_RANGE_WIDTH_MAN) {
    hi = lo + MIN_RANGE_WIDTH_MAN;
  }

  let assumptions = [...output.assumptions];
  const clampAssumption =
    "この金額幅の下限は、いただいた回答の規模・連携・情報の扱いなどを踏まえた目安として調整しています（希望予算の数値に合わせて引き下げていません）。";
  if (!assumptions.some((a) => a.includes("希望予算の数値に合わせて引き下げ"))) {
    assumptions = [clampAssumption, ...assumptions].slice(0, 10);
  }

  let estimateDrivers = [...(output.estimateDrivers ?? [])];
  const hasClampDriver = estimateDrivers.some((d) => d.factor.includes("下限に合わせて"));
  if (!hasClampDriver) {
    estimateDrivers = [
      { factor: CLAMP_DRIVER_FACTOR, effect: "up" as const },
      ...estimateDrivers,
    ].slice(0, 8);
  }

  let plainCustomerSummary = output.plainCustomerSummary.trim();
  if (!plainCustomerSummary.includes("希望の予算帯ではなく")) {
    const addition = `\n\n${CLAMP_PLAIN_NOTE}`;
    const maxLen = 1100;
    if (plainCustomerSummary.length + addition.length <= maxLen) {
      plainCustomerSummary = `${plainCustomerSummary}${addition}`;
    }
  }

  return {
    output: {
      ...output,
      estimateLoMan: lo,
      estimateHiMan: hi,
      assumptions,
      estimateDrivers,
      plainCustomerSummary,
    },
    didClamp: true,
  };
}
