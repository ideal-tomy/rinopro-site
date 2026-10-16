# AXEON UI 移行 — 公開 URL 台帳

**版:** 2026-10-17（デザイン判断確認）  
**入力:** `docs/page-media-audit-2026-10-16/pages.csv`、`src/app/sitemap.ts`、`npm run build` ルート  
**検証状態:** F2–F4 実装済み。デザイン判断チェックリスト実行済（P0 なし・P1/P2 は `design-signoff-issues.md`）。

列: `URL` / `種別` / `テーマ` / `スタイル由来` / `利用パターン` / `例外` / `検証` / `ax接続`

| URL | 種別 | テーマ | スタイル由来 | 利用パターン | 例外 | 検証 | ax接続 |
|-----|------|--------|--------------|--------------|------|------|--------|
| `/` | 企業・案内 | corporate | Tailwind + home-presentation + ax | EditorialIntro, ProcessFlow, ContactCTA | home:presentation-clamp | F:デザイン確認 2026-10-17 | **済** |
| `/about` | 企業・案内 | corporate | CSSModule (`about-page`) + ax シェル | EditorialIntro, Prose | module 凍結 | F:デザイン確認 2026-10-17 | **済**（シェル） |
| `/contact` | 企業・案内 | corporate | ax | ContactCTA, Prose | — | F:デザイン確認 2026-10-17 | **済** |
| `/services` | サービス | corporate | CSSModule (`services-page`) + ax シェル | EditorialIntro, DecisionComparison | module 凍結 | F:デザイン確認 2026-10-17 | **済**（シェル） |
| `/services/consulting` | サービス | corporate | CSSModule (`consulting-final`) + Ax patterns | EditorialIntro, ProcessFlow, Evidence, ContactCTA | module 凍結 | F:デザイン確認 2026-10-17 | **済** |
| `/services/insourcing-enablement` | サービス | corporate | CSSModule (`enablement-page`) + ax シェル | ProcessFlow, BeforeAfter, ContactCTA | module 凍結 | F:デザイン確認 2026-10-17 | **済**（シェル） |
| `/industries/construction` | 業界LP | lp | Tailwind (`IndustryLpPage`) + theme-lp | EditorialIntro, BeforeAfter, ProductScreen, ContactCTA | theme-lp | F:デザイン確認 2026-10-17 | **済** |
| `/industries/manufacturing` | 業界LP | lp | 同上 | 同上 | theme-lp | F:デザイン確認 2026-10-17 | **済** |
| `/solutions/*`（construction以外） | 業界・記事 | corporate | Tailwind + ax シェル | Prose, EditorialIntro | — | F:デザイン確認 2026-10-17 | **済** |
| `/articles/*` | 記事 | corporate | Tailwind + ax-page | Prose | container-reading | F:デザイン確認 2026-10-17 | **済** |
| `/articles/t/*` | 記事 | corporate | Tailwind + ax-page | Prose | container-reading | F:デザイン確認 2026-10-17 | **済** |
| `/experience` | デモ一覧 | corporate | Tailwind + ax | EditorialIntro | — | F:デザイン確認 2026-10-17 | **済** |
| `/experience/[slug]`（掲載中） | 体験 | corporate | Tailwind + prototypes + ax | ProductScreen | density:compact | F:デザイン確認 2026-10-17 | **済**（例外付き） |
| `/demo/[slug]` | デモ詳細 | corporate | Tailwind + ax | ProductScreen, Prose | density:compact | F:デザイン確認 2026-10-17 | **済**（例外付き） |
| `/estimate-detailed*` | 見積 | corporate | Tailwind + ax | Prose, ContactCTA | density:compact | F:デザイン確認 2026-10-17 | **済**（例外付き） |
| `/prototype-showroom` | 社内 | corporate | Tailwind + Ax gallery | — | noindex | F:デザイン確認 2026-10-17 | **済** |
| `/lp/kaigo-care-dx` | LP（Next） | care | Ax patterns + theme-care | 全パターン | theme-care | F:デザイン確認 2026-10-17 | **済** |
| `/lp/chuken-enterprise-v2` | LP（Next） | chuken | Ax patterns + theme-chuken | EditorialIntro, ProcessFlow, ContactCTA | theme-chuken, noindex | F:デザイン確認 2026-10-17 | **済** |
| `/studio/*` | CMS | corporate | Sanity | — | scope:studio | — | **例外**（対象外） |

### リダイレクトのみ（移行対象外・台帳記録）

`/consulting`→consulting、`/flow`→enablement、`/demo`・`/demo/list`・`/cases`・`/case-studies`→experience、旧 `/services/*` スラッグ、`/solutions/construction`→industries、`*.html` LP 正規化。

### 動的 slug 展開メモ

- 記事: `getAllArticleSlugs` / `getAllThemeArticleSlugs`（sitemap 参照）
- 業界 LP: `getAllIndustryLpSlugs`（construction, manufacturing）
- 体験掲載: `ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS`
- デモ: Sanity `fetchDemosForDisplay`

### クラスタ対応

| クラスタ | 主な URL | E 状態 |
|----------|----------|--------|
| C-1 シェル | Header/Footer, `/contact`, `/services` | 済 |
| C-2 サービス詳細 | `/services/consulting`, `/services/insourcing-enablement` | 済（module 凍結） |
| C-3 トップ・about | `/`, `/about` | 済（about module 凍結） |
| C-4 業界・記事 | `/industries/*`, `/articles/*`, `/solutions/*` | 済 |
| C-5 体験・見積 | `/experience*`, `/demo/*`, `/estimate-detailed*` | 済 |
| C-6 静的 LP | `/lp/kaigo-care-dx`, `/lp/chuken-enterprise-v2` | 済（Next） |
