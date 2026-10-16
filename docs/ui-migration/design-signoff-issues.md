# デザイン判断 — 指摘一覧（§7.1）

**セッション:** 2026-10-17（localhost:3456 / `npm run build` 本番相当）  
**正本手順:** [design-signoff-checklist.md](design-signoff-checklist.md)  
**P0 open:** 0（コード修正なし）

| ID | URL | 幅 | 部品 ID / 箇所 | 現象 | 重要度 | 対応方針 | 状態 |
|----|-----|-----|----------------|------|--------|----------|------|
| 1 | 複数（about / contact / industries / experience 等） | — | `layout.tsx` `metadata.template` | ページ側 title が既に `\| AXEON` を含むと、タブタイトルが `… \| AXEON \| AXEON` になる | P1 | 各 page / コンテンツ metaTitle から末尾 `\| AXEON` を外し template に一本化 | closed（fix/p1-design-signoff） |
| 2 | `/` | 375/1280 | home.implementation-showcase-card（建物OS・OpenEstate） | 「詳細」が「デモ体験」と同じ外部 URL だった | P2 | 外部デモのみの事例は `showDetailCta: false` で「詳細」を非表示 | closed |
| 3 | `/lp/chuken-enterprise-v2` | 375 | グローバル Header + `ChukenSiteHeader` | SP でハンバーガーが二重（サイト全体メニューと LP 内アンカーメニュー） | P2 | `site-shell-routes` で chuken LP のグローバル Header/Footer を非表示 | closed |
| 4 | `/lp/kaigo-care-dx` | — | `sitemap.ts` | 公開 LP だが `/sitemap.xml` に未掲載（chuken / showroom は noindex で除外妥当） | P1 | インデックス対象なら sitemap に追加 | closed（fix/p1-design-signoff） |

### 合格メモ（要約）

- 全 CRITICAL URL HTTP 200。ページ全体横 overflow: 375/1280 で重大漏れなし（consulting / services の「意図した」カード横スクロールは領域内）。
- トップ: フィーチャー 4 枚の左右列高さ揃え（1280）、業界 6 カード高さ揃え（1280）、CTA `_blank` 外部 OK。
- kaigo: タブ 3 種・`role=tabpanel`・`#contact-kaigo` 存在・底部 CTA `/contact`。
- chuken: SP ページメニューに考え方〜FAQ、CTA `/contact?from=lp-chuken-v2`、`robots=noindex, follow`。
- showroom: `robots=noindex, nofollow`。
- 旧 HTML: `/lp/*.html` → Next へ rewrite（307→200）。
