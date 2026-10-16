# AXEON UI 移行 — CSS 競合マップ

**版:** 2026-10-16（フェーズ A）  
**正本:** `src/styles/axeon-ui.css`（`--ax-*`）

---

## 1. コンテナ定義

| 場所 | 定義（移行前/途中） | 状態 |
|------|---------------------|------|
| `axeon-ui.css` `.ax-container-wide` | `min(1160px, 100% - gutter*2)` | **正本** |
| `consulting-final.module.css` `.container` | `var(--ax-container-max)` 参照済み | 接続済 |
| `service-landing-shared.module.css` `.container` | 同上 | 接続済 |
| `consulting-page.module.css` `.container` | 同上 | 接続済（ナビ等） |
| `IndustryLpPage` | Tailwind `max-w-*` + `--lp-*` | 未接続 |
| home-presentation | Tailwind 独自 | 未接続 |

---

## 2. CSS Modules 一覧（行数）

| ファイル | 行数 | 判定 |
|----------|------|------|
| `enablement-page.module.css` | ~1276 | **移行必須→削減**（C-2） |
| `consulting-page.module.css` | ~1074 | **参照ゼロ化後削除候補**（paper は ax へ移行済） |
| `services-page.module.css` | ~982 | 移行必須（C-1） |
| `consulting-final.module.css` | ~391 | ax トークン接続済。パターン置換で縮小（C-2） |
| `service-landing-shared.module.css` | ~388 | enablement 共有。コンテナ済。段階削減 |
| `enablement-pre-support-diagrams.module.css` | ~234 | 図解専用。ProcessFlow 候補 |
| `about-page.module.css` | ~200 | C-3 で ax 寄せ |
| `ReasonLoopDiagram.module.css` | ~154 | 図解。例外 or ProcessFlow |
| `service-flow-diagram.module.css` | ~97 | ProcessFlow 候補 |
| `service-navigation.module.css` | ~86 | ナビ残。anchorBar をここに集約 |

---

## 3. ブレークポイント重複

| 値 | 主な出現 | 方針 |
|----|----------|------|
| **639 / 768 / 1024** | `axeon-ui.css` | **正本** |
| 767px | enablement / consulting-page / globals scroll-reveal | C-2 で 768 へ寄せ |
| 899px | consulting-page / enablement / about | C-2 で 768 または 640 へ |
| 900px | consulting-final | 768 へ統一予定 |
| 429px | consulting-page paper | 640 帯に吸収可 |

---

## 4. グローバル強制・危険パターン

| 項目 | 状態 |
|------|------|
| `p, li { line-height: !important }` | **廃止済**（globals.css） |
| `--line-height-body: 1.75` | globals 更新済 |
| `text-base`（Tailwind 色衝突） | 残存: GuidedStepPanel, FreeformChatPanel, DemoTelop*, DemoDetailContent。`text-base-dark` は色トークンで別問題 |
| ガラス / `border-white/15` | プロジェクトルールで禁止。監査時に都度修正 |

---

## 5. Industry LP / テーマ変数

| 接頭辞 | 用途 | ax との関係 |
|--------|------|-------------|
| `--color-*` | サイト共通（globals） | `--ax-*` が参照 |
| `--ax-*` | UI ロール正本 | — |
| `--lp-*` | IndustryLpPage 業種色 | B/C-4 で `data-ax-theme` 上書きへ接続 |
| kaigo HTML 内 `--primary` 等 | 静的 LP | C-6 で `theme-care` |

---

## 6. 不具合仕分け（consulting レトロスペクティブより）

| 問題 | 分類 |
|------|------|
| 改行二重化（配列 span + block） | **共通原因** → Prose / EditorialIntro ルール |
| BP 899/767 競合 | **共通原因** → ax BP 一本化 |
| SP 本文 14px | **共通原因** → body 16px 固定 |
| 工程図 SP 12px | **共通原因** → ProcessFlow SP ルール |
| ご相談例の階層逆転 | **個別バグ**（コピー固定時は CSS 階層のみ） |
| loading と本番の CSS 不一致 | **個別バグ** → consulting loading は final に統一済 |
| デモ高密度 UI | **意図例外** → density:compact |
