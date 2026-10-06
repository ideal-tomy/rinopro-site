# AXEON ご支援内容：実装と検証

ローカルプレビュー： http://127.0.0.1:3103/services

指示書 `docs/AXEON-services-implementation.md` のPC画像・スマホHTMLを復元して実装した。本番反映、push、mainへのマージは行っていない。指示書そのものは編集していない。

## 追加指定の反映

- SERVICE MENUは紹介専用。PCの「すべての支援内容を見る」と4枚のカード下のリンクを削除。
- スマホのSERVICE MENUもリンクを持たない紹介表示へ変更。
- PROCESSの「資料をダウンロード」を削除。
- PROCESSの説明段落「経営と現場の論点を整理し、作るだけで終わらない『使われ続ける』状態まで伴走します。」を削除。
- サービス主要カードの詳細リンクと「まずはご相談ください」は維持。

## 変更ファイルと責務

| ファイル | 内容 |
| --- | --- |
| `src/components/services/ServicesPageContent.tsx` | ヒーロー、PCの紹介4項目、5工程、相談CTA。SEOメタ情報とルートは既存のまま。 |
| `src/components/services/ServicesFlipCards.tsx` | 主要サービス2面、操作部、スマホの紹介欄。詳細は既存の2ページへ接続。 |
| `src/components/services/useServicesCardRotation.ts` | 回転、スワイプ、タイマー、停止、可視性・フォーカス・メニューの監視と後始末。 |
| `src/components/services/services-page.module.css` | このページに限定した寸法、配色、画像切り出し、レスポンシブ。 |
| `src/components/layout/Header.tsx` | ご支援内容ページのPC表示でのみ出る問い合わせリンクを追加。共通ナビとメニューは再利用。 |
| `public/images/services/approved/` | 指示書の画像2点、PC用の切り出し6点、見本の下部波形用SVG。新しいイラスト・AI画像は生成していない。 |
| `docs/axeon-approved-reference/` | 復元した原本HTMLと画像。プレビュー専用ダイアログ・外枠は実サイトへ移植していない。 |
| `scripts/verify-services-approved.cjs` | 幅、表示、回転、導線、フォーカス、Chromeのタッチスクロール、WebKitを検証。 |
| `scripts/verify-services-text.cjs` | 文字200％相当の表示を検証。 |
| `scripts/inspect-services-approved.cjs` | 見本の表裏と最初の実装を撮影した確認用スクリプト。 |
| `scripts/compare-services-approved.cjs` | 同じ幅の見本／実装の比較画像を生成。 |

共通フッターの会社説明・既存リンクは保持。依存関係、トップページ、他の本文ページは変更していない。

## スクリーンショット

- PC： [1024px 全体](after-1024-full.png)、[1122px 全体](after-1122-full.png)、[1440px 全体](after-1440-full.png)
- タブレット： [768px 全体](after-768-full.png)
- スマホ390px： [表面・全体](after-390-full.png)、[裏面・全体](after-390-back.png)
- スマホ390px： [上部](after-sp-top.png)、[中部](after-sp-middle.png)、[下部](after-sp-bottom.png)
- Windows WebKit： [表面・ビューポート](webkit-front.png)、[裏面・ビューポート](webkit-back.png)
- 文字拡大： [320px](after-text-200-320.png)、[390px](after-text-200-390.png)、[430px](after-text-200-430.png)

## 見本との比較

[PC左右比較](comparison-pc.png)、[PC重ね合わせ](comparison-pc-overlay.png)、[スマホ表面比較](comparison-mobile-front.png)、[スマホ裏面比較](comparison-mobile-back.png)。左右比較は左が見本、右が実装。画像を縮小して高さを合わせてはいない。PC重ね合わせは1024px幅のまま上1536pxを50％透過で比較している。

1024pxでは、ヘッダー64px、ヒーロー終端317px、主要カード開始317px・終了670px、カード左27px／右521px・幅476px・間18px、SERVICE MENU開始690pxを基準に合わせた。写真の開始位置は参照の約812pxに対して実装約811px。紹介欄の終了は参照約1135pxに対して実装約1139px。

スマホは原本HTMLの寸法と画像倍率・位置・半内製化のclip-pathを採用した。表裏は同じグリッドに載せ、390pxでは両面のレイアウト高さ595pxを確認。回転時の投影によりgetBoundingClientRectには小数pxの差が出るため、実レイアウト高さはoffsetHeightで確認している。

