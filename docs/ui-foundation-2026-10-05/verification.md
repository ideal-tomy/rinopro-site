# トップの変更基盤整理・検証

確認日: 2026-10-05。最終エラー確認: 2026-10-06。

## 変更内容

- トップのコンテナ・余白・文字・主要CTAの既存Tailwind指定を、home-presentation.ts のセクション別定数へ移動。Heroのテキストパネルも含みます。値とクラス順は維持。
- 共用CTAの寸法を lib/ui/landing-cta-styles.ts の LANDING_CTA_BUTTON_CLASS へ移動。src内の利用元を移行し、旧exportは互換性のため維持。
- useReducedMotion のeffect内の同期setStateを useSyncExternalStore に置換。SSR/初回hydrationのfalse、ブラウザ設定の反映と購読解除を維持。
- 各部品は文言・構造・カード・図解・デモ挙動を担当。背景ラッパ、共通ボタン、サイト全体の色・フォントは既存の管理場所を維持。

管理範囲と利用ページは [トップ構成資料](../home-top-structure.md) を参照してください。

## ソースと静的検査

- 17ファイルについて移動した定数を元の文字列に戻して比較し、JSX・クラス文字列・文章・リンクが一致することを確認。共用CTAの指定値も一致。
- TypeScript型チェックは通過。
- 本番ビルドは通過（67静的ページの生成完了）。
- src全体のESLintは従来25エラー・14警告から24エラー・14警告へ。useReducedMotionの1件を解消。今回変更した部品・定数に新しい指摘なし。
- 残る指摘の一覧: [lint-after.json](lint-after.json)。チャット・見積もり・体験デモ等の既存指摘を一括修正していません。
- Reactレビュー: 新しいclient境界・取得処理・DOMラッパは追加せず、セマンティクスとaria属性を維持。メディア設定の購読はモジュール内の安定した関数を使用。

## 表示の前後比較

Chromeのローカル専用検証セッションで記録。高さ900px、prefers-reduced-motion: reduce。フォントを待ち、ページ全体をスクロールして遅延画像を読み込んだ後に記録しています。iPhone Safari実機は未確認。

| 対象 | 比較結果 | スクリーンショット |
| --- | --- | --- |
| トップ375px | 記録した66要素の位置・寸法・文字設定・文章・リンク一致。Hero画像領域に描画品質の差あり | [前](before-375.png) / [後](after-375.png) |
| トップ390px | 66要素一致、スクリーンショットのピクセル完全一致 | [前](before-390.png) / [後](after-390.png) |
| トップ430px | 66要素一致、スクリーンショットのピクセル完全一致 | [前](before-430.png) / [後](after-430.png) |
| トップ1280px | 66要素一致。承認デモの動的描画領域に8,379ピクセルの差 | [前](before-1280.png) / [後](after-1280.png) |
| トップ1440px | 66要素一致。承認デモの動的描画領域に8,993ピクセルの差 | [前](before-1440.png) / [後](after-1440.png) |
| /services/consulting・390px | スクリーンショットのピクセル完全一致 | [前](before-services-consulting.png) / [後](after-services-consulting.png) |
| /prototype-showroom・390px | スクリーンショットのピクセル完全一致 | [前](before-prototype-showroom.png) / [後](after-prototype-showroom.png) |
| /services/insourcing-enablement・390px | 共用CTAの利用ページ。スクリーンショットのピクセル完全一致 | [前](before-services-insourcing-enablement.png) / [後](after-services-insourcing-enablement.png) |

375pxの差はHero画像の初回読み込み時の描画品質に見られ、同じ配置・文章を維持しています。[Heroの前](before-375-top.png) / [後](after-375-top.png)。PCの差はデモ内の描画に限定され、[比較画像](pc-demo-comparison.png)でも配置の一致を確認しました。全幅でのピクセル完全一致を主張するものではありません。

数値記録は before-*.json / after-*.json、比較集計は [comparison.json](comparison.json)。下層ページの採寸対象はトップより少なく、スクリーンショット全体の比較と共用CTAのソース一致も併用しています。

## 既存の表示問題

トップは変更前後とも scrollWidth が clientWidth を5px超過しています。今回の整理による増加はありません。下層3ページは超過0px。トップの全幅要素とスクロールバー幅の関係を、次のUI改善で確認・修正する対象として残します。

日本語の改行、本文の中央揃え、部品ごとの余白差は今回の値を維持しています。整理完了はUI改善完了を意味しません。

## 操作検証

本番ビルドを http://127.0.0.1:3100 で起動して確認。開発サーバーではHeaderのhydrationを確認できず、クリック後のメニュー表示も確認できなかったため、操作の合格判定に使用していません。

操作確認13項目はすべて通過しました。モバイルメニューとFAQのキーボード開閉、デモへのページ内移動、問い合わせ・概算・デモ一覧への遷移、問い合わせ欄の入力、通常→低モーション→通常の購読反映、エラーオーバーレイなしを確認。結果は [operations-after.json](operations-after.json) に記録しています。Heroは現在1画像なのでスライド選択ボタンの試験は対象外です。設定の購読反映は実際のHeroのReact状態から確認しました。既存の検証セッションにはReactのhydrationエラー（418）が6件記録されていました。browser-errors.txtの記号だけの出力をエラーなしと解釈した判定を訂正します。最新の本番ビルドを新規ブラウザセッションで開き直し、トップ・問い合わせ・概算・デモ一覧では未捕捉エラー0件を確認しました（browser-errors-fresh.json、browser-errors-contact.json、browser-errors-estimate-detailed.json、browser-errors-experience.json）。以前の記録の発生原因は特定できていないため、環境を問わずエラーがないとは断定しません。画面外要素へのクリックは検証ツールで明示的にscrollintoviewしてから実施しています。問い合わせフォームの送信は実施していません。整理前の操作は開発サーバーの状態により十分な確認ができていないため、前後の操作結果の完全比較は未確認です。操作関連のDOM・リンク・イベント処理の保全はソース比較でも確認しています。

## 再確認用スクリプト

- scripts/verify-home-foundation.ps1 before / after: 指定幅と下層の記録。参照するサーバーは127.0.0.1:3000。
- node scripts/verify-home-foundation-source.mjs: 今回の移動がソース上で表示・文章・リンクを維持しているか確認。
- node scripts/compare-home-foundation.mjs: 保存した前後記録と画像の比較。
- scripts/verify-home-foundation-operations.ps1: ローカル本番ビルドの主要操作確認。

ブラウザ検証はnpmのagent-browserを一時利用しました。プロジェクトの依存関係、ロックファイル、環境変数は変更していません。既存の文書削除も維持しています。コミット・pushは実施していません。

