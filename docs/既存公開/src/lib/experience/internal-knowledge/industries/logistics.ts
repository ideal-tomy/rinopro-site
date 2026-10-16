import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const logisticsDataset: IndustryDataset = {
  id: "logistics",
  label: "物流・運送",
  icon: "🚚",
  toneInstruction:
    "時系列・責任分界・連絡期限をはっきり書く。荷主・キャリア・当社の切り分けを明示。",
  policies: ["cite_required", "pricing_kb_only"],
  policyDescription: "出典明示／スポット運賃は営業照会",
  systemPreamble:
    "参照ナレッジは配送インシデント初動・再配達条件・温度管理の社内規程抜粋である。",
  escalationContact: "運行管理責任者または営業",
  kb: [
    {
      id: "l-kb-1",
      title: "配送インシデント初動",
      section: "荷主連絡",
      body: `遅延・破損・紛失は30分以内に荷主へ一次連絡する。原因区分（当社/キャリア/荷主）を記録し、再発防止チケットを起票する。`,
    },
    {
      id: "l-kb-2",
      title: "再配達・不在",
      section: "手数料",
      body: `契約タイプAは再配達1回無料、タイプBは都度課金とする。詳細は契約添付の料金表を正とする。`,
    },
    {
      id: "l-kb-3",
      title: "温度管理（冷蔵冷凍）",
      section: "記録と逸脱",
      body: `庫内・車載ロガーで30分毎に記録する。基準逸脱時は品質責任者へ即時連絡し、荷主判断を仰ぐ。`,
    },
    {
      id: "l-kb-4",
      title: "荷役・混載",
      section: "異物混入防止",
      body: `混載禁止品はマニフェストと照合し、違反があれば積載中止とする。`,
    },
    {
      id: "l-kb-5",
      title: "ドライバー労務",
      section: "休憩・拘束時間",
      body: `改善基準告示に基づき休憩・待機を記録する。違反疑いは労務担当へ報告する。`,
    },
    {
      id: "l-kb-6",
      title: "保険・免責",
      section: "荷主への説明",
      body: `賠償上限・免責事由は運送約款に従い説明する。個別契約で上書きがある場合は契約書を確認する。`,
    },
    {
      id: "l-kb-7",
      title: "スポット運賃",
      section: "照会先",
      body: `日々変動するスポット運賃は本ナレッジに記載しない。営業または運行管理へ照会する。`,
    },
    {
      id: "l-kb-8",
      title: "危険物運送",
      section: "表示・積載",
      body: `危険物は法令に基づき表示票・積載区分を遵守する。不明点は保安担当へ確認する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "トピックは？",
      choices: withOther([
        { label: "遅延・破損・紛失", nextNodeId: "n1" },
        { label: "再配達・不在", nextNodeId: "n2" },
        { label: "温度・品質", nextNodeId: "n3" },
        { label: "契約・運賃", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "インシデント",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "荷主への一次連絡", kbRefIds: ["l-kb-1"] },
        { label: "混載・異物混入", kbRefIds: ["l-kb-4"] },
        { label: "危険物の基本", kbRefIds: ["l-kb-8"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "再配達",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "手数料の考え方", kbRefIds: ["l-kb-2"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "温度",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "温度逸脱時", kbRefIds: ["l-kb-3"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "契約",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "賠償上限・免責の説明", kbRefIds: ["l-kb-6"] },
        { label: "スポット運賃の照会先", kbRefIds: ["l-kb-7"] },
        { label: "ドライバー労務記録", kbRefIds: ["l-kb-5"] },
      ]),
    },
  },
};
