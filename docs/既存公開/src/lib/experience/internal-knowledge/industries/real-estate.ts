import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const realEstateDataset: IndustryDataset = {
  id: "real_estate",
  label: "不動産（管理・仲介）",
  icon: "🏢",
  toneInstruction:
    "断定を避け、確認事項と次アクションを明示。宅建・法務の境界を守る。",
  policies: ["no_legal_advice", "cite_required", "pricing_kb_only"],
  policyDescription: "法的判断は担当へ／出典明示／個別賃料はシステム照会",
  systemPreamble:
    "参照ナレッジは重要事項説明チェックリスト・原状回復ガイド・管理費説明テンプレの抜粋である。最終判断は宅建士・法務とする。",
  escalationContact: "宅建士または法務・管理責任者",
  kb: [
    {
      id: "re-kb-1",
      title: "重要事項説明チェックリスト",
      section: "必須記載事項",
      body: `宅地建物取引業法で定める事項を漏れなく説明する。不明点は顧問または法務レビューを必須とし、口頭のみの確約は行わない。`,
    },
    {
      id: "re-kb-2",
      title: "原状回復ガイド",
      section: "通常損耗と負担",
      body: `経年劣化は原則として借主負担としない。故意・過失による損傷は協議のうえ精算する。模様替えの原状回復は契約書の特約を確認する。`,
    },
    {
      id: "re-kb-3",
      title: "管理費・共益費",
      section: "説明テンプレ",
      body: `管理費に含まれる項目（清掃・保守・人件費の一部等）を表形式で説明する。値上げは管理規約・委託契約に基づく手続を案内する。`,
    },
    {
      id: "re-kb-4",
      title: "入居審査・更新",
      section: "更新料・償却",
      body: `更新に関する条件は契約書と借地借家法の趣旨に沿って説明する。実費・償却の有無は個別契約を確認する。`,
    },
    {
      id: "re-kb-5",
      title: "競売・瑕疵",
      section: "告知の原則",
      body: `知得した瑕疵は重要事項として説明する。調査限界についても文言で明示する。`,
    },
    {
      id: "re-kb-6",
      title: "管理組合対応",
      section: "修繕積立金",
      body: `大規模修繕計画・積立金の説明は管理規約と長期修繕計画に基づく。数値は最新の総会資料を正とする。`,
    },
    {
      id: "re-kb-7",
      title: "物件マスタ照会",
      section: "賃料・敷金",
      body: `個別物件の賃料・敷金・保証金は物件管理システムを参照する。本ナレッジに確定額は記載しない。`,
    },
    {
      id: "re-kb-8",
      title: "広告・景表法",
      section: "優良誤認の禁止",
      body: `実際より有利と誤認される表示を行わない。利回り表記は根拠資料を保持する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "テーマは？",
      choices: withOther([
        { label: "重要事項・コンプライアンス", nextNodeId: "n1" },
        { label: "原状回復・退去", nextNodeId: "n2" },
        { label: "管理費・修繕", nextNodeId: "n3" },
        { label: "賃料・物件情報", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "重説",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "説明前のチェック観点", kbRefIds: ["re-kb-1"] },
        { label: "瑕疵・告知", kbRefIds: ["re-kb-5"] },
        { label: "広告表示の注意", kbRefIds: ["re-kb-8"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "退去",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "通常損耗と負担", kbRefIds: ["re-kb-2"] },
        { label: "更新・償却", kbRefIds: ["re-kb-4"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "管理",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "管理費の説明", kbRefIds: ["re-kb-3"] },
        { label: "修繕積立金", kbRefIds: ["re-kb-6"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "賃料",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "この物件の賃料を知りたい", kbRefIds: ["re-kb-7"] },
      ]),
    },
  },
};
