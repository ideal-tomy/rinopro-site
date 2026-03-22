import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const clinicOpsDataset: IndustryDataset = {
  id: "clinic_ops",
  label: "医療事務・クリニック運営（非診療）",
  icon: "🏥",
  toneInstruction:
    "診療内容・診断には一切触れず、受付・会計・手続きの案内に限定する。丁寧で中立な窓口口調。",
  policies: ["no_diagnosis", "cite_required", "pricing_kb_only"],
  policyDescription: "診断判断なし／出典明示／料金の個別額はナレッジ外ならエスカレ",
  systemPreamble:
    "参照ナレッジは院内マニュアル（受付・会計・個人情報・感染対策）の抜粋。実運用は最新版規程に従うこと。",
  escalationContact: "受付責任者または事務長",
  kb: [
    {
      id: "cl-kb-1",
      title: "受付業務マニュアル",
      section: "第3章 予約変更・キャンセル",
      body: `予約の変更・キャンセルは原則として前営業日までに電話または患者Webから受け付ける。当日キャンセルは空き状況を確認のうえ再予約を案内する。無断キャンセルが一定回数に達した場合、当院規程に基づき予約制限を行うことがある。`,
    },
    {
      id: "cl-kb-2",
      title: "会計・レセプト業務",
      section: "自費診療の説明",
      body: `自費メニューには治療計画書と見積書を交付する。保険診療との併用可否は医師の医学的判断に委ねるため、受付単独では断定しない。「医師にお尋ねください」と案内する。`,
    },
    {
      id: "cl-kb-3",
      title: "個人情報保護手順書",
      section: "家族への開示",
      body: `本人同意書または委任状がある場合に限り、診療内容を除く予約・会計等の情報を家族に共有できる。開示範囲は必要最小限とし、記録を残す。`,
    },
    {
      id: "cl-kb-4",
      title: "院内感染対策マニュアル",
      section: "発熱・体調不良来院者",
      body: `発熱または強い体調不良の来院者は、受付で別動線を案内しマスク着用を依頼する。混雑時は待機場所を指定し、他患者との接触を避ける。必要に応じ医師・看師へ連絡する。`,
    },
    {
      id: "cl-kb-5",
      title: "個人情報保護手順書",
      section: "開示請求・第三者照会",
      body: `開示請求は本人確認のうえ様式Cで受付し、30日以内に回答を目安とする。警察・公的機関の照会は院長承認と法務確認後に対応する。`,
    },
    {
      id: "cl-kb-6",
      title: "会計・レセプト業務",
      section: "領収書・診療費明細",
      body: `領収書は会計窓口で発行する。診療費明細の再発行は本人確認のうえ手数料〇〇円（規程による）。第三者への送付は同意なしでは行わない。`,
    },
    {
      id: "cl-kb-7",
      title: "受付業務マニュアル",
      section: "初診・紹介状",
      body: `初診は保険証と写真付身分証を確認する。紹介状がある場合は診療科へ添付する。紹介状なしの専門外来は、科の方針に従い受診可否を案内する。`,
    },
    {
      id: "cl-kb-8",
      title: "医療広告ガイドライン（要約）",
      section: "窓口での説明の線引き",
      body: `効果の保証・他院との比較優位の断定等は行わない。説明は院内掲示・医師説明に委ね、受付は事実関係（予約枠・手続き）に限定する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "窓口・事務のどの案件ですか？",
      choices: withOther([
        { label: "予約・キャンセル", nextNodeId: "n1" },
        { label: "会計・自費・明細", nextNodeId: "n2" },
        { label: "個人情報・家族連絡", nextNodeId: "n3" },
        { label: "感染対策・体調不良", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "予約",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "変更・キャンセルのルール", kbRefIds: ["cl-kb-1"] },
        { label: "初診・紹介状", kbRefIds: ["cl-kb-7"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "会計",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "自費メニューの説明の仕方", kbRefIds: ["cl-kb-2"] },
        { label: "領収書・明細の再発行", kbRefIds: ["cl-kb-6"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "個人情報",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "家族への情報共有", kbRefIds: ["cl-kb-3"] },
        { label: "開示請求・公的照会", kbRefIds: ["cl-kb-5"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "感染対策",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "発熱・体調不良の来院者対応", kbRefIds: ["cl-kb-4"] },
        { label: "窓口で言ってよいこと（広告規制）", kbRefIds: ["cl-kb-8"] },
      ]),
    },
  },
};
