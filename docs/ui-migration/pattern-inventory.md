# AXEON UI 移行 — 表現パターン対応表

**版:** 2026-10-16（フェーズ A）  
**正本:** `docs/最終改善/AXEON_UI共通ルール.md` §7、`docs/demo-detail-lp-kaigo-pattern.md`

| パターン ID | 向く内容 | 既存コンポーネント候補 | ax 実装状況 | 優先 |
|-------------|---------|------------------------|-------------|------|
| `EditorialIntro` | 大見出し＋要旨 | ConsultingPage hero、IndustryLp hero、home Hero | **C0 で実装** | 高 |
| `Prose` | 長文・記事 | serviceReading、記事本文、about ストーリー | **C0 で実装** | 高 |
| `ProcessFlow` | 工程・手順 | ServiceFlowDiagram、Consulting steps、enablement 階段 | **C0 で実装** | 高 |
| `ContactCTA` | 問い合わせ | consulting contact、home CTA、IndustryLp CTA | **C0 で実装** | 高 |
| `Evidence` | 成果物・数値 | ConsultingResultSample（`ax-evidence-paper`） | **済** | — |
| `BeforeAfter` | 現状と改善 | IndustryLp 比較、kaigo BA、case-study-before-after | C0 後半 | 中 |
| `ProductScreen` | 操作画面 | kaigo appframe、experience prototypes、demo detail | C0 後半 / C-5 例外多 | 中 |
| `DecisionComparison` | 選択肢比較 | services flip cards、consulting roles | C0 後半 | 中 |

### ページ → パターン（代表）

| ページ | 主に使うパターン |
|--------|------------------|
| `/services/consulting` | EditorialIntro, ProcessFlow, Evidence, ContactCTA, Prose |
| `/services/insourcing-enablement` | EditorialIntro, ProcessFlow, BeforeAfter, ContactCTA |
| `/` | EditorialIntro, ProcessFlow, ContactCTA |
| `/industries/*` | EditorialIntro, BeforeAfter, ProductScreen, ContactCTA |
| `/lp/kaigo-care-dx` | 上記すべて（設計思想の基準） |
| `/experience/[slug]` | ProductScreen（density:compact 例外） |

### C0 実装先

`src/components/ui/ax/patterns/` — スタイルは `axeon-ui.css` の `.ax-pattern-*` に集約。
