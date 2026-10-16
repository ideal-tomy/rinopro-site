# フェーズ F — URL / 部品バックログ

**前提:** フェーズ E 完了。手順は `phase-f-playbook.md`。  
**優先度:** P0（営業・LP 印象）→ P1（主要導線）→ P2（その他）

| 優先 | URL / 部品 ID | 現象 | 方針メモ | 状態 |
|------|---------------|------|----------|------|
| P0 | `/lp/kaigo-care-dx` | 旧 HTML とのセクション・デモ密度差 | tabpanel a11y、role-note、office/medical archive 密度、theme-care demo トークン | **done**（F2 2026-10-16） |
| P0 | `/lp/chuken-enterprise-v2` | Fraunces・Cases・Team・Header | Experience/Team/Cases dummy UI、Solutions 3フェーズ、SP メニュー・scroll hide | **done**（F2 2026-10-16） |
| P0 | `/` · `home.demo-featured-article` | 右枠の中身高さ差 | DemoFrame flex-1 + 内側 min-h-0 | **done**（F2 2026-10-16） |
| P1 | `/` · `home.implementation-showcase-card` | 業界カード本文長の差 | catchCopy line-clamp-3 適用済 | **done** |
| P1 | `/services/consulting` | 見出し改行・図解 SP | exampleDiagram 縦積み、flow-diagram 本文 15px 以上 | **done**（F3 2026-10-16） |
| P1 | `/services/insourcing-enablement` | enablement module 内の SP 余白 | stages 幅・padding 調整 | **done**（F3 2026-10-16） |
| P1 | `/about` | about module と ax ロールの差 | heading / body / gap を ax 変数へ | **done**（F3 2026-10-16） |
| P2 | `/industries/*` | `--lp-*` hex 直書きの残 | axeon-themes `theme:lp` 既定化、ページ上書き枠のみ | **done**（F4 2026-10-16） |
| P2 | `/experience/[slug]` | compact 内の操作 UI | FreeformChat 主説明 15px | **done**（F4 2026-10-16） |
| P2 | `/services` | services-page module | process steps カード高さ stretch | **done**（F4 2026-10-16） |

### 参照

- 旧 kaigo: `docs/archive/lp/kaigo-care-dx.html`
- 旧 chuken: `docs/archive/lp/chuken-enterprise-v2.html`
- 部品契約: `component-contracts.md`

### F1 実装メモ（2026-10-16）

- kaigo: `KaigoLpSections` / `KaigoDemoViews`、layout フォント、`KaigoCareDxPage` 構成復元
- chuken: `layout.tsx` Fraunces + ヒーロー display
- home: `DemoFrame` + 全 `*Showcase` の h-full

### F2–F4 実装メモ（2026-10-16）

- kaigo: tabpanel、デモ密度、`--ax-theme-demo-*`
- chuken: `ChukenSiteHeader` / `ChukenCasesSection` / `ChukenTeamSection`
- home: DemoFrame 縦 flex 埋め
- consulting / enablement / about / industries / experience / services: SP・トークン・高さ
