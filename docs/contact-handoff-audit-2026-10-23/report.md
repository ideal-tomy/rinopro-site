# 概算見積もり・要件から問い合わせへの引き継ぎ調査

実施日: 2026-10-23。対象: `rinopro-site` の現在の `main`。

## 結論

原因は、見積もり結果画面と問い合わせフォームの接続が両方外れていること。見積もりを生成する処理やメールの添付処理がなくなったわけではない。

1. 金額結果画面が `/contact` へ直接リンクし、本文・スナップショットの保存と流入元指定を行っていない。
2. 問い合わせフォームが `prefill` / `handoff` / `from=estimate` を読み取らず、保存済みの見積もりを復元しない。
3. フォームの送信payloadにも `estimateSnapshot` がないため、APIから管理者メールの添付まで届かない。

アプリのコードは変更していない。調査スクリプトと結果・報告書のみを追加した。コミット・push・公開・実メール送信は行っていない。

## 現在の経路と断絶点

```text
ヒアリング
  → 見積もり・要件を作成
  → sessionStorage の詳細見積フローに保存
  → /estimate-detailed/result（要件のたたき台）
  → /estimate-detailed/amount（金額）
  → 「お問い合わせページへ」
  → /contact                         ← 引き継ぎの準備もfrom指定もない
  → ContactForm                      ← 見積もりの受け取り処理がない
  → POST /api/contact                ← estimateSnapshot が入らない
  → 管理者メール                     ← 要件定義・見積もりの添付が作られない
```

### コード上の根拠

| 箇所 | 現状 |
| --- | --- |
| `src/components/estimate/EstimateDetailedAmountContent.tsx:123` | `<Link href="/contact">お問い合わせページへ</Link>`。引き渡し処理を呼ばない |
| `src/components/contact/ContactForm.tsx:40` | 本文は空文字で開始 |
| 同ファイル `:59` 以降 | 自動反映するクエリは `pattern` と `industry` のみ |
| 同ファイル `:114` 以降 | name/email/message/company/triedExperienceのみを組み立てる。snapshot・briefは送信しない |
| `src/lib/contact/apply-contact-handoff.ts:173` | 受け取り・復旧用の純粋関数は残っているが、現在のフォームから呼ばれていない |
| `src/lib/chat/estimate-handoff.ts:404` | 本文とsnapshotの一時保存処理は残っているが、現在の金額画面から呼ばれていない |
| 同ファイル `:419` | `from=estimate` を付けるURL生成処理も残っているが、現在の金額画面から呼ばれていない |
| `src/app/api/contact/route.ts:44` / `:65` | APIはsnapshotを受け取ってメールへ渡せる。現フォームはそのフィールドを送らない |
| `src/lib/contact/mail-templates.ts:128` | snapshotから管理者メールの添付を生成する |
| `src/lib/contact/build-contact-mail-attachments.ts:27` | 実見積もりsnapshotがある場合は要件定義Markdownと見積もりJSONの2ファイル。なければ0件 |
| `src/lib/contact/send-contact-emails.ts:89` | 生成された添付をメール送信サービスへ渡す処理も残っている |

`applyContactHandoff()` は、単に過去の見積もりデータが保存されているだけでは自動適用しない。明示的な流入元・引き継ぎ指定に応じて復元する設計で、通常の `/contact` は `none` になる。

## 履歴で確認した変更

2026-06-26のコミット `d43f01a`（「サービスページ画像変更」）で、以下が削除されている。

- 金額画面の `goContact()` と `prepareContactNavigationFromEstimateFlow(flow)` の呼び出し。
- `ContactForm` の `useContactHandoff()` と、下書きを本文へ反映する処理。
- `carriedSnapshot` と、送信payloadへの `estimateSnapshot` の同梱。
- 引き継ぎ済み表示、復元失敗時の案内・送信制御、送信成功時の引き継ぎデータ削除。
- 金額画面の任意の問い合わせ前整理UI。

現在のツリーには `use-contact-handoff.ts` と `navigate-to-contact-from-estimate.ts` 自体も存在しない。旧実装のimportを戻すだけでは修復できない。

今回のデモブランド対応・main統合によって初めて発生したものではなく、その前から存在する状態。全体を旧コミットへ戻すのではなく、現在のフォーム構成に必要な機能を再接続するのが適切。

## 再現・検証結果

新規の隔離ブラウザコンテキストで、調査用の見積もり・要件データを使って確認した。送信リクエストはブラウザで捕捉してテスト応答を返し、実際のAPI・メール送信サービスへは送っていない。

