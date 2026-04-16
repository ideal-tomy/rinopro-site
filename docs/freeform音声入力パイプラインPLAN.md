# Phase 4: freeform / 音声入力パイプライン PLAN

## 目的

- 自由記述と音声入力を、選択式からこぼれた例外ではなく **正式な入力経路** として扱えるようにする。
- 曖昧な希望や口語の入力を、そのまま捨てずに **言語化支援 -> facts 候補抽出 -> 確認質問** へつなぐ。
- いきなり重い AI 判定に寄せず、**軽量ルールを基本** としながら、必要箇所だけ AI 補助できる構造にする。

---

## このフェーズの位置づけ

- 親計画: [`チャット刷新実行計画.md`](./チャット刷新実行計画.md) の `Phase 4`
- 前提ドキュメント:
  - [`チャット共通facts一覧.md`](./チャット共通facts一覧.md)
  - [`チャット質問棚卸し表.md`](./チャット質問棚卸し表.md)
  - [`問い合わせポリシー.md`](./問い合わせポリシー.md)
- このフェーズは、**Phase 1〜3 で facts と質問定義の境界がある程度固まっていること** を前提にする。

---

## 現状整理

### すでにあるもの

- トップ導線では `その他（自由記述）` から `FlowSelection.freeform` を保持できる
- visitor journey には `lastFreeformSummary` があり、見積 prefill で `summary` に流し込める
- demo hub にはフリーテキストからおすすめ demo を返す軽量ルール API がある
- チャット入力にはブラウザ音声認識があり、現状は正規化後そのまま `onSend()` へ流している

### まだ足りないもの

- freeform / 音声入力を **同じパイプライン** で扱う共通契約
- `freeformMemo` と facts 候補の切り分け
- 抽出結果の **確信度** と **owner / state** を伴う保存
- 曖昧な内容を次の選択式に戻すための確認質問ルール
- 「適当な解答にも言語化支援を返す」ための応答方針

---

## このフェーズで達成したい状態

1. テキスト入力と音声入力が、同じ `freeform input` として扱われる
2. 入力はまず `freeformMemo` として保持される
3. その入力から canonical facts / candidate facts を抽出できる
4. 高確信なものだけ prefill される
5. 低確信なものは「つまり近いのはこれですか？」の確認質問へ戻る
6. 問い合わせや見積へ進む前に、自由記述が structured な流れへ自然に接続される

---

## このフェーズでやらないこと

- 全チャットに高度な LLM 抽出を一気に入れること
- 音声入力の精度を外部 STT で全面改善すること
- 入口質問の全面刷新
- 問い合わせ送信ゲートの最終実装
- `summary` 分離や `8文字以上` 撤去そのもの

`8文字以上` 撤去は Phase 5 の責務とし、このフェーズでは **その置き換え材料を揃える** ところまでを担当する。

---

## 実装方針

### 原則1: まずは軽量・可逆

- ルールだけで扱えるものはルールで扱う
- AI 補助が必要でも、まず `freeformMemo` を残して **後から再解釈可能** にする
- 一度の抽出結果を絶対視しない

### 原則2: 抽出より確認を重視

- 推定した facts を無言で確定しすぎない
- 高確信のみ `direct` / `approx`
- 迷うものは `candidate` として残し、次の質問で確認する

### 原則3: 音声入力も freeform の一種

- 音声専用の別ロジックを増やさない
- 音声は `transcript -> normalize -> freeform input` として処理する
- 音声だけ特別な handoff を作らない

### 原則4: 応答価値を返す

- 「入力が曖昧だから失敗」にしない
- 曖昧入力にも、まず短い要約や整理案を返す
- ユーザーの言葉を、次に答えやすい選択肢へ翻訳する

---

## サブフェーズ構成

## Phase 4-1: 入力契約の統一

### 目的

- テキスト / 音声 / トップ freeform / グローバル freeform を同じ型で扱えるようにする

### Plan mode で決めること

- `freeform input` の共通 payload
- source 種別
  - `typed`
  - `voice`
  - `wizard_other`
  - `draft_injection`
- どの時点で `raw` と `normalized` を両方持つか
- `freeformMemo` の長さ・圧縮ルール

### Agent mode の実装対象

- `src/components/chat/ChatInput.tsx`
- `src/components/chat/HomeConciergeFlow.tsx`
- `src/lib/chat/voice-normalize-query.ts`
- 新規候補:
  - `src/lib/freeform/freeform-input.ts`
  - `src/lib/freeform/freeform-normalize.ts`

