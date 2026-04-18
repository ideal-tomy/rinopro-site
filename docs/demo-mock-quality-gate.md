# モックデモ品質ゲート（1本ごと・バッチごと）

**ポートフォリオ分類（①②③④・保留ランク）**: [demo-portfolio-governance.md](demo-portfolio-governance.md) ／ トリアージ表 [demo-portfolio-triage.md](demo-portfolio-triage.md)

新規 `aiDemo`（特に `mock_preview`）を追加する前に、以下を満たすこと。  
詳細のサイト実装観点は [`docs/tool-demo-implementation-checklist.md`](tool-demo-implementation-checklist.md) も参照。

## A. 体験・理解（tool-demo 6.5 相当）

- [ ] **30秒で理解できる**: 入力1回 → 生成 → 使える成果物2点、の流れがタイトル・`oneLiner`・`description` で伝わる
- [ ] **サンプル入力3件**: `sampleData` に実演用3パターン（短/中/長や平常/トラブルが混ざるとよい）
- [ ] **CTAが試作依頼に接続**: `ctaTitle` / `ctaButtonText` で「3営業日で試作」等、問い合わせ導線が明示されている
- [ ] **出力は2点固定**: `mockOutputPrimary` と `mockOutputSecondary` が毎回同じ役割・見出し構造（`outputStructure` と整合）
- [ ] **専門用語を避ける**: ユーザー向け説明・モック本文で「AI」「RAG」より、業務上のベネフィット表現を優先

## B. モック本文のルール（追加）

- [ ] **固有名詞は最小限**: 架空の会社名・人名・案件名は必要最低限（コンシェルジュの捏造防止方針と整合）
- [ ] **モックは読み切れる長さ**: ストリーミング演出でも破綻しないよう、過度に長いテキストにしない
- [ ] **`ai_live` 以外は `mock_preview`**: 原則モックで投入し、反応確認後に昇格（[`docs/新規デモ追加手順.md`](新規デモ追加手順.md)）

## C. データ・スキーマ

- [ ] **slug**: kebab-case、既存と重複なし（`scripts/demo-batches/`・`seed-ai-demos.ts` 内を検索）
- [ ] **industry**: `construction` / `legal` / `manufacturing` のいずれか
- [ ] **industryTags / functionTags / moduleTags**: 一覧・基盤図の絞り込みに使うため、1本あたり過剰に多くしない（主目的が伝わる程度）
- [ ] **writingTone**: 必要なら明示。省略時はシードの推論に任せる（[`docs/demo-next-20-seed-format.md`](demo-next-20-seed-format.md)）

## D. バッチ単位（10本ごと推奨）

- [ ] **機能パターンの偏り**: [`docs/demo-mock-taxonomy-matrix.md`](demo-mock-taxonomy-matrix.md) の表で、同セルへの集中が続いていないか確認
- [ ] **重複インベントリ更新**: [`docs/demo-mock-inventory.md`](demo-mock-inventory.md) に追記済み
- [ ] **seed 実行または Studio Publish 後**: `/demo`・`/demo/[slug]` の表示をスポット確認

## E. 初回体験フロー（UI で誘導・tool-demo / 体験プロトタイプ共通）

長文の機能説明より、**最初の数秒で「次の一手」が視線で分かる**ことを優先する。

- [ ] **主 CTA は原則1つ**（実行・生成など）。補助操作は主操作の後か、視覚的に一段弱くする
- [ ] **初回は短い一本道**（未入力→試す→結果）。高度な設定は折りたたみ・ウィザード・後段に分離
- [ ] **サンプル・シナリオ切替**は「中身の差し替え」と分かるラベル（「サンプル1」だけにしない）。可能なら入力欄の直上に置く
- [ ] **詳細仕様・機能一覧**はページ上段を占有しない（折りたたみ・「詳しく」・`/experience` では `foldLeadCopy` 等で任意表示）
- [ ] **フローティングの「相談」系**は、生成の主ボタンと役割が被らない表記にする
- [ ] **アクセシビリティ**: 視覚誘導に加え、ボタン名や `aria-label` で「押すと何が起きるか」を短く伝える（長文マニュアルの代替ではない）

既存の書類たたき台シェル（[`BeforeAfterDocumentShell`](../src/components/experience/shells/BeforeAfterDocumentShell.tsx)）では `DocumentShellPresetDefinition.sampleLabels` でシナリオ名を渡せる。

## F. 横展開（優先度）

パイロットで型が固まったら、[`docs/demo-mock-inventory.md`](demo-mock-inventory.md) または [demo-portfolio-triage.md](demo-portfolio-triage.md) の優先度に沿って順次、セクション E を適用する。重複 UI が増えたら共有コンポーネント化を検討する。
