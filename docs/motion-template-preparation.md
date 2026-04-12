# モーション UI テンプレ準備手順（GitHub Template / レイヤー0〜1）

**目的**: Axeon の「ページ遷移クロスフェード」「共通モーション定数・variants」「軽いプリミティブ」を、**新規案件ですぐ使える** GitHub Template リポジトリとして切り出す。

**スコープ（初版）**: レイヤー **0〜1 のみ**。レイヤー2（`StepCrossfade` 等の見積レシピ抽象化）は **後続リファクタ後**にテンプレへ追加する。境界の詳細は `docs/motion-template-extraction.md` を参照。

---

## 推奨する進め方（全体像）

1. **テンプレ用リポジトリを空で用意**（GitHub 上で作成。後述のとおり Template にする）。
2. **ローカルで Next.js の最小アプリを用意**（`create-next-app` 推奨）し、Axeon から **決め打ちのファイルだけコピー**する。
3. **レイアウトをテンプレ用に最小化**（Axeon の `Header` / `Chat` 等は載せない）。
4. **`npm run build` が通る**ところまで確認してから初回 push。
5. GitHub の **Settings → Template repository** を有効化。
6. 新案件は **Use this template** で複製し、案件固有のページ・デザイントークンを足す。

**やらないこと（初版）**: Axeon 全体の mirror、見積・チャット・Sanity 等のドメインコード、レイヤー2の先行実装。

---

## 前提

- Node / npm（または pnpm）が使えること。
- Axeon リポジトリを手元に clone 済みであること（コピー元）。
- テンプレ先リポジトリの URL（例: `https://github.com/<user>/<template-repo>.git`）を決めておくこと。

---

## 手順 1: GitHub 側でテンプレ用リポジトリを作る

1. GitHub で **新規リポジトリ**を作成（空でよい。README なしでも可）。
2. まだコードを push していない状態でよい。**コード投入後**に次へ進む。

---

## 手順 2: ローカルで「テンプレ用 Next アプリ」の土台を作る

プロジェクト名は任意（例: `next-motion-template`）。

```bash
npx create-next-app@latest next-motion-template --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd next-motion-template
```

**推奨オプションの理由**

- **App Router + `src/`**: Axeon と同じ `@/*` → `./src/*` のパス解決に揃えやすい。
- **Tailwind**: Axeon の `globals.css` / ユーティリティ前提に合わせる（Tailwind v4 か v3 かは create-next-app の出力に合わせ、下記「手順 4」で調整）。

---

## 手順 3: Axeon からコピーするファイル（レイヤー0〜1・チェックリスト）

以下は **Axeon のパスをそのまま** `next-motion-template/src/` 配下へコピーする想定。

### レイヤー0（トークン・variants・フック）

| コピー元（Axeon） |
|---------------------|
| `src/lib/motion/config.ts` |
| `src/lib/motion/variants.ts` |
| `src/hooks/use-reduced-motion.ts` |
| `src/lib/utils.ts`（`cn` — motion コンポーネントが依存） |

### レイヤー1（プリミティブ + ページ遷移の入口）

| コピー元（Axeon） |
|---------------------|
| `src/components/motion/PageTransition.tsx` |
| `src/components/motion/FadeIn.tsx` |
| `src/components/motion/PageContent.tsx` |
| `src/components/motion/StaggerChildren.tsx` |
| `src/components/motion/MotionDiv.tsx` |
| `src/components/motion/ScrollSequence.tsx`（使わない案件は削除可） |
| `src/components/motion/PulseScale.tsx`（使わない案件は削除可） |
| `src/app/template.tsx` |

**初版で省略してよいもの**: `PulseScale.tsx` / `ScrollSequence.tsx`（ページ内演出が不要なら）。

---

## 手順 4: `globals.css` の取り込み

Axeon の `src/app/globals.css` は **プロジェクト全体のトークン・レイヤーが大きい**ため、テンプレでは次のどちらかでよい。

### 方針 A（推奨・手早い）

- create-next-app が生成した `src/app/globals.css` をベースにしつつ、Axeon から **次のブロックだけ**追記する。

  - `@media (prefers-reduced-motion: no-preference)` 内の  
    `::view-transition-old(root)` / `::view-transition-new(root)` のアニメーション指定  
    （Axeon の該当コメント付きブロック）

