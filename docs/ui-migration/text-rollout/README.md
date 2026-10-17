# テキスト表示ルール — ページ別展開（進捗）

**正本:** [`docs/最終改善/AXEON_全サイト共通_テキスト表示ルール.md`](../../最終改善/AXEON_全サイト共通_テキスト表示ルール.md)  
**数値・色:** [`docs/最終改善/AXEON_UI共通ルール.md`](../../最終改善/AXEON_UI共通ルール.md) §4–5 / `src/styles/axeon-ui.css`

## 進め方（1 URL ごと）

1. 構成表（セクション・読者の疑問・要点・型 A〜E）を `NN-<slug>.md` に書く
2. 必要なコピーだけ `src/lib/content/*` で構造化（文言は削らない）
3. `ax-role-*` / 既存パターンで表示を整える
4. ブラウザで **390px（iPhone 相当）** と **1280px（PC）** を目視
5. この表と `rollout-log.md` を更新

### ブラウザ確認のコツ

- スクロール演出（`data-scroll-reveal-unit`）は画面外だと透明。スクショ時は対象までスクロールするか、`prefers-reduced-motion: reduce` で確認する
- 固定ヘッダーがセクション上端に重なるので、見出しの改行はアンカー移動後に確認する
- 実機 iPhone: 同一 Wi‑Fi で `http://<PCのLAN IP>:3000`

## 共通で入れたもの

| 日付 | 内容 |
|------|------|
| 2026-10-18 | `ax-role-lead` / `ax-role-body` / `.ax-prose p` に `text-wrap: pretty`（末尾 1〜2 文字の行落ちを抑える。Chrome 117+ / Safari 26+、未対応ブラウザは従来どおり） |
| 2026-10-18 | `AxPhrases`（句単位でだけ折り返す）・`AxRichParagraph`（強調・引用つき段落）。Chrome の `pretty` は日本語の行末落ちに効きにくいため、見出し・リード・短い説明は `AxPhrases` を使う |
| 2026-10-18 | `ax-pattern-flow` / `ax-pattern-compare`: unlayered の `margin: 0` を外し（`mt-*` が効くように）、区切りを 1px の細線に |

## 進捗表

| # | URL | 構成表 | 390 | 1280 | 文言変更 | 残課題 |
|---|-----|--------|:---:|:----:|----------|--------|
| 0 | `/`（#about・#ceo 基準実装） | [01-home.md](01-home.md) | ☑ | ☑ | なし | — |
| 1 | `/` 残セクション | [01-home.md](01-home.md) | ☑ | ☑ | なし | デモの Before/After ピルは既存契約のまま |
| 2 | `/services/consulting` | [02-consulting.md](02-consulting.md) | ☑ | ☑ | なし | 項目本文（比較・工程）は共通パターンが文字列のみのため自然折り返し |
| 3 | `/about` | [03-about.md](03-about.md) | ☑ | ☑ | なし（代表原稿をトップと共有） | 「大切にしていること」3 列の行末 |
| 4 | `/services` | [04-services.md](04-services.md) | ☑ | ☑ | なし | — |
| 5 | `/contact` | [05-contact.md](05-contact.md) | ☑ | ☑ | なし | — |
| 6 | `/services/insourcing-enablement` | [06-enablement.md](06-enablement.md) | ☑ | ☑ | なし | — |

共有 CSS 変更の影響確認（2026-10-18）: `/lp/chuken-enterprise-v2` の APPROACH と `/prototype-showroom` のギャラリーを 390 / 1280 で確認し、崩れ・横はみ出しなし。chuken は SP で独自の `pb-8` と共通の gap が重なり STEP 間がやや広い（chuken 側の調整はフェーズ 2 の `/lp/*` で扱う）。

フェーズ 2 以降: `/industries/*` → `/experience` → `/articles/*` → `/estimate-detailed*` → `/lp/*`
