# 相談例セクションの変更・検証

対象：`/services/consulting#consulting-examples`

ローカルプレビュー： http://127.0.0.1:3104/services/consulting#consulting-examples

## 変更

- `ConsultingPage.tsx`：指定されたラベル・主見出し・説明文。
- `ConsultingInteractions.tsx`：指定文言の共通データと3項目の意味構造。旧タブ、PC/SP別データ、繰り返し注記、アイコンと矢印を撤去。ネイティブ横スクロール・位置同期・ResizeObserverの後始末を維持。
- `consulting-mobile-cases.module.css`：900px以上は42:58の3行、899px以下は88%幅の横スクロールカード。下部ドットは44pxの操作領域、読み上げラベルとaria-currentを持つ。高さは自然な内容量とflex stretchで揃える。
- `consulting-page.module.css`：利用元を確認したうえで旧相談例専用CSSと多段演出を削除。共通で使うnoteや他セクションのCSSは保持。
- `scripts/verify-consulting-examples.cjs`：スクリーンショットとブラウザ検証。

困りごと26px（SP23px）→整理する内容20px（SP18px）→本文16px→分類14px・ラベル/注記13pxの優先順位。表示演出はセクション単位のopacityのみで、横スクロールのtransformを上書きしない。動きを減らす設定では演出なし。

## 検証の範囲

Chrome / Playwright WebKit：375・390・430・768・899・900・1024・1280・1440px。

`after-results.json` に各幅の寸法と結果を保存。PCの3行、SPの等高カード、全本文、注記1回、ページ横はみ出しなし、ドットとネイティブスクロールの同期、Homeキー、演出中/演出後の移動を検証。Chromeでは縦ホイールとCDPによる横・縦タッチジェスチャーも通過。

WebKitではスクロール領域上の縦ホイールによるページ移動を確認できなかった。合格扱いにはせずJSONの `verticalWheelPassed` に記録。実機Safariの縦スワイプが機能するかは別途確認が必要。

`before-chromium-*.png` が修正前、`after-*.png` が修正後。スクリーンショットはセクション単位。

WebKitのページ共通リンク（contact/about）のRSC先読みにアクセス制御エラーが出た場合は結果JSONに別途記録する。相談例は外部API・データベースを利用しない。

## 未確認

iPhone Safari実機。Playwright WebKitは実機Safariではない。スクリーンリーダー実機、実端末の指でのスワイプも未確認。

`npm run build`（コンパイル・TypeScript・静的生成）、変更した2つのTSXへのESLint、`git diff --check` は成功。

本番反映・mainへのマージ・pushは行っていない。
