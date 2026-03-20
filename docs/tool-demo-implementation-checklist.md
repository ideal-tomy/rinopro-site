# ツールdemoページ 実装チェックリスト

## 完了条件（Definition of Done）
- `'/demo'` が「1画面1デモ」のストーリー・スクロールになっており、デモが1件ずつ滑らかに切り替わる（Snap scroll）
- `'/demo'` に「機能タグ × 業種タグ」を軸にした `RRINO-AI 基盤図` のハイライト（機能×業種マトリクス）を表示する
- `RRINO-AI 基盤図` は、スクロールに合わせてモジュールが軽量に組み上がり、組み上がり後に `業種タグ` 切替で `DB` + `プロンプト（思考ロジック）` の2要素が同時に差し替わる
- 各デモのCTA（カード/ボタン）をクリックすると `'/demo/[slug]'` の詳細ページへ遷移する
- デモが少ない前提で、該当がない組み合わせでは「2週間でデモ化」メッセージを表示できる
- 詳細ページでは「動画（または代替）」「機能説明」「操作体験（MVPでも可）」に加え、「モジュール解体図（タグベースでも可）」を表示する
- `sitemap` が（可能なら） `'/demo/[slug]'` まで含む

## 現状整理（このリポジトリで分かっていること）
- 一覧ページ: `src/app/demo/page.tsx` → `fetchDemoItems()` を呼び `DemoPageContent` を描画
- 一覧のUI: `src/components/demo/DemoPageContent.tsx` が `StaggerGrid`（縦グリッド）で `DemoCard` を並べている
- カード: `src/components/demo/DemoCard.tsx` は `'/demo/${slug}'` にリンクしている
- 詳細ページ: `src/app/demo/[slug]/...` が見当たらず、未実装
- Sanity `demoItem` 型: `src/lib/sanity/types.ts` には `title/slug/description/image` しかない
- Sanityクエリ: `src/lib/sanity/queries.ts` の `demoItemsQuery` もタイトル/slug/description/image のみ

---

## 0. 作業前に決める（迷わないための合意）
- [ ] このフェーズ（デモ2〜3個）のUX方針を確定する
  - 推奨: `/demo` は「1画面1デモ（ストーリー・スクロール）」＋「機能×業種マトリクス」（基盤図の軽量組み上げアニメを最初から実装）
- [ ] タグ設計を確定する
  - `機能タグ`（例: 音声入力、DB検索、要約、検索）
  - `業種タグ`（例: 建設、士業、製造...）
  - `モジュールタグ`（例: Whisper、Vector DB、LLM wrapper...）
- [ ] タグのソース方針を確定する
  - MVP: モジュール/タグ辞書はフロント固定、Sanity側は「どのタグを使うか」だけ持つ（編集コスト最小化）
- [ ] 詳細ページの「操作体験」のMVPを確定する
  - 選択肢A: まずは動画 + 手順（実操作は次段階）
  - 選択肢B: 入力→疑似実行（OpenAI等）で“動いている体験”を作る
  - 選択肢C: iframe埋め込み（外部デモ）で“実操作”に寄せる
- [ ] 「2週間でデモ化」メッセージの文言トーンを確定する（営業感無し）
- [ ] `RRINO-AI 基盤図` のMVPは「タグ一覧で止めず、軽量アニメで組み上がる」前提にする
  - 表示は `Framer Motion` で実装（既存のモーション基盤に合わせる）
  - 体験要件: スクロールに同期→組み上がり後に `業種タグ` 切替で一部モジュールだけ差し替え

---

## 1. Sanity側のデータ設計を拡張する
（現状のSanity項目案は `docs/sanity-schema.md` にあるが、実運用はSanity Studioのスキーマ拡張が必要）
- [ ] `demoItem` に「機能タグ」フィールドを追加する
  - 例: `functionTags`（array of string）または `functions`（ref）
