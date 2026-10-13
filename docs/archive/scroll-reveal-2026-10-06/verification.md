# 全ページ共通のスクロール表示（2026-10-06）

共通レイアウトに ScrollRevealController を追加。本文の見出し・セクション・カード・フォーム・フッターなどが、初めて画面に入ると600msで14px下からフェードインします。長いセクションは内部の短いブロックを対象にし、親子を同時に動かしません。固定ヘッダーやポータルのダイアログは対象外です。

追加ライブラリ・DOMラッパ・スクロールイベントは使用せず、IntersectionObserver と Web Animations API を使用。既存のtransformを使うアニメーションとは別のtranslateを使います。初期画面、JavaScript無効時、未対応ブラウザは内容を表示したままです。

## hydrationの修正

初期実装で共通処理が data-scroll-reveal 属性を追加し、ページのhydrationより先に処理された場合に不一致が発生しました。ユーザーのログで特定し、属性への書き込みを全て削除しました。状態は内部のSet/WeakSetで管理します。suppressHydrationWarningは使用していません。

## 操作・設定

表示は各ページで一度だけ。ページ遷移時には監視・実行中のアニメーションを解除し、遷移先を再登録します。後から追加されたDOMはMutationObserverで監視。動きを減らす設定ではアニメーションを行わず、実行中に設定が変わった場合も停止します。キーボードフォーカスが入った対象も表示を即座に確定します。

個別の領域で動きを止める場合は、その領域のJSXで data-scroll-reveal="off" を指定できます。共通処理自体が属性を追加することはありません。

変更: src/components/navigation/ScrollRevealController.tsx、src/app/layout.tsx。

## 検証

最新コードのTypeScript、変更ファイルのESLint、本番ビルド（67ページ生成）通過。ブラウザ結果は results.json、未捕捉エラーは browser-errors.json に保存します。再確認は scripts/verify-scroll-reveal.ps1（最新ビルドを3100で起動）。

ローカルプレビュー: http://127.0.0.1:3100/ 。iPhone Safari実機は未確認。本番反映・commit・pushは行っていません。

低モーション設定で既存図解のHTML差分によるReact 418も検出。ReasonFlowDiagram / ReasonEngineDiagram の設定取得を、サーバーと初回hydrationの値が一致する既存の useReducedMotion フックへ統一しました。図解の内容は維持しています。


通常モーション: 390pxでトップ、サービス、会社紹介、記事本文（/articles/construction）、問い合わせ、詳細見積もり、体験デモの7ページで開始中のopacity、完了時のopacity=1、一度だけの表示、横超過0pxを確認。PC1280pxのサービスページでも動作と横超過0pxを確認。後から追加したブロックの表示、フォーカス時の停止、クライアント遷移後の再登録も通過（interaction-check.json、pc-check.json）。


最終確認: 図解の修正を含む本番ビルド通過。新規セッションで通常表示と低モーション表示を再確認し通過。コンソールのerror 0件、未捕捉エラー0件（final-console.json、browser-errors.json）、実行中の共通アニメーションなし（reduced-after-fix.json）。過去のエラー記録は browser-errors-before-diagram-fix.json と reduced-before-fix.json に分けて残しています。npm経由のCLI待機が長い場合、検証スクリプトの -BrowserBinary に導入済みagent-browser実行ファイルを指定できます。

