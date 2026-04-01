# コンシェルジュ第2層マスタ（domainId × detailId）

実装の正は [`src/lib/demo/intelligent-concierge.ts`](../src/lib/demo/intelligent-concierge.ts) の `CONCIERGE_DOMAIN_DETAIL_OPTIONS`。本表はレビュー・営業・差分把握用。

**ID 規約**: 安定した短い英スネーク。リリース後のリネームは handoff 履歴の意味がずれるため避ける。

## 一覧

| domainId（第1層） | detailId | 表示ラベル（日本語） | メモ |
|-------------------|----------|----------------------|------|
| construction | `civil_infra` | 土木・インフラ | 現場・公共・インフラ系 |
| construction | `building` | 建築・工務 | 建築一式・工務店寄り |
| construction | `equipment` | 設備・メンテ | 設備工事・保守 |
| construction | `real_estate` | 不動産・開発 | 開発・デベロッパー寄り |
| legal | `attorney` | 弁護士 | |
| legal | `tax_accounting` | 税理・会計 | 税理士・会計事務所 |
| legal | `labor_social` | 社労士・労務 | |
| legal | `admin_scrivener` | 行政書士 | |
| legal | `other_prof` | その他士業 | |
| manufacturing | `mass_assembly` | 量産・組立 | ライン・量産型 |
| manufacturing | `job_shop` | 受託・多品種 | 多品種小ロット |
| manufacturing | `process_materials` | プロセス・素材・部品 | 素材・化学・部品 |
| manufacturing | `food_plant` | 食品工場 | |
| staffing | `dispatch` | 派遣・就労マッチング | 既存 |
| staffing | `support` | 登録支援・紹介事業 | 既存 |
| food_service | `store` | 店舗・キッチンオペ | 既存 |
| food_service | `hq` | 本部・多店舗管理 | 既存 |
| food_wholesale | `trade` | 卸・営業・受発注 | 既存 |
| food_wholesale | `fresh` | 鮮度・在庫・ロス管理 | 既存 |
| services | `retail` | 小売・店舗 | 既存 |
| services | `medical` | 医療・介護 | 既存 |
| services | `other_svc` | その他サービス | 既存 |
| distribution | `warehouse` | 倉庫・DC | |
| distribution | `three_pl` | 3PL・物流委託 | |
| distribution | `last_mile` | ラストワン・配送 | |
| distribution | `import_export` | 輸出入・通関 | |
| other | — | （第2層なし） | 詳しく選ぶに選択肢を出さない |

## 参照

- [業種 × 詳細見積 handoff 契約](industry-estimate-handoff-contract.md) §7
