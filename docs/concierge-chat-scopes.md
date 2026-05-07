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
