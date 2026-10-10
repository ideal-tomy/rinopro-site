# 会社紹介 SP Hero・Profile・反転カード

## 変更

- AboutPageContent.tsx: SP専用のラベル「AXEONについて」、指定の2行見出し、本文後の装飾図。PCの見出しとHero本文は維持。
- AboutLeaderSection.tsx: SP見出しを「代表 秋吉 莉乃」に統合。Strategy Leadは小さな補助情報。代表本文5段落と既存の全文表示操作は維持。
- AboutSectionHeader.tsx: レスポンシブ見出しを渡せるようReactNodeを許容。
- AboutTeamSection.tsx: SPのアコーディオンを2枚の反転カードへ変更。担当内容の現行文言を裏面に表示。PCは静的な2カラム。
- about-page.module.css: 899px以下の表示とカード内容の余白を調整。表裏は同じグリッド領域に重ね、高さを保持。
- useServicesCardRotation.ts: 既存フックをラベル・breakpointで再利用可能にし、カード面のタップ操作を共通化。

## 再利用

services-page.module.cssのflipStage、flipInner、face、back、flipControls、sideDotを直接使用。回転は既存と同じ950ms / cubic-bezier(0.4, 0.05, 0.2, 1)。既存のスワイプ、自動回転、停止・再開、フォーカス・hover中の停止、reduced motionを共通フックから再利用。

現在の実装には重複引用カードは既に存在しなかった。新たに引用カードを追加していない。「仕事で大切にしていること」は今回変更していない。site-copy.tsも今回変更していない。

## 検証

- Next.js本番ビルド、変更対象のESLint: 成功。
- Chrome実ブラウザ: 375 / 390 / 430 / 820 / 1440px。
- before-copy.jsonと現行aboutCopyの全項目一致。代表本文5段落とHero本文のDOMテキストも一致。
- HeroはSPで2行、PCで既存見出しを表示。
- ProfileはSPで統合見出し、PCで既存構造。blockquoteなし。
- SPの2枚のカード: 切替ボタン、カード面タップ、スワイプ、裏面本文、表裏同一高さ、文字あふれなし。
- 1440px: SPカード非表示、静的担当カードが同じ行の2カラム。
- 横スクロール0。console/page errors 0。通常時の実行中アニメーションから既存と同じ950ms/easingを確認。
- /services: 共通フック変更後もカード面タップ、既存の切替ボタン、CTA遷移を確認。

証跡: verification.json、services-regression.json、hero-*.png、profile-*.png、card-*.png、about-1440.png。verify.cjsは本番プレビュー http://127.0.0.1:3114 を使用。

新規依存関係、公開、pushなし。

## Profile表示の追加修正

ユーザーの再指定により、PC・SPとも「PROFILE」「代表 秋吉 莉乃」の2段に統一した。Strategy Leadの補助表示と、重複する役職・氏名のブロックを削除。代表本文は変更していない。初回の「PCは従来のProfile構造を維持」という記載はこの追加修正で置き換える。

対象: AboutLeaderSection.tsx。確認: verify-profile-unified.cjs / profile-unified-verification.json / profile-unified-*.png。
