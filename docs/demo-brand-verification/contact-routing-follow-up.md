# 建設デモの問い合わせ先 再確認・補強

確認日: 2026-10-23。依頼: `docs/追記.md`「建設デモ：ブランドに応じた問い合わせ先の切り替え」。サイト内の見積もり本文同封とは別の、既存ブランド修正PLANの対応として実施。

## 原因と公開状態

公開URL `https://construction-demo-six.vercel.app/?brand=axeon` は、現在も旧実装の動作である。

- 表示は `Construction` のみで、AXEON名がない。
- `/photo` `/report` `/ops` へのリンクにbrandが付かない。
- 「相談する」はIDEAL公式を向く。`brand=ideal` の場合と同一。
- ハブに見積もりCTAは表示されていない。

一方、ローカル `construction_demo` の作業ツリーにはブランド分岐の修正がある。公開ページの内容はこの修正を反映していない。

| リポジトリ | ブランチ・コミット | 状態 |
| --- | --- | --- |
| rinopro-site | `main`。建設の入口変更は `208f845` に含まれる。確認時HEADは `b78174f` | 掲載URLはAXEON指定になっている |
| construction_demo | `main` / `5849ee6` | ブランド分岐は未コミットの作業ツリーにある。今回の補強も未コミット |
| roi-simulator | この再確認では変更なし | 既存ローカル版を検証に使用 |

`rinopro-site` のmain統合では、別リポジトリ `construction_demo` の未コミット変更は取り込まれない。建設の修正済みコミットはまだ存在しないため、公開デプロイとのSHA一致を示すことはできない。

Vercelの管理APIは、ローカルの `.vercel/project.json` に記載されたチームへのアクセスが403で拒否された。既存CLIでも同スコープのプロジェクト情報を取得できなかった。接続認証の変更、CLI更新、デプロイは実施していない。

ローカルリンクのプロジェクト名は `construction-demo`。公開URLのデプロイID、対応Git SHA、当該URLとこのプロジェクトの対応は管理情報では未確認。公開URLのHTMLが旧動作であることは直接確認済み。推測したプロジェクトへ公開しない。

## 今回の補強

以前のローカル実装は、共通 `NEXT_PUBLIC_CONTACT_URL` をAXEONへ適用しない構成だった。ただしブランド別の上書き変数へ誤って逆ブランドのURLを設定した場合は、その値を採用できていた。

`construction_demo/lib/demo-brand.ts` に `DEMO_BRANDS` を設け、表示名・公式サイトURL・既定問い合わせ先・問い合わせ先の許可オリジンをブランド別の固定設定に集約した。

`getContactUrl()` は、同ブランドの許可済みHTTPSオリジンだけを上書き先として受け付ける。逆ブランド・未登録ドメイン・不正URL・ユーザー情報付きURLは既定の問い合わせ先へ戻す。

互換仕様は維持している。

- 有効なURLの `brand` を優先。未指定・不正値はIDEAL。
- 共通の旧 `NEXT_PUBLIC_CONTACT_URL` はIDEAL専用。AXEONへ流用しない。
- AXEONにはIDEALの `service=ai-consulting` / `intent=gallery` をコピーしない。
- `from=photo` / `from=report` は既存どおり画面連携に使い、消費時もbrand等を残す。

公式ドメインを変更する場合は `DEMO_BRANDS` の公式URL・許可オリジンも更新する。任意ドメインへの環境変数だけの差し替えは受け付けない。

### 変更ファイル

今回追加で変更:

- `construction_demo/lib/demo-brand.ts`: ブランド設定の集約と問い合わせ先の検証。
- `construction_demo/README.md`: 上書き設定の範囲と公式ドメイン変更手順。
- `rinopro-site/scripts/verify-demo-brand-links.cjs`: 逆ブランドの上書き、不正URL、許可済み上書きの回帰テスト。
- `rinopro-site/scripts/verify-demo-brand-browser.cjs`: ハブへ戻った後の「相談する」をクリックし、対応ブランドのフォーム到達まで確認。
- `rinopro-site/docs/demo-brand-verification/browser-results.json`: 今回の結果に更新。各ケースにクリック後のURL・タイトル・HTTPステータスを追加。

