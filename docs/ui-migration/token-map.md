# AXEON UI 移行 — トークン対応表（v1.1 承認版）

**版:** 2026-10-16  
**状態:** 実装値を正式採用（`src/styles/axeon-ui.css`）。変更時は本表と CSS を同時更新。

## 色

| ax トークン | 値 / 参照 | 旧トークン |
|-------------|-----------|------------|
| `--ax-text-heading` | `var(--color-text-primary)` `#1a1a1a` | — |
| `--ax-text-body` | `var(--color-text)` `#1a1a1a` | — |
| `--ax-text-supporting` | `var(--color-text-secondary)` `#4a4a4a` | — |
| `--ax-link` | `#1d4ed8` | Tailwind blue-700 相当 |
| `--ax-brand-primary` | `var(--color-accent-primary)` `#26418e` | — |
| `--ax-surface-page` | `var(--color-bg-base)` `#fafaf8` | — |
| `--ax-surface-card` | `var(--color-bg-pure)` `#fff` | — |
| `--ax-surface-muted` | `var(--color-bg-neutral)` `#f4f4f2` | — |
| `--ax-border-subtle` | `var(--color-border-light)` `#e5e5e0` | — |
| `--ax-focus-ring` | `var(--color-accent-primary)` | — |

## タイポロール（PC / SP）

| ロール | class | PC | SP |
|--------|-------|----|----|
| display | `ax-role-display` | 48px / 1.30 | 32px / 1.35 |
| page-title | `ax-role-page-title` | 40px / 1.40 | 30px / 1.40 |
| section-title | `ax-role-section-title` | 34px / 1.45 | 26px / 1.45 |
| item-title | `ax-role-item-title` | 22px / 1.45 | 19px / 1.50 |
| lead | `ax-role-lead` | 18px / 1.75 | 16px / 1.75 |
| body | `ax-role-body` | 16px / 1.75 | 16px / 1.70 |
| supporting | `ax-role-supporting` | 14px / 1.65 | 同左 |
| ui-label | `ax-role-ui-label` | 13px / 1.45 | 同左 |
| eyebrow | `ax-role-eyebrow` | 12px / 1.40 | 同左 |

## レイアウト

| トークン / class | 値 |
|------------------|-----|
| `--ax-container-max` | 1160px |
| `--ax-gutter` | 20 / 32(md) / 40(lg) |
| `.ax-container-wide` | min(max, 100% - gutter*2) |
| `.ax-container-reading` | min(42rem, …) |
| `--ax-section-standard-y` | 64 / 96(md) |
| `--ax-section-compact-y` | 48 / 64(md) |

## 禁止

- 新規ページ固有 `*.module.css`（例外は `exceptions.md`）
- 新規 hex 直書き（テーマ上書きファイル以外）
- Tailwind `text-base`（サイズ用途）
