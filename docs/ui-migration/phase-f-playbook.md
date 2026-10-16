# フェーズ F — URL 単位調整プレイブック

**前提:** フェーズ E（共通化完了）が終わっていること。

## 1 URL あたりの手順

1. **対象 URL を選ぶ**（`phase-f-backlog.md` の優先度順）
2. **代表幅で目視** — 375 / 768 / 1280（必要なら 320 / 1440 も）
3. **チェック** — `acceptance-matrix.md` の列（タイポ・色・改行・overflow・図解 SP・操作・a11y）
4. **差分を部品 ID で記録** — ページ名の応急 CSS は禁止。`component-contracts.md` か `exceptions.md` を更新
5. **最小差分で実装** — Ax トークン / パターン優先。新規 `*.module.css` 禁止
6. **検証** — `npm run verify:ax-ui`、該当 URL の build ルート確認
7. **マトリクス更新** — 合格列をチェック、バックログ行を閉じる

## スモーク（E 完了直後・F 開始時）

CRITICAL_URLS + `/lp/chuken-enterprise-v2` を 375 と 1280 で各 1 回:

- `/` `/about` `/contact` `/services` `/services/consulting`
- `/services/insourcing-enablement` `/industries/construction` `/experience`
- `/estimate-detailed` `/lp/kaigo-care-dx` `/lp/chuken-enterprise-v2` `/prototype-showroom`

確認: 意図しない横スクロールなし、主要 CTA 到達可、本文が読める。

## 優先候補（初期）

1. `/lp/kaigo-care-dx` — archive HTML とのセクション parity
2. `/` — デモセクション・業界カード
3. `/services/consulting` — 改行・図解 SP
4. `/lp/chuken-enterprise-v2` — ディスプレイ書体・複雑セクション
