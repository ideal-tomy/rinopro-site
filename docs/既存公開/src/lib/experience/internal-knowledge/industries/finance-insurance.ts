import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const financeInsuranceDataset: IndustryDataset = {
  id: "finance_insurance",
  label: "金融・保険（バックオフィス）",
  icon: "🏦",
  toneInstruction:
    "誤解を招かない表現。個別推奨・収益約束は禁止。条件と例外を添える。",
  policies: ["no_investment_advice", "cite_required", "pricing_kb_only"],
  policyDescription: "投資助言なし／出典明示／個別手数料はコンプライアンスへ",
  systemPreamble:
    "参照ナレッジは顧客対応基本・手数料体系・クレーム初動の社内規程抜粋である。最終判断はコンプライアンス部門とする。",
  escalationContact: "コンプライアンスまたは商品部門",
  kb: [
    {
      id: "fi-kb-1",
      title: "顧客対応基本方針",
      section: "禁止される説明",
      body: `個別の投資推奨・保険加入の勧誘文は承認済みテンプレ外では使用しない。適合性の原則に沿い、顧客の知識・経験・目的を踏まえた説明にとどめる。`,
    },
    {
      id: "fi-kb-2",
      title: "手数料体系（対外）",
      section: "一般口座・取引",
      body: `取引ごとの手数料は公表料金表に準拠する。キャンペーン適用時は条件を必ず併記する。`,
    },
    {
      id: "fi-kb-3",
      title: "クレーム・苦情処理",
      section: "記録とSLA",
      body: `事実関係・時系列・顧客発言の要約を記録する。回答期限は社内SLAに従い、判断が難しい案件はコンプライアンスへエスカレーションする。`,
    },
    {
      id: "fi-kb-4",
      title: "マネロン・疑わしい取引",
      section: "初動",
      body: `疑わしい取引の届出基準に該当する場合は、直ちにAML担当へ報告する。顧客への説明は定型文に限定する。`,
    },
    {
      id: "fi-kb-5",
      title: "個人情報・秘密保持",
      section: "第三者照会",
      body: `本人確認なしの口座情報開示は行わない。公的機関の照会は法務確認のうえ対応する。`,
    },
    {
      id: "fi-kb-6",
      title: "電子交付・書面交付",
      section: "同意取得",
      body: `重要書面の電子交付は、所定の同意取得手続を完了した顧客に限る。`,
    },
    {
      id: "fi-kb-7",
      title: "特別手数料・個別契約",
      section: "照会先",
      body: `個別契約による特別手数料は本ナレッジに記載しない。コンプライアンスまたは商品部門へ照会する。`,
    },
    {
      id: "fi-kb-8",
      title: "保険募集人コンプライアンス",
      section: "比較・誘導",
      body: `他社商品との優劣を断定しない。必要に応じ比較表は監査済み資料のみ使用する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "区分は？",
      choices: withOther([
        { label: "説明・勧誘の境界", nextNodeId: "n1" },
        { label: "手数料・料金", nextNodeId: "n2" },
        { label: "クレーム・苦情", nextNodeId: "n3" },
        { label: "AML・個人情報", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "説明",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "個別推奨を書いてよいか", kbRefIds: ["fi-kb-1"] },
        { label: "保険の比較説明", kbRefIds: ["fi-kb-8"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "手数料",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "一般手数料の説明", kbRefIds: ["fi-kb-2"] },
        { label: "特別手数料・個別契約", kbRefIds: ["fi-kb-7"] },
        { label: "電子交付の同意", kbRefIds: ["fi-kb-6"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "クレーム",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "記録とSLA", kbRefIds: ["fi-kb-3"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "コンプライアンス",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "疑わしい取引の初動", kbRefIds: ["fi-kb-4"] },
        { label: "第三者からの口座照会", kbRefIds: ["fi-kb-5"] },
      ]),
    },
  },
};