- [ ] `demoItem` に「業種タグ」フィールドを追加する
  - 例: `industryTags`（array of string）または `industries`（ref）
- [ ] `demoItem` に「モジュールタグ（構成パーツ）」フィールドを追加する
  - 例: `moduleTags`（array of string）
- [ ] `demoItem` にストーリー表示順/おすすめのためのフィールドを追加する（任意）
  - 例: `featuredRank`（number）または `featured`（boolean）
- [ ] `demoItem` に動画関連フィールドを追加する
  - 例: `videoUrl`（string）
  - 代替策: `videoPoster`（画像URL）も用意
- [ ] `demoItem` に詳細説明用フィールドを追加する
  - 例: `highlights`（array of string）
  - 例: `howItHelps`（text）
  - 例: `useCases`（array of string）
- [ ] 「操作体験」のMVPに必要なフィールドを追加する（MVP選択肢に応じて）
  - 選択肢A（手順のみ）: `steps`（array of string）/ `expectedResult`（text）
  - 選択肢B（入力→疑似実行）: `experienceTemplate` / `inputPlaceholder` / `outputStyle` 等
  - 選択肢C（iframe）: `embedUrl`（string）/ `embedTitle`（string）
- [ ] （任意）ストーリー内の見せ方用フィールドを追加する（デモごと）
  - 例: `oneLiner`（1行ベネフィット）/ `storyLead`（短い導入文）

---

## 2. TypeScriptの型と Sanity取得を拡張する
- [ ] `src/lib/sanity/types.ts` の `DemoItem` を拡張する
  - 追加: `functionTags`, `industryTags`, `moduleTags`, `featuredRank/featured`（任意）、`videoUrl`, `highlights`, `steps`, `embedUrl` など
- [ ] `src/lib/sanity/queries.ts` の `demoItemsQuery` を拡張する
  - 現状: `title/slug/description/image` のみ
  - 目的: `/demo` のストーリー/マトリクスに必要な `functionTags` / `industryTags` / `moduleTags` と、`oneLiner`（任意）などを返す
- [ ] 詳細ページ用に `fetchDemoItemBySlug` を追加する
  - 例: `src/lib/sanity/fetch.ts` に `fetchDemoItemBySlug(slug: string)`
  - 併せて `src/lib/sanity/queries.ts` に `demoItemBySlugQuery` を追加
- [ ] エラーハンドリング方針を統一する
  - 既存: `sanityFetch` が失敗時に `[]` を返すため、詳細は `notFound()` 適用を検討
- [ ] 業種ごとの `DB` + `プロンプト（思考ロジック）` 差し替えマップの雛形を作成する
  - 配置: `src/lib/demo/industry-module-map.ts`（TS定数）
  - 型: `IndustryKey` / `SwappableModuleState` / `INDUSTRY_MODULE_MAP`
  - 業種ごとに `db` と `promptLogic` の2要素を定義し、基盤図の差し替えUIで参照する

---

## 3. `/demo` ページ構成を「1画面1デモ」＋「機能×業種マトリクス」へ作り替える

### 3-1. 現行実装の置き換え方
- [ ] `src/components/demo/DemoPageContent.tsx` で `StaggerGrid`（縦グリッド）を撤去
- [ ] `DemoPageContent` を `DemoStoryScroll`（ストーリー）と `DemoMatrixSection`（マトリクス）に分割
- [ ] 既存の `PageSectionWithScroll` の利用可否を整理
  - 推奨: ストーリー内でタイトル/目的文を「冒頭だけ」表示し、以降はスクロールパネル主導にする

### 3-2. ストーリー・スクロール（「1画面1デモ」）
- [ ] 1デモ＝1パネル（`h-screen`）の設計を確定する
- [ ] 切り替え方式を確定する
  - MVP案: CSSの `scroll-snap`（`snap-y snap-mandatory`）＋アクティブ判定（`IntersectionObserver`）
  - 代替案: `framer-motion` のスクロール連動でフェード/スケール
