# 既存公開ページのコピー

作成日: 2026-10-16

現在のローカル作業フォルダから、公開ルートのページと依存ファイルをコピーしました。元ファイルは変更していません。作業中の変更も含まれます。本番配信中のリビジョンとの一致は未確認です。

## 内容

- ページ本体と共通レイアウト、読み込み表示
- 参照先のコンポーネント、CSS、データ、ローカル画像・動画・SVG
- public/lp の公開HTMLと参照素材
- 記事HTML、ページ機能に使うAPI、設定・依存バージョン情報
- 元の相対パスを維持。コピー一覧.json に各ファイルのSHA-256を記録

## 対象外・注意

管理画面 /studio、旧URLの転送専用ページ、検証スクリプト、過去資料、node_modules、ビルド生成物、環境変数・秘密情報は含めません。
/prototype-showroom は noindex ですが直接アクセス可能なページとして含めています。
動的ルート [slug] はテンプレートとローカルデータを収録しています。Sanityのコンテンツ、外部画像・フォント、環境変数は外部依存です。
単体HTMLとしての書き出しではありません。すべての機能をこのフォルダだけでオフライン再現できる形式ではありません。

## ページファイル

- src/app/about/page.tsx
- src/app/articles/t/[slug]/page.tsx
- src/app/articles/[slug]/page.tsx
- src/app/contact/page.tsx
- src/app/demo/[slug]/page.tsx
- src/app/estimate-detailed/amount/page.tsx
- src/app/estimate-detailed/page.tsx
- src/app/estimate-detailed/processing/page.tsx
- src/app/estimate-detailed/result/page.tsx
- src/app/experience/page.tsx
- src/app/experience/[slug]/page.tsx
- src/app/industries/[slug]/page.tsx
- src/app/page.tsx
- src/app/prototype-showroom/page.tsx
- src/app/services/consulting/page.tsx
- src/app/services/page.tsx
- src/app/services/[slug]/page.tsx
- src/app/solutions/[slug]/page.tsx

## 確認結果

コピー 516 ファイル、82,057,872 bytes。全ファイルのコピー元・コピー先SHA-256一致を確認。
