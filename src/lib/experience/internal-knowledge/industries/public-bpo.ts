import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const publicBpoDataset: IndustryDataset = {
  id: "public_bpo",
  label: "自治体・BPO（窓口）",
  icon: "🏛",
  toneInstruction:
    "公平・中立的な窓口語り口。個別の法的判断は行わず、一般論と必要書類に限定。",
  policies: ["cite_required", "pricing_kb_only"],
  policyDescription: "出典明示／条例の個別解釈は担当課へ",
  systemPreamble:
    "参照ナレッジは標準的な窓口手続案内・手数料例・回答の境界に関する社内マニュアル抜粋である。実際の取扱いは最新条例・要綱を正とする。",
  escalationContact: "担当課または市民課長代理",
  kb: [
    {
      id: "pb-kb-1",
      title: "窓口手続一般",
      section: "本人確認・様式",
      body: `本人確認書類は運転免許証・マイナンバーカード等の一覧に従う。申請書は窓口Webの最新様式を使用する。写しはA4片面で可。`,
    },
    {
      id: "pb-kb-2",
      title: "回答の境界",
      section: "条例解釈",
      body: `条例の解釈や個別案件の適用可否は担当課の確認が必要である。窓口は一般論と必要書類のみ案内し、断定しない。`,
    },
    {
      id: "pb-kb-3",
      title: "手数料例",
      section: "住民票の交付",
      body: `住民票の交付は1通300円（条例改正により変更あり得る—最新は公式掲示を確認）。`,
    },
    {
      id: "pb-kb-4",
      title: "個人情報・開示請求",
      section: "第三者代理",
      body: `代理人による請求は委任状と代理人本人確認が必要。目的外利用は禁止。`,
    },
    {
      id: "pb-kb-5",
      title: "行政手続法（要約）",
      section: "教示義務",
      body: `申請が却下される場合は理由と不服申立ての教示を行う。教示文は定型を使用する。`,
    },
    {
      id: "pb-kb-6",
      title: "多文化・言語支援",
      section: "通訳",
      body: `通訳が必要な場合は予約窓口へ誘導する。重要事項は誤訳防止のためダブルチェックを行う。`,
    },
    {
      id: "pb-kb-7",
      title: "苦情・要望",
      section: "記録",
      body: `苦情・要望は様式Kで受付し、担当課へ転送する。窓口で確約しない。`,
    },
    {
      id: "pb-kb-8",
      title: "手続未特定時",
      section: "照会",
      body: `手続名が特定できない場合、手数料・期限をナレッジから確定できない。手続一覧または担当課へ照会する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "区分は？",
      choices: withOther([
        { label: "持ち物・申請書", nextNodeId: "n1" },
        { label: "条例・個別判断", nextNodeId: "n2" },
        { label: "手数料", nextNodeId: "n3" },
        { label: "苦情・教示", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "書類",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "一般的な持ち物と様式", kbRefIds: ["pb-kb-1"] },
        { label: "代理人・委任状", kbRefIds: ["pb-kb-4"] },
        { label: "言語支援", kbRefIds: ["pb-kb-6"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "解釈",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "このケースは適用できるか", kbRefIds: ["pb-kb-2"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "手数料",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "住民票の交付", kbRefIds: ["pb-kb-3"] },
        { label: "手続が分からないとき", kbRefIds: ["pb-kb-8"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "運用",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "却下時の教示", kbRefIds: ["pb-kb-5"] },
        { label: "苦情・要望の受付", kbRefIds: ["pb-kb-7"] },
      ]),
    },
  },
};
