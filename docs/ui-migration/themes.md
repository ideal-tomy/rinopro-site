# AXEON UI 移行 — テーマ規則

**版:** 2026-10-16  
**適用方法:** ルート要素に `data-ax-theme="..."` を付与。CSS は `src/styles/axeon-themes.css`。

| テーマ ID | 用途 | 上書きする変数 |
|-----------|------|----------------|
| `corporate`（省略時） | サイト本体 | 既定 `--ax-*` |
| `care` | 介護 DX LP（kaigo） | brand→緑系、accent、surface |
| `chuken` | 中堅向け LP | brand→navy、accent→赤系 |
| `lp` | IndustryLpPage | `--lp-primary` 等を `--ax-brand-primary` に接続 |

### スコープ

```html
<div data-ax-theme="care" class="ax-page">…</div>
```

テーマは **色・影・角丸の意味付け**のみ。タイポロール名・余白ロール名・コンテナ幅は共通。

### Industry LP

`IndustryLpPage` の `--lp-primary` / `--lp-ink` / `--lp-surface` をテーマ `lp` で `--ax-brand-primary` / `--ax-text-heading` / `--ax-surface-page` にマップする（C-4）。
