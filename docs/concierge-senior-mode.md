# シニアモード（コンシェルジュ）

## 目的

高関与ユーザー（具体的な相談文・ウィザード後の追質問・事例流入など）に対し、**シニアアーキテクト／シニアコンサルタント**相当の system 追記と**要約版デモカタログ（最大10件）**を載せ、**理由付き**のサイト内リンクで納得感を出す。営業トーンは抑え、**チャット下部の CTA 帯が主導線**であることは変えない。

## 実装の単一ソース

- 判定・カタログ・プロンプト追記: [`src/lib/ai/concierge-senior.ts`](../src/lib/ai/concierge-senior.ts)
- system 組み立て: [`src/lib/ai/concierge-prompts.ts`](../src/lib/ai/concierge-prompts.ts) の `buildConciergeSystem`
- API: [`src/app/api/chat/route.ts`](../src/app/api/chat/route.ts)
- クライアントシグナル: [`src/components/chat/ChatContainer.tsx`](../src/components/chat/ChatContainer.tsx) の `conciergeSignalsRef` + `prepareSendMessagesRequest`

## 発火条件（サーバ `inferSeniorEngagement`）

次の**すべて**を満たすとき、直近メッセージが `user` のリクエストでシニアになる。

1. **文脈**: `mode` が `development` / `consulting`、または `pageContext` が `demo` / `services`、または `conciergeSignals.fromCaseStudy === true`
2. **エンゲージメント**（いずれか）:
   - 直近ユーザー文が **40文字以上**（`SENIOR_MIN_MESSAGE_LENGTH`）
   - **キーワード2つ以上**（`SENIOR_KEYWORDS` に部分一致。一覧は `concierge-senior.ts`）
   - **ウィザード構造**: 1通目ユーザーがサービスプリセット／step1 ラベル／「自由記述で相談する」のいずれかで、2通目以降にユーザーがいる（`detectPostWizardUserMessage`）
   - **クライアント信号** `postPreset: true`（プリセット確定または自由記述開始の**次の送信1回**）
   - **事例流入** `fromCaseStudy: true` かつ直近ユーザー文が **24文字以上**

`default` + `top` / `other` では、上記文脈に入らないため通常シニアにならない。

## クライアント信号 `conciergeSignals`

| フィールド | 意味 |
|-----------|------|
| `postPreset` | サービスウィザードでテンプレ返信後、または自由記述開始後の**次の API 送信1回**だけ付与（送信後に ref から削除） |
| `presetLabel` | 選んだ最終ラベル（任意・プロンプト補助） |
| `fromCaseStudy` | URL クエリ `concierge_from=case_study` のとき、送信ごとに付与（`window.location.search` から判定） |

改ざんされてもプロンプト補助以上の害は想定しにくいが、**サーバ側推論が主**でシグナルは補助。

## ホワイトリスト URL

モデルに出させるパスは次に限定（プロンプトで明示）。

- `/demo/list`, `/estimate-detailed`, `/contact`
- シニア用カタログに列挙された `/demo/{slug}` のみ

## 検証スクリプト

```bash
npx tsx scripts/verify-concierge-senior.ts
```

## 変更時

閾値・キーワード・出力型を変えたら **本書と `concierge-senior.ts` を同じ PR で更新**すること。
