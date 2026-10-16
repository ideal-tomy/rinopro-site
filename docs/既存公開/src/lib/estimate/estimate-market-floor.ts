/**
 * 中堅・大企業向けの「市場相場 × AXEON 効率化（≒ 0.80）」フロア計算。
 *
 * 設計意図（内部基準・ユーザー向け文章に出さない）:
 * - 一般的な開発会社の見積もりレンジを 100% としたときに、AXEON は AI 駆動開発に
 *   よる効率化分（約 2 割）を差し引いた水準で提示する。
 * - したがって、AI が出力した最終レンジが「市場相場 × 0.80」のフロア未満になる
 *   場合は、ルール層で下限・上限を引き上げる。
 * - メインターゲットは中堅〜大企業（従業員 200〜1000 人規模以上）のため、
 *   小規模（11〜50 人）でも、中堅企業と同じく `× 0.80` の係数で下限を持たせる。
 *   ただし市場相場そのものは中堅・大企業より一段下になる（過剰見積もりは避ける）。
 *
 * 重要: この計算の理由（「市場相場」「2 割引き」「AI 駆動開発」「AXEON 割」など）は、
 * `plainCustomerSummary` / `assumptions` / `estimateDrivers` / `requirementDoc` には
 * 一切書かない。社内の算出基準として閉じる。
 */

const AXEON_EFFICIENCY_FACTOR = 0.8;

type Archetype =
  | "internal_tool"
  | "customer_facing_app"
  | "ai_assistant"
  | "integration_hub"
  | "enterprise_core";

type SizeBand = "small" | "mid" | "enterprise";

type Range = { lo: number; hi: number };

/**
 * 市場相場（一般開発会社の中央値レンジ・万円）。
 * これに `AXEON_EFFICIENCY_FACTOR` を掛けたものが AXEON の最終フロア。
 * 数字はあくまで「中堅〜大企業向け開発として現実的なレンジ」のたたき台。
 */
const MARKET_BASELINE_MAN: Record<Archetype, Record<SizeBand, Range>> = {
  internal_tool: {
    small: { lo: 200, hi: 500 },
    mid: { lo: 300, hi: 800 },
    enterprise: { lo: 600, hi: 1500 },
  },
  customer_facing_app: {
    small: { lo: 350, hi: 900 },
    mid: { lo: 500, hi: 1400 },
    enterprise: { lo: 900, hi: 2800 },
  },
  ai_assistant: {
    small: { lo: 280, hi: 700 },
    mid: { lo: 400, hi: 1000 },
    enterprise: { lo: 700, hi: 1800 },
  },
  integration_hub: {
    small: { lo: 400, hi: 900 },
    mid: { lo: 600, hi: 1500 },
    enterprise: { lo: 1000, hi: 3500 },
  },
  enterprise_core: {
    small: { lo: 500, hi: 1100 },
    mid: { lo: 800, hi: 2000 },
    enterprise: { lo: 1500, hi: 4500 },
  },
};

function detectSizeBand(answers: Record<string, string>): SizeBand {
  const team = answers["会社やチームの人数のイメージ"] ?? "";
  if (team.includes("201人以上")) return "enterprise";
  if (team.includes("51〜200") || team.includes("51～200")) return "mid";
  if (team.includes("11〜50") || team.includes("11～50")) return "small";
  // 未回答・「10人以下」など: メインターゲットが中堅以上のため、安全側で `mid` を仮置き。
  return "mid";
}

function detectArchetype(answers: Record<string, string>): Archetype {
  const product = answers["何を作りたいですか"] ?? "";
  const integration = answers["今お使いのツールや、他のシステムとのつなぎ"] ?? "";
  const usage = answers["主な使い方・載せる場所"] ?? "";
  const hosting = answers["データやシステムの置き場所のイメージ"] ?? "";
  const audience = answers["誰が使う・見るか（社内・外部）"] ?? "";
  const blob = [product, integration, usage, hosting, audience].join(" ");

  // 上から優先度順。基幹・統合は他に勝つ。
  if (/基幹|ERP|全社|複数部門|大規模|業務システム/i.test(blob)) {
    return "enterprise_core";
  }
  if (/データ基盤|連携基盤|ETL|統合ハブ|ハブ\b|DWH|データレイク/i.test(blob)) {
    return "integration_hub";
  }
  if (
    /チャットボット|RAG|問い合わせ自動|アシスタント|自動要約|自動分類|生成AI|LLM|ChatGPT|GPT/i.test(
      blob
    )
  ) {
    return "ai_assistant";
  }
  if (
    /LINE|専用アプリ|スマホアプリ|toC|消費者向け|エンドユーザー/i.test(blob) ||
    /お客様や取引先|外部にも見せる|一部は外部/.test(audience) ||
    /顧客|カスタマー/.test(product)
  ) {
    return "customer_facing_app";
  }

  return "internal_tool";
}

/** 主にコストドライバー的に上振れする要因の積み上げ係数（市場相場テーブルへの倍率） */
function deriveBaselineMultiplier(answers: Record<string, string>): number {
  let mult = 1.0;

  const integration = answers["今お使いのツールや、他のシステムとのつなぎ"] ?? "";
  if (integration.includes("つなぐ必要がある")) mult += 0.18;
  else if (integration.includes("できればつなぎたい")) mult += 0.08;

  const data = answers["扱う情報に個人情報は含まれますか"] ?? "";
  if (data.includes("はい、含まれる") || data.includes("一部だけ")) mult += 0.1;

  const hosting = answers["データやシステムの置き場所のイメージ"] ?? "";
  if (hosting.includes("社内ルールで閉じた環境")) mult += 0.08;

  const design = answers["見た目・デザインの期待"] ?? "";
  if (design.includes("こだわりたい")) mult += 0.06;

  const audience = answers["誰が使う・見るか（社内・外部）"] ?? "";
  if (audience.includes("お客様や取引先") || audience.includes("外部にも見せる")) {
    mult += 0.08;
  }

  const update = answers["情報の更新の頻度"] ?? "";
  if (update.includes("リアルタイム") || update.includes("頻繁")) mult += 0.06;

  // 上ぶれを抑える（市場相場の +50% まで）。
  return Math.min(mult, 1.5);
}

/**
 * 回答から「AXEON が下回ってはいけないフロアレンジ」を計算する。
 * - 計算: 市場相場（アーキタイプ × 規模） × コストドライバー倍率 × 0.80
 * - 下限・上限ともに最小値として機能する（AI が上回って出力する分には触らない）。
 */
export function computeMarketFloorFromAnswers(answers: Record<string, string>): {
  archetype: Archetype;
  sizeBand: SizeBand;
  multiplier: number;
  baseline: Range;
  floor: Range;
} {
  const archetype = detectArchetype(answers);
  const sizeBand = detectSizeBand(answers);
  const baseline = MARKET_BASELINE_MAN[archetype][sizeBand];
  const multiplier = deriveBaselineMultiplier(answers);

  const adjustedLo = baseline.lo * multiplier;
  const adjustedHi = baseline.hi * multiplier;

  const floor: Range = {
    lo: Math.round(adjustedLo * AXEON_EFFICIENCY_FACTOR),
    hi: Math.round(adjustedHi * AXEON_EFFICIENCY_FACTOR),
  };

  return { archetype, sizeBand, multiplier, baseline, floor };
}

/** AXEON_EFFICIENCY_FACTOR を外部から参照する必要があるとき用 */
export { AXEON_EFFICIENCY_FACTOR };
