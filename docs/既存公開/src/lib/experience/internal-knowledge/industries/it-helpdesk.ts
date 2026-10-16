import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const itHelpdeskDataset: IndustryDataset = {
  id: "it_helpdesk",
  label: "IT・社内ヘルプデスク",
  icon: "💻",
  toneInstruction:
    "手順番号と権限の境界を明確に。セキュリティは推測で緩めない。",
  policies: ["cite_required"],
  policyDescription: "出典（手順書）を明示",
  systemPreamble:
    "参照ナレッジは情シス運用規程（アカウント・VPN・権限・情報分類）の抜粋である。",
  escalationContact: "情シスサービスデスク",
  kb: [
    {
      id: "it-kb-1",
      title: "アカウント運用規程",
      section: "パスワードリセット",
      body: `本人確認後、SSOポータルのセルフサービスを案内する。セルフで不可の場合は情シスチケットを起票（優先度S2）。`,
    },
    {
      id: "it-kb-2",
      title: "VPNトラブルシュート",
      section: "第一対応",
      body: `クライアント再起動→ネットワーク切替→証明書期限確認の順で実施。解決しない場合はログを取得してチケットに添付する。`,
    },
    {
      id: "it-kb-3",
      title: "権限申請ワークフロー",
      section: "承認",
      body: `業務アプリの権限は部門長承認後に情シスが付与する。特権アカウントは別フローで隔週レビュー対象とする。`,
    },
    {
      id: "it-kb-4",
      title: "情報分類・持ち出し",
      section: "機密データ",
      body: `機密ラベル付きデータの外部持ち出しは申請とDLPスキャンが必須。USBメモリ原則禁止。`,
    },
    {
      id: "it-kb-5",
      title: "端末・MDM",
      section: "紛失時",
      body: `紛失は直ちにヘルプデスクへ報告し、リモートワイプを検討する。警察届の要否はセキュリティ担当が判断する。`,
    },
    {
      id: "it-kb-6",
      title: "メール・フィッシング",
      section: "通報",
      body: `不審メールはリンクを開かず、添付を実行せず、報告ボタンまたは転送先へ送付する。`,
    },
    {
      id: "it-kb-7",
      title: "ソフトウェア導入",
      section: "承認",
      body: `業務外ソフトの私的導入は禁止。業務用はソフトウェア資産台帳に登録されたもののみ。`,
    },
    {
      id: "it-kb-8",
      title: "ISMS（要約）",
      section: "アクセス制御の原則",
      body: `最小権限の原則に基づき、アカウントは職務に必要な範囲に限定する。退職・異動時は即日権限剥奪を原則とする。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "カテゴリは？",
      choices: withOther([
        { label: "アカウント・パスワード", nextNodeId: "n1" },
        { label: "VPN・接続", nextNodeId: "n2" },
        { label: "権限・申請", nextNodeId: "n3" },
        { label: "セキュリティ", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "アカウント",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "パスワード再設定", kbRefIds: ["it-kb-1"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "VPN",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "つながらないときの第一歩", kbRefIds: ["it-kb-2"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "権限",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "アプリ権限の承認フロー", kbRefIds: ["it-kb-3"] },
        { label: "ソフト導入のルール", kbRefIds: ["it-kb-7"] },
        { label: "ISMS・アクセス制御の考え方", kbRefIds: ["it-kb-8"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "セキュリティ",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "機密データの持ち出し", kbRefIds: ["it-kb-4"] },
        { label: "端末紛失", kbRefIds: ["it-kb-5"] },
        { label: "不審メール", kbRefIds: ["it-kb-6"] },
      ]),
    },
  },
};
