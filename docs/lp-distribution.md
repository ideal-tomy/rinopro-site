# 配布用スタンドアロン LP

メインサイトの Header / Footer / サイトマップからはリンクしません。URL を直接配布して利用します。

## 公開 URL

| ターゲット | ファイル | URL（本番） |
|-----------|----------|-------------|
| 中堅企業向け v2 | `public/lp/chuken-enterprise-v2.html` | `https://www.axeon.jp/lp/chuken-enterprise-v2` |

※ `.html` 付きURLは上記へリダイレクトされます。配信は `public/lp/chuken-enterprise-v2.html` を rewrite で表示します（サイトの Header/Footer は付きません）。

## ローカルで開けないとき

1. 動いている `npm run dev` をすべて止める（ターミナルで Ctrl+C）
2. まだポートが塞がっている場合: `taskkill /PID <表示されたPID> /F`
3. `.next` フォルダを削除してから `npm run dev` を再実行
4. `http://localhost:3000/lp/chuken-enterprise-v2` を開く（**3001 ではなく、起動ログに出たポート**）

## 原稿の置き場所

- 編集用マスター: `docs/files/AXEON-LP-中堅企業向け_v2.html`
- 本番反映時は `public/lp/` にコピーし、リンク・メタタグを揃える

## SEO

- `noindex, follow` を LP に付与（メインサイトとの検索競合を避ける）

## 問い合わせ導線

- CTA は `/contact?from=lp-chuken-v2`（流入計測用クエリ）