### 実装内容

- `FreeformInputEnvelope` のような共通型を作る
- 音声入力は `normalizeVoiceSearchQuery()` の結果だけ送るのをやめ、`rawTranscript` と `normalizedText` を両方保持できるようにする
- トップの `FlowSelection.freeform` を、その場しのぎの文字列ではなく共通入力契約経由で作る

### 受け入れ条件

- どの導線から来た freeform かをコード上で識別できる
- 後続処理が「音声かテキストか」で分岐しすぎない

---

## Phase 4-2: `freeformMemo` 保存レイヤーの整備

### 目的

- 抽出前の一次保存先を統一する

### Plan mode で決めること

- `freeformMemo` をどこに持つか
  - visitor journey
  - estimate draft candidate
  - inquiry brief candidate
- 1件上書きか、短い履歴を持つか
- 圧縮前本文をどこまで残すか

### Agent mode の実装対象

- `src/lib/journey/visitor-journey.ts`
- `src/lib/journey/visitor-journey-storage.ts`
- `src/lib/journey/visitor-journey-estimate-prefill.ts`
- 新規候補:
  - `src/lib/freeform/freeform-memo.ts`

### 実装内容

- `lastFreeformSummary` 依存を整理し、`freeformMemo` の保存責務を明確化する
- `summarizeFreeformText()` を Phase 4 用の共通 memo 化関数へ寄せる
- 見積 prefill では「memo をそのまま `summary` に流す」のではなく、候補として扱う準備に変える

### 受け入れ条件

- freeform が来たとき、どこにどう残るかが一貫する
- 後続フェーズで `problemSummary` 分離しても壊れにくい

---

## Phase 4-3: facts 候補抽出レイヤーの導入

### 目的

- freeform から canonical facts / candidate facts を抽出できるようにする

### Plan mode で決めること

- 抽出対象の優先順位
  - `industryBundle`
  - `productCategory`
  - `productArchetype`
  - `problemSummary`
  - `targetSummary`
  - `timeline`
  - `integration`
- state の付け方
  - `direct`
  - `approx`
  - `candidate`
  - `missing`
- AI を使う条件
  - ルールで十分
  - 長文で意味が濃い
  - 問い合わせ直前で価値が高い

### Agent mode の実装対象

- `src/lib/facts/canonical-facts.ts`
- `src/lib/demo/infer-concierge-answers-from-text.ts`
- `src/app/api/demos/recommend-from-text/route.ts`
- 新規候補:
  - `src/lib/freeform/extract-freeform-facts.ts`
  - `src/lib/freeform/freeform-fact-rules.ts`
  - `src/lib/freeform/freeform-fact-ai.ts`

### 実装内容

- まずはルールベースで抽出できるものから始める
- demo 推定用ロジックを、demo 専用のまま閉じずに再利用可能なルールへ寄せる
- 抽出結果は `FactEnvelope[]` で返し、source に `freeform:typed`, `freeform:voice`, `freeform:wizard_other` などを持たせる

### 受け入れ条件

- freeform 入力から、少なくとも `productCategory` と `problemSummary` 候補を返せる
- 抽出結果に state と source が含まれる
- 重い AI がなくても最低限の価値が出る

---

## Phase 4-4: 確認質問への戻し方を実装

### 目的

- 抽出した facts を、次の structured question に自然につなぐ

### Plan mode で決めること

- 高確信時の振る舞い
  - 自動 prefill
  - 確認メッセージだけ出して次へ進む
- 低確信時の振る舞い
  - 候補選択肢を返す
  - 元の質問へ戻す
  - demo を見せる
- どの導線が何を確認担当するか

### Agent mode の実装対象

- `src/lib/chat/question-definition.ts`
- `src/lib/chat/estimate-handoff.ts`
- `src/lib/journey/visitor-journey-estimate-prefill.ts`
- `src/components/chat/ChatContainer.tsx`
- 新規候補:
  - `src/lib/freeform/freeform-followup-policy.ts`

### 実装内容

- `FactEnvelope.state` に応じて follow-up を出し分ける
- `candidate` のまま見積や問い合わせに渡しすぎない
- 「つまり近いのはこれですか？」の再質問テンプレを作る

### 受け入れ条件

