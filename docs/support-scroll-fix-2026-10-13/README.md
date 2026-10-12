# 半内製化ページのスクロール修正

対象：`/services/insourcing-enablement#checks`。計画：[AXEON-support-scroll-improvement-plan.md](../AXEON-support-scroll-improvement-plan.md)。

プレビュー：http://127.0.0.1:3105/services/insourcing-enablement#checks

## 原因と変更

共通の自動スクロール表示とカード個別の表示処理が同居し、カード側をSPで止めても親の18px縦移動が残っていた。初期化順序によって共通処理へ登録される経路もあった。修正前の調査証拠は [evidence.json](../support-scroll-investigation-2026-10-13/evidence.json) に保存済み。

ページルートにSSR時点から `data-scroll-reveal="off"` を付け、共通処理から除外した。ページ専用hookで、事前確認・課題・開発・問い合わせを外側セクション単位に一度だけ表示する。演出はopacityのみ・600ms。子要素の縦移動と遅延、SPだけの演出上書きを撤去した。

SSRでは本文を隠さない。初期画面で既に見えるセクションは隠し直さず、非表示領域から入るセクションにだけopacityのWAAPI演出をかける。JS/IntersectionObserver/animateが使えない場合も通常表示。reduced-motionの設定変更では演出をcancelする。横スライドと反転のtransformには触れない。

横スクロールはネイティブのまま。位置同期を実スクロール位置から更新し、末尾カードも先頭位置へ送れる余白を設けた。リサイズ時に選択位置を維持する。位置ボタンは通常button＋aria-currentへ整理し、44pxの操作領域とフォーカス表示を確保した。左右/Home/Endキーで移動できる。

## 削除・維持

- 独立した `#approach`「支援の進め方」とそのデータ・専用revealを削除。
- `#development`「開発の進め方」、反転操作、埋め込みタイムライン、問い合わせは維持。
- 事前確認5件の本文・SVG図解は維持。
- 調査対象のデータと描画本文に「月額支援」「月額の伴走」「3か月ごとの更新」はなかったため、追加の文言削除はなし。
- 全ページ共通controller・共通モーション設定・他ページの演出は変更していない。埋め込みタイムラインは既にenablement指定でopacity:1のvariantsを使用しており、その既存処理を維持した。

## 変更ファイル

1. `src/components/services/EnablementPage.tsx`
2. `src/components/services/EnablementPreSupportCards.tsx`
3. `src/components/services/enablement-page.module.css`
4. `src/components/services/useEnablementSectionReveal.ts`（追加）

## 検証と証拠

- [results.json](./results.json)：各幅の毎フレーム座標・高さ・opacity・実行したWAAPI。
- [extra-results.json](./extra-results.json)：CPU4倍低速＋JS読込遅延、モーション設定の途中切替、リサイズ、反転・リンクの確認。
- `before-390.png` / `before-1440.png`：修正前。
- `after-chromium-*.png` / `after-webkit-*.png`：修正後。
- `after-chromium-390.webm` / `after-webkit-390.webm`：操作動画。動画開始直後のロード待ちも含む。
- 再実行：`node scripts/verify-enablement-scroll.cjs`、`node scripts/verify-enablement-scroll-extra.cjs`。既存インストール済みPlaywrightを使用。

検証対象幅は375/390/430/768/1024/1099/1100/1280/1440px。ChromeとPlaywright WebKitで別々に記録する。

最終結果：Chrome・WebKitそれぞれ9幅、計18回の表示・操作シーケンスが通過。カードの縦移動と高さ変動は計測中0px、track scrollTopも0。セクションの演出はopacityのみ・600ms・最大1回で、カードや本文への追加演出は検出されなかった。

再読込→縦スクロール→演出中の横操作→完了後の位置ボタン全5件→Home/End→カードクリック→離れて戻る、の操作経路を検証。毎フレームでcard document上端・track相対上端・高さの変動1px以下、track scrollTop=0をチェックする。共通/子演出がなく、セクションWAAPIがopacityのみ600msで1回以下であることも確認する。

Chrome390pxではCDPの横タッチと縦タッチを模擬入力し、横scrollLeftとページscrollYがそれぞれ変化することを確認。その他の横操作はホイールと位置ボタンを使用。WebKitのタッチ実機相当の確認は行っていない。

JavaScript無効と初期reduced-motionで全文表示を確認。CPU4倍低速起動の初期計測はopacity=1、translate=none。モーション設定を途中変更した後はopacity=1・実行中演出0。768/1024/1099/1100/390pxへのリサイズで最終カード位置を維持した。

`npm run build`（コンパイル・型チェック・67ページ生成）、変更TSX/TSのESLint、`git diff --check` は成功。

## 確認の限界

修正前にユーザー報告の指操作を完全再現したとは言えない。確認できたのは親の縦移動と個別カード演出の同居。修正後は模擬入力と座標ログをもとに検証している。

iPhone Safari実機、実端末の指操作、実スクリーンリーダーは未確認。Playwright WebKitをSafari実機の合格として扱わない。WebKitでページ共通リンクのRSC先読みにアクセス制御エラーが出た場合はJSONの `unrelatedPrefetchErrors` に別記録する。

本番反映・mainへのマージ・pushは実施していない。
