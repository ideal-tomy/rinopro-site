# Vercel本番設定確認シート

目的: デプロイ前に「設定漏れでページが変化/停止するリスク」を最小化する。

## 1. 環境変数チェック

`.env.example` と実装参照を基準に、本番プロジェクトへ設定する。

### 必須

- [ ] `NEXT_PUBLIC_SITE_URL`
- [x] `GOOGLE_GENERATIVE_AI_API_KEY`
- [x] `SANITY_PROJECT_ID` または `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [x] `SANITY_DATASET` または `NEXT_PUBLIC_SANITY_DATASET`

### 機能利用時に必須

- [x] `DEEPGRAM_API_KEY`（音声入力を使う場合）
- [ ] `NEXT_PUBLIC_ESTIMATE_WAIT_VIDEO_URL`（待機動画を出す場合）
- [ ] `SANITY_API_TOKEN`（シード/更新系スクリプト実行時）

### 未使用でも確認

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## 2. Next.js / ルーティング設定確認

参照: `next.config.ts`

- [ ] リダイレクト `/cases -> /experience` が意図どおり
- [ ] CSP を現行値で凍結（今回は挙動変更しない）
- [ ] `images.remotePatterns` に `cdn.sanity.io` が含まれる

## 3. 既知警告の扱い

今回の `npm run build` で以下警告を確認:

- Next.js が workspace root を `C:\\Users\\ryoji` と推定
- 追加ロックファイルとして `C:\\Users\\ryoji\\demo\\rinopro\\package-lock.json` を検出

判定:

- [ ] 公開前に運用上「許容」か「対応」かを合意
- [ ] 対応する場合、`turbopack.root` 設定またはロックファイル整理方針を決定

## 4. API系の設定依存確認

- [ ] `/api/chat`（Gemini key）
- [ ] `/api/demo/run`（Gemini key）
- [ ] `/api/estimate-detailed`（Gemini key）
- [ ] `/api/inquiry-brief`（Gemini key）
- [ ] `/api/contact`（ログ運用）

## 5. 判定記録

- 確認日時:
- 確認者:
- 未設定項目:
- 公開可否: `GO` / `NO-GO`

## 6. ローカル事前確認メモ（2026-04-17）

機密値は表示せず、有無のみ確認。

- `NEXT_PUBLIC_SITE_URL`: missing
- `GOOGLE_GENERATIVE_AI_API_KEY`: set
- `SANITY_PROJECT_ID`: set
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: set
- `SANITY_DATASET`: set
- `NEXT_PUBLIC_SANITY_DATASET`: set
- `DEEPGRAM_API_KEY`: missing

備考:

- `NEXT_PUBLIC_SITE_URL` は未設定だとデフォルトURLを参照するため、本番前に設定推奨。
- 音声入力を本番で有効化する場合は `DEEPGRAM_API_KEY` の設定が必要。

## 7. 本番確認メモ（2026-04-17）

- Vercel環境変数画面で `GOOGLE_GENERATIVE_AI_API_KEY` / `SANITY_PROJECT_ID` / `SANITY_DATASET` / `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` を確認済み。
- 本番デプロイ後に音声入力が動作しているため、Deepgram系キーは本番実行条件を満たしていると判定。
- `NEXT_PUBLIC_ESTIMATE_WAIT_VIDEO_URL` は機能利用時のみ必要（未利用なら未設定で問題なし）。
- `SANITY_API_TOKEN` はシード/更新系スクリプト実行時のみ必要（通常のサイト表示には不要）。