- [ ] 背景の演出（星空のゆっくり移動）を実装する
  - `public/` 内の該当アセット（例: `tec02.jpg`）があるか確認
- [ ] 各パネルの表示要素を確定する（引き算）
  - タイトル
  - 1行ベネフィット（`oneLiner` があるなら優先）
  - `機能タグ` / `業種タグ`（小さなバッジ）
  - CTA: `体験する` → `/demo/${slug}`
  - （任意）`モジュールタグ` は「数点だけ」をプレビュー

### 3-3. ロード中状態のUX（スカスカ感を抑える）
- [ ] スケルトンを「パネル形状」にする（縦グリッドの3枚表示は避ける）
- [ ] `demos.length === 0` 時の空状態は短く（“準備中”程度）し、画面の余白が極端にならないよう調整

### 3-4. 機能 × 業種マトリクス（基盤の証明）
- [ ] 画面配置を決める（MVP）
  - 推奨: ストーリー直下に `機能×業種` セクションを1つ置く（デモが少なくても成立）
- [ ] 左右どちらを置くか確定する
  - 推奨: 左=`機能`（ベネフィット起点）、右=`業種`（自分事化の着地）
- [ ] 選択/ハイライトの挙動を実装する
  - `機能` と `業種` を選択（またはホバー）したら中央の `RRINO-AI 基盤図` をハイライト
  - 該当するデモがある場合: 上位1〜3件を表示し、クリックで詳細へ
  - 該当がない場合: 「あなたの現場の課題を、2週間でデモ化します」＋ `相談する` などの導線
- [ ] `RRINO-AI 基盤図` のMVP設計
  - MVP: モジュールアイコンを並べ、`moduleTags` と一致するものだけ発光/強調
  - 遷移演出: 軽量（派手なバウンド禁止）

### 3-5. 「モジュール解体図」（組み上げ演出）
- [ ] 詳細ページでの見せ方を優先しつつ、`/demo` では `RRINO-AI 基盤図` のアニメ体験をMVPとして実装
- [ ] `RRINO-AI 基盤図` の「軽量組み上げ」実装方針を確定
  - スクロール連動（`scroll-snap` / IntersectionObserver / scroll progressのいずれかで同期）
  - 組み上げ前は未完成（パーツが分離）→ 組み上げ後は完成形（発光/位置固定）
- [ ] 「組み上がり後に `業種タグ` 切替」で差し替えるモジュールを確定
  - 仕様: `DB` + `プロンプト（思考ロジック）` の2要素を同時に差し替える
  - 業種ごとに「DBの種類/接続先イメージ」と「思考ロジック（プロンプト方針）」を切り替える
  - 差し替えは2要素固定とし、他モジュールは共通化して軽量を保つ
- [ ] Framer Motion の演出要件を決める（過剰バウンス禁止）
  - MVPはフェード/スライド/スケール程度に留める
  - `prefers-reduced-motion` を尊重（静的に完成状態へ）
- [ ] `機能タグ` と `業種タグ` の選択ロジックを基盤図へ反映
  - `機能タグ` で土台モジュール構成を変える（必要なら最小差分）
  - `業種タグ` で差し替えるモジュールを `DB` + `プロンプト（思考ロジック）` に限定する

---

## 4. 詳細ページ（`/demo/[slug]`）を実装する

### 4-1. ルート・ファイルを作る
- [ ] `src/app/demo/[slug]/page.tsx` を新規追加（サーバーコンポーネント）
- [ ] `src/app/demo/[slug]/not-found.tsx`（任意）を追加し、存在しないslug時の表示を整える
- [ ] `src/app/demo/[slug]/loading.tsx`（任意）でデータ取得中のスケルトンを入れる

### 4-2. 詳細ページの情報設計（表示要素）
- [ ] ヘッダー（上部）
  - タイトル
  - `機能/業種/モジュール` タグ（またはカテゴリバッジの置き換え）
  - （任意）おすすめ/注目バッジ
