# Live Sync × audio_text マッピング

最終更新: 2026-03-26

`inputType: audio_text` のうち、**配送インシデント**（`driver-voice-incident-draft`）は専用 UI のため Live Sync 対象外。それ以外は [`src/lib/experience/live-sync-audio-text-prototypes.ts`](../src/lib/experience/live-sync-audio-text-prototypes.ts) で `liveSyncMode` を定義し、[`ExperiencePrototypeRunner`](../src/components/experience/ExperiencePrototypeRunner.tsx) が [`LiveSyncTranslationExperience`](../src/components/experience/prototypes/LiveSyncTranslationExperience.tsx) にルーティングする。

| slug | Live Sync モード | 右ペインの主出力 |
|------|------------------|------------------|
| `live-sync-voice-translation` | `translation` | モック翻訳（EN/KO/ZH） |
| `construction-shadow-foreman` | `digest` | 結論・期限・TODO |
| `meeting-minutes-auto` | `digest` | 結論・期限・TODO |
| `property-viewing-memo` | `digest` | 結論・期限・TODO |
| `morning-meeting-daily-draft` | `digest` | 結論・期限・TODO |
| `site-survey-voice-memo` | `digest` | 結論・期限・TODO |
| `parent-meeting-voice-summary` | `digest` | 結論・期限・TODO |
| `cs-qbr-voice-summary` | `digest` | 結論・期限・TODO |
| `event-brief-voice-to-quote-memo` | `digest` | 結論・期限・TODO |
| `grocery-freshness-voice-waste-log` | `digest` | 結論・期限・TODO |
| `venue-loadin-voice-timeline` | `digest` | 結論・期限・TODO |
| `voicemail-followup-reply-draft` | `rewrite` | 丁寧語・言い換え |
| `call-monitor-feedback-coaching` | `rewrite` | 丁寧語・言い換え |
| `gallery-exhibit-voice-script-draft` | `rewrite` | 丁寧語・言い換え |
| `retail-floor-voice-handoff` | `handover` | 申し送り・注意・次アクション |
| `care-shift-voice-handover` | `handover` | 申し送り・注意・次アクション |
| `clinic-reception-voice-handover` | `handover` | 申し送り・注意・次アクション |
| `pet-hotel-handover-voice-memo` | `handover` | 申し送り・注意・次アクション |

## 参照

- 在庫・カタログ: [`docs/demo-mock-inventory.md`](demo-mock-inventory.md)
- モック実装: [`src/lib/experience/live-sync-modes-mock.ts`](../src/lib/experience/live-sync-modes-mock.ts)