- freeform のあとに、選択式へ戻す自然な一手がある
- 高確信な内容だけが prefill され、誤確定が抑えられる

---

## Phase 4-5: 音声入力の統合と UX 調整

### 目的

- 音声入力を検索用の簡易機能から、言語化支援の正式入口へ寄せる

### Plan mode で決めること

- 音声入力の適用範囲
  - グローバル freeform のみ
  - トップの freeform モーダルにも適用するか
- `rawTranscript` を UI に見せるか
- 音声後に即送信するか、確認ステップを挟むか

### Agent mode の実装対象

- `src/components/chat/ChatInput.tsx`
- `src/components/chat/VoiceToggle.tsx`
- 新規候補:
  - `src/components/chat/FreeformConfirmBox.tsx`

### 実装内容

- 現状の「認識完了後 400ms で即送信」を見直す
- 音声は原則 `入力欄に反映 -> 確認して送信` を基本に寄せる
- 必要なら「この内容で送りますか」の軽い確認 UI を入れる

### 受け入れ条件

- 誤認識がそのまま送信されにくい
- 音声入力でも、テキスト入力と同じ freeform pipeline に入る

---

## 優先実装順

1. Phase 4-1 `入力契約の統一`
2. Phase 4-2 `freeformMemo 保存レイヤー`
3. Phase 4-3 `facts 候補抽出`
4. Phase 4-4 `確認質問への戻し方`
5. Phase 4-5 `音声入力の UX 調整`

### この順にする理由

- 先に契約と保存先を整えないと、抽出ロジックが場当たりになる
- 抽出だけ先に作っても、確認質問へ戻せないと UX 価値が薄い
- 音声は最後に同じレールへ載せればよく、先に専用設計しない方が安全

---

## 主要ファイル一覧

### 既存で主に触る候補

- `src/components/chat/ChatInput.tsx`
- `src/components/chat/HomeConciergeFlow.tsx`
- `src/components/chat/ChatContainer.tsx`
- `src/components/chat/VoiceToggle.tsx`
- `src/lib/chat/voice-normalize-query.ts`
- `src/lib/journey/visitor-journey.ts`
- `src/lib/journey/visitor-journey-storage.ts`
- `src/lib/journey/visitor-journey-estimate-prefill.ts`
- `src/lib/facts/canonical-facts.ts`
- `src/lib/demo/infer-concierge-answers-from-text.ts`
- `src/app/api/demos/recommend-from-text/route.ts`
- `src/lib/chat/estimate-handoff.ts`

### 新規作成の第一候補

- `src/lib/freeform/freeform-input.ts`
- `src/lib/freeform/freeform-normalize.ts`
- `src/lib/freeform/freeform-memo.ts`
- `src/lib/freeform/extract-freeform-facts.ts`
- `src/lib/freeform/freeform-fact-rules.ts`
- `src/lib/freeform/freeform-followup-policy.ts`

---

## 受け入れ条件

- freeform / 音声入力の経路が、コード上で一つの責務として説明できる
- `freeformMemo` と canonical facts / candidate facts が混ざらない
- 見積 prefill に使う内容が、文字列の丸流しではなく state 付きで扱える
- 曖昧な内容でも、次の structured question を返せる
- 音声入力が誤送信しにくい

---

## 回帰確認項目

- トップの `その他（自由記述）` から会話が壊れない
- demo hub のフリーテキストおすすめが維持される
- visitor journey の要約表示が破綻しない
- 見積 prefill で不要な上書きが起きない
- 問い合わせ準備文脈へ不正確な facts が流れ込みすぎない

---

## リスクと対策

### リスク1: 誤抽出で勝手に決めつける

- 対策: `candidate` を多めに使い、無言の確定を減らす

### リスク2: AI 判定で遅くなる

- 対策: まずルールベース、必要時のみ AI

### リスク3: 音声認識の誤変換

- 対策: 即送信をやめ、確認を挟む

### リスク4: `summary` と役割が重複する

- 対策: Phase 5 で `productArchetype` / `problemSummary` 分離を前提に、Phase 4 では memo と候補に留める

---

## 次にそのまま作るべき PLAN

この文書の次アクションとしては、まず `Phase 4-1: 入力契約の統一` の専用 PLAN を切るのが最短。

理由:

- 音声入力の即送信改善
- freeform の source 識別
- 後続の memo 化 / 抽出 / follow-up の起点

をまとめて支える最初の土台になるため。
