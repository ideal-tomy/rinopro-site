# 自動見積テンプレ化: Core / Domain / AppAdapter 境界

## 目的

- 既存品質を維持しながら、見積フローをテンプレ化可能な構造へ分割する。
- 「handoff済みキーの再質問禁止」を共通ルールとして固定する。

## 責務表

### Core（再利用）

- `src/lib/estimate-core/question-model.ts`
  - 質問ID（不変）
  - 表示ラベルマッピング
  - 回答済みID抽出
  - 再質問可否 `shouldAskEstimateQuestion()`
- `src/lib/estimate-core/wizard-steps.ts`
  - ウィザードのステップ定義（ID駆動）
- `src/lib/estimate-core/handoff-codec.ts`
  - handoffのエンコード/デコード共通
- `src/lib/estimate/estimate-snapshot.ts`
  - 見積スナップショット契約（schema）
- `src/lib/estimate/estimate-detailed-session.ts`
  - 途中保存・再開契約（schema）

### Domain（案件差し替え）

- `src/lib/estimate-domain/default/prompts.ts`
- `src/lib/estimate-domain/default/narrow-eligibility.ts`
- `src/lib/estimate-domain/default/industry-adapter.ts`

現行は `default` pack として実装。案件固有要件はここを差し替える。

### AppAdapter（接続層）

- `src/lib/chat/estimate-handoff.ts`
  - チャット文脈と見積文脈の橋渡し
  - Domain固有の業種バンドル解釈はadapter責務
- `src/components/estimate/EstimateDetailedFormContent.tsx`
  - URL/ctx/session を受けて UI へ接続

## キー不変ルール（重要）

- 質問の内部キーは `EstimateQuestionId` を唯一の基準とする。
- ラベル変更は `ESTIMATE_QUESTION_LABELS` 側のみで行う。
- 永続化キー、handoff判定、再質問判定はラベルではなく `EstimateQuestionId` で扱う。

## 再質問禁止ルール

- handoff済み（prefilled）質問IDはウィザードに表示しない。
- answers済み質問IDは再質問しない。
- 初期実装は「省略」で統一（読み取り専用表示は後続拡張）。

## 受け入れ条件

- handoffありで `industry` が再質問されない。
- 途中保存済みの回答キーが再質問されない。
- handoffなしでは既存どおり質問が表示される。
