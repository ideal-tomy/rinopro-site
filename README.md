# AXEON Webサイト

Next.js App Router / React / TypeScript / Tailwind CSS の企業サイトです。実際のバージョンとコマンドは package.json を参照してください。

## 起動と確認

- npm ci: ロックファイルに基づく依存関係のインストール。
- npm run dev: 開発サーバー（通常 http://localhost:3000）。
- npm run build: 本番ビルド。
- npm run start: ビルド済みサイトの起動。
- npm run lint: プロジェクトのESLintチェック。
- npx tsc --noEmit --incremental false: 型チェック。

外部連携の設定項目は .env.example を参照してください。認証情報はGitへ登録しません。機能別の verify:* コマンドは package.json にあります。

## コードの入口

- src/app: ページ、レイアウト、API。
- src/components: 機能・ページ別の表示部品。
- src/hooks: Reactの状態管理やブラウザ連携。
- src/lib: コンテンツ、業務ロジック、外部連携、入力検証。
- src/data / content: 記事などのデータ。
- public: 画像と静的ページ。
- scripts: 検証、データ登録、レポート生成。

トップページの入口は src/app/page.tsx、表示順の管理は src/components/home/HomeLandingPage.tsx です。

[現行トップの構成と旧実装候補](docs/home-top-structure.md) に、セクション、表示ルールの所在、参照確認の結果を記載しています。home フォルダ内の全ファイルが現行トップで使われているわけではありません。

## 変更時の確認

AGENTS.md と適用される作業規約を確認してください。この環境のNext.jsは node_modules/next/dist/docs/ のガイドを参照して扱います。

トップのUI変更は、上記の構成文書で現行部品を確認してから行います。共通部品やCSSを変更する場合は下層ページへの影響も確認してください。

[トップの変更基盤整理・表示と操作の検証結果](docs/ui-foundation-2026-10-05/verification.md) に、前後画像、管理範囲、既存の表示問題、検証スクリプトを記録しています。

トップのUI・UX改善: [変更内容・比較画像・検証結果](docs/uiux-2026-10-06/verification.md)。
