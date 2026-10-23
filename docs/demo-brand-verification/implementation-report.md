# デモのブランド導線 実装・検証報告

実施日: 2026-10-23

建設の「相談する」に関する再確認・上書き設定の補強は [追加対応報告](./contact-routing-follow-up.md) を参照。公開URLは旧挙動のままで、本番反映は未実施。

## 実装した内容

AXEON／IDEALの入口から建設デモに入ったとき、写真・報告・提出・現場オペ・ハブへ戻る操作と、見積もり・相談先で同じブランドを使うようにした。パラメータなしの旧建設URLはIDEALとして扱う。

### construction_demo

- `lib/demo-brand.ts`: ブランド正規化、表示名、内部リンク、消費済み `from` だけを除去する処理、ブランド別問い合わせ先を集約。
- `lib/demo-links.ts`: 環境設定をサーバーで読み、解決済み見積もり・問い合わせURLだけを画面へ渡す。クライアントから環境変数を参照する構成を解消。
- `lib/roiLink.ts`: `brand=ideal` 固定を外し、解決済みブランドからURLを生成。既存のkit・industry・cat・fromは維持。
- 各ページ: サーバーの `searchParams` からブランドを解決。報告画面の既存UIは `components/ReportDemo.tsx` に分離し、サーバーのページは設定の受け渡しに限定。
- ハブ・写真・報告・管理: 既存の表示領域にブランド名を表示し、全内部リンクでブランドを維持。
- 写真→報告・報告→管理: ワンタイムの `from` は従来どおり消費し、ブランドや他のクエリ・ハッシュは消さない。
- 見積もりCTA: ハブ、デスクトップ完了画面、モバイル完了画面、操作メニューの全呼び出しに解決済みURLを渡す。
- `README.md`: 入口URLとブランド別設定、見積もり設定の要件を追記。
- ビルド中に見つかった既存の `ReportStoryPane.tsx` の型エラーを1行修正。日報型であることを確認済みの `draft` を返り値の型に維持し、帳票UIは変更していない。

### roi-simulator

`src/lib/url.ts` でAXEONもURLへ明示して保存する。入力時のURL書き戻し、見積もりを閉じる操作、共有・埋め込みURL生成で `brand=axeon` が省略されない。ブランド全体の既定値・試算計算・質問内容は変更していない。

### rinopro-site

- `src/lib/content/external-demos.ts`: AXEON用の建設ハブ・報告書URLを一元化。
- トップと建設業界LP: `brand=axeon` を付けて建設デモを開く。
- 製造URLの定数名 `manufacturingIdeal` は実体に沿って `manufacturingQualityIncident` に変更。掲載文言・デモ自体の差し替えは未実施。

### ideal_official

既存の未コミット変更を維持したまま、既に作業ツリーに存在していた建設デモURLへ `brand=ideal` を追加した。

- `data/demo-first/portfolio.ts`
- `data/cases/construction-photo-sorting.ts`
- `data/demo-lp/photo-to-classification.ts`
- `app/ai-capability-gallery/photo-to-classification/page.tsx`
- `content/articles/construction.html`
- `next.config.ts` の `/construction` リダイレクト
- `scripts/prepare-article-html.mjs` の生成元設定

既存のドメイン変更・保育URL修正など、今回より前に存在した変更は戻していない。記事再生成による他記事の書き換えは行っていない。

## 検証結果

| 確認 | 結果 |
| --- | --- |
| 建設デモの型チェック | 成功。既存帳票の型エラー修正後に確認 |
| 建設デモの本番ビルド | 成功。テスト用ROIオリジンをコマンドの環境だけに渡して実施 |
| 見積もりの本番ビルド | 成功 |
| AXEONサイトの本番ビルド | 成功 |
| AXEON側の変更したコンテンツTSのeslint | 成功 |
| IDEAL側の変更したTS／TSX／設定・生成スクリプトのeslint | 成功 |
| IDEAL側全体の型チェック | 既存の `e2e/journeys/services.spec.ts:13` で失敗。3引数のヘルパーに4引数を渡している。今回のURL変更箇所に関する診断はなし。無関係なテストは変更していない |
| URLヘルパーの回帰テスト | 成功。ブランドなし・不正値・二重指定、fromとハッシュ保持、問い合わせ先、共有・埋め込み・見積もり閉鎖時のURL往復 |
| IDEAL既定でのAXEON URL復元 | 回帰テストで成功。`VITE_DEFAULT_BRAND=ideal` 相当のテスト条件でもAXEONを維持 |
| ローカルブラウザ | AXEON／IDEALのデスクトップとAXEONの390pxモバイルで主要導線に成功 |
| 本番ビルドでのローカル再確認 | 建設・AXEONは `next start`、見積もりは `vite preview` で上記の主要導線を再確認して成功 |
| IDEAL側の実入口 | 開発サーバーでトップ・建設LP・記事のリンクと旧URLの307リダイレクトを確認。全て `brand=ideal` |
| 公開中の他3デモ | 計17段階の操作・表示リンクを確認。IDEALの問い合わせ・見積もりへの誤誘導なし |

