# サービス6下層ページ コピー平易化レビュー表

対象: [`src/lib/content/service-offerings.ts`](../src/lib/content/service-offerings.ts)（6 slug）、およびデータ基盤ページの注記 [`src/components/services/ServiceOfferingDetailView.tsx`](../src/components/services/ServiceOfferingDetailView.tsx)。

## インベントリ（フィールド構造）

各オファリングは以下のパスを持つ（一意キーは `slug` + `section` + `fieldPath`）。

| slug | section | fieldPath（代表） |
|------|-----------|-------------------|
| dx-strategy | meta | metaTitle, metaDescription |
| * | hero | eyebrow, title, lead, contactQuery |
| * | why | heading, paragraphs[], callouts[].label/text |
| * | issues | heading, cards[].title/body |
| * | journey | heading, intro, steps[].number/title/duration/description |
| * | pitfalls | heading, stumblingTitle, stumblingItems[], supportTitle, supportItems[] |
| * | outcomes | heading, bullets[], futureParagraph |
| * | relatedLinks | heading, links[].href/label |
| industry-solutions | （追加） | showIndustryGrid |

上記以外のフィールドで本文変更がないものは **changeType: keep** とみなし、下表では省略している。

## 略語・表記ルール（実装で統一）

| 略語 | 方針 |
|------|------|
| PoC | `試作検証（PoC）` と初出で併記（meta は平易語のみに置換した箇所あり） |
| SLA | `処理の目標（SLA）` / `障害対応などの約束（SLA）` / `対応の目標時間とオンコール`（見出し） |
| API | `システム連携（API）`（必要な箇所のみ） |
| SRE / IaC / Runbook | 初出に短い日本語＋括弧 |
| エスカレーション / 冪等性 / ドリフト / トリアージ | 意味を残す括弧付き gloss を併記 |

## 高リスク語スキャン結果（分類）

| 分類 | 代表語 | 対応 |
|------|--------|------|
| 組織・統制 | ガバナンス、ゲート、責任分界 | ルール・管理体制、承認の段取り、役割の切り分け |
| データ基盤 | レイク／ウェアハウス／マート、パイプライン | 業務語での説明＋必要に応じ既存用語を括弧で残す |
| 関係者 | ステークホルダー | 関係者 |
| コピー文体 | 咀嚼、投資判断に耐える、分水嶺 | 整理／材料になる／続けられるかの分かれ目 |
| 英単語 | Owner、ハンドオフ | 担当者、引き継ぎ |

## 変更一覧（current → proposed）

