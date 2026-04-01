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
