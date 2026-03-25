# コンシェルジュ会話スコープ（sessionId）

## 目的

`useChat` の `id`（実装では `chatSessionId`）が **会話履歴の境界**になる。**同じ id 同士だけ**メッセージが共有される。  
ユーザーの「このページのボット」「カードから開いた相談」と体感を揃えるため、導線ごとに id 規則を固定する。

**実装の単一ソース**: [`src/lib/chat/concierge-session-id.ts`](../src/lib/chat/concierge-session-id.ts) の `buildConciergeChatSessionId`。

## 詳細見積もりとの関係

トップの選択式フローから **詳細見積もり**へ渡す文脈は、チャット session とは別経路（[`src/lib/chat/estimate-handoff.ts`](../src/lib/chat/estimate-handoff.ts) のペイロード／URL／sessionStorage）で行う。  
会話スコープをページ単位に分離しても、見積の引き継ぎはこの仕組みで維持できる。

## `/demo/list` とグローバルコンシェルジュ

- **ウィザード本体**は [`ChatContainer`](../src/components/chat/ChatContainer.tsx) 内の `DemoListConciergeFlow` のみ（一覧ページに埋め込んだ二重モーダルは廃止）。
- **一覧上の条件チップ・「あなた向けの提案」**は [`ConciergeChatProvider`](../src/components/chat/concierge-chat-context.tsx) の `demoListWizardSnapshot` と同期する（ウィザード完了時に `setDemoListWizardSnapshot`、リセット時に `null`）。
- **「コンシェルジュを開く」**は `requestOpenDemoListPageConcierge()` でシーケンスを進め、`ChatContainer` が `conciergeSurface === "page"` でポップアップを開く（自動オープン・FAB→このページについてと同じ表面）。

## スコープ表

| 優先順（実装と同順） | 条件 | sessionId パターン | 主な UI / 状態 |
|---------------------|------|-------------------|----------------|
| 1 | `surface === "pick"` | `concierge-pick-{slug}` | FAB 直後・× 閉じ後。`slug = pathname` から算出（`/about` → `about`、トップ → `root`） |
| 2 | `surface === "global"` | `concierge-home` | 「サイト全体のガイド」選択後（主にトップ）。`HomeConciergeFlow` |
| 3 | `pathname === "/services"` かつカード | `concierge-services-card-development` / `concierge-services-card-consulting` | `entrySource` が `services-card-*` |
| 4 | `pathname === "/services"`（上記以外） | `concierge-services-hub` | FAB→このページについて→開発/コンサル確定後の hub 会話 |
| 5 | `pathname` が `/demo` で開始 | `concierge-demo-{path を _ 化}` | デモ一覧・各デモページの page 表面 |
| 6 | 上記以外 | `concierge-path-{slug}` | 例: `/flow` → `concierge-path-flow`、`/services/development` → `concierge-path-services-development` |

### メモ

- **`mode`（development / consulting / default）は API の system 用**。sessionId には **使わない**（pathname でスコープし、広域の dev/consult 共有を避ける）。
- **`/services` は厳密一致**。`/services/development` は hub ではなく `concierge-path-services-development`。
- 初回マウントの `useState` フォールバックは `CONCIERGE_CHAT_SESSION_INITIAL`（`/` + pick と同じ `concierge-pick-root`）。直後の `useEffect` で `provisionalId` に同期される。

## 変更時

`buildConciergeChatSessionId` の分岐を変えたら **本表を同じ PR で更新**すること。
