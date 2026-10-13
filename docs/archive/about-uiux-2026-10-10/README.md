# AXEON /about UI/UX再設計の確認記録

2026-10-10。`docs/AXEON_about_UIUX再設計_Codex指示.md` と `docs/AXEON企業紹介ページ.png` を基準に実装しました。

## 実装内容

- Hero: 左に確定文案、右にCSS・SVGの線と図形。写真・画像ファイルは使用していません。
- 設立理由: 3段落を維持し、右に短い要点カード3枚。説明は確定文案からの抜粋・短縮です。
- 代表: 見出し「代表」、PROFILE、役職、氏名、本文5段落と順序を維持。右の引用は現行本文の第4段落をそのまま使用しています。
- 考え方: 横3カード。確定した見出し・説明全文を維持。
- 進め方: 見出し・短い本文・サービスへのボタンを並べる帯。
- 体制: 同じ大きさの2役割カード。
- 会社概要: 7項目の2列表。メールとURLをリンクに変更。
- CTA: 淡い青の帯、主・副ボタン。
- 全体: 最大1280px、白と淡い青の背景、左寄せ見出し、既存ブランド青。SPは縦積みへ変更。
- 動き: 既存ScrollRevealControllerを使用。500msのfade/14px移動、80ms刻みの順次表示。一度だけ表示し、reduceでは即時表示・動き停止。新しいライブラリは追加していません。

## 変更ファイル（今回）

更新:
- `src/components/about/AboutPageContent.tsx`
- `src/components/about/AboutSectionHeader.tsx`
- `src/components/about/AboutStorySection.tsx`
- `src/components/about/AboutPrinciplesSection.tsx`
- `src/components/about/AboutApproachSection.tsx`
- `src/components/about/AboutFactsSection.tsx`
- `src/app/globals.css`（旧体制図の専用アニメーションのみ削除）

追加:
- `src/components/about/AboutTeamSection.tsx`
- `src/components/about/about-page.module.css`
- `src/components/about/about-presentation.ts`

削除:
- `src/components/about/AboutTeamFusionDiagram.tsx`
- `src/lib/ui/about-reading-styles.ts`

`site-copy.ts` は今回の作業前バックアップとファイル全体が完全一致しています。前フェーズの変更とユーザーの未追跡資料を維持しました。

## 削除した旧要素

中央揃えの共通レイアウト、暖色CTA、体制図の中央ハブ・波紋・常時アニメーション、左右の担当一覧を結ぶ旧行レイアウト、旧About専用のタイポグラフィ定義。詳細4ステップや期間表示は復活させていません。

## 確認

- `npm run build`: 成功（TypeScript・静的ページ生成を含む）。
- AboutコンポーネントのESLint: 成功。
- `git diff --check`: 成功。
- Desktop: 1440px、1920px。
- Tablet: 768px、1024px。
- Mobile: 375px、390px、430px。
- 全幅でHTTP 200、ページと各要素の横はみ出しなし。
- 8セクション、考え方3カード、体制2カード、会社概要7項目を確認。
- 代表の全文5段落をDOMから照合。見出し・役職・氏名を含むテキスト定義も完全一致。
- /services・/contactのクリック遷移成功。メール・URLのリンク先も確認。
- ページ内のimg・picture・SVG image要素は0。
- console error・pageerrorは0。
- 通常設定で25件の一度だけの500msアニメーションを記録。reduce設定でアニメーション0、設定切替時も停止。
- PC/SP/Tabletのスクリーンショットを目視確認。

詳細は `verification.json`、再確認用スクリプトは `verify.cjs`、画面は `about-幅.png` と `hero-1440.png`。

## 参考画像との差と残る微調整

代表の本文は参考画像より長い現行全文を維持しているため、代表セクションの高さは参考画像より大きくなります。本文の要約・削除は行っていません。代表の見出しも現行の「代表」を維持しています。

機能・表示上の未解決事項はありません。公開・pushは行っていません。

ローカル確認URL: http://127.0.0.1:3114/about （本番ビルド）。
