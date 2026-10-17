# AXEON UI 移行 — 受け入れマトリクス

**正本:** `docs/最終改善/AXEON_UI共通ルール.md` §10  
**検証幅:** 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440  
**注:** F2–F4 実装後。2026-10-17 デザイン判断セッションで 375/1280 を再確認（詳細は [design-signoff-checklist.md](design-signoff-checklist.md) / [design-signoff-issues.md](design-signoff-issues.md)）。

| URL | タイポ | 色 | 改行 | 横 overflow | 図解 SP | 操作 | a11y | 備考 |
|-----|:------:|:--:|:----:|:-----------:|:-------:|:----:|:----:|------|
| `/` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | デザイン確認済・home 契約 OK |
| `/about` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | デザイン確認済（title 二重は issues #1） |
| `/contact` | ☑ | ☑ | ☑ | ☑ | — | ☑ | ☑ | フォーム UI OK・送信は本番で R5 |
| `/services` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | PROCESS 高さ揃え・意図横スクロールあり。PROCESS/メニュー余白を ax（gutter・section-compact）化、フリップカードは PC 広幅・SP スワイプ維持（2026-10-17） |
| `/services/consulting` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | 図解 SP 再確認。ヒーロー図は横書き（foreignObject）、サブナビ ax トークン化（2026-10-17） |
| `/services/insourcing-enablement` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | stages 操作 OK。サブナビ ax トークン化（2026-10-17） |
| `/industries/construction` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ヒーロー・試算 375 OK |
| `/industries/manufacturing` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | 同上 |
| `/experience` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | 一覧カード 375 OK |
| `/estimate-detailed` | ☑ | ☑ | ☑ | ☑ | — | ☑ | ☑ | wizard 入口 OK |
| `/articles/construction` | ☑ | ☑ | ☑ | ☑ | — | ☑ | ☑ | 読み物幅 OK |
| `/lp/kaigo-care-dx` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | タブ 3 種・PoC 導線 OK |
| `/lp/chuken-enterprise-v2` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | Cases/Team SP OK・noindex |
| `/prototype-showroom` | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ | noindex・社内 |

### 不合格例（再確認）

- `overflow-x: hidden` だけで横はみ出しを隠す
- CSS 値のみ合って画面未確認
- URL 別の応急 CSS

### サインオフ

| 役割 | 氏名 | 日付 |
|------|------|------|
| 技術検証 | Auto（実装ゲート） | 2026-10-16 |
| デザイン判断 | Auto（チェックリスト実行・P0 なし） | 2026-10-17 |

**補足:** 最終デザイン承認者（人）の確認は未。P1/P2 は [design-signoff-issues.md](design-signoff-issues.md)（ブランチ上は対応済み）。R5/R6 は 2026-10-17 記録 — [release-gates-r5-r6.md](release-gates-r5-r6.md)（R5: 本番メール送信要修正、R6: a11y 100 / perf 要改善）。
