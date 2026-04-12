# コンシェルジュ会話スコープ（sessionId）

## 目的

`useChat` の `id`（実装では `chatSessionId`）が **会話履歴の境界**になる。**同じ id 同士だけ**メッセージが共有される。  
ユーザーの「このページのボット」「カードから開いた相談」と体感を揃えるため、導線ごとに id 規則を固定する。

**実装の単一ソース**: [`src/lib/chat/concierge-session-id.ts`](../src/lib/chat/concierge-session-id.ts) の `buildConciergeChatSessionId`。

## 詳細見積もりとの関係

トップの選択式フローから **詳細見積もり**へ渡す文脈は、チャット session とは別経路（[`src/lib/chat/estimate-handoff.ts`](../src/lib/chat/estimate-handoff.ts) のペイロード／URL／sessionStorage）で行う。  
会話スコープをページ単位に分離しても、見積の引き継ぎはこの仕組みで維持できる。

`ConciergeEstimateContextPayload`（`?ctx=`）には任意で **`industryBundle`**（第1層 domainId・任意の第2層・補足1行）を載せられる。詳細見積側では **業種ステップをスキップ**し、`answers` の「業種」に反映する。契約の単一ソースは [`docs/industry-estimate-handoff-contract.md`](industry-estimate-handoff-contract.md)。

## 自動オープン方針

- 現在は **ページ到達だけでは自動オープンしない**。トップ・`/services`・`/demo/list` を含め、常設の FAB やページ内ボタンからの **明示操作** を主導線とする。
- トップは [`HeroSection`](../src/components/home/HeroSection.tsx) の「相談から始める」と右下 FAB を優先する。
- `/services` はカード内の **「チャットで相談する」** を優先し、`/demo/list` は一覧探索を主にしつつ **「条件から相談する」** を補助導線とする。
- 将来、自動オープンを再導入する場合は **ページ起点ではなく行動起点**（一定スクロール、迷い行動、URL パラメータ、明示ボタンなど）のポリシーとして設計する。

## `/demo/list` とグローバルコンシェルジュ

- **ウィザード本体**は [`ChatContainer`](../src/components/chat/ChatContainer.tsx) 内の `DemoListConciergeFlow` のみ（一覧ページに埋め込んだ二重モーダルは廃止）。
- **一覧上の条件チップ・「あなた向けの提案」**は [`ConciergeChatProvider`](../src/components/chat/concierge-chat-context.tsx) の `demoListWizardSnapshot` と同期する（ウィザード完了時に `setDemoListWizardSnapshot`、リセット時に `null`）。
- **「コンシェルジュを開く」**は `requestOpenDemoListPageConcierge()` でシーケンスを進め、`ChatContainer` が `conciergeSurface === "page"` でポップアップを開く（自動オープン・FAB→このページについてと同じ表面）。
- モーダル内の **「選択式ガイドに戻る」** / **「demoの条件選択に戻る」** は `chatSessionId` を変えず `messages` を空にするだけ（同一 session スコープ内でのやり直し）。

## 返答ルールの優先順位

- 返答はまず **現在ページの文脈** を優先する。
- そのうえでユーザー意図を `知りたい` / `比較したい` / `相談したい` / `料金感を知りたい` に寄せて解釈する。
- **次の一歩は1つだけ強く出す** のが基本。必要な場合でも補助導線は最小限にする。
- 明示入口が持つ初期意図は `conciergeSignals.entryIntent` で `/api/chat` に渡せる。現状はトップの「相談から始める」と `demo/list` の条件相談導線などで利用する。
- ホームの固定フローは UI ボタンで複数の選択肢を見せられるが、本文側の「次の一歩」は1本に絞る。

## スコープ表

| 優先順（実装と同順） | 条件 | sessionId パターン | 主な UI / 状態 |
|---------------------|------|-------------------|----------------|
| 1 | `surface === "pick"` | `concierge-pick-{slug}` | FAB 直後・× 閉じ後。`slug = pathname` から算出（`/about` → `about`、トップ → `root`） |
| 2 | `surface === "global"` かつ `pathname` が `/demo` または `/experience` で開始 | `concierge-global-demo-hub` | デモ・体験ハブ上で「サイト全体」を選んだ会話（トップの `concierge-home` と分離） |
| 2a | `surface === "global"`（上記以外） | `concierge-home` | 「サイト全体のガイド」選択後（主にトップ）。`HomeConciergeFlow` |
| 3 | `pathname === "/services"` かつカード | `concierge-services-card-development` / `concierge-services-card-consulting` | `entrySource` が `services-card-*` |
| 4 | `pathname === "/services"`（上記以外） | `concierge-services-hub` | FAB→このページについて→開発/コンサル確定後の hub 会話 |
| 4a | `pathname === "/flow"` | `concierge-path-flow` | 開発ページ直訪問。mode は `development` に固定され、2段階ウィザードが表示される（`showServiceCardStartFlow`） |
| 4b | `pathname === "/consulting"` | `concierge-path-consulting` | コンサルページ直訪問。mode は `consulting` に固定され、2段階ウィザードが表示される |
| 5 | `pathname` が `/demo` で開始 | `concierge-demo-{path を _ 化}` | デモ一覧・各デモページの page 表面 |
| 6 | 上記以外 | `concierge-path-{slug}` | 例: `/services/development` → `concierge-path-services-development` |

### メモ

- **`mode`（development / consulting / default）は API の system 用**。sessionId には **使わない**（pathname でスコープし、広域の dev/consult 共有を避ける）。
- **`/services` は厳密一致**。`/services/development` は hub ではなく `concierge-path-services-development`。
- `/flow`・`/consulting` は mode が useState の useEffect で自動設定されるため、`servicesIntroComplete` は `true` に初期化される（ウィザード選択不要でそのまま入れる状態）。
- 初回マウントの `useState` フォールバックは `CONCIERGE_CHAT_SESSION_INITIAL`（`/` + pick と同じ `concierge-pick-root`）。直後の `useEffect` で `provisionalId` に同期される。

## 変更時

`buildConciergeChatSessionId` の分岐を変えたら **本表を同じ PR で更新**すること。
