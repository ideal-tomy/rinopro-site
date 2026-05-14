/**
 * 詳細見積APIのルールベース下限補正のスモーク検証
 * 実行: npx tsx scripts/verify-estimate-credible-range.ts
 *
 * 2026-05 更新: 市場相場 × AXEON 効率化（0.80）フロアモデルに切替。
 * 中堅・大企業向けに「70〜250 万円」のような水準が出ないことを確認する。
 */

import {
  applyCredibleMinimumRangeToEstimate,
  computeCredibleFloorManFromAnswers,
} from "../src/lib/estimate/estimate-credible-range";
import { computeMarketFloorFromAnswers } from "../src/lib/estimate/estimate-market-floor";
import type { EstimateDetailedAiOutput } from "../src/lib/estimate/estimate-snapshot";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function baseAi(lo: number, hi: number): EstimateDetailedAiOutput {
  return {
    requirementTitle: "テスト",
    requirementDefinitionDocument: "## x\ny",
    scopeIn: [],
    scopeOut: [],
    openQuestions: [],
    regulatoryNotes: [],
    assumptions: ["前提1"],
    followUpItems: [],
    estimateDrivers: [],
    plainCustomerSummary: "概要です。",
    estimateLoMan: lo,
    estimateHiMan: hi,
  };
}

function run(): void {
  // 小規模 × 社内ツール（最小条件）でも、中堅相応のフロアまで底上げされる
  const smallAnswers: Record<string, string> = {
    業種: "小売・店舗・ネット販売",
    "何を作りたいですか": "在庫の見える化ツール",
    "会社やチームの人数のイメージ": "11〜50人",
    "今お使いのツールや、他のシステムとのつなぎ": "まずは単体でよい",
    "扱う情報に個人情報は含まれますか": "いいえ、含まれない想定",
  };
  const smallFloor = computeCredibleFloorManFromAnswers(smallAnswers);
  // small × internal_tool baseline 200 × 0.80 = 160 を下回らない
  assert(smallFloor >= 150, `small floor unexpected: ${smallFloor}`);

  // 大企業 × 連携あり × 個人情報 × LINE 連携: フロアが大きく上がる
  const enterpriseAnswers: Record<string, string> = {
    業種: "小売・店舗・ネット販売",
    "何を作りたいですか": "顧客向けのアプリ",
    "会社やチームの人数のイメージ": "201人以上",
    "今お使いのツールや、他のシステムとのつなぎ": "今のツールとつなぐ必要がある",
    "扱う情報に個人情報は含まれますか": "はい、含まれる",
    "誰が使う・見るか（社内・外部）": "お客様や取引先にも見せる",
    "主な使い方・載せる場所": "LINEの友だち・LINE連携で使う",
  };
  const enterpriseFloor = computeCredibleFloorManFromAnswers(enterpriseAnswers);
  // customer_facing_app × enterprise の baseline 900 × multiplier(≥1.3) × 0.80 ≒ 936
  assert(
    enterpriseFloor > smallFloor,
    `enterprise floor should be larger than small: ${enterpriseFloor} vs ${smallFloor}`
  );
  assert(
    enterpriseFloor >= 700,
    `enterprise floor unexpected (too low): ${enterpriseFloor}`
  );

  // AI が低すぎる出力をした場合（70〜250 万）でも、フロアまで持ち上がる
  const clamped = applyCredibleMinimumRangeToEstimate(
    baseAi(70, 250),
    enterpriseAnswers
  );
  assert(clamped.didClamp, "should clamp when AI is too low for enterprise");
  assert(
    clamped.output.estimateLoMan >= enterpriseFloor,
    `clamped lo should meet floor: ${clamped.output.estimateLoMan} vs ${enterpriseFloor}`
  );
  assert(
    clamped.output.estimateHiMan > clamped.output.estimateLoMan,
    "hi should be larger than lo after clamp"
  );

  // 既にフロア（lo / hi 両方）を上回っているレンジは触らない
  const above = applyCredibleMinimumRangeToEstimate(
    baseAi(1500, 3500),
    enterpriseAnswers
  );
  assert(!above.didClamp, "should not clamp when already above floor");

  // 「市場相場」「2割引」「AXEON」「効率化」「AI 駆動」のような語が、追加されるドライバー・前提に
  // 入っていないこと（要約への明示度: 触れない方針）。
  const forbidden = ["市場相場", "2割", "AXEON", "効率化", "AI 駆動", "AI駆動"];
  const driverText = clamped.output.estimateDrivers.map((d) => d.factor).join("\n");
  const assumptionsText = clamped.output.assumptions.join("\n");
  for (const word of forbidden) {
    assert(
      !driverText.includes(word),
      `estimateDrivers should not contain "${word}"`
    );
    assert(
      !assumptionsText.includes(word),
      `assumptions should not contain "${word}"`
    );
  }
  // 要約（plainCustomerSummary）はクランプで一切いじらない（A: 触れない）
  assert(
    clamped.output.plainCustomerSummary === "概要です。",
    `plainCustomerSummary should be untouched by clamp`
  );

  // アーキタイプ判定の最低限の確認
  const floorIntegration = computeMarketFloorFromAnswers({
    "何を作りたいですか": "全社のデータ基盤を整備したい",
    "会社やチームの人数のイメージ": "201人以上",
  });
  assert(
    floorIntegration.archetype === "enterprise_core" ||
      floorIntegration.archetype === "integration_hub",
    `expected enterprise_core/integration_hub, got ${floorIntegration.archetype}`
  );

  console.log("verify-estimate-credible-range: ok");
}

run();
