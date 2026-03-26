import { DEMO_HUB_TYPE_SECTION_SLUGS } from "@/lib/experience/prototype-registry";

/** タイプ別セクション各カードのラベル（`/demo`・トップ共通） */
export const DEMO_HUB_TYPE_SECTION_BADGES: Record<
  (typeof DEMO_HUB_TYPE_SECTION_SLUGS)[number],
  string
> = {
  "live-sync-voice-translation": "Live Sync",
  "loan-interview-business-outline": "書類・計画ドラフト",
  "workflow-approval-lite-demo": "承認・通知",
  "legal-memory-secretary": "検索・ナレッジ",
  "webinar-invite-email-draft": "メール草案",
  "presentation-outline": "資料骨子",
};

export type DemoHubPurposeId =
  | "inquiry"
  | "report"
  | "document"
  | "knowledge";

export interface DemoHubPurposeGroup {
  id: DemoHubPurposeId;
  title: string;
  description: string;
  /** 体験ページがある slug（最大3件） */
  experienceSlugs: readonly [string, string, string];
}

/** 「目的から選ぶ」4目的・各3デモ（`/demo`・トップ共通） */
export const DEMO_HUB_PURPOSE_GROUPS: readonly DemoHubPurposeGroup[] = [
  {
    id: "inquiry",
    title: "問い合わせ・顧客対応",
    description: "一次返信・分類・留守電の言い換えなど、対外向けの流れを試せます。",
    experienceSlugs: [
      "inquiry-intake-triage-demo",
      "service-claim-reply-assist",
      "voicemail-followup-reply-draft",
    ],
  },
  {
    id: "report",
    title: "報告・記録",
    description: "数値の週次まとめから、現場のインシデント・会議メモまで。",
    experienceSlugs: [
      "ops-report-metrics-demo",
      "driver-voice-incident-draft",
      "meeting-minutes-auto",
    ],
  },
  {
    id: "document",
    title: "文書・資料のたたき台",
    description: "プレゼン骨子、案内メール、融資面談用の体裁付き出力を確認できます。",
    experienceSlugs: [
      "presentation-outline",
      "webinar-invite-email-draft",
      "loan-interview-business-outline",
    ],
  },
  {
    id: "knowledge",
    title: "検索・整理",
    description: "条文・先例の当たりから、雑メモの会議整形、要件の抜き出しまで。",
    experienceSlugs: [
      "legal-memory-secretary",
      "bullet-mess-to-meeting-agenda",
      "rfp-requirements-extract",
    ],
  },
] as const;

/** 一覧ページでコンシェルジュを自動表示するクエリ（`ChatContainer` と同期） */
export const DEMO_LIST_CONCIERGE_QUERY = "concierge=1" as const;
