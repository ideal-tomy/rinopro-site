# コード健全性・リファクタ候補調査（2026-04-02）

## 目的

- **単一責任の原則から大きく逸脱している**と考えられる箇所を洗い出す。
- **将来のバグや認識ズレの温床**になりやすい箇所を明示する。
- 実行は本書の提案のみでは行わない（優先度付きの調査メモ）。

## 調査方法

- `src` 配下の TypeScript / TSX を行数で概観し、**800 行超**または**複数ドメインが同居**しているファイルを重点確認。
- 既存ドキュメント（`concierge-spec-index.md`、`requirements-docs-refactor-plan.md`）で既知の論点と突合。

---

## サマリ（優先度の目安）

| 優先 | 対象 | 主な懸念 |
|------|------|----------|
| 高 | `src/components/chat/ChatContainer.tsx` | UI・セッション・計測・自動オープン・経路別例外が1コンポーネントに集中。変更の波及が読みにくい。 |
| 高 | `src/components/chat/HomeConciergeFlow.tsx` | トップ分岐の状態機械＋画面＋モーションが一体。`concierge-flow.ts` との境界はあるがファイルが肥大化。 |
| 中 | `src/lib/chat/concierge-flow.ts` | 分岐定義・概算生成・文言が1モジュール。ドメインとしてはまとまっているが行数・責務が増え続けるとドキュメント同期コストが上がる。 |
| 中 | `src/lib/chat/estimate-handoff.ts` | ペイロード v1 / v2 / レガシーの解釈・URL・sessionStorage が同居。**解読ミスがサイレントバグ**になりやすい。 |
| 中 | `src/lib/demo/intelligent-concierge.ts` | スコアリング・タクソノミ・型・オプション定義が同居。デモ追加のたびに触るとテストなしだと退行リスク。 |
| 中 | `src/components/estimate/EstimateDetailedHearingWizard.tsx` | 見積ヒアリング UI の塊。`estimate-core` との分離は進んでいるが、コンポーネント単体が依然として巨大。 |
| 低〜中 | `src/lib/content/site-copy.ts` | コピー集約は良いが**単一ファイルが肥大**し、変更の差分レビューが重い。 |
| 低〜中 | `src/components/experience/prototypes/*.tsx`（複数） | 体験デモごとに 400〜800 行規模。**パターンは似ているが共通化されていない**と、同種バグの重複が起きやすい。 |

---

## 詳細

### 1. `ChatContainer.tsx`（約 1000+ 行）

**観察**

- 単一の `export function ChatContainer()` に、おおぼく以下が同居している。
  - `useChat`（transport・`conciergeSignalsRef`・session id）
  - パス連動（`pathname` / `useResolvedConciergePath`）と `mode` の同期
  - 自動オープン・`sessionStorage`・抑制フラグ
  - KPI（`emitConciergeKpi`）と遅延 CTA（`getConciergeCtaDelayMs`）
  - `/demo`・`/demo/list` 向けのおすすめ取得・レース回避
  - **`mainContent` の大型分岐**（`HomeConciergeFlow` / `ServicesConciergeFlow` / `DemoListConciergeFlow` / エントリピッカー等）
- フックの使用回数だけでも **50 回超**（`useState` / `useEffect` / `useMemo` 等の合計）に達しており、**状態の組み合わせ爆発**が起きやすい構造。

**単一責任からの逸脱**

- 「チャットシェル」だけでなく、**サイト横断のオーケストレーション**に近い。
- プロジェクトルール上も「コンシェルジュの会話スコープ変更は doc 同期」とあるが、**コード上の境界はこの1ファイルに集約**されている。

**将来のエラー温床**

- **`pathname` × `conciergeSurface` × `messages.length` × `mode`** の組み合わせで表示が変わる。1 経路の修正が別経路の初期表示・リセット・計測を壊しやすい（既に `requirements-docs-refactor-plan.md` で論点化済み）。
- 新しい「ページ専用フロー」を足すたびに `mainContent` 分岐と `useEffect` が増え、**レビュー可能な複雑度を超えやすい**。

**リファクタの方向性（案）**

- **表示分岐**を `getConciergeMainViewModel({ ... })` のような純粋関数＋小さなサブコンポーネントへ。
- **自動オープン・sessionStorage** を専用フック（例: `useConciergeAutoOpen`）へ。
- **Transport 構築**を `useConciergeChatTransport` へ分離。

---

### 2. `HomeConciergeFlow.tsx`（約 1000+ 行）

**観察**

- トップの業種ゲート・ルート選択・各トラックの質問ステップ・完了 UI までを**1 コンポーネント群**で保持。
- `AnimatePresence` によるフレーム切替と、`concierge-flow.ts` への依存が混在。

**単一責任からの逸脱**

- 「フロー制御」と「各ステップの見た目」が分離しきれていない（ステップごとにコンポーネント化されている部分もあるが、親が依然として巨大）。

**将来のエラー温床**

- ステップ追加・文言変更のたびに**同じファイル内の複数 `kind` 分岐**を触る必要があり、**フレームキー・戻る挙動・アニメーション**とセットで退行しやすい。

**リファクタの方向性（案）**

- ステップ単位で `frames/` サブディレクトリに分割（既存の `ConciergeIndustryStep` パターンを拡張）。
- 状態遷移を `useReducer` または明示的な `FlowState` 型＋遷移関数に集約し、**UI は view に限定**。

---

### 3. `concierge-flow.ts`（約 540+ 行）

**観察**

- 定数（`ROOT_CHOICES`、各 `FlowStepDef`）と、**概算ブロック生成・テキスト組み立て**が同一ファイル。

**単一責任からの逸脱（程度は中）**

