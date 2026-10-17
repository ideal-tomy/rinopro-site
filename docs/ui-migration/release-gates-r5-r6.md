# 公開直前ゲート R5 / R6 記録

**実施日:** 2026-10-17  
**本番 URL:** `https://rinopro-site.vercel.app`（`main` デプロイ。UI 移行ブランチ未マージ時は旧ビルドの可能性あり）  
**手順正本:** [design-signoff-checklist.md](design-signoff-checklist.md) §6

---

## R5 — 問い合わせテスト送信

| 項目 | 結果 |
|------|------|
| `/contact` フォーム表示 | OK（本番ブラウザ確認・必須項目・送信ボタン） |
| `POST /api/contact`（JSON） | **502** `send_failed` — 「メールの送信に失敗しました。」 |
| 初回 curl（エスケープ不良） | 500 Internal Server Error（再現用・入力不正） |

**判定:** フォーム〜API バリデーションは通るが、**本番メール送信（Resend）が失敗**。公開前に Vercel の `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_ADMIN_EMAIL` を再確認し、Resend ダッシュボードで送信ログを見る。

**テスト payload（再実行用）:**

```json
{
  "name": "[R5 UI移行テスト] 自動確認",
  "email": "noreply@example.com",
  "company": "AXEON QA",
  "message": "【R5 デザイン判断ゲート】問い合わせ API の本番テスト送信です。無視して問題ありません。"
}
```

成功時の期待レスポンス: `200` + `{ "success": true, "mode": "sent" }`

---

## R6 — Lighthouse（Performance / Accessibility）

**条件:** 本番 URL・headless Chrome・`--disable-extensions`（[benchmark-protocol.md](../archive/lighthouse/benchmark-protocol.md) 準拠・1 回ずつ）

| URL | Performance | Accessibility | LCP |
|-----|:-----------:|:-------------:|-----|
| `/` | 38 | **100** | 9.6 s |
| `/contact` | 58 | **100** | 3.9 s |
| `/services` | 38 | **100** | 13.6 s |

**生データ:** `docs/ui-migration/lighthouse-r6-{home,contact,services}.json`

**メモ:**

- **Accessibility は 3 URL とも 100**（UI 移行の a11y 目標は満たしている想定）。
- **Performance は低め**（特に `/`・`/services` の LCP）。画像・JS 量・サードパーティは別途改善バックログ（P2 相当）でよい。デプロイ後に `fix/p1-design-signoff` マージ後、再計測推奨。

---

## デプロイ後の再確認チェック

- [ ] R5 が `success: true` になるまで Resend 設定を直し、同 payload で再 POST
- [ ] タブ title の `| AXEON | AXEON` が解消されているか（P1 はブランチ側で修正済み）
- [ ] `/sitemap.xml` に `/lp/kaigo-care-dx` が含まれるか（ブランチマージ後）
