# スマホ矢印・スクロール表示調整

対象指示: Codex_スマホ矢印方向_スクロールアニメーション調整指示.md

- コンサルティング支援範囲: 1023px以下は独立した32pxのArrowDownを2か所表示。PCのSVG・横向き矢印・グリッド寸法は維持。
- 共通スクロール表示: 760ms、スマホ720ms、移動18px、cubic-bezier(0.22, 1, 0.36, 1)。通常のstaggerはPC140ms／スマホ100ms。5項目の一覧は110ms基準。
- IntersectionObserver: 下端-10%、基本threshold 0.2。画面より長い要素は到達可能な閾値に補正。支援範囲と半内製化の縦長グループは要素を個別に観測。
- 計画カード内部3項目はカードの開始から120/240/360ms遅延。
- 一度表示した要素を再び隠さない。reduced motionの設定変更にも対応。

## 検証

Chromeの実ブラウザを使用。375/390/430/1440pxで、コンサルティング、半内製化、ご支援内容、会社紹介、トップの5ページを検証。

- before.json: 今回の変更前の本文とPCカード位置・寸法。
- verification.json: 本文比較、PC配置比較、矢印、overflow、CLS、表示判定時の座標、duration/delay、一度だけの表示、console/page errors。
- scope-*.png: 各幅の支援範囲画面。
- motion-detail.json: 実行中の720ms CSS Transition／100ms staggerと、reduced motion切り替え後の即時表示。
- verify.cjs: 再実行用。ローカル本番プレビュー http://127.0.0.1:3114 を使用。

本文比較では、既存の回転カードの状態ラベル（再生／停止）だけを正規化。本文やCTAの文言には変更なし。

最終ビルド成功。変更対象のTypeScript/TSXのESLint成功。リポジトリ全体のLintは既存スクリプト・別機能の89エラーにより不通過。依存関係追加・公開・pushは実施していない。

CLSは実測値を保存し、検証では0.00001未満を描画上の微小差として扱う。厳密なゼロのみを通過条件にしていない。先行計測では約0.00000065の値を1件検出した。

最終検証: 全44記録のチェック通過。横スクロール0、console/page errors 0、本文一致、PCカード位置・寸法一致。CLSは4つの対象内ページで0、トップで最大約0.00000507。

## スマホの表示速度を再調整

発火位置は維持し、スマホの表示時間を720msから980ms、staggerを100msから120msへ変更。開始直後に急に明るくなるカーブから cubic-bezier(0.25, 0.1, 0.25, 1) へ変更した。PCは760msと従来のイージングを維持。CSSと共通WAAPIの両方に反映。最新の確認は gentle-mobile-verification.json と verify-gentle-mobile.cjs。既存の verification.json は初回調整時の記録。
