# トップ掲載デモのリンク調査（2026-10-23）

## 結論

建設デモのIDEAL誘導は、デモ側の固定設定に原因がある。トップ側は共通の建設デモURLを掲載しているが、デモが流入元によってブランドを切り替える実装になっていない。入口URLに `brand=axeon` を追加するだけでは解決しない。

アプリのソース・環境変数・公開設定は変更していない。

## トップの入口

正本は `src/lib/content/top-featured-demos.ts:2`。`FeaturedTryLink` は `tryHref` をそのまま別タブで開く（`src/components/home/demo-showcase/TopFeaturedDemoShowcase.tsx:402`）。ブランド・流入元パラメータの追加はない。

| 掲載デモ | URL | 公開確認 | IDEALへの誘導 |
| --- | --- | --- | --- |
| 建設 | https://construction-demo-six.vercel.app/ | HTTP 200、建設の記録デモ（3体験） | 問い合わせはIDEAL公式。見積もり生成処理もIDEAL固定 |
| 製造 | https://axeonmanufacturing02.vercel.app/ | HTTP 200、Quality Incident Console | 確認したHTML・JSにIDEAL見積もり・問い合わせへの導線なし |
| 図面承認 | https://approval-diagram.vercel.app/ | HTTP 200、受入検査 AIサポート | 確認したHTML・JSにIDEAL見積もり・問い合わせへの導線なし |
| 保育 | https://childcare-demo-six.vercel.app/ | HTTP 200、SafeChild DX | 確認したHTML・JSにIDEAL見積もり・問い合わせへの導線なし |

製造について別の整合性問題あり。トップは「サンプル質問」「回答と出典」を案内しているが、実際のリンク先は品質不具合対応のコンソール。リンク自体は到達できるが、紹介内容との一致は要修正判断。

## 建設の根拠

ローカルの `construction_demo/lib/roiLink.ts:1` で以下を固定している。

```text
kit=report-auto
industry=construction
cat=internal
from=construction-demo
brand=ideal
```

`getRoiSimulatorUrl()` は `NEXT_PUBLIC_ROI_SIMULATOR_URL` に上記を付与する。呼び出し元や入口のクエリを受け取らない。公開 `/report` の配信JS `/_next/static/chunks/app/report/page-43f6f2f297a83148.js` にも同じ `brand:"ideal"` が存在するため、手元のソースだけの問題ではない。

`construction_demo/lib/hub.ts:5` の `CONTACT_URL` は環境変数がなければ以下。

```text
https://ideal-official-three.vercel.app/contact?service=ai-consulting&intent=gallery&demo=construction-hub
```

公開トップの「相談する」にも実際にこのURLが出力されている。`https://construction-demo-six.vercel.app/?brand=axeon` のレスポンスでも同じIDEAL問い合わせ先が出る。内部の `/photo` `/report` `/ops` へのリンクにもブランドは付かない。

見積もりCTAは `components/RoiPaybackCta.tsx` にあり、報告画面やワークフローの完了時に表示する構造。環境変数がなければ非表示になる。今回の公開トップのHTMLには見積もりCTAが存在しなかった。公開 `/report` のJSでは環境変数が文字列に置換されず `env.NEXT_PUBLIC_ROI_SIMULATOR_URL` として残っていた。公開環境でのCTA表示と完了操作後の実リンクはブラウザ未操作のため未確認。ユーザーが見た見積もりリンクそのものを取得できたとは扱わない。

補助リンクの `https://kanri-kensetsu.vercel.app/login` もHTTP 200（GENBA NOTE）。ログイン後の操作・リンクは調査対象外。

## ブランド分岐がある場所

見積もりアプリ `roi-simulator/src/lib/brand.ts` には `axeon` / `ideal` の分岐がある。`parseBrand()` はURLで明示されたブランドを環境変数・既定値より優先する。したがって建設デモが `brand=ideal` を送る限り、見積もり側は意図どおりIDEALとして解釈する。

「見積もりアプリにブランド分岐がある」ことと「建設デモが流入元別にブランドを引き継げる」ことは別。確認した建設実装には後者がない。

## その他の公開確認範囲

- 製造: `/`、`src/app.js`、`src/views.js` とローカルのソースを確認。ローカル `selectionReturn.js` にAXEONデモ選定ページへの条件付き戻り先はあるが、見積もりのブランド分岐ではない。
- 図面承認: `/`、`screens.html?screen=match`、`story-mode.html`、`app.js`、`preview.js`、`selectionReturn.js` とローカルのソースを確認。AXEONデモ選定ページへの戻り先あり。
- 保育: `/`、`dashboard.html` とローカルのHTMLを確認。入口は同一サイト内のdashboardに進む。
- HTTP到達性と配信HTML・JSの読み取りによる調査。ブラウザで全操作を実行するE2E確認ではない。Browser用実行ツールがこのセッションでは提供されていないため、UI操作は実施していない。

## 修正方針

1. 建設デモが `brand=axeon|ideal` を受け取るようにする。既存IDEAL導線の既定動作は維持する。
2. `/photo` `/report` `/ops` とハブへの戻りを含め、デモ内の遷移でブランドを引き継ぐ。
3. 見積もりURLと問い合わせ先を同じブランドから決定する。問い合わせ先は許可したブランドごとの固定設定を使う。
4. AXEONトップの入口に `brand=axeon`、IDEAL側には必要に応じて `brand=ideal` を明示する。
5. `src/lib/content/industry-lp/external-demos.ts` の建設・報告書URLも同じ共通デモを指しているので、トップ以外も合わせて整える。
6. 公開環境の見積もりCTA表示条件を確認し、双方の入口から完了→見積もり→見積もりを閉じるまでブランド維持を確認する。

調査依頼のため、以上は修正案であり未実装。依存関係の追加、環境変数の変更、デプロイは行っていない。