ブラウザ検証では既存のPlaywrightとインストール済みEdgeのヘッドレス実行を使用。新しいパッケージ・ブラウザのインストールは行っていない。

### 建設・見積もりのブラウザ確認範囲

- 写真整理 → 報告下書き → 確認 → 提出 → 見積もりを別タブで開く。
- 見積もりの表示ブランドと実URL、入力、共有URLからの復元、閉じる、再読み込み、再開。
- 提出 → 管理画面 → ハブへ戻る操作と、`from` 消費後のブランド保持。
- ブランドなし／不正値の旧入口、各画面への直アクセス、既存の埋め込み入口。
- 同じブラウザコンテキスト内でAXEON版とIDEAL版を別タブに開き、互いのリンクのブランドが変わらないことを確認。
- AXEONトップ／建設LPの実際の掲載リンク。
- ロゴ相当のブランド表示と各画面の表示ブランド、問い合わせ・補助アプリ等の出口。
- サンプル動作を使用。実画像のAI解析・問い合わせ送信はこの導線検証に含めない。

結果の実URLは [browser-results.json](./browser-results.json)、画像は同じフォルダの `*-submitted.png` に保存。

IDEAL側の実入口の結果は [ideal-entry-results.json](./ideal-entry-results.json)。IDEALのローカル建設LPでは既存動画 `/videos/demo-lp/construction-record.mp4` の404も記録されたが、ブランド導線とは別のため変更していない。

### 他3デモ

- 製造: 入口→ダッシュボード→不具合詳細→原因調査→是正・承認→提出を操作。
- 図面承認: 入口→照合・保留一覧・承認・基準改定の表示切り替え→仕組みの説明を確認。公開版は画面紹介を切り替える構成であり、実データの承認送信テストではない。
- 保育: 入口→ダッシュボード→記録開始・停止→サンプル記録→報告書生成→報告書詳細→質問・決まりへの参照を確認。

各段階の表示リンクは [other-demo-results.json](./other-demo-results.json)。確認した各デモに見積もりの新規CTAは追加していない。

補助アプリ `kanri_kensetsu` はローカルの外部URL・ブランド関連コードを検索し、今回の見積もり／IDEAL誘導に相当する処理は見当たらなかった。ログイン後の全機能のE2E確認は未実施で、アプリ自体は変更していない。

## 本番反映に必要な作業と未解決事項

コミット・push・デプロイ・Vercelの環境設定変更は行っていない。現在の公開サイトに今回の修正が反映されたとは扱わない。

公開中の建設デモでは、サンプル提出後にも見積もりCTAが表示されなかった。ハブにも見積もりCTAがなく、公開JSにはクライアントの環境変数参照が残っていた。今回その参照をサーバー解決に変更したが、公開環境の変数設定値は未取得であり、非表示の原因を「環境変数未設定」とは断定していない。

公開時は次を確認する。

1. `construction_demo` のProduction環境で `NEXT_PUBLIC_ROI_SIMULATOR_URL=https://roi-simulator-eta.vercel.app` が有効であることを確認する。必要なら設定して再ビルドする。
2. AXEONの相談先の既定値は、到達を確認した `https://www.axeon.jp/contact?demo=construction-hub`。任意の上書きは `NEXT_PUBLIC_AXEON_CONTACT_URL` を使う。
3. IDEALの既定相談先は既存URLを維持。任意の上書きは `NEXT_PUBLIC_IDEAL_CONTACT_URL`、または互換用 `NEXT_PUBLIC_CONTACT_URL` を使う。AXEONにはこの互換変数を適用しない。
4. 見積もりアプリ → 建設デモ → 掲載元の順に公開する。IDEAL側は既存作業を含むため、今回分だけの差分と他の未コミット変更を確認してから公開する。
5. 公開後にAXEON／IDEALの実入口から再操作し、必要な見積もりCTAが表示・操作できることと、表示ブランド・全出口URLを再確認する。非表示なら未解決のまま報告する。

製造の紹介文と品質不具合対応デモの不一致も未解決。ユーザーに2案を提示済み。現行デモを維持して紹介を合わせるか、現行の紹介に合うデモへリンクを変更するかの判断後に別差分で対応する。

## 再実行

`rinopro-site` から以下を実行する。

```powershell
node scripts/verify-demo-brand-links.cjs
node scripts/verify-demo-brand-browser.cjs
node scripts/verify-other-featured-demo-links.cjs
node scripts/verify-ideal-demo-entries.cjs
```

ブラウザテストの既定値は建設 `http://127.0.0.1:3180`、見積もり `http://127.0.0.1:3181`、AXEON `http://127.0.0.1:3182`。`DEMO_ORIGIN` / `ROI_ORIGIN` / `SITE_ORIGIN` で変更可能。建設側の見積もり設定もテスト対象のROIオリジンに合わせる。Playwrightは既存の `ideal_official/node_modules/playwright` を利用し、必要なら `PLAYWRIGHT_MODULE` で場所を指定する。

IDEAL入口テストは `http://127.0.0.1:3183` を使用し、`IDEAL_ORIGIN` で変更可能。検証のため起動したローカルサーバーは検証後に終了する。