| 検証 | 結果 |
| --- | --- |
| 完了済み見積もりを保存して金額画面から問い合わせをクリック | `/contact` に遷移し、本文は空 |
| 有効なsnapshot・prefill・詳細見積フローを全て保存したうえで `/contact?from=estimate&prefill=session` を開く | 本文は空。フォーム側が読まないことを確認 |
| `/contact?prefill=...` でコンシェルジュの短文を渡す | 本文は空。コンシェルジュ経路も同じ受け取り不備の影響を受ける |
| 金額画面から遷移したフォームを調査用入力で送信し、リクエストを捕捉 | payloadはname/email/messageのみ。estimateSnapshot・inquiryBriefはない |
| `npm run verify:contact-handoff` | 成功。ただし補助関数を直接呼ぶテストであり、実画面の接続は検証していない |
| `npm run verify:contact-mail` | 成功。ただしsnapshotを直接渡すテスト。実フォームが送らない問題は検出しない |
| 正しい流入元指定を付けて既存の受け取り関数を直接呼ぶ | `estimate_ok`。snapshot生成・復元の基本処理は利用可能 |
| メール添付関数へsnapshotを渡す／渡さない | 2件／0件。受け渡しを戻せば既存の添付生成を使える |

ブラウザ結果: [results.json](./results.json)。純粋関数の結果: [logic-results.json](./logic-results.json)。ローカルの既存本番ビルドを起動して確認し、公開中サイトの送信テストは行っていない。

## そのまま復活させると残る問題

旧 `buildContactMessageDraft()` は、要件定義の全文を問い合わせ本文へ入れる。一方で現在の本文欄とAPIスキーマは6000文字まで。

調査用に7000文字の要件本文を渡すと、自動下書きは7466文字になり、実際に `message` の文字数エラーになることを確認した。同じ完全なsnapshotでも、本文を短い相談文に分ければAPIスキーマの検証は通る。

したがって「旧コードをそのまま戻す」「全文を本文欄に詰める」だけの修正は推奨しない。**本文に相談概要・金額・追記欄、別の構造化データに要件全文・ヒアリング回答**を保持する構成にする。本文だけでなく実メールの添付までを完成条件にする。

## 推奨する修正

### 1. 金額画面の問い合わせボタンを再接続

- 現在のflowから `buildEstimateSnapshotFromFlow()` でsnapshotを作る。
- 問い合わせ向けの短い要約を作り、snapshotとまとめて保存する。
- `/contact?from=estimate&prefill=session` など、引き継ぎ意図を明示した同一タブの導線にする。
- 保存に失敗した場合は、成功した前提で進めず、再試行等の案内を出す。既存保存ヘルパーは例外を握りつぶすvoid返却なので、修正時には成功・失敗を判断できるようにする。
- 通常のヘッダー等の問い合わせリンクまで、過去データを無条件で付ける挙動にはしない。

### 2. 問い合わせフォームで復元・確認

- 既存 `applyContactHandoff()` を使う受け取りフック等を再実装し、本文とsnapshotをフォームstateへ渡す。
- 「概算見積もり・要件を同封しています」と、案件名・金額・同封内容を見せる。
- 問い合わせ本文には短い要約を初期入力する。長い要件は本文から分離し、ユーザーが追記・編集しても上書きしない。
- 手入力・`pattern`・`industry` の既存反映と競合しないよう適用順序を定義する。
- 引き継ぎを指定しているのに復元できない場合は明示し、見積もりに戻る／通常問い合わせとして続ける手段を出す。

### 3. 送信データ・添付をつなぐ

- `ContactForm` のpayloadに `estimateSnapshot` を同梱する。
- 既に問い合わせ前整理のbrief等がある場合も失わない。必要に応じて `inquiryBrief` 等を明示してメール本文へつなぐ。
- 要件全文・ヒアリング回答・金額はsnapshot側で保持し、要約のために元データを切り捨てない。
- 既存のAPI・メール添付関数を利用し、管理者メールの要件定義 `.md` と見積もり `.json` の生成を確認する。
- 現行の実装では顧客向け自動返信にファイルは添付しない。顧客にも同じ添付を送る要件がある場合は、別途明確にして対応する。
- 送信成功後だけ引き継ぎ用データを削除し、送信失敗時には入力と同封データを保持する。

### 4. 実導線の回帰テスト

- 要件・金額作成 → 問い合わせボタン → 自動要約表示 → リクエストのsnapshot → 管理者メール添付の一連を検証する。
- 6000文字を超える要件でも、本文の文字数エラーや全文の欠落が起きないこと。
- 戻る・再読込・保存失敗・復元失敗・送信失敗時の保持・成功後の削除を確認する。
- 通常問い合わせへ古い見積もりを付けないことと、コンシェルジュのprefillも反映すること。
- 既存の関数単体テストは継続し、それだけで画面全体の引き継ぎを合格にしない。

## 調査範囲の補足

今回はサイト内の `/estimate-detailed` フローが対象。前の調査で扱った外部 `roi-simulator` は別オリジンであり、同じsessionStorageを直接共有できない。外部見積もりからAXEON問い合わせへ内容を渡す要件も含める場合は、外部側の送信導線と受け取り形式を別途設計する。

再実行:

```powershell
npm run verify:contact-handoff
npm run verify:contact-mail
node node_modules/tsx/dist/cli.mjs docs/contact-handoff-audit-2026-10-23/probe-logic.ts
node docs/contact-handoff-audit-2026-10-23/reproduce.cjs
```

ブラウザ調査はローカルサーバー `http://127.0.0.1:3190` を使用。`SITE_ORIGIN` で変更可能。既存PlaywrightとEdgeを利用し、依存の追加は行っていない。
