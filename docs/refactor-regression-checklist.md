# コンシェルジュ・チャット 回帰チェックリスト（リファクタ用）

リファクタ前後で **表示・挙動が同一**かを手動確認する。  
正の仕様索引: [concierge-spec-index.md](./concierge-spec-index.md) / [要件定義.md](./要件定義.md) §3。

**ベースライン**: タグ `refactor/chat-baseline-2026-04-02`（または作業開始時点の annotated tag）のコミットと比較する。

---

## トップ `/`

- [ ] FAB でコンシェルジュを開く
- [ ] 非ホーム相当の入口が無いため、ホームでは `pick` / `global` の経路が意図どおり（エントリピッカーが出ない条件と `HomeConciergeFlow`）
- [ ] `HomeConciergeFlow`: 業種ゲート → ルート選択 → 完了まで遡れる
- [ ] ウィザードから下書き注入後、送信して **メッセージ1件以上でもモーダル幅が狭くならない**（広幅維持）
- [ ] ウィザード完了フェーズで入力欄の表示タイミングが崩れていない

## `/demo`・`/demo/list`

- [ ] `page` 表面で `DemoListConciergeFlow` が表示される
- [ ] ウィザード完了後: **`/demo/list` ではモーダルが閉じる** / **`/demo` では閉じずオーバーレイ等が維持される**（実装コメントどおり）
- [ ] フリーチャット送信後、ルールベースおすすめ（recommend-from-text）が動く経路でオーバーレイが意図どおり

## `/services`・`/flow`・`/consulting`

- [ ] FAB から開いたときエントリピッカー（このページ / サイト全体）が出る条件
- [ ] `/services` で開発/コンサル選択 → `ServicesConciergeFlow` → 完了後 `ServiceCardConciergeStartFlow` 相当の経路
- [ ] `/flow`・`/consulting` で mode が固定され、イントロ完了扱いになる

## 自動オープン・抑制

- [ ] `shouldAttemptChatAutoOpen` 対象ページで、初回のみ自動オープン（sessionStorage `1`）
- [ ] `suppressNextChatAutoOnce` / サイト内ナビ後に自動オープンが抑制される
- [ ] `/demo/list`・`/services` の自動オープンで `entrySource`・`conciergeSurface === page"` になる

## サイト内リンク・ナビ

- [ ] `CONCIERGE_NAVIGATE_FROM_CHAT` 発火後にモーダルが閉じ、クロームがリセットされる

## 計測・CTA（任意だが推奨）

- [ ] アシスタント回答後に遅延 CTA が demo ハブ以外で動く
- [ ] demo ハブでは遅延 CTA がオフ

---

## 自動スモーク（補助）

- `npm run verify:concierge-panel` … `getConciergePanelDerivedState` の分岐が期待どおりか（完全な UI 代替ではない）。

## 復旧時の使い方

- 差分確認: `git diff refactor/chat-baseline-2026-04-02 -- src/components/chat/ChatContainer.tsx`
- ファイル単位復元: `git checkout refactor/chat-baseline-2026-04-02 -- path/to/file`
- ブランチを捨ててやり直し: `git checkout main && git branch -D feature/refactor-chat-container` 後、tag から再ブランチ

---

## Phase 7 追記: 入口→出口の手動シナリオ（`/`・`/demo/list`・`/services`）

**自動確認（2026-04-17 実施）**

- [x] `npm run verify:concierge` … A/B・CDE・E 直の結果本文が期待形式であること
- [x] `npm run verify:concierge-panel` … `getConciergePanelDerivedState` の分岐が期待どおり
- [x] `npm run build` … 型・ビルドが通ること

**ブラウザ手動（未チェックの項目は実機で確認すること）**

### `/` トップ

| # | シナリオ | 確認内容 |  |
|---|----------|----------|---|
| H1 | FAB → コンシェルジュ表示 | ルート質問が「いま一番ほしい状態に近い…」の 6 択である | [ ] |
| H2 | 業種ゲート | 任意のルート選択後、業種ステップが表示され確定できる | [ ] |
| H3 | A トラック深掘り | ROOT で「接点」または「社内作業」→ **2 問目が「まずつくるもののかたち」** で、**内向き自動化** と **外向き問い合わせ窓口** が文言上区別されている | [ ] |
| H4 | 完了まで | A3 → A_SCOPE → 結果 →「戻る」で 1 段戻れる／「条件変更」でルートからやり直せる | [ ] |
| H5 | メモ注入 | 結果から「メモを入力欄に貼る」→ チャット入力に下書きが入る | [ ] |
| H6 | モーダル幅 | ウィザードでメッセージを 1 件以上送っても **モーダル幅が狭くならない** | [ ] |

### `/demo/list`

| # | シナリオ | 確認内容 |  |
|---|----------|----------|---|
| D1 | 表面 | ページコンシェルジュ（条件相談）が表示される | [ ] |
| D2 | 完了後 | **モーダルが閉じる**（`/demo/list` 専用の挙動） | [ ] |
| D3 | 自動オープン | 初回訪問時の自動オープン後、`entrySource` / `conciergeSurface === "page"` が想定どおり | [ ] |

### `/services`

| # | シナリオ | 確認内容 |  |
|---|----------|----------|---|
| S1 | FAB | **エントリピッカー**（このページ／サイト全体）が出る | [ ] |
| S2 | 開発またはコンサルカード経由 | プリセット Step1 の文言が **「欲しいもの／整理」起点**（費用単独の入口になっていない）で進行できる | [ ] |
| S3 | 完了後 | 固定返信 → CTA（見積・問い合わせ）へ遷移できる | [ ] |
| S4 | 自動オープン | 初回に限り自動オープンし、`conciergeSurface === "page"` に寄る | [ ] |

### サイト横断（チェックリスト本文と対応）

| 本書セクション | Phase7 で触った確認 |
|----------------|----------------------|
| トップ `/` | H1〜H6 が上記の細分化 |
| `/demo`・`/demo/list` | D1〜D3 |
| `/services` | S1〜S4 |
| 自動オープン・抑制 | D3・S4 + 既存 `- [ ]` 行と併用 |
