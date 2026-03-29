# AIコンシェルジュ仕様 — ドキュメント索引（正の入口）

チャット・コンシェルジュに関する**読む順序**と**変更時に同期するファイル**をここに集約する。  
要件の「なぜ」と実装の「どうなっているか」が分断しないよう、まず本ファイルから辿る。

## 読む順序（推奨）

1. [`要件定義.md`](./要件定義.md) §1・§2 … サイト全体のコンセプト・ページ役割  
2. [`要件定義.md`](./要件定義.md) §3 … チャットの**プロダクト上の約束**（リファクタ後は要約＋本索引へのリンク想定）  
3. **トップの選択式フロー**  
   - [`top-chat-branching-design.md`](./top-chat-branching-design.md) … 分岐・CTA・操作設計  
   - [`分岐別解答マップ.md`](./分岐別解答マップ.md) … 生成文言・出力順・結果 UI 導線・`concierge-flow.ts` 対応表  
4. **会話の境界（session）** … [`concierge-chat-scopes.md`](./concierge-chat-scopes.md)（`concierge-session-id.ts` と同 PR で更新）  
5. **API 応答モード（シニア等）** … [`concierge-senior-mode.md`](./concierge-senior-mode.md)（`concierge-senior.ts` / `route.ts` と同 PR で更新）  
6. **リファクタ計画（ドキュメント整理のロードマップ）** … [`requirements-docs-refactor-plan.md`](./requirements-docs-refactor-plan.md)

## 変更時の同期ルール（最低限）

| 変更したもの | 同じ PR / 同じ作業で更新するドキュメント |
|--------------|------------------------------------------|
| `buildConciergeChatSessionId` / 会話スコープ | `concierge-chat-scopes.md` の表 |
| `inferSeniorEngagement` / シニア用プロンプト | `concierge-senior-mode.md` |
| `concierge-flow.ts` の分岐・文言・出力順 | `分岐別解答マップ.md` |
| トップ分岐の段数・ボタン・CTA | `top-chat-branching-design.md` |
| 「トップだけおかしい」系の**プロダクト要件** | `要件定義.md` §3 または別紙の受け入れ条件（計画: `requirements-docs-refactor-plan.md` 参照） |

## 実装の主要エントリ（コード）

- UI 分岐・モーダル幅・表面: `src/components/chat/ChatContainer.tsx`  
- トップ分岐ロジック: `src/lib/chat/concierge-flow.ts`  
- 吹き出し表示: `src/components/chat/ChatBubble.tsx`（ユーザーはプレーン、アシスタントは `assistant-markdown.tsx` で Markdown・内部パスリンク可）  
- チャット API: `src/app/api/chat/route.ts`
- デモ hub のフリーテキスト→おすすめ3件（ルール・LLMなし）: `src/app/api/demos/recommend-from-text/route.ts` ＋ `src/lib/demo/infer-concierge-answers-from-text.ts`

## トップだけ挙動が異なって見える理由（要約）

1. **ウィザード**（`HomeConciergeFlow`）と **フリーチャット**（`ChatMessages`）は `messages.length` 等で切り替わる。  
2. **`default` + トップ**ではシニアモードが原則オフ（詳細は `concierge-senior-mode.md`）。  
3. **おすすめデモ UI**はデモ一覧フロー等に寄せてあり、トップのフリーチャットには同一コンポーネントが無い場合がある。  
4. アシスタント本文は **`[表示名](/path)` 形式**であれば内部リンクとしてクリック可能（生のバッククォートのみのパスはインラインコード表示のまま）。

詳細とリファクタ手順は [`requirements-docs-refactor-plan.md`](./requirements-docs-refactor-plan.md) を参照。