| id | slug | section | fieldPath | current（要約） | proposed | changeType | notes |
|----|------|---------|-----------|----------------|----------|------------|-------|
| DX-WHY-P0 | dx-strategy | why | paragraphs[0] | 品質・コンプライアンス | 品質・法令・社内ルールへの適合 | replace | 硬い外来語を業務語へ |
| DX-WHY-P1 | dx-strategy | why | paragraphs[1] | 投資判断に耐える／PoCと本実装 | 投資判断の材料になる／試作検証（PoC）と本実装 | replace | PoC は gloss |
| DX-ISS-C2-T | dx-strategy | issues | cards[2].title | データの所在と責任分界 | データの所在と役割の切り分け | replace | |
| DX-ISS-C4-T | dx-strategy | issues | cards[4].title | 組織とガバナンス | 組織とルール・管理体制 | replace | |
| DX-ISS-C4-B | dx-strategy | issues | cards[4].body | 意思決定のゲート（…） | 意思決定の承認段取り（…） | replace | |
| DX-JRN-IN | dx-strategy | journey | intro | 次のPoCや実装 | 次の試作検証（PoC）や実装 | add_gloss | |
| DX-JRN-S3 | dx-strategy | journey | steps[2].description | 投資判断に耐える計画 | 投資判断の材料になる計画 | replace | |
| DX-OUT-B1 | dx-strategy | outcomes | bullets[1] | PoCと本実装の境界 | 試作検証（PoC）と本実装の境界 | add_gloss | |
| AI-META | ai-apps | meta | metaDescription | PoC止まりを防ぐ | 試作検証で止まりがちな進め方を避ける | replace | SEO でも過度に幼くならない表現 |
| AI-WHY-P1 | ai-apps | why | paragraphs[1] | コントロールポイント | 管理のポイント | replace | |
| AI-WHY-C0 | ai-apps | why | callouts[0].text | ヒューマンレビュー境界 | 人が必ず確認する範囲 | replace | |
| AI-ISS-C2 | ai-apps | issues | cards[2].body | エスカレーション | 報連相の段取り（エスカレーション） | add_gloss | |
| AI-ISS-C3 | ai-apps | issues | cards[3].body | API・…・冪等性 | システム連携（API）・…・二重実行でも結果が崩れないこと（冪等性） | add_gloss | |
| AI-ISS-C4 | ai-apps | issues | cards[4].body | 責任分界 | 役割の切り分け | replace | |
| DP-HERO | data-platform | hero | lead | データレイク／ウェアハウス／マートの役割分担から…燃料を供給 | 生データの保管場所・分析向けの集約データベース・レポート用に整えたデータ（いわゆるレイク／ウェアハウス／マート）の役割分担から…使えるデータを供給 | replace | 比喩ではなく業務語 |
| DP-WHY-P1 | data-platform | why | paragraphs[1] | マートに載せ | 分析・報告用に整えたデータ（マート）に載せ | add_gloss | |
| DP-WHY-C0-L | data-platform | why | callouts[0].label | ガバナンス | ルールと権限管理 | replace | |
| DP-WHY-C0-T | data-platform | why | callouts[0].text | 越境利用を防ぐ | 許可のない部門・用途への利用を防ぐ | replace | |
| DP-WHY-C1 | data-platform | why | callouts[1].text | パイプラインの監視とデータ契約（SLA）／沈黙する欠損 | データの取り込み〜加工の流れ（パイプライン）の監視と処理の目標（SLA）／気づかれない欠損 | replace | |
| DP-ISS-C2-T | data-platform | issues | cards[2].title | パイプライン設計 | データ処理の流れの設計 | replace | |
| DP-ISS-C2-B | data-platform | issues | cards[2].body | 冪等性 | 二重実行でも結果が崩れないこと（冪等性） | add_gloss | |
| DP-JRN-IN | data-platform | journey | intro | 優先ドメイン／パイプラインと権限 | 優先する業務領域／データ処理の流れと権限 | replace | |
| DP-JRN-S3-T | data-platform | journey | steps[2].title | パイプライン実装 | データ処理の実装 | replace | |
| DP-PIT-S1 | data-platform | pitfalls | stumblingItems[2] | パイプライン障害 | データ処理の障害 | replace | |
| DP-PIT-SM2 | data-platform | pitfalls | stumblingItems[1] | 公式の数値が固定されない | 公式の数値が定まらない | replace | 「固定」の語感調整 |
| DP-SUP-S1 | data-platform | pitfalls | supportItems[0] | ビジネスドメイン単位 | 業務領域単位 | replace | |
| DP-OUT-B1 | data-platform | outcomes | bullets[1] | データパイプラインが稼働 | データの取り込み〜加工の流れが稼働 | replace | |
| DP-OUT-B2 | data-platform | outcomes | bullets[2] | 障害とドリフトに | 障害とデータ・設定のずれ（ドリフト）に | add_gloss | |
| INS-HERO | insourcing-enablement | hero | lead | ハンドオフの粒度／インシデント | 引き継ぎの粒度／運用上のトラブル対応 | replace | |
| INS-WHY-H | insourcing-enablement | why | heading | DXの分水嶺 | DXを続けられるかの分かれ目 | replace | |
| INS-WHY-C1-L | insourcing-enablement | why | callouts[1].label | ガードレール | 安全のためのレビュー | replace | |
| INS-WHY-C1-T | insourcing-enablement | why | callouts[1].text | レビュー観点とゲート | レビューの観点と承認の段取り | replace | |
| INS-ISS-C0 | insourcing-enablement | issues | cards[0].body | 非機能要件 | 性能・セキュリティなどの品質要件 | replace | |
| INS-ISS-C1 | insourcing-enablement | issues | cards[1].body | SRE | 運用・安定稼働担当（SRE） | add_gloss | |
| INS-ISS-C3 | insourcing-enablement | issues | cards[3].body | IaC | インフラをコードで管理する仕組み（IaC） | add_gloss | |
| INS-ISS-C4 | insourcing-enablement | issues | cards[4].body | SLA、 | 障害対応などの約束（SLA）、 | add_gloss | |
| INS-PIT-S1 | insourcing-enablement | pitfalls | supportItems[1] | ゲート設計 | 承認の段取りの設計 | replace | |
| INS-PIT-S0 | insourcing-enablement | pitfalls | supportItems[0] | 運用Runbook | 運用手順書（Runbook） | add_gloss | |
| IND-WHY-P0 | industry-solutions | why | paragraphs[0] | ベストプラクティス／コンプライアンスリスク | 一般的な成功パターン／法令・社内ルール違反のリスク | replace | |
| IND-ISS-C1-T | industry-solutions | issues | cards[1].title | ステークホルダー | 関係者 | replace | |
| IND-ISS-C1-B | industry-solutions | issues | cards[1].body | 承認ゲート | 承認の段取り | replace | |
| IND-JRN-IN | industry-solutions | journey | intro | PoCスコープ | 試作検証（PoC）の範囲 | add_gloss | |
| CONT-HERO | continuous-improvement | hero | lead | 咀嚼し | 整理し | replace | |
| CONT-ISS-C0-T | continuous-improvement | issues | cards[0].title | SLAとオンコール | 対応の目標時間とオンコール | replace | |
| CONT-ISS-C0-B | continuous-improvement | issues | cards[0].body | エスカレーション | 上位へつなぐ流れ（エスカレーション） | add_gloss | |
| CONT-ISS-C1-B | continuous-improvement | issues | cards[1].body | フィーチャーフラグ | 機能の出し分け（フィーチャーフラグ） | add_gloss | |
| CONT-ISS-C3-B | continuous-improvement | issues | cards[3].body | Owner | 担当者 | replace | |
| CONT-PIT-S1 | continuous-improvement | pitfalls | supportItems[1] | ファシリテート | 進行を支援 | replace | |
| CONT-PIT-S2 | continuous-improvement | pitfalls | supportItems[2] | インシデント／トリアージ | 重大な障害／原因の切り分けと優先付け（トリアージ） | replace | |
| VIEW-DP-CAP | （view） | journey | ServiceOfferingDetailView キャプション | 基盤の積層イメージ | データの流れと役割のイメージ | replace | データ基盤 slug のみ |

## 実装状態

上表の **proposed** は [`service-offerings.ts`](../src/lib/content/service-offerings.ts) および [`ServiceOfferingDetailView.tsx`](../src/components/services/ServiceOfferingDetailView.tsx) に反映済み。ビルド確認は `npm run build`。

## keep（明示）

- 各 slug の `metaTitle`（ブランド・サービス名として維持）、未変更の `hero.title`、`relatedLinks` の大半、`pitfalls` の具体的シナリオ文などは **一般的ビジネス語または固有名称** のため **keep**。
- `CI/CD`、プロダクトオーナー等は IT 担当読者にも通じる前提で **keep**（全面排除はしない方針に合わせる）。
