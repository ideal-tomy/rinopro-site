# 業種 × 詳細見積 handoff 契約（実装の単一の真実）

[業種階層構造.md](業種階層構造.md) 第 7 節・[0401見積もりUIUX見直し.md](0401見積もりUIUX見直し.md) §1.1 と整合する。

## 1. `ConciergeEstimateContextPayload`（`estimate-handoff.ts`）

- `v: 1` の既存フィールド `track`, `path`, `detailBlock` は不変。
- 任意: `industryBundle?: ConciergeIndustryBundle`
  - `domainId`: `ConciergeDomainId`（`intelligent-concierge.ts`）
  - `domainDetailId?`: 第 2 層 ID（未選択は省略）
  - `note?`: 自由記述 1 行（未入力は省略）

デコードは後方互換: `industryBundle` なしの古い URL は従来どおり。

## 2. 見積フォーム `EstimateFormDraft`（`estimate-detailed-session.ts`）

- `industry`: `estimateDetailedCopy.industryOptions` の `value`（ウィザード UI・内部値）
- `industryDisplayLine?`: 設定時、**日本語キー「業種」**の回答は `build-estimate-detailed-answers` でこの文字列を優先（ラベル変換より優先）
- 自由記述 `note` は **「業種」キーにのみ反映**（「いまいちばんやりたいこと・課題」にはマージしない）

## 3. コンシェルジュ domainId → `form.industry`（ウィザード value）

| domainId | form.industry | 備考 |
|----------|---------------|------|
| construction | construction | |
| legal | professional | 士業・専門 |
| manufacturing | manufacturing | |
| services | retail | サービス・小売・医療・飲食など |
| distribution | logistics_wholesale | 流通・物流 |
| staffing | staffing | 人材・派遣 |
| food_service | food_service | 飲食・外食 |
| food_wholesale | food_wholesale | 食品・卸 |
| other | other | 特定せず |

## 4. `industryDisplayLine` の組み立て

1. 第 1 層の `CONCIERGE_DOMAIN_OPTIONS` の `label`
2. 第 2 層あり: ` — ` + `CONCIERGE_DOMAIN_DETAIL_LABELS[domainId][domainDetailId]`
3. `note` あり: `（補足: {note}）`

## 5. 詳細見積ウィザード

- `industryBundle` 付きで遷移した場合: **業種ステップをスキップ**（`skipIndustryStep`）。`form` は上記で事前入力済み。
- 直接 `/estimate-detailed`（ctx なし）: 従来どおり業種から開始。

## 6. セッション優先順位（`EstimateDetailedFormContent`）

1. `reset=1` 後は URL の `ctx` のみ再適用（既存動線）
2. それ以外の初回: `sessionStorage` の `formDraft` があれば復元（**ctx の industry は上書きしない**）
3. `formDraft` がなく `ctx.industryBundle` がある場合のみ bundle を適用

## 7. 第 2 層マスタ

- `CONCIERGE_DOMAIN_DETAIL_OPTIONS`: `domainId` ごとの `{ id, label }[]`（任意ステップ用）
- `CONCIERGE_DOMAIN_DETAIL_LABELS`: `Record<domainId, Record<detailId, string>>`（コード内では `DOMAIN_DETAIL_LABELS` として `CONCIERGE_DOMAIN_DETAIL_OPTIONS` から生成）
- 全 `domainId` の人間可読一覧: [industry-second-layer-matrix.md](industry-second-layer-matrix.md)（`other` は第2層なし）
