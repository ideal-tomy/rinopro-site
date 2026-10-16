import type { LiveSyncMode } from "@/lib/experience/live-sync-modes-mock";

export interface LiveSyncAudioTextPrototypeMeta {
  slug: string;
  title: string;
  tier: "track3" | "track2";
  demoSlug: string;
  shortDescription: string;
  inputHint: string;
  immersiveOnDemoDetail?: boolean;
  liveSyncMode: LiveSyncMode;
}

/**
 * `inputType: audio_text` のデモを Live Sync テンプレで横展開（driver-voice-incident-draft は専用UIのため除外）。
 * @see docs/live-sync-audio-text-matrix.md
 */
export const LIVE_SYNC_AUDIO_TEXT_PROTOTYPES: LiveSyncAudioTextPrototypeMeta[] = [
  {
    slug: "construction-shadow-foreman",
    title: "現場監督の影武者",
    tier: "track3",
    demoSlug: "construction-shadow-foreman",
    shortDescription:
      "音声メモを Live Sync で整理し、結論・期限・TODO のモック要約を右ペインに逐次表示します。",
    inputHint: "例: 今日の養生の状況、明日の天気、協力会社への依頼事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "meeting-minutes-auto",
    title: "議事録を3秒で",
    tier: "track3",
    demoSlug: "meeting-minutes-auto",
    shortDescription:
      "会議の口述を Live Sync で追従表示し、結論・期限・TODO をモック抽出します。",
    inputHint: "例: 決まったこと、宿題、次回までの期限を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "property-viewing-memo",
    title: "物件内見メモ自動整理",
    tier: "track3",
    demoSlug: "property-viewing-memo",
    shortDescription:
      "内見の音声メモから、Live Sync で要点・期限・TODO をモック整理します。",
    inputHint: "例: 客の反応、気になる点、次のアクションを話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "morning-meeting-daily-draft",
    title: "朝礼メモから日報ドラフト",
    tier: "track3",
    demoSlug: "morning-meeting-daily-draft",
    shortDescription:
      "朝礼の音声を Live Sync で要約し、結論・期限・TODO のモックを表示します。",
    inputHint: "例: 安全連絡、本日の予定、共有事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "retail-floor-voice-handoff",
    title: "店頭接客ボイスメモの共有整理",
    tier: "track3",
    demoSlug: "retail-floor-voice-handoff",
    shortDescription:
      "接客メモを Live Sync の申し送りモードで整理し、次番・本部向けのモックを表示します。",
    inputHint: "例: お客様の要望、在庫、引き継ぎたいことを話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "handover",
  },
  {
    slug: "site-survey-voice-memo",
    title: "現地調査ボイスから調査メモ",
    tier: "track3",
    demoSlug: "site-survey-voice-memo",
    shortDescription:
      "現地の口述を Live Sync で要約し、結論・期限・TODO をモック表示します。",
    inputHint: "例: 状況、寸法の感触、次に必要なことを話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "parent-meeting-voice-summary",
    title: "面談ボイスから記録サマリ",
    tier: "track3",
    demoSlug: "parent-meeting-voice-summary",
    shortDescription:
      "面談の音声を Live Sync で要約し、結論・期限・TODO のモックを並べます。",
    inputHint: "例: 話した内容、合意、フォロー事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "voicemail-followup-reply-draft",
    title: "留守電メモから折り返し返信草案",
    tier: "track3",
    demoSlug: "voicemail-followup-reply-draft",
    shortDescription:
      "留守電の内容を Live Sync の言い換えモードで丁寧語案に逐次近づけます。",
    inputHint: "例: 相手の用件、折り返しの希望、聞き取りメモを話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "rewrite",
  },
  {
    slug: "care-shift-voice-handover",
    title: "介護シフト申し送りボイス要約",
    tier: "track3",
    demoSlug: "care-shift-voice-handover",
    shortDescription:
      "申し送り音声を Live Sync の申し送りモードで整理し、注意・次アクションをモック表示します。",
    inputHint: "例: バイタル、服薬、家族連絡の有無を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "handover",
  },
  {
    slug: "cs-qbr-voice-summary",
    title: "定例レビューのボイスからサマリ",
    tier: "track3",
    demoSlug: "cs-qbr-voice-summary",
    shortDescription:
      "定例の口述を Live Sync で要約し、結論・期限・TODO をモック化します。",
    inputHint: "例: KPI、課題、次の打ち手を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "event-brief-voice-to-quote-memo",
    title: "打ち合わせボイスから見積前提メモ",
    tier: "track3",
    demoSlug: "event-brief-voice-to-quote-memo",
    shortDescription:
      "打ち合わせ音声を Live Sync で要約し、結論・期限・TODO のモックを出します。",
    inputHint: "例: 要件、スケジュール感、未決事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "call-monitor-feedback-coaching",
    title: "モニタリングメモからフィードバック文",
    tier: "track3",
    demoSlug: "call-monitor-feedback-coaching",
    shortDescription:
      "モニタリングの所感を Live Sync の言い換えモードで整理し、丁寧なフィードバック案に近づけます。",
    inputHint: "例: 良かった点、改善点、トーンの印象を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "rewrite",
  },
  {
    slug: "clinic-reception-voice-handover",
    title: "受付シフトの申し送りボイス要約",
    tier: "track3",
    demoSlug: "clinic-reception-voice-handover",
    shortDescription:
      "受付の申し送りを Live Sync の申し送りモードで表示し、注意・次アクションをモックします。",
    inputHint: "例: 予約の変更、問い合わせ、翌朝の確認事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "handover",
  },
  {
    slug: "pet-hotel-handover-voice-memo",
    title: "ペット預かり引き渡しボイスメモ",
    tier: "track3",
    demoSlug: "pet-hotel-handover-voice-memo",
    shortDescription:
      "お迎え時の音声を Live Sync の申し送りモードで整理します。",
    inputHint: "例: 様子、給餌、次回の希望を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "handover",
  },
  {
    slug: "gallery-exhibit-voice-script-draft",
    title: "展示解説のナレーション原稿たたき台",
    tier: "track3",
    demoSlug: "gallery-exhibit-voice-script-draft",
    shortDescription:
      "解説の口述を Live Sync の言い換えモードで読みやすい原稿風に整えます。",
    inputHint: "例: 展示の要点、比喩、注意事項を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "rewrite",
  },
  {
    slug: "grocery-freshness-voice-waste-log",
    title: "鮮度管理のボイスから廃棄ログ草案",
    tier: "track3",
    demoSlug: "grocery-freshness-voice-waste-log",
    shortDescription:
      "口述メモを Live Sync で要約し、結論・期限・TODO をモック表示します。",
    inputHint: "例: 品目、数量、廃棄理由を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
  {
    slug: "venue-loadin-voice-timeline",
    title: "搬入立ち合いボイスからタイムライン",
    tier: "track3",
    demoSlug: "venue-loadin-voice-timeline",
    shortDescription:
      "立ち会いの音声を Live Sync で要約し、結論・期限・TODO をモック化します。",
    inputHint: "例: 時刻、トラブル、次の連絡先を話してください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "digest",
  },
];