- データ定義と生成ロジックの同居は**ドメインサービスとしては自然**だが、行数が増えると `分岐別解答マップ.md` との**二重管理感**が強まる。

**将来のエラー温床**

- 文言・金額レンジ・分岐 ID の変更が**同一 PR で表・型・本文**に波及し、取りこぼしが起きやすい（索引の同期表で緩和はされている）。

**リファクタの方向性（案）**

- `flow-definitions.ts`（定数のみ）と `flow-builders.ts`（生成のみ）に分割するか、**生成のみテストを追加**して退行を防ぐ。

---

### 4. `estimate-handoff.ts`（約 390+ 行）

**観察**

- `ChatHandoffPayload` の v1 / v2 / レガシー、`encode` / `decode`、URL・問い合わせ連携、業種バンドル等が**1 モジュール**に集約。

**単一責任からの逸脱**

- 「シリアライズ」「後方互換」「ルーティング方針」が同居。

**将来のエラー温床**

- **デコードの分岐漏れ**（フィールド追加・型ゆるみ）は、実行時に静かにフォールバックしたり、問い合わせ先で情報欠落したりしやすい。
- `estimateSnapshotSchema.safeParse` 等はあるが、**全体の組み合わせテスト**がないと境界値で壊れやすい。

**リファクタの方向性（案）**

- バージョンごとに `decodeV1` / `decodeV2` をファイル分割し、**入口の `decodeChatHandoff` だけが集約**する形にする。
- ユニットテストで **レガシー URL サンプル**を固定フィクスチャ化。

---

### 5. `intelligent-concierge.ts`（約 470+ 行）

**観察**

- デモ推薦のスコアリング、`CONCIERGE_DOMAIN_OPTIONS` 等の**巨大なデータ**、型定義が同居。

**将来のエラー温床**

- スコア定数・同点タイブレーク・体験レジストリ連携が**1 箇所のロジック**に依存。ルール変更時に**意図しない順位入れ替え**が起きやすい。

**リファクタの方向性（案）**

- `score-demo-candidates.ts` と `concierge-domain-options.ts` に分割。
- 重要な分岐は**表形式のテストデータ**でスナップショット検証。

---

### 6. `EstimateDetailedHearingWizard.tsx`（約 810+ 行）

**観察**

- 見積ウィザードの画面・入力・バリデーション呼び出し・モーションが**1 ファイル**に集中。

**将来のエラー温床**

- `flushSync` や `AnimatePresence` を含むため、**React の更新タイミング**に依存するバグが入りやすい（既存コードは意図的だが変更コストが高い）。

**リファクタの方向性（案）**

- `motion-template-extraction.md` の StepCrossfade 抽出と同様、**アニメブロックだけ**子コンポーネント化（既に計画書あり）。

---

### 7. 体験プロトタイプ（`experience/prototypes/*`）

**観察**

- 複数ファイルが **400〜800 行**規模。業種デモごとに**似た状態管理・シェル利用**が繰り返されている可能性が高い。

**将来のエラー温床**

- 共通バグ修正（アクセシビリティ・`prefers-reduced-motion`・エラーハンドリング）が**ファイル横断で漏れやすい**。

**リファクタの方向性（案）**

- 共通部分を `hooks/` または `ExperiencePrototypeShell` に寄せる（規模が大きいので別イテレーション向き）。

---

### 8. `site-copy.ts`（約 670+ 行）

**観察**

- サイト全体のコピーが**単一モジュール**に集約。

**単一責任からの逸脱**

- 「1 ファイル 1 責務」というより**メンテナンス性**の問題（差分が巨大になりやすい）。

---

## 意図的に薄く保てている箇所（対照）

- **`src/app/api/chat/route.ts`**（約 100 行）  
  - レート制限・パース・シニア推論・プロンプト組み立て・ストリーム返却が**一直線**で読みやすい。  
  - 複雑さは `concierge-prompts.ts` / `concierge-senior.ts` に押し出されている。

---

## 実施状況（2026-04-02 リファクタ実行計画に基づく）

**完了（短期の中心）**

- `ChatContainer`: [`use-concierge-chat-transport.ts`](../src/hooks/use-concierge-chat-transport.ts)、[`use-concierge-container-effects.ts`](../src/hooks/use-concierge-container-effects.ts) へ副作用・transport を抽出。
- `mainContent` 相当: [`concierge-panel-derived-state.ts`](../src/lib/chat/concierge-panel-derived-state.ts) で分岐とレイアウト用フラグを純粋関数化。
- `concierge-flow`: 定数・型を [`concierge-flow-definitions.ts`](../src/lib/chat/concierge-flow-definitions.ts) に分離（[`concierge-flow.ts`](../src/lib/chat/concierge-flow.ts) は生成ロジック＋再 export）。
- `HomeConciergeFlow`: 型を [`home-concierge-flow-types.ts`](../src/components/chat/home-concierge-flow-types.ts) に分離。
- 回帰用: [`docs/refactor-regression-checklist.md`](./refactor-regression-checklist.md)、Git タグ `refactor/chat-baseline-2026-04-02`、`npm run verify:concierge-panel`（[`scripts/verify-concierge-panel-derived.ts`](../scripts/verify-concierge-panel-derived.ts)）。

**未着手・次段**

- `estimate-handoff` の decode をバージョン別モジュール化＋専用 verify / テスト。
- `intelligent-concierge` のスコアリングとドメイン定義のファイル分割。
- 体験プロトタイプの共通シェル化（長期）。

変更時は `docs/concierge-spec-index.md` の同期表と、`docs/requirements-docs-refactor-plan.md` の受け入れ条件と突合すること。

---

*本ドキュメントは調査時点のスナップショットである。行数はツール計測の概算。*
