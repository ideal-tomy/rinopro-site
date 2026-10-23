# 建設以外の外部デモ：ブランド・問い合わせ導線の調査と修正

確認日：2026-10-23。ローカル修正まで。コミット・push・デプロイは未実施。

## 調査範囲

トップ掲載の製造品質・承認フロー・保育を含め、サイトから到達する建設以外の14デモ、31ページを公開環境で確認した。通常の画面内リンクを最大2ページまで追跡し、外部リンク、ロゴ画像、画面内のIDEAL表記を記録した。ログイン後の全機能や全組み合わせを網羅するものではない。

| デモ | 公開入口 | 結果 |
| --- | --- | --- |
| 製造品質 | axeonmanufacturing02.vercel.app | 確認した画面で誤誘導なし。変更なし |
| 承認フロー | approval-diagram.vercel.app | 同上 |
| 保育 | childcare-demo-six.vercel.app | 同上 |
| 製造業ハブ | product-flow-jet.vercel.app/manufacturing | 製品説明LPの問い合わせが仮メール宛先。ROIリンクのAXEON指定も欠落 |
| 社内ナレッジAI | internal-knowledge-demo.vercel.app | ソースでROIリンクのブランド指定欠落を確認 |
| 建設管理 | kanri-kensetsu.vercel.app | 確認した画面で誤誘導なし。変更なし |
| 採用 | saiyou-demo0420.vercel.app | 同上 |
| 建物管理 | obs-demo.vercel.app | 同上 |
| 農業 | oriza-copilot.vercel.app | 同上 |
| 介護 | kaigo-operation-demo.vercel.app | 同上 |
| DD | dd-demo-red.vercel.app | 同上。別サービスの試用リンクは確認対象として記録 |
| 不動産 | openestate-demo.gembashift.com | 確認した画面で誤誘導なし。変更なし |
| 引き継ぎ | lambent-smakager-7bcf0a.netlify.app | 同上 |
| マッチング | candid-salmiakki-22e9c7.netlify.app | 同上 |

製品固有の名称・ロゴは維持した。確認範囲で別会社のロゴへの置き換えを要する箇所はなかった。建設写真デモの先行修正は `contact-routing-follow-up.md` を参照。

## 修正内容

### product_flow

- 公開 `/lp` の「自社文書での活用を相談する」が `mailto:contact@example.com` を参照していたため、全問い合わせCTAを共通のブランド設定へ統合。
- AXEONの既定先を `https://www.axeon.jp/contact?demo=product-flow`、IDEALを `https://ideal-official-three.vercel.app/contact?demo=product-flow` とした。
- 既存のビルド時 `VITE_BRAND` 切替を維持。問い合わせ・製品説明の外部URL設定は、そのブランドの公式オリジンだけを許可。不正な値・逆ブランド設定は既定値へ戻す。製品説明の同一アプリ内パスは利用可能。
- ROIリンクは両ブランドで `brand` を明示し、既存のベースURLのクエリも保持。
- IDEALでは従来どおり `/lp` は製造業ハブへ戻る。AXEON用LPをIDEALに表示する変更は加えていない。
- READMEと環境変数の型コメントも更新。

### internal_knowledge_demo と入口サイト

- 共用デモは `?brand=axeon` / `?brand=ideal` を読み、ROIリンクへ引き継ぐ。未指定・不明値はAXEON。
- 画面名「社内ナレッジAI」を維持。紹介とデモのハッシュ遷移・再読み込みでもクエリを維持。
- IDEAL指定時は、AXEONの厳選版へ戻る導線を表示しない。
- rinopro-site の共通外部URLには `brand=axeon`、ideal_official のポートフォリオ・紹介LP・事例の3入口には `brand=ideal` を指定。
- ROIサービスURL未設定時のCTA非表示は既存仕様を維持。

## 検証と記録

- 公開14デモ・31ページの記録：`other-external-audit.json`（`scripts/audit-external-demo-brands.cjs`）。
- トップ3デモの操作を17段階で再確認：`other-demo-results.json`（既存 `scripts/verify-other-featured-demo-links.cjs`）。
- ソース設定の検証：`scripts/verify-external-demo-brand-config.cjs`。両ブランド、逆ブランド設定、不正なURL、同一アプリ内パス、ROIのクエリ保持、共用デモ入口を検証。
- ローカル本番ビルドのブラウザー検証：`scripts/verify-external-demo-brand-browser.cjs`、結果 `other-external-local-results.json`。両ブランドの製造業ハブ、サンプル体験完了後の相談先、ROIの別タブ・再読み込み、問い合わせ先フォーム到達、ナレッジの紹介往復・ROI・戻る導線を確認。
- product_flow：TypeScriptビルドとAXEON／IDEALのVite本番ビルド。internal_knowledge_demo：TypeScript検査とVite本番ビルド。
- サイト側の変更データは対象ファイルのESLintで確認。既存の依存再生成を伴う `prebuild` は実行せず、インストール・依存変更は行っていない。

ブラウザー検証用ビルドはローカルROI URLと意図的な逆ブランド環境変数を用いた検証専用。配布する際は各デプロイの正規環境変数で再ビルドすること。Viteの既存のチャンクサイズ警告は残る。

## 公開反映

公開サイトはまだ変更前。product_flow、internal_knowledge_demo と両入口サイトの変更を各リポジトリでレビュー・デプロイし、公開先でも同じ導線を再確認する必要がある。入口サイトだけの公開では、デモ内部の不具合は直らない。

この修正はブランド・問い合わせ先の整合を扱う。概算見積もりの結果を問い合わせ本文へ添付する処理は、別調査 `../contact-handoff-audit-2026-10-23/` の対象。

着手前から存在したホーム画面の3ファイルや、他リポジトリの作業中変更は変更・ステージしていない。
