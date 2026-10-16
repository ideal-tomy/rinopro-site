import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const manufacturingDataset: IndustryDataset = {
  id: "manufacturing",
  label: "製造・工場",
  icon: "⚙️",
  toneInstruction:
    "手順・責任者・記録の三点を明確に。ISO用語は必要最小限で補足する。",
  policies: ["cite_required", "pricing_kb_only"],
  policyDescription: "出典明示／部品単価など未掲載は購買へ",
  systemPreamble:
    "参照ナレッジは品質マニュアル（ISO 9001準拠手順の抜粋）、保全・購買連携規程である。",
  escalationContact: "品質保証責任者または製造部長",
  kb: [
    {
      id: "m-kb-1",
      title: "品質マニュアル",
      section: "8.7 不適合製品の管理",
      body: `安全・法令適合・顧客要求に影響する不適合が判明した場合、製品の識別・隔離・評価を行う。再利用・返品・廃棄の決定は品質責任者が承認する。再発防止措置は是正処置手順に従い記録する。`,
    },
    {
      id: "m-kb-2",
      title: "保全安全手順書",
      section: "LOTO（ロックアウト）",
      body: `設備の点検・修理前にエネルギー源を遮断し、ロックアウト/タグアウトを実施する。解除は作業担当と監視者の双方確認後に限る。`,
    },
    {
      id: "m-kb-3",
      title: "購買・開発連携規程",
      section: "代替品・規格変更",
      body: `部品の規格変更・代替品採用は購買と開発の両承認が必要。緊急時は所長決裁により最大72時間の暫定使用を認める場合がある。`,
    },
    {
      id: "m-kb-4",
      title: "製造日報・ロット管理",
      section: "トレーサビリティ",
      body: `原材料ロットと完成品ロットの紐付けをMESまたは手帳で記録する。召回時は24時間以内に対象範囲を特定できる状態を維持する。`,
    },
    {
      id: "m-kb-5",
      title: "校正・検査機器管理",
      section: "校正周期",
      body: `計測器は校正計画に従い外部または内部校正を実施する。期限切れ機器での検査データは無効とする。`,
    },
    {
      id: "m-kb-6",
      title: "変更管理（MOC）",
      section: "工程変更の承認",
      body: `設備・材料・工程条件の変更はMOC票を起票し、品質・安全・環境の影響評価を行う。軽微変更は班長承認、重大変更は工場長承認とする。`,
    },
    {
      id: "m-kb-7",
      title: "顧客苦情処理",
      section: "初動24時間",
      body: `苦情受付後24時間以内に一次回答方針を顧客へ連絡する。原因調査は品質と製造が共同で実施し、再発防止を期限付きで登録する。`,
    },
    {
      id: "m-kb-8",
      title: "部品単価・在庫照会",
      section: "照会先",
      body: `標準単価・在庫評価額は購買システムのマスタを正とする。本ナレッジにはリアルタイム単価を記載しない。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "区分を選んでください",
      choices: withOther([
        { label: "品質・不適合", nextNodeId: "n1" },
        { label: "保全・安全", nextNodeId: "n2" },
        { label: "調達・部品", nextNodeId: "n3" },
        { label: "トレーサ・苦情", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "品質",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "不適合品が出たとき", kbRefIds: ["m-kb-1"] },
        { label: "工程変更の承認", kbRefIds: ["m-kb-6"] },
        { label: "検査器の校正", kbRefIds: ["m-kb-5"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "保全",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "LOTOの基本", kbRefIds: ["m-kb-2"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "調達",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "代替品・規格変更", kbRefIds: ["m-kb-3"] },
        { label: "部品単価の見方", kbRefIds: ["m-kb-8"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "その他製造",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "ロット・トレーサ", kbRefIds: ["m-kb-4"] },
        { label: "顧客苦情の初動", kbRefIds: ["m-kb-7"] },
      ]),
    },
  },
};
