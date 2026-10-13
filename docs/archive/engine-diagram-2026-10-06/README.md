# 意思決定エンジン図の表示調査（2026-10-06）

## コードバージョン

- 調査開始時のローカルHEAD: `a51a4cfce3e22069682d45cfb9037106f883cc6a`（変更なし）。
- Vercel APIで `axeon.jp` の本番デプロイを照合。同じコミットでREADY。詳細は `version.json`。
- 本番HTMLにも中央のrect/textは存在する。コード反映漏れではない。
- ユーザーが見た外部開発プレビューのURLは未取得。そのプレビュー自体のデプロイSHAは未確認。

## 原因と切り分け

Windows版Playwright 1.52.0のWebKit 18.4で、本番をiPhone 13の端末設定（390px幅、通常モーション）で開いた。
中央SVG `<motion.g>` の `scale(0.94)` がある状態では、画面内の矩形にもかかわらずIntersectionObserverが `isIntersecting:false / ratio:0` を返した。
`whileInView` が開始されず、中央だけ `opacity:0` に残る。修正前画面は `before-webkit.png`、数値は `before-webkit.json`。

同じ本番ページの検証ブラウザ内で、中央グループのCSS transformだけをnoneに変更すると `isIntersecting:true / ratio:1` に変化した（`diagnostic-webkit.json`）。本番への変更は行っていない。

## 修正

`src/components/home/reason/ReasonEngineDiagram.tsx` の中央グループのみ、scaleとtransformOriginを削除。
opacityのフェード、遅延、表示タイミングは維持。rect/textの内容、色、座標、サイズ、左右の要素、接続線は変更なし。

## 検証

- `npm run build`: 成功（型チェック・67ページ生成を含む）。
- 修正済み本番ビルド: `http://127.0.0.1:3101`。
- WebKit 18.4 / iPhone 13端末設定: 中央opacity 1、交差率1。`after-webkit.png` / `after-webkit.json`。
- WebKit 18.4 / 1280px幅・動きを減らす設定: いずれも中央opacity 1。`after-desktop-webkit.json` / `after-reduced-webkit.json`。
- Chrome / 390px幅: 中央opacity 1、コンソールエラーなし。`after-chrome-webkit.json`（ファイル名のwebkitは検証スクリプトの共通接尾辞）。
- WebKitからの `interactive-widget` viewport未対応警告は既存設定の警告であり、今回の中央表示とは別。React hydration mismatchは検出されていない。

**iPhone Safari実機は未確認。** Windows WebKitの端末設定による再現・修正確認であり、実際のiOS Safariの結果ではない。iPhone機種・iOSバージョンも未取得。
修正はローカルのみ。本番へのデプロイ・git pushは行っていない。

再検証は一時Playwrightのモジュールパスを `PLAYWRIGHT_MODULE` に指定し、`node scripts/verify-engine-webkit.cjs URL 保存名` を実行する。プロジェクト依存・lockfileの追加は行っていない。
