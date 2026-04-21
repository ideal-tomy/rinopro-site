# コンシェルジュ KPI イベント

ブラウザで `window` に `concierge-kpi` カスタムイベントを送出します。GTM 等で `addEventListener('concierge-kpi', …)` または dataLayer 連携で購読可能。

| イベント名 (`detail.name`) | 内容 |
|-----------------------------|------|
| `answer_complete` | アシスタント回答のストリーミング完了（`textLength`, `messageId`） |
| `cta_visible` | チャット下部「次の一歩」CTA 帯の遅延表示（`delayMs`） |
| `cta_click` | CTA リンク／ボタン押下（`href`, `ctaKind`） |
| `followup_message` | 2通目以降のユーザー送信（`turn`） |
| `wizard_reset` | モーダル内「選択式に戻る」相当（`ctaKind`: `home_global_wizard` / `demo_list_wizard`） |
| `fab_nudge_visible` | 右下「AIに相談」FAB直上の先回り吹き出し（`ConciergeFabNudge`）を表示。`nudgePageId` に `home` / `demo_hub` / `services` 等 |
| `fab_nudge_dismiss` | 「閉じる」で非表示。当該 `nudgePageId` では `localStorage`（`axeon:fab-nudge:v2`）により再表示しない（他ページは別） |

実装: [`src/lib/chat/concierge-analytics.ts`](../src/lib/chat/concierge-analytics.ts)
