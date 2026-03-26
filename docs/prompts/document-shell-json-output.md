# 書類たたき台シェル — AI 接続用プロンプト契約（JSON 出力）

体験デモを **実AI** に切り替える際、API は **この形の JSON のみ** を返すよう system で指示する。フロントは Zod 等でパースし、失敗時はルールベースモックにフォールバックする。

## 入力（リクエスト body 例）

- `slug`: デモ識別子（例: `loan-interview-business-outline`）
- `rawText`: ユーザーの自由記述
- `selections`: 選択ウィザードの結果 `Record<stepId, optionId>`（未使用なら `{}`）

**system に含める指示（要約）**

- ユーザーが選んだ `selections` は **制約として必ず尊重**し、矛盾する出力をしない。
- `rawText` に無い事実を捏造しない。不足は「要確認」として明示。

## 出力 JSON スキーマ（概念）

ルートオブジェクト:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `documentTitle` | string | 右ペイン見出し |
| `blocks` | array | 下記 discriminated union の配列 |

### `blocks` の種類（`type` で判別）

1. `{ "type": "heading", "text": string }`
2. `{ "type": "paragraph", "text": string }`
3. `{ "type": "bullets", "items": string[] }`
4. `{ "type": "table", "caption"?: string, "headers": string[], "rows": string[][] }`
5. `{ "type": "kpis", "items": { "label": string, "value": string, "note"?: string }[] }`
6. `{ "type": "checklist", "items": { "label": string, "done"?: boolean, "note"?: string }[] }`

## 出力ルール

- **JSON のみ**（前後にマークダウンや説明文を付けない）。
- 日本語でよい。文字数は目安 **8000 文字以内**（必要なら system で調整）。
- プレースホルダ `[TODO]` の乱発は避け、必ずしも埋まらない箇所は「（要確認）」など自然な文言にする。

## user メッセージ組み立て例

```text
【自由記述】
（rawText そのまま）

【選択結果】
- industry: retail
- stage: preopen
- urgency: soon
```

このドキュメントは [document-plan-shell-types.ts](../../src/lib/experience/document-plan-shell-types.ts) と [document-shell-preset-types.ts](../../src/lib/experience/document-shell-preset-types.ts) と整合させること。