- そのうえで **ビルドエラーが出る Tailwind v4 / v3 の差**があれば、テンプレ側の公式構成に合わせて `@import` や `@layer` を調整する。

### 方針 B（Axeon に完全寄せ）

- Axeon の `globals.css` をほぼそのまま持ち込む。  
  → 依存する CSS 変数（`--color-base` 等）も一緒に必要になるため、**テンプレが重くなる**。初版は方針 A を推奨。

---

## 手順 5: テンプレ用の最小 `layout.tsx`

Axeon の `src/app/layout.tsx` は `Header` / `Footer` / `ChatContainer` 等に依存するため、**テンプレでは載せない**。

テンプレの `src/app/layout.tsx` は次を満たせばよい。

- `import "./globals.css"`
- `<html>` / `<body>` で子を表示
- フォントは Geist 等 **create-next-app デフォルトのまま**でよい（案件ごとに差し替え）

`template.tsx` は **ルートレイアウトの子**として自動的にページをラップするため、`layout.tsx` 内で `PageTransition` を二重に呼ばないこと。

---

## 手順 6: 動作確認用のサンプルページ（任意だが推奨）

- `src/app/page.tsx` で `PageContent` + `PageContentItem` または `StaggerChildren` を 2〜3 ブロック並べ、**ページ遷移**用に `src/app/about/page.tsx` などもう 1 枚用意する。
- リンクで行き来し、`template.tsx` 経由の **フェード**が効くことを確認する。

---

## 手順 7: 依存パッケージ

テンプレの `package.json` に、少なくとも次が含まれること（Axeon から版本はテンプレ生成時点の安定版に合わせてよい）。

- `framer-motion`
- `clsx`
- `tailwind-merge`

```bash
npm install framer-motion clsx tailwind-merge
```

Axeon にある他依存（Sanity, AI SDK 等）は **テンプレには入れない**。

---

## 手順 8: ビルド・初回 push

```bash
npm run lint
npm run build
git init   # 未初期化の場合
git remote add origin <テンプレ用リポジトリの URL>
git add .
git commit -m "feat: motion template (layers 0-1)"
git push -u origin main
```

---

## 手順 9: GitHub で Template repository にする

1. リポジトリの **Settings** を開く。
2. **General** の **Template repository** にチェックを入れて保存。

これでリポジトリ画面に **Use this template** が表示される。

公式: [Creating a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)

---

## 新規案件での使い方（毎回）

1. GitHub で **Use this template** → 新リポジトリ作成。
2. clone して `npm install` → `npm run dev`。
3. 案件に合わせて `layout.tsx` のメタデータ・フォント、`globals.css` のカラー変数、ページを追加。
4. ページ内の「ぬるぬる」は `FadeIn` / `PageContent` / `StaggerChildren` を利用。ページ遷移は **`template.tsx` を残す**限り自動で効く。

**注意**: Template から作ったリポジトリは **テンプレ更新の自動マージはされない**。テンプレを改良したら、必要に応じて手動で差分を取り込むか、後からレイヤー2をパッケージ化する運用へ移行する（`docs/motion-template-extraction.md` の「保存の形」参照）。

---

## トラブルシュート（よくある）

| 現象 | 確認すること |
|------|----------------|
| `@/...` が解決しない | `tsconfig.json` の `paths`: `"@/*": ["./src/*"]` |
| `PageTransition` でエラー | `next/navigation` の `usePathname` は Client コンポーネント内のみ（`template.tsx` は `"use client"` 済み） |
| CSS が効かない | `layout.tsx` で `globals.css` を import しているか |
| View Transitions が効かない | ブラウザ対応・Next の View Transitions 有効化の有無。初版は **Framer の `PageTransition` だけでも十分**な場合が多い |

---

## 次のステップ（任意・レイヤー2）

見積ウィザード等から `StepCrossfade` / `IntroSlideSequence` / `ProcessingWaitStage` を切り出したら、同じテンプレリポジトリに `src/components/motion/` へ追加し、README に利用例を書く。詳細は `docs/motion-template-extraction.md` の「レイヤー2」節。

---

*最終更新: Axeon 用メモ。テンプレリポジトリ側にも短い README を置くと、未来の自分が助かる。*
