# 半内製化ページ v1 実装・検証記録

対象：`/services/insourcing-enablement`。既存URLを維持し、コンサルティングページのCSSを再利用しました。

## 変更ファイル

- `src/components/services/EnablementPage.tsx`：新構成・確認項目の選択操作。
- `src/components/services/enablement-page.module.css`：段階パネル・アイコン一覧・課題と支援の対比・開発工程の可読性。
- `src/components/services/ServiceOfferingDetailView.tsx`：半内製化だけ新構成に切替。
- `src/components/services/FlowTimelinePageContent.tsx`：半内製化専用フラグ。4タブと既存データ・工程イラストは再利用。キーボード操作とタブパネルの関連付けを追加。
- `src/components/services/FlowStepMedia.tsx`：任意の画像サイズ指定を追加。半内製化だけ実際の表示幅に合わせ、768px境界でも工程イラストが読み込まれるように調整。既存の標準値は保持。
- `scripts/verify-enablement-v1.cjs`：ブラウザ検証。

## 整理した表示

旧「なぜ内製化が…」「半内製化で進めること」「内製化までの流れ」、独立したデータの流れ・改善サイクルの図と説明、将来像、FAQ、関連する入口、重複CTAを除去しました。指定のアプリ開発の補足文・安定性と安全性ブロックも除去しました。共通コンポーネントを使う他ページには削除を適用していません。既存コンテンツデータと16枚の工程イラストは変更していません。

## 実画面

| セクション | PC 1440px | SP 390px |
| --- | --- | --- |
| ページ全体 | [画像](full-1440.png) | [画像](full-390.png) |
| ヒーロー | [画像](hero-1440.png) | [画像](hero-390.png) |
| 支援の進め方 | [画像](approach-1440.png) | [画像](approach-390.png) |
| 確認すること | [画像](checks-1440.png) | [画像](checks-390.png) |
| 課題と支援 | [画像](support-1440.png) | [画像](support-390.png) |
| 開発の進め方 | [画像](development-1440.png) | [画像](development-390.png) |
| 問い合わせ | [画像](cta-1440.png) | [画像](cta-390.png) |

### 開発タブ別

| タブ | PC | SP |
| --- | --- | --- |
| 共通の進め方 | [画像](development-common-1440.png) | [画像](development-common-390.png) |
| Webサイト制作 | [画像](development-website-1440.png) | [画像](development-website-390.png) |
| アプリ開発 | [画像](development-app-1440.png) | [画像](development-app-390.png) |
| 業務ダッシュボード | [画像](development-dashboard-1440.png) | [画像](development-dashboard-390.png) |

## 検証

320・390・768・1024・1440pxで、横はみ出し、5確認項目、4開発タブ、既存工程文・成果物・16枚の画像、指定文の削除、ページ内リンク、問い合わせ先を検証。TypeScript・本番ビルド・変更したTSXのESLintを確認。[機械検証結果](verification.json)。

## 未確認事項

指示書で参照される参考画像4〜7枚目は提供を確認できないため、指示書の配置・形状を基準に実装しています。ブラウザ検証はWindows版Chromeです。ダークモード時の文字色、③〜⑤の枠位置、旧URLの転送、JavaScript無効時の初期本文も確認しました。公開・pushは行っていません。
