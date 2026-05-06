# Lint Debt Backlog (Existing Issues)

作成日: 2026-05-07
対象ブランチ: feature/redesign-v2-phase12-push

## 目的

`npm run lint` の失敗要因を、今回の G-4/G-5 変更範囲とは切り分けて管理する。

## 方針

- 今回コミットでは、導線整理とライト統一を優先する。
- 既存 lint 負債は本ファイルで別チケット化し、後続でまとめて解消する。

## 既存lint負債（代表例）

`npm run lint` 実行結果より（今回変更外が中心）:

1. `scripts/assess-demo-portfolio-triage.js`
   - `@typescript-eslint/no-require-imports`
2. `src/components/chat/ConciergeFabNudge.tsx`
   - `react-hooks/set-state-in-effect`
3. `src/components/chat/ServiceCardConciergeStartFlow.tsx`
   - `react-hooks/set-state-in-effect`
4. `src/components/demo/DemoListRecommendationPopup.tsx`
   - `react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps`
5. `src/components/estimate/EstimateDetailedMobileShell.tsx`
   - `react-hooks/refs`
6. `src/components/estimate/EstimateDetailedProcessingContent.tsx`
   - `react-hooks/purity`
7. `src/components/three/ParticleField.tsx`
   - `react-hooks/purity`
8. `src/hooks/use-concierge-chat-transport.ts`
   - `react-hooks/refs`, `react-hooks/exhaustive-deps`
9. `src/hooks/use-page-transition.ts`
   - `react-hooks/set-state-in-effect`
10. `src/hooks/use-reduced-motion.ts`
    - `react-hooks/set-state-in-effect`

## 先行対応優先順位（提案）

1. `react-hooks/rules-of-hooks` / `react-hooks/refs` / `react-hooks/purity` 系
2. `react-hooks/set-state-in-effect`
3. `exhaustive-deps` / `unused-vars`

## 受け入れ条件（別チケット側）

- `npm run lint` が全体で通る
- 変更箇所ごとに回帰確認（`build`/主要導線）を実施
