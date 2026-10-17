# AXEON UI — 部品レイアウト契約（フェーズ E）

**版:** 2026-10-16  
横断で揃える部品のみ定義する。ページごとの改行・文言はフェーズ F。

## コンテナ・見出し（横断）

| 項目 | 契約 | 実装 |
|------|------|------|
| 企業ページコンテナ | `ax-container-wide`（max 1160px + gutter） | `axLayout.containerWide` / `.ax-container-wide` |
| 読み物コンテナ | `ax-container-reading`（min 42rem） | contact・記事本文 |
| セクション余白 | `--ax-section-standard-y` | `AxSection` / `.ax-section-standard` |
| セクション見出しロール | `ax-role-section-title` | PC 34 / SP 26 |
| トップ見出しスタイル | `HOME_SECTION_HEADING_STYLES` は clamp 系で暫定 | F で `ax-role-*` へ寄せるか判断 |

## 部品 ID

### `home.demo-featured-article`

| 項目 | 契約 |
|------|------|
| 外枠 | `rounded-2xl`〜`28px`、border、`bg-[var(--df-bg)]`、共通 padding 段階 |
| グリッド | `lg:grid-cols-2` + **`items-stretch`** |
| 右メディアスロット | **`h` + `max-h` 同値**（例: SP 260px → lg **420px**）。`min-h-0 overflow-hidden` でグリッド伸長を抑止 |
| lg 文案列 | デモ列と **同じ行高（420px）**。見出しは **lg:text-4xl + line-clamp-2** で行の暴れを抑える |
| テキスト | PC 見出しは `titleLines` 2行。Before/After はラベル上・2行本文。CTA は After 直下（注記なし） |

実装: `src/components/home/demo-showcase/TopFeaturedDemoShowcase.tsx`

### `home.implementation-showcase-card`

| 項目 | 契約 |
|------|------|
| 親グリッド | 列の子は **`h-full`** |
| カード本体 | **`h-full flex flex-col`** で高さ揃え |
| メディア帯 | 共通アスペクト（既存カード仕様を維持し枠だけ揃える） |

実装: `src/components/home/ImplementationShowcaseCard.tsx` + 親セクション

### `home.demo-section-heading`

| 項目 | 契約 |
|------|------|
| 改行 | 意味の切れ目のみ。空 `<br>` 禁止 |
| 文言 | 既存コピーを維持（新規作成しない） |

実装: `src/components/home/HomeDemoFirstShowcase.tsx`
