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
