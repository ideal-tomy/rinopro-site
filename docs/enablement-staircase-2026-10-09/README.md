# 半内製化「支援の進め方」階段レイアウト修正

## 変更

- `src/components/services/EnablementPage.tsx`：番号をH3のタイトル左に移動。長い見出しは意味のまとまりで折り返します。
- `src/components/services/enablement-page.module.css`：カード間隔18px、段差28px。同じCSS変数からカード位置と下端の階段線を算出。共通高さはGridの伸長で確保し、文章を切る固定高さは使っていません。番号20px、タイトル20px、本文16pxを維持。
- `scripts/verify-enablement-staircase.cjs`：カードの上下端、階段線、番号位置、本文サイズ、横はみ出しを検証。

今回の階段修正は「支援の進め方」に限定。既存の導入文・4段階の文言・補足文・配色を維持し、ヒーロー・確認事項・対比・開発タブ・CTAは変更していません。並行して依頼されたコンサルティングのスマホ相談例改修は[別記録](../consulting-mobile-cases-2026-10-09/README.md)です。

## 実画面

- [PC 1440px：セクション全体](approach-1440.png)
- [PC 1280px](approach-1280.png)
- [PC 1024px](approach-1024.png)
- [SP 390px：番号とタイトルの位置](approach-390.png)
- [320px・文字拡大](text-enlarged.png)

## 検証

320・390・768・1024・1280・1440px。PCでは4枚が同じ高さ、上下端が28px刻み、線の垂直部分がカード間、カード下端と線の間が10px、補足文まで28px。SPでは段差・横向き線を解除。全幅で番号とタイトルの先頭行が揃い、本文16px以上、ページ横はみ出しなし。[測定結果](verification.json)。

`npm run build`・TypeScript・変更TSXのESLintを確認。

## 未確認事項

Windows版Chromeで検証しました。実機のiOS Safari・Androidブラウザは未確認です。公開・pushは行っていません。
