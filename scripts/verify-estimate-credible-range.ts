/**
 * 詳細見積APIのルールベース下限補正のスモーク検証
 * 実行: npx tsx scripts/verify-estimate-credible-range.ts
 */

import {
  applyCredibleMinimumRangeToEstimate,
  computeCredibleFloorManFromAnswers,
} from "../src/lib/estimate/estimate-credible-range";
import type { EstimateDetailedAiOutput } from "../src/lib/estimate/estimate-snapshot";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const minimalAnswers: Record<string, string> = {
  業種: "小売・店舗・ネット販売",
  "何を作りたいですか": "在庫の見える化ツール",
  "会社やチームの人数のイメージ": "〜10人くらい",
  "今お使いのツールや、他のシステムとのつなぎ": "まずは単体でよい",
  "扱う情報に個人情報は含まれますか": "いいえ、含まれない想定",
};

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
  const floorSmall = computeCredibleFloorManFromAnswers(minimalAnswers);
  assert(floorSmall >= 40 && floorSmall <= 120, `floor range unexpected: ${floorSmall}`);

  const heavyAnswers: Record<string, string> = {
    ...minimalAnswers,
    "会社やチームの人数のイメージ": "201人以上",
    "今お使いのツールや、他のシステムとのつなぎ": "今のツールとつなぐ必要がある",
    "扱う情報に個人情報は含まれますか": "はい、含まれる",
    "誰が使う・見るか（社内・外部）": "お客様や取引先にも見せる",
    "主な使い方・載せる場所": "LINEの友だち・LINE連携で使う",
  };
  const floorHeavy = computeCredibleFloorManFromAnswers(heavyAnswers);
  assert(floorHeavy > floorSmall, "heavy context should raise floor");

  const low = applyCredibleMinimumRangeToEstimate(baseAi(15, 45), heavyAnswers);
  assert(low.didClamp, "should clamp when AI is too low");
  assert(low.output.estimateLoMan >= floorHeavy - 5, "clamped lo should meet floor");

  const ok = applyCredibleMinimumRangeToEstimate(baseAi(320, 520), heavyAnswers);
  assert(!ok.didClamp, "should not clamp when already above floor");

  console.log("verify-estimate-credible-range: ok");
}

run();