画面遷移と完了CTA等に関する前回の変更ファイル一覧は [実装・検証報告](./implementation-report.md) を参照。

## 修正後の遷移先

| 項目 | AXEON | IDEAL |
| --- | --- | --- |
| 入口 | `/?brand=axeon` | `/?brand=ideal` |
| 表示名 | AXEON | ideal |
| 公式サイト設定 | `https://www.axeon.jp/` | `https://ideal-official-three.vercel.app/` |
| 問い合わせ | `https://www.axeon.jp/contact?demo=construction-hub` | `https://ideal-official-three.vercel.app/contact?service=ai-consulting&intent=gallery&demo=construction-hub` |
| 見積もり | `{ROI_ORIGIN}/?kit=report-auto&industry=construction&cat=internal&from=construction-demo&brand=axeon` | 同左の `brand=ideal` |
| 写真→報告 | `/report?from=photo&brand=axeon` | `/report?from=photo&brand=ideal` |
| 報告→管理 | `/ops?from=report&brand=axeon` | `/ops?from=report&brand=ideal` |
| 各画面→ハブ | `/?brand=axeon` | `/?brand=ideal` |

既存UIのロゴ相当の表示はブランド名テキスト。公式サイトへの外部「戻る」リンクは建設デモには現存しないため新設していない。既存の「← ハブ」は上表どおりブランドを維持する。公式サイトへリンクする場合の正本は `DEMO_BRANDS.siteUrl` とする。

ヘッダー・フッター・完了画面を含む既存外部リンクを確認した。建設から補助アプリへの `https://kanri-kensetsu.vercel.app/login` は共通の本格アプリ用リンクとして維持し、問い合わせ先へ変換したり、未対応のbrandクエリを付けたりしていない。

## 検証結果

環境設定による逆ブランドへの上書きを再現するため、ビルドコマンドのプロセス環境にだけ次を指定した。

```text
NEXT_PUBLIC_AXEON_CONTACT_URL=https://ideal-official-three.vercel.app/contact
NEXT_PUBLIC_CONTACT_URL=https://www.axeon.jp/contact
NEXT_PUBLIC_ROI_SIMULATOR_URL=http://127.0.0.1:3181
```

`.env.local`・Vercelの設定自体は変更していない。このテスト用ビルドを公開するものではない。

| テスト | 結果 |
| --- | --- |
| ブランドとURLの回帰テスト | 成功。逆ブランド・不正値は既定問い合わせ先へ戻る |
| construction_demoの本番ビルド・型検査 | 成功 |
| AXEONデスクトップ | 写真→報告→提出→見積もり→管理→ハブ→相談を確認 |
| IDEALデスクトップ | 同じ経路を確認 |
| AXEONモバイル390px | 同じ経路を確認 |
| 「相談する」の実クリック | AXEONは「問い合わせ \| AXEON」、IDEALは「お問い合わせ \| ideal」のフォームへ到達。どちらもHTTP 200 |
| 見積もり | URL・表示ブランド、共有URL、再読み込み、閉じる・再開を確認 |
| 同一ブラウザの別タブ | AXEON／IDEALを同時に開いてもbrandが混ざらない |
| 旧入口・画面直リンク・埋め込み | 既存の回帰テスト成功 |

詳細な実URLは [browser-results.json](./browser-results.json)。問い合わせ先への到達までを確認し、フォーム送信は行っていない。

## 本番で残っていること

公開URLは依然としてIDEALへ向く旧挙動で、解決済みとは扱わない。コミット・push・公開は本対応では行っていない。

本番反映時は、公開URLに対応する正しいVercelプロジェクトを確認し、建設デモの修正をコミットしたうえで公開する。見積もりアプリのブランド保持修正も本番反映を確認する。公開後は実際の両ブランド入口から同じクリック検証を実施し、デプロイID・Git SHA・表示ブランド・全出口URLを対応付けて記録する。