追加指定によりSERVICE MENUのリンク、PROCESSの説明段落と資料ボタンは見本から意図的に削除している。フッターはプレビュー用の簡略版ではなく実サイトの情報を保持している。PCのナビ間隔、本文の折返し、文字ウェイト、PROCESSの縦寸法と波形の曲率には参照画像との差が残り、画素単位の完全一致とはしていない。

## 最終値

| 部位 | 値 |
| --- | --- |
| PC本文の最大幅 | 約1200px。主要カード外枠1254px、左右padding27pxを含む。 |
| PCヒーロー／工程の左右余白 | 48pxを下限、広い画面は中央の1200px幅に合わせる。 |
| スマホの本文余白 | 20px。主要カード外側14px／内側19px。320pxでは外側11px／内側15px。 |
| ヘッダー | 区切り線を含め64px。ロゴSP31px／PC36px。 |
| ページ見出し | SP38px・行高1.4／PC58px・行高1.35。350px以下は34px。 |
| サービス見出し | SP29px・行高1.5／PC34px。350px以下25px、タブレット26px。 |
| 説明文 | ヒーローSP14px・行高1.95／PC20px・1.65。カードSP15px・1.8／PC18px・1.5。 |
| 紹介写真 | 212:139の比率を維持。広い画面で上下を過剰に切らない。 |
| CTA | SP47px以上、角丸7px／PC45px以上。 |
| 色 | 文字#09152c、紺#173983、青カード#edf8ff→#e8f5ff、半内製化#fff8f7→#fff4f2。 |
| フォント | システムフォントを優先し、既存Noto Sans JPの変数・Yu Gothic・sans-serifへフォールバック。 |
| 切り替え | SP〜767px／タブレット768〜1023px／PC1024px〜。 |
| 回転 | perspective1500px、180°、950ms cubic-bezier(.4,.05,.2,1)。静止6000ms＋完了待ち1000ms、手動後12000ms保留。 |
| 操作部 | 最小高さ45px、ドット40×44px。文字拡大時は左右の案内が折り返し、ドットと重ならない。 |

## 実行した確認

- `npm run build`：成功。全67ページを生成。
- `node node_modules/typescript/bin/tsc --noEmit`：成功。
- 変更TS/TSX4ファイルのESLint：エラー・警告なし。
- `git diff --check`：成功。
- Chrome：320／375／390／430／767／768／1023／1024／1122／1280／1440px。全幅で横はみ出しなし。PCは2サービスともinertなし、スマホは非表示面のみinert。
- 自動回転、明示的停止の維持、左右スワイプ、ドット切り替え、裏面へのフォーカス除外、幅変更後のinert解除、メニューとEscape、キーボードEnterによる詳細ページ遷移、両詳細ページ・問い合わせ導線：成功。
- Chromeのタッチ入力をCDPで送信し、縦スクロールが動き、面が勝手に切り替わらないことを確認。
- `/contact`と`/about`で追加ヘッダーリンクが非表示になることを確認。
- reduced-motion：初期停止、手動切り替えはアニメーションなし。
- CSSで計算済み文字サイズを2倍にした320／390／430pxの確認：横はみ出し、案内とドットの重なりなし。実際のiOS文字サイズ設定による確認とは区別している。
- Windows WebKitのiPhone 13エミュレーション：表裏の表示と手動切り替えを確認。
- 最終ブラウザ検証のconsole error・pageerror：0件。詳細は [verification.json](verification.json) と [text-200.json](text-200.json)。

最初のチェックは既存 `.next/dev/types` の生成済み2ファイルの構文破損で失敗した。ソースのエラーではなく、該当生成ファイルを `.next/qa-backups` へ退避した後、ビルド・型チェックを完了した。tsconfigの検証を弱めたり、依存関係を変更したりしていない。

## 残る制約・未確認

iPhone Safariの実機確認は**未確認**。Windows WebKit・Chromeの端末エミュレーションを実機確認とは扱っていない。

PC写真・イラストは提供されたJPEGからの切り出し。高解像度の一致する原画は見つからず、広い画面では写真が拡大される。原画が提供されれば解像度を改善できる。

PC画像はCSS原本ではないため、上記のナビ間隔・文字描画・工程の縦寸法・波形までの完全一致は未達。最新の削除指定と実サイトの共通情報を優先したローカル実装として確認できる状態。
