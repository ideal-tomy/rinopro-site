# AIコンシェルジュ仕様 — ドキュメント索引（正の入口）

チャット・コンシェルジュに関する**読む順序**と**変更時に同期するファイル**をここに集約する。  
要件の「なぜ」と実装の「どうなっているか」が分断しないよう、まず本ファイルから辿る。

## 読む順序（推奨）

1. [`要件定義.md`](./要件定義.md) §1・§2 … サイト全体のコンセプト・ページ役割  
2. [`要件定義.md`](./要件定義.md) §3 … チャットの**プロダクト上の約束**（要約・受け入れ条件）と本索引への入口  
3. **トップの選択式フロー**  
   - [`top-chat-branching-design.md`](./top-chat-branching-design.md) … 分岐・CTA・操作設計  
   - [`分岐別解答マップ.md`](./分岐別解答マップ.md) … 生成文言・出力順・結果 UI 導線・`concierge-flow.ts` 対応表  
4. **チャット刷新の親計画**  
   - [`チャット刷新実行計画.md`](./チャット刷新実行計画.md) … フェーズ単位で PLAN 作成 → 実行するための大枠の実行計画  
   - [`freeform音声入力パイプラインPLAN.md`](./freeform音声入力パイプラインPLAN.md) … `Phase 4` の実装順・責務境界・受け入れ条件  
5. **チャット横断の共通設計（facts / 担当範囲）**  
   - [`チャット共通facts一覧.md`](./チャット共通facts一覧.md) … 共通 facts の canonical 候補と、自由記述の扱い  
   - [`チャット質問棚卸し表.md`](./チャット質問棚卸し表.md) … 各チャットが担当する質問・出口・重複ポイント  
6. **問い合わせの役割・送信ゲート方針**  
   - [`問い合わせポリシー.md`](./問い合わせポリシー.md) … 誰を問い合わせへ通し、誰を demo / 見積へ流すかの基準  
   - [`問い合わせ改善PLAN.md`](./問い合わせ改善PLAN.md) … 入口・送信ゲート・返信運用へ落とす段階計画  
7. **会話の境界（session）** … [`concierge-chat-scopes.md`](./concierge-chat-scopes.md)（`concierge-session-id.ts` と同 PR で更新）  
8. **API 応答モード（シニア等）** … [`concierge-senior-mode.md`](./concierge-senior-mode.md)（`concierge-senior.ts` / `route.ts` と同 PR で更新）  
9. **リファクタ計画（ドキュメント整理のロードマップ）** … [`requirements-docs-refactor-plan.md`](./requirements-docs-refactor-plan.md)

## 変更時の同期ルール（最低限）

| 変更したもの | 同じ PR / 同じ作業で更新するドキュメント |
|--------------|------------------------------------------|
| `buildConciergeChatSessionId` / 会話スコープ | `concierge-chat-scopes.md` の表 |
| `inferSeniorEngagement` / シニア用プロンプト | `concierge-senior-mode.md` |
| フェーズ単位の刷新順・依存関係 | `チャット刷新実行計画.md` |
| `concierge-flow.ts` の分岐・文言・出力順 | `分岐別解答マップ.md` |
| トップ分岐の段数・ボタン・CTA | `top-chat-branching-design.md` |
| shell / CTA / 入口 policy の責務境界 | 本索引のコード入口と `refactor-regression-checklist.md` |
| 全チャットで共通化する facts / 質問担当の見直し | `チャット共通facts一覧.md` と `チャット質問棚卸し表.md` と `src/lib/facts/canonical-facts.ts` と `src/lib/chat/question-definition.ts` |
| 問い合わせへ送る条件 / demo へ流す条件 / 送信ゲート | `問い合わせポリシー.md` と `問い合わせ改善PLAN.md` |
| 「トップだけおかしい」系の**プロダクト要件** | `要件定義.md` §3（受け入れ条件）と本索引から辿る B 層 doc |

## 実装の主要エントリ（コード）

- UI 分岐・モーダル幅・表面: `src/components/chat/ChatContainer.tsx`（分岐の純粋算出は `src/lib/chat/concierge-panel-derived-state.ts`、副作用は `src/hooks/use-concierge-container-effects.ts`、CTA と入口 policy は `src/lib/chat/concierge-cta-policy.ts` / `src/lib/chat/concierge-entry-policy.ts`）  
- トップ分岐ロジック: `src/lib/chat/concierge-flow.ts`  
- 質問定義の共通契約: `src/lib/chat/question-definition.ts`（トップは `src/lib/chat/concierge-flow-definitions.ts`、demo は `src/lib/demo/intelligent-concierge.ts`、services は `src/lib/chat/service-card-preset-content.ts`）  
- 吹き出し表示: `src/components/chat/ChatBubble.tsx`（ユーザーはプレーン、アシスタントは `assistant-markdown.tsx` で Markdown・内部パスリンク可）  
- チャット API: `src/app/api/chat/route.ts`
- デモ hub のフリーテキスト→おすすめ3件（ルール・LLMなし）: `src/app/api/demos/recommend-from-text/route.ts` ＋ `src/lib/demo/infer-concierge-answers-from-text.ts`

## トップだけ挙動が異なって見える理由（要約）

1. **ウィザード**（`HomeConciergeFlow`）と **フリーチャット**（`ChatMessages`）は `messages.length` 等で切り替わる。  
2. **`default` + トップ**ではシニアモードが原則オフ（詳細は `concierge-senior-mode.md`）。  
3. **おすすめデモ UI**はデモ一覧フロー等に寄せてあり、トップのフリーチャットには同一コンポーネントが無い場合がある。  
4. アシスタント本文は **`[表示名](/path)` 形式**であれば内部リンクとしてクリック可能（生のバッククォートのみのパスはインラインコード表示のまま）。

詳細とリファクタ手順は [`requirements-docs-refactor-plan.md`](./requirements-docs-refactor-plan.md) を参照。
