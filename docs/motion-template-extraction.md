# モーション UI の切り出し境界とテンプレ保存方針

Axeon ほぼ完成後のリファクタに向け、**再利用テンプレ（GitHub）に載せる単位**と **アプリに残すドメイン境界**をファイル単位で整理する。

**GitHub Template の初版を実際に作る手順**（create-next-app → ファイルコピー → push → Template 化）は **`docs/motion-template-preparation.md`** を参照。

---

## 1. 推奨する「保存」の形（優先順）

| 優先 | 方式 | 含めるもの | 向いている用途 |
|------|------|------------|----------------|
| 1 | **GitHub Template Repository**（薄い Next スターター） | **初版はレイヤー 0〜1** + 最小 `app/`。レイヤー 2 は切り出し後に追加 | 新サイト／新アプリを「Use this template」で即開始 |
| 2 | **同一 monorepo の `packages/motion-ui`（任意）** | レイヤー 0〜2 を npm パッケージ化 | Axeon を動かしたまま、他リポから `workspace:*` で共有 |
| 3 | **GitHub Packages（private npm）** | 2 と同じ中身をバージョン付きで公開 | 複数クライアント案件で更新を追いたいとき |

**ドメイン固有（見積もり・チャット・体験デモ）はテンプレに「薄くサンプルだけ」載せ、本番データ・API は載せない。**

---

## 2. レイヤー構造（依存の向き）

```
レイヤー 0  tokens + variants     → 数値・イージング・Variants 定義のみ
レイヤー 1  primitives           → PageTransition, FadeIn, 汎用 Stagger 等
レイヤー 2  interaction patterns   → ステップ横断フェード、イントロ連続、待機 UI の「殻」
レイヤー 3  product / domain       → 見積フォーム、コンシェルジュ、デモ個別（Axeon に残す）
```

- **テンプレに必ず含める**: 0 → 1 → 2 の順（2 は「汎用 API」まで。文言・分岐データは差し替え）。
- **案件ごとに差し替える**: レイヤー 3 と、レイヤー 2 への **children / config 注入**。

---

## 3. レイヤー 0 — トークン・共通 Variants（最初に切り出す）

| ファイル | 役割 | テンプレ化 |
|----------|------|------------|
| `src/lib/motion/config.ts` | `DURATION_*`, `STAGGER_DELAY`, Hero 用 `HERO_*` | ✅ そのまま or プロジェクト名を汎用化 |
| `src/lib/motion/variants.ts` | `EASE_*`, `fadeIn`, `staggerContainer`, `heroStaggerItem` 等 | ✅ |
| `src/app/globals.css`（該当ブロックのみ） | View Transitions API の `::view-transition-*` | ✅ コメント付きで断片として同梱可 |

**リファクタ時の整理案**

- `EstimateDetailedHearingWizard.tsx` と `EstimateDetailedMobileShell.tsx` で重複している **`easeSpeak = [0.22, 1, 0.36, 1]`** を `lib/motion/variants.ts`（例: `EASE_SPEAK`）に寄せる。
- `PageTransition.tsx` は `DURATION_PAGE_*` を参照しているが `durationOut` は定義のみで exit に未使用 — テンプレ化前に **意図どおりか**だけ確認（仕様として残すならコメントで固定）。

---

## 4. レイヤー 1 — プリミティブ（既存 `components/motion/` を核に）

| ファイル | 役割 | テンプレ化 |
|----------|------|------------|
| `src/components/motion/PageTransition.tsx` | ルート単位の blur フェード（`pathname` key） | ✅ `usePathname` は Next 依存のままでよい |
| `src/components/motion/PageContent.tsx` | ページ内スタッガー | ✅ |
| `src/components/motion/StaggerChildren.tsx` | 子の順番表示 | ✅ |
| `src/components/motion/FadeIn.tsx` | 汎用フェード | ✅ |
| `src/components/motion/MotionDiv.tsx` | 薄いラッパ | ✅ 任意 |
| `src/components/motion/ScrollSequence.tsx` | スクロール連動 | ✅ ページ演出で使う場合のみ |
| `src/components/motion/PulseScale.tsx` | パルス | ✅ 任意 |
| `src/app/template.tsx` | `AnimatePresence mode="wait"` + `PageTransition` | ✅ App Router の必須パターンとして同梱 |
| `src/hooks/use-reduced-motion.ts` | `prefers-reduced-motion` | ✅ レイヤー 0〜2 とセット |

---

## 5. レイヤー 2 — 抽象化の主戦場（「まず切り出す境界」）

ここが **見積ウィザード等から分離したい「動きのレシピ」**。

### 5.1 ステップ横断フェード（HearingWizard の核）

**現状**: `EstimateDetailedHearingWizard.tsx` 内で以下が **ドメイン（`stepId`・フォーム）と密結合**。

- `AnimatePresence mode="wait" initial={false}`
- `motion.div` の `key={stepId}`
- `motionProps`（`easeSpeak` + opacity / x / blur + `prefersReducedMotion` 分岐）

**切り出し案（新規ファイルのイメージ）**

| 提案パス | 責務 |
|----------|------|
| `src/components/motion/StepCrossfade.tsx`（名前は任意） | props: `stepKey: string \| number`, `reduceMotion`, `children`。内部で `AnimatePresence` + `motion.div` + 共通 `variants` を適用 |

**残す場所（ドメイン）**

