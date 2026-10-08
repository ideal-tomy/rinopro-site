# コンサルティング・スマホ相談例 改修記録

既存の768px未満という切替基準を維持しました。スマホのみ、3枚の横スクロール＋CSS Scroll Snapに変更。PCの文言は変更せず、同じデータにSP用短縮文を追加しています。

## 変更ファイル

- `src/components/services/ConsultingInteractions.tsx`：SP短縮文、カード、ドット、現在位置の同期、幅変更時の位置調整。PCタブは維持。
- `src/components/services/ConsultingPage.tsx`：相談例セクションに局所的なスタイルクラスを追加。
- `src/components/services/consulting-mobile-cases.module.css`：SP相談例専用のスタイル。この相談例改修で共有CSS・他セクション・半内製化は変更していません。追加依頼の半内製化階段修正は[別記録](../enablement-staircase-2026-10-09/README.md)です。
- `scripts/verify-consulting-mobile-cases.cjs`：表示と操作のブラウザ検証。

## スクリーンショット

372×614px、固定ヘッダーを含む実画面です。3枚とも本文16px、結論・位置表示まで確認しています。

| 画面 | スクリーンショット |
| --- | --- |
| 部門間の二重入力 | [372×614px](mobile-372-case-1.png) |
| AI導入の検討 | [372×614px](mobile-372-case-2.png) |
| 既存システムの見直し | [372×614px](mobile-372-case-3.png) |
| PC相談例 | [1440px](desktop-1440.png) |
| 文字拡大 | [150%表示](text-enlarged.png) |

## 検証

- 320・372・390・430・767・768・1440px。372pxでは高さ614pxを確認。
- 次カードの見切れ、3枚の本文と結論、ドット・番号の同期、最後のカードの左端位置、キーボード、幅変更、共通注記1回、ページ横はみ出しなし。
- 文字を拡大するとカードが自然に伸びることを確認。
- Chromeのタッチ入力で実際に横スワイプし、2枚目への切替と位置同期を確認。
- PCは改修前後の画像比較で差分0、文章も一致。[比較結果](pc-comparison.json)。
- `npm run build`・TypeScript・変更TSXのESLintを確認。[ブラウザ検証結果](verification.json)。

## 未確認事項

Windows版Chromeで検証しました。実機のiOS Safari・Androidブラウザは未確認です。公開・pushは行っていません。
