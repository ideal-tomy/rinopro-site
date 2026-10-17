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
| 右メディアスロット（lg） | **`h` + `max-h` 同値 420px**。`min-h-0 overflow-hidden` でグリッド伸長を抑止 |
| 右メディアスロット（lg 未満） | 高さ固定なし（中身に合わせてデモ全体を表示）。保育デモの画像グリッドのみ `h-[280px]` / `sm:h-[360px]` |
| lg 文案列 | デモ列と **同じ行高（420px）**。左だけ `lg:pl-10 xl:pl-14` で列間とのバランスを取る |
| テキスト（lg） | 見出しは `titleLines` 2行。Before/After はラベル上・2行本文。CTA は After 直下（注記なし） |
| テキスト（lg 未満） | 文案列は非表示。Before/After は不透明の横長ピル2つ（左下重ね、`DemoFrameBottomOverlayContext`）。`useScrollLinkedOpacity` の中盤で左からスライドイン（After は Before より遅れ）。同 opacity で本文に黒ディム（`bg-black/42`）。`prefers-reduced-motion` 時はディム常時・ピルは最終位置。余白は増やさない。タグは非表示。CTA はデモ枠の下に全幅 |

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

## 読み物（テキスト表示ルール基準実装）

正本: [`AXEON_全サイト共通_テキスト表示ルール.md`](../最終改善/AXEON_全サイト共通_テキスト表示ルール.md) §3.2・§9

### `home.brand-story`（型 B・暗背景）

| 項目 | 契約 |
|------|------|
| 構成 | 文脈ラベル → 2 行見出し（`headingLines`）→ 導入 → 意味ブロック ×2 → ビジョン → 結び |
| 意味ブロック | context（lead サイズ・薄青）→ block lead（太字）→ body。context と block lead は近く、ブロック間は広く |
| 揃え | SP は全て左揃え。PC は見出しのみ中央、本文は `max-w-[42rem]` 左揃え |
| 強調 | 1 ブロック 1 箇所まで（`emphasis` を構造化して保持） |

実装: `HomeBrandStorySection.tsx` / `homeLandingCopy.brandStory` / `HOME_BRAND_STORY_STYLES`

### `home.ceo-message`（型 B・明背景）

| 項目 | 契約 |
|------|------|
| 構成 | ラベル → 2 行見出し（`messageHeadingLines`）→ 役職・氏名 → 本文カード |
| PC（lg+） | 左: 見出し・署名（sticky）、右: 本文カード `46rem` 上限（1 行 35〜40 字） |
| 本文 | `message[]` の `emphasis`（本文内太字）と `variant: "quote"`（左線の引用）だけで差をつける |

実装: `HomeCeoMessageSection.tsx` / `homeLandingCopy.ceo` / `HOME_CEO_STYLES`

### `ax.phrases`

| 項目 | 契約 |
|------|------|
| 用途 | 見出し・リード・FAQ 質問・短い注記など、**短い文**を意味のまとまりでだけ折り返す |
| データ | `readonly string[]`（句の配列）。文言は変えず区切るだけ |
| 1 文 1 行を守りたいとき | `<span className="block">` の中に `AxPhrases` を入れる（PC は行固定、SP は句で折り返し） |
| 使わない | 3 行を超える本文段落（自然折り返し＋`text-wrap: pretty` に任せる） |

実装: `src/components/ui/ax/AxPhrases.tsx`

### `ax.compare` / `ax.flow`（区切り線）

| 項目 | 契約 |
|------|------|
| 区切り線 | 1px `--ax-border-subtle`。ブランド色の太線は使わない（ラベル・見出しで階層を作る） |
| 間隔 | 項目間 32px 以上、項目見出し → 説明 8px |
| 余白 | パターン側で `margin` を持たない（`mt-*` を親から渡す） |

### `ax.reading-block`（保留）

意味ブロックを持つ読み物が **2 箇所目** に現れた時点で `src/components/ui/ax/patterns/AxReadingBlock.tsx` に切り出す。それまでは上記 2 契約を見本としてコピーしない（同じ形のデータ構造だけ揃える）。
