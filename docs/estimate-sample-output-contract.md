# 詳細見積：サンプル入力と期待出力（契約表・たたき台）

[0401見積もりUIUX見直し.md](0401見積もりUIUX見直し.md) P3 の置き場。実装変更時は本表とモック・API 出力を同期する。

## コンシェルジュ handoff あり（`ctx` + `industryBundle`）

| 観点 | 期待 |
|------|------|
| ウィザード | **業種**ステップは表示されない（`skipIndustryStep`） |
| フォーム | `industry` / `industryDisplayLine` が事前設定される |
| answers「業種」 | `industryDisplayLine` の全文（第1層・第2層・補足を含む） |

## 直接訪問（`ctx` なし）

| 観点 | 期待 |
|------|------|
| ウィザード | 先頭から **業種**を含む全ステップ |
| answers「業種」 | `industryOptions` のラベル（`industryDisplayLine` 未使用時） |

## 事業メモサンプル 1〜3（未整備時のプレースホルダ）

| No | 入力ソース | 期待する結果ページの要素 |
|----|------------|-------------------------|
| 1 | TBD | TBD（見出し・レンジ・免責の固定文） |
| 2 | TBD | 同上 |
| 3 | TBD | 同上 |

サンプル確定後、上表を埋め、`estimate-detailed-hearing-examples` または処理 API のゴールデンと突き合わせる。

## P1 以降（ウィザード束ね・分岐）

- 条件分岐で省略するステップは **「answers に既に意味があるキー」**を増やさないこと（0401 §1.1）。
- 変更時は `ESTIMATE_DETAILED_ANSWER_KEY_ORDER` と `build-estimate-detailed-answers` を同じ PR で更新する。
