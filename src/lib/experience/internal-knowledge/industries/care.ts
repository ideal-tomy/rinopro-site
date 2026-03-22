import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const careDataset: IndustryDataset = {
  id: "care",
  label: "介護・福祉",
  icon: "🤝",
  toneInstruction:
    "利用者・家族に配慮したやわらかい表現。事実と手続きを分けて説明する。",
  policies: ["cite_required", "pricing_kb_only"],
  policyDescription: "出典明示／個別請求額はナレッジ外なら事務へ",
  systemPreamble:
    "参照ナレッジは施設のケアマニュアル・家族連絡・費用説明・事故報告手順の抜粋である。",
  escalationContact: "施設長またはケアマネジャー",
  kb: [
    {
      id: "ca-kb-1",
      title: "ケア記録・報告マニュアル",
      section: "バイタル変化時の対応",
      body: `平常時からの変化がある場合は記録に残し、看護師または当直責任者へ速やかに報告する。緊急時は施設の緊急対応フローに従い、119・主治医・家族の連絡順序を守る。`,
    },
    {
      id: "ca-kb-2",
      title: "家族連絡ガイド",
      section: "面会・外出",
      body: `面会は予約制とし、感染症流行時は人数・時間の制限を設ける。変更は前日17時までに窓口へ連絡する。外出・外泊はケアプランと照合し、担当者が承認する。`,
    },
    {
      id: "ca-kb-3",
      title: "サービス費用説明資料",
      section: "介護保険自己負担",
      body: `自己負担割合は被保険者証の区分に準拠する。サービス種別ごとの単位数の説明はケアマネが行い、確定請求額は事務が計算する。`,
    },
    {
      id: "ca-kb-4",
      title: "事故・ヒヤリハット報告",
      section: "転倒・けがの初動",
      body: `事故発生時はまず安全確保と応急処置を行い、状況を記録する。医療機関受診の要否は看護師または医師が判断する。家族へは方針に沿い速やかに連絡する。`,
    },
    {
      id: "ca-kb-5",
      title: "個人情報・秘密保持",
      section: "職員間の情報共有",
      body: `必要最小限の情報のみ職員間で共有する。SNS等への投稿は禁止。外部への口頭説明は施設長または指定者が行う。`,
    },
    {
      id: "ca-kb-6",
      title: "夜勤・申し送り",
      section: "引き継ぎ様式",
      body: `申し送りは様式Nに記載し、重点事項は朝礼で口頭補足する。未完了タスクは担当と期限を明記する。`,
    },
    {
      id: "ca-kb-7",
      title: "薬剤・医療関連",
      section: "服薬支援",
      body: `服薬は医師の指示と介護計画に基づく。変更・中止は医療職の指示なく行わない。残薬は薬袋と照合し記録する。`,
    },
    {
      id: "ca-kb-8",
      title: "虐待防止・相談窓口",
      section: "職員の対応",
      body: `虐待の疑いがある場合は、ただちに施設長へ報告し、調査・外部相談の可否を判断する。本人の安全確保を最優先する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "どの分野ですか？",
      choices: withOther([
        { label: "記録・バイタル・緊急", nextNodeId: "n1" },
        { label: "家族・面会", nextNodeId: "n2" },
        { label: "費用・請求", nextNodeId: "n3" },
        { label: "事故・コンプライアンス", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "ケア記録",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "バイタル変化時の報告", kbRefIds: ["ca-kb-1"] },
        { label: "夜勤の申し送り", kbRefIds: ["ca-kb-6"] },
        { label: "服薬支援の基本", kbRefIds: ["ca-kb-7"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "家族",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "面会・予約のルール", kbRefIds: ["ca-kb-2"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "費用",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "自己負担の考え方", kbRefIds: ["ca-kb-3"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "安全",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "転倒・けがの初動", kbRefIds: ["ca-kb-4"] },
        { label: "個人情報・職員間共有", kbRefIds: ["ca-kb-5"] },
        { label: "虐待防止の通報", kbRefIds: ["ca-kb-8"] },
      ]),
    },
  },
};
