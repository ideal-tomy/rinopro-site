# AXEON UI 移行 — 適用記録（rollout-log）

| 日付 | クラスタ | 内容 | 触った主なパス | 残 CSS |
|------|----------|------|----------------|--------|
| 2026-10-16 | C 基盤 v1.1 | axeon-ui / AxText・Container・Section / layout ax-site | `src/styles/axeon-ui.css`, `src/components/ui/ax/*`, `layout.tsx` | サービス系 module 残 |
| 2026-10-16 | A | url-registry / css-conflict-map / pattern-inventory | `docs/ui-migration/*` | — |
| 2026-10-16 | B | token-map / themes / exceptions / gallery | `axeon-themes.css`, `AxGallerySection`, prototype-showroom | — |
| 2026-10-16 | C0 | 表現パターン 8 種 | `src/components/ui/ax/patterns/*` | — |
| 2026-10-16 | C2 | consulting Ax 接続、consulting-page 参照ゼロ化・退避 | `ConsultingPage.tsx`, `service-navigation.module.css`, archive | enablement-page 残 |
| 2026-10-16 | C3–C5 | home/about/contact/industry/experience/estimate に ax 接続 | 各クラスタ | services-page.module 残 |
| 2026-10-16 | C6 | kaigo-care-dx Next 化、HTML 退避、rewrite 解除 | `src/app/lp/kaigo-care-dx`, `KaigoCareDxPage`, `docs/archive/lp` | chuken HTML 残 |
| 2026-10-16 | D | verify-ax-ui / acceptance-matrix / text-base 掃除 | `scripts/verify-ax-ui.mjs` | 手動スクショ未 |
| 2026-10-16 | E0 | phase-e-scope / component-contracts / phase-f-playbook / §1.5 | `docs/ui-migration/*`, `AXEON_UI共通ルール.md` | — |
| 2026-10-16 | E1 | 全クラスタ ax-page / theme / density シェル接続 | contact/about/services/articles/solutions/experience/estimate/industry | module 凍結維持 |
| 2026-10-16 | E2 | ホーム部品契約（stretch・min-h・h-full）・showroom プレビュー | `TopFeaturedDemoShowcase`, `home-presentation`, `AxGallerySection` | — |
| 2026-10-16 | E3 | chuken Next 化・HTML 退避・rewrite 解除 | `ChukenEnterpriseV2Page`, `docs/archive/lp`, `next.config.ts` | parity は F |
| 2026-10-16 | E4 | url-registry 更新・phase-f-backlog・verify 拡張 | `verify-ax-ui.mjs`, 台帳 | F サインオフ待ち |
| 2026-10-16 | F1 | P0 着手: kaigo セクション復元・デモ強化・LP フォント / chuken display / トップデモ h-full | `KaigoLpSections`, `KaigoDemoViews`, layouts, `TopFeaturedDemoShowcase` | parity 残は backlog |
| 2026-10-16 | F2–F4 | P0–P2 クローズ: kaigo demo a11y・密度 / chuken sections+header / home DemoFrame / consulting・enablement・about / industries トークン / experience 15px / services steps | `KaigoDemoViews`, `chuken/*`, `DemoFrame`, service/about modules, `axeon-themes.css` | acceptance デザイン判断待ち |
| 2026-10-17 | デザイン判断 | checklist 段 A–G: 375/1280 ブラウザ確認・導線・noindex。P0 なし。P1/P2 記録 | `design-signoff-checklist.md`, `design-signoff-issues.md`, `acceptance-matrix.md` | issues #1–#4 open |