- `STEP_IDS` / `FormState` / `StepBlock` / 各 `stepId === "..."` の JSX → **`EstimateDetailedHearingWizard.tsx` または将来の `steps/*.tsx`**
- `flushSync` + `setStepIndex` の **遷移タイミング**はドメインだが、**アニメと同期する必要がある**ため、コールバック `onAfterSelectAdvance` などで StepCrossfade 側と整合を取りやすくする。

### 5.2 モバイル全画面シェル + イントロ連続カード

**現状**: `EstimateDetailedMobileShell.tsx`

- Portal / `fixed` / `dvh` / safe-area / `useVisualViewportFrame`
- `phase: "intro" \| "wizard"` と `introIndex` の **状態機械**
- イントロ部分の `AnimatePresence` + `fadeDuration` + `easeSpeak`
- タイマー（`FADE_SEC`, `HOLD_SEC`, `SLIDE_MS_*`）

**切り出し案**

| 提案パス | 責務 |
|----------|------|
| `src/components/motion/FullscreenPortalShell.tsx`（任意） | `fixed` + backdrop + safe-area + optional `vvFrame` のみ |
| `src/components/motion/IntroSlideSequence.tsx`（任意） | `items: ReactNode[]` または `renderSlide(index)` + タイマー + `AnimatePresence` |

**ドメインに残す**: `copy.title` / `copy.intro` など **文言**、`writeEstimateDetailedIntroDone` など **ストレージ**。

### 5.3 処理待ち（進捗メッセージ・メディア・フェード）

**現状**: `EstimateDetailedProcessingContent.tsx`

- `MIN_MS`, `FADE_IN_SEC`, `PROGRESS_MESSAGES` のローテーション
- `AnimatePresence` による **結果表示前の段階 UI**
- ルーティング・ロック・`sessionStorage` は **見積ドメイン**

**切り出し案**

| 提案パス | 責務 |
|----------|------|
| `src/components/motion/ProcessingWaitStage.tsx`（任意） | props: `messages[]`, `tipRotationMs`, `children`（動画枠など）。**ルーティングは持たない** |

### 5.4 他ファイルとの「同種パターン」（テンプレにまとめる候補）

| ファイル | パターン | 備考 |
|----------|----------|------|
| `src/components/experience/shells/DocumentShellChoiceWizard.tsx` | `DURATION_PAGE_*` + `AnimatePresence mode="wait"` | `lib/motion/config` と既に共有。ウィザード抽象化時に **StepCrossfade と統合検討** |
| `src/components/experience/prototypes/wizard/WizardOverlay.tsx` | `DURATION_SMOOTH` + `mode="wait"` | 体験デモ用。テンプレには **薄いサンプル 1 本**でよい |
| `src/components/chat/HomeConciergeFlow.tsx` | 複数 `AnimatePresence` | **レイヤー 3**。テンプレには載せず、パターンだけ 2 で再利用 |

---

## 6. レイヤー 3 — Axeon に残す（テンプレにはサンプルのみ）

| 領域 | 代表ファイル | 理由 |
|------|----------------|------|
| 見積ドメイン | `EstimateDetailedFormContent.tsx`, `EstimateDetailedHearingWizard.tsx`, `EstimateDetailedMobileShell.tsx`, `lib/estimate/*` | フィールド定義・バリデーション・API |
| チャット | `ChatContainer.tsx`, `HomeConciergeFlow.tsx`, `ChatPopup.tsx` | 会話状態・スコープ |
| UI ブランド | `components/ui/button.tsx`（motion 付き） | デザインシステムと一体。テンプレでは **shadcn 素の Button** に差し替え可能 |
| Hero 固有 | `HeroSection.tsx` | `heroStaggerItem` の **custom 閾値**はプロダクト固有 |

---

## 7. リファクタ実施順（推奨）

1. **重複解消**: `easeSpeak` を `lib/motion/variants.ts` に集約（触るファイルは 2〜3）。
2. **StepCrossfade（仮）抽出**: `EstimateDetailedHearingWizard` から **214 行付近の `AnimatePresence` ブロックのみ**を新コンポーネントへ。動作確認は見積モバイル・デスクトップの両方。
3. **IntroSlideSequence（仮）**: `EstimateDetailedMobileShell` の intro 部分を 2 の後に分離。
4. **ProcessingWaitStage（仮）**: 見積フローが安定してからでよい（ルーティングと分離するため変更範囲が広い）。
5. **テンプレリポジトリ作成**: レイヤー 0〜2 + `template.tsx` + 最小ページ 1 枚 + `docs/motion-template-extraction.md` の短縮版 `README`。

---

## 8. テンプレリポジトリに含めるディレクトリ一覧（チェックリスト）

- [ ] `src/lib/motion/config.ts`
- [ ] `src/lib/motion/variants.ts`（`EASE_SPEAK` 集約後）
- [ ] `src/components/motion/*`（プロダクト固有 import がないもの）
- [ ] `src/hooks/use-reduced-motion.ts`
- [ ] `src/app/template.tsx`
- [ ] `globals.css` の View Transitions 断片
- [ ] （抽出後）`StepCrossfade` / `IntroSlideSequence` / `ProcessingWaitStage` 相当
- [ ] **含めない**: `lib/estimate/*`, `lib/chat/*`, 本番用 `.env`

---

## 9. 関連ドキュメント

- 遷移 UX の数値要件: `docs/要件定義.md` セクション 4
- デザイン要件: `docs/デザイン要件.md`
- コンシェルジュのスコープ変更時: `docs/concierge-chat-scopes.md`

---

*このドキュメントは「最適な保存方法」と「切り出し境界」の設計メモである。実装タスクが固まったら Issue / 別紙で手順を分割してよい。*
