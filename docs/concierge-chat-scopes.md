# コンシェルジュ会話スコープ（sessionId）

実装の単一ソースは `src/lib/chat/concierge-session-id.ts` の `buildConciergeChatSessionId`。

## pathname 由来の sessionId（surface が `page` のとき）

- **`/demo/*` および `/experience/*`**: `concierge-demo-{pathname を `/` を `_` に置換したもの}`  
  例: `/experience/internal-knowledge-share-bot` → `concierge-demo-_experience_internal-knowledge-share-bot`

## その他の surface

- **`pick`**: `concierge-pick-{pathname のスラッグ化}`
- **`global`** で pathname が `/demo` または `/experience` で始まる場合: `concierge-global-demo-hub`
- **`global`** で上記以外: `concierge-home`
- **`page`** で `/services` など上記以外: `concierge-path-{pathname のスラッグ化}`（実装参照）

体験ハブは **`/demo` を `/experience` に統合**しているため、両プレフィックスは同一ポリシーで扱う。

## 問い合わせハンドオフ（2026-05 追記）

- **正規経路**: コンシェルジュ（および詳細見積終端）から `/contact` へ進むときは、**テキスト化 prefill**（クエリ `?prefill=`、長文時は sessionStorage + `?prefill=session`）を用いる。
- **旧 `?handoff=`（構造化ペイロード）**: 互換のため当面 **残置**。新規実装では prefill を優先する。