- [ ] 動画セクション（MVP必須）
  - `videoUrl` がある場合: `video controls` で表示
  - なければ: `image` の代替 + 「概要」セクションへ誘導
- [ ] 機能説明セクション（MVP必須）
  - `highlights`（箇条書き）
  - `howItHelps` / `useCases`（短文）
- [ ] 操作体験セクション（MVPは選択肢に応じて実装）
  - 選択肢A: 手順 `steps` + 想定結果（読むだけで体験感）
  - 選択肢B: 入力フォーム + 実行ボタン（内部で疑似実行）
  - 選択肢C: `embedUrl` を iframe で表示（必要に応じてsandbox）
- [ ] 次の導線（必ず1つ）
  - 例: 「次に見る」→ `サービス` または 「相談する」

### 4-3. 操作体験（選択肢B）を採用する場合の実装タスク
- [ ] `src/app/api/demo/run/route.ts` を追加
  - 入力: `demoSlug` + `userInput`
  - 返却: `outputText`（+ 任意で `nextDemoSlug`）
- [ ] OpenAI呼び出しは現行の `src/app/api/chat/route.ts` と同等の文体・レート制限方針に寄せる
- [ ] 詳細ページ側は `use client` コンポーネントで入力フォームと実行結果表示を作る

### 4-4. 操作体験（選択肢C）を採用する場合の実装タスク
- [ ] `iframe` 埋め込み方式の安全性を確認する（CSP、sandbox、許可ドメイン）
- [ ] `embedUrl` 側の表示崩れ/遷移阻害がないかを確認

---

## 5. おすすめ/関連デモの表示（詳細ページ下部）
- [ ] 詳細ページで「共通モジュール or 共通機能がある別デモ」レールを表示する（横スクロールでも可）
- [ ] 表示対象は Sanity の `moduleTags` / `functionTags` / `industryTags` で絞り込む
- [ ] デモが少ない前提なので、上位3〜4件までに抑え「引き算」で整える

---

## 6. SEO / リンク / 導線の整備
- [ ] `/demo` 内の各CTA（ストーリーパネル/マトリクス）から詳細遷移が正しい（`/demo/${slug}`）
- [ ] `src/app/sitemap.ts` を更新して `'/demo/[slug]'` も含める方針を決める
  - 現状: `/demo` のみ
- [ ] `metadata` を詳細ページにも追加する（タイトル/description）
- [ ] 既存の Speakライク遷移（`src/app/template.tsx` / `src/components/motion/PageTransition.tsx`）が詳細でも効くように確認する

---

## 7. 品質チェック（最低限ここを通す）
- [ ] `'/demo'` が「1画面1デモ」で切り替わり、スクロールの体験（Snap感）が崩れない
- [ ] `機能×業種マトリクス` が選択に応じて正しくハイライトされ、該当なし時の文言が表示される
- [ ] 詳細ページで `動画/説明/操作体験` が、データ欠損時（videoなし等）でも破綻しない
- [ ] モバイルでのタッチターゲット（44x44px）と、スクロールでの視認性を確認
- [ ] `prefers-reduced-motion` の影響を確認（スクロール/フェードが過剰にならない）
- [ ] 画像は `next/image` を使用し、レイアウトシフトが出ないか確認
- [ ] レート制限のあるAPI（チャット等）を操作体験で使う場合は、回数が破綻しないか確認

---

## 8. 次の改善（段階的に“動く体験”を強くする）
- [ ] 操作体験を “本物に近づける”（iframeや実API連携へ）
- [ ] モジュール組み上げの演出を段階強化（軽量のまま）
- [ ] デモが増えた段階で、探索性（検索/絞り込み/並び替え）を追加
- [ ] 難易度/所要時間/対象業務など、意思決定に必要な情報を補強

