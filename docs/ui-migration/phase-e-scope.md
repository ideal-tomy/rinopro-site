# フェーズ E — スコープ正本

**版:** 2026-10-16  
**正本:** `docs/最終改善/AXEON_UI共通ルール.md` §1.5

## 完了定義（「共通化完了」）

1. `docs/ui-migration/url-registry.md` の公開 URL で、`ax接続` が **済** または **例外台帳登録済み**
2. `npm run build` と `npm run verify:ax-ui` が通る
3. `docs/ui-migration/phase-f-backlog.md` に URL 別の未調整項目が列挙されている

## 含める / 含めない

| 含める | 含めない（フェーズ F） |
|--------|------------------------|
| 全主要 URL の `ax-page` / `data-ax-theme` / `data-ax-density` 接続 | kaigo / chuken の旧 HTML ピクセル parity |
| コンテナ・セクション余白の横断ルール確定と代表部品の契約 | ページごとの見出し改行・原稿調整 |
| トップ等の部品 ID 単位のレイアウト契約＋最小 grid 修正 | `consulting-final` 等 module の全面削除 |
| chuken: App Router + `theme:chuken` + セクション骨格 | 体験プロトタイプ内部 UI の作り直し |

## 凍結する CSS Modules（削除しない）

フェーズ E では参照を壊さず、外側シェルのみ ax 接続する。

| パス | 備考 |
|------|------|
| `src/components/services/consulting-final.module.css` | consulting 本番ビュー |
| `src/components/services/enablement-page.module.css` | enablement |
| `src/components/services/services-page.module.css` | サービス一覧 |
| `src/components/services/service-landing-shared.module.css` | 共有 |
| `src/components/services/service-navigation.module.css` | アンカーバー |
| `src/components/services/service-flow-diagram.module.css` | 図解 |
| `src/components/services/enablement-pre-support-diagrams.module.css` | 図解 |
| `src/components/about/about-page.module.css` | about |
| `src/components/home/reason/ReasonLoopDiagram.module.css` | 図解 |

## 変更禁止

- 新規ページ固有 `*.module.css`（例外は `exceptions.md` に ID・理由・検証を追記してから）
- 新規 hex 直書き（テーマ上書きファイル以外）
- Tailwind `text-base`（サイズ用途）
- 明背景上の `text-white`

## ホームコンテナ方針（E2 決定）

企業ページの横断コンテナは **`--ax-container-max`（1160px）系**を正式とする。  
トップの `home-presentation` は `axLayout.containerWide` に寄せる。見た目の微差はフェーズ F のバックログで扱う。
