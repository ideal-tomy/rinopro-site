# チャット共通 facts 一覧

## 目的

- トップ、demo、services、詳細見積、問い合わせが**別々の質問列**を持っていても、裏側では同じ facts を扱えるようにする。
- 「どのチャットが何を確定し、何を次へ引き継ぐか」を明確にし、**同趣旨の再質問**を減らす。
- 自由記述や音声入力を、例外ではなく **facts 抽出の材料**として扱えるようにする。

---

## このドキュメントの前提

- ここでいう facts は、**ユーザーの文章そのもの**ではなく、チャット横断で再利用したい**正規化済みの事実・意図・温度感**を指す。
- 体験プロトタイプ内の独立 bot は本書の主対象外とし、**サイト全体のコンシェルジュ〜見積〜問い合わせ**に関わる facts を優先する。
- 現状の実装で既に持っているものと、今後 canonical に寄せたいものを同じ表で整理する。

---

## 全体像

サイト全体のチャットは、最終的に次の3段へ収束させる。

1. **言語化前**  
   何が欲しいか、何が詰まっているか、どこから考えればよいかを整理する段階。
2. **仮整理済み**  
   作りたいものの型、対象、制約、概算の前提が揃い、要件定義と見積のたたき台が作れる段階。
3. **送信判断済み**  
   概算や前提を見たうえで、今回の相談で何を判断したいかが言える段階。

各チャットボットは、この3段のどこを担当するかを分担する。

---

## canonical facts の考え方

### 実装上の正規レイヤー

- canonical facts のキー名、収集状態、owner は `src/lib/facts/canonical-facts.ts` を正とする。
- 収集状態はコード上では `direct` / `approx` / `candidate` / `missing` を使い、本書の `直接確定` / `近似確定` / `要確認` / `未収集` に対応させる。
- owner は `visitorJourney` / `estimateFormDraft` / `inquiryBrief` の 3 つに固定する。
- `decisionMaker` と `whyNow` は Phase 1 では canonical ではなく candidate facts に留める。

### A. 入口・文脈 facts

| fact | 役割 | 現状の主な格納先 | 備考 |
|------|------|------------------|------|
| `entryIntent` | 直近の入口意図。学習・比較・相談・見積のどれで入ってきたか | `visitorJourney.latestEntryIntent` | 現状は `learn / compare / consult / estimate` の粒度 |
| `pageKindHistory` | 最近どのページ群を見てきたか | `visitorJourney.recentPageKinds` | 関心の偏りや温度感を見る補助 |
| `interestBias` | demo 寄り / consulting 寄り / development 寄り | `visitorJourney.interestBias` | CTA 優先順や返答トーンの補助 |
| `journeyDepth` | `light / exploring / estimate_ready / contact_ready` | `visitorJourney.journeyDepth` | 今どの段階にいるかの要約 |
| `viewedDemoSlugs` | 見た demo の履歴 | `visitorJourney.viewedDemoSlugs` | demo への再誘導や比較文脈に使える |

### B. 事業・テーマ facts

| fact | 役割 | 現状の主な格納先 | 備考 |
|------|------|------------------|------|
| `industryBundle` | 業種の第1層 / 第2層 / 補足1行 | `ConciergeEstimateContextPayload.industryBundle`, `visitorJourney.industryBundle` | すでに handoff の主軸 |
| `problemSummary` | いま困っていること・変えたいことの一文 | `EstimateFormDraft.summary`, `ContactForm.problemStatement`, `inquiryBrief.problemSummary` | 現状は 8文字ルールに強く依存 |
| `freeformMemo` | ユーザーの曖昧な希望・補足メモの圧縮版 | `visitorJourney.lastFreeformSummary`, `FlowSelection.freeform` | 自由記述や音声入力の主な受け皿 |
| `targetSummary` | 誰のどの業務か | `ContactForm.targetSummary`, `inquiryBrief.targetSummary` | 今後はより早い段階で取りたい |
| `currentPain` | うまくいっていないこと | `EstimateFormDraft.pain`, `ConciergeAnswers.issue` | 現状は demo と見積で粒度が違う |

### C. 成果物・解決方向 facts

| fact | 役割 | 現状の主な格納先 | 備考 |
|------|------|------------------|------|
| `productCategory` | 欲しいものの大カテゴリ | トップ分岐 `track`, demo 一覧の `issue` / `role`, サービス preset | まだ全チャットで同じ語彙ではない |
| `productArchetype` | 作りたいものの型。Web / 顧客管理 / 自動化 / 受付 / 業務基盤など | 現状はトップ `A3`、`D2`、一部 freeform に分散 | 今後 canonical にしたい中心 fact |
| `desiredOutcomeLevel` | どこまでできれば十分か / 理想か | 現状はトップの選択肢に内包 | 将来的にカテゴリ別 2問目で明示化したい |
| `audienceRole` | 現場 / 管理職 / 経営などの視点 | `ConciergeAnswers.audienceRole` | demo 一覧ではすでに明確 |
| `desiredReply` | 今回の返信で何を返してほしいか | `InquiryDesiredReply`, `inquiryBrief.desiredReply` | 最終送信判断に近い fact |

### D. 見積・要件整理 facts

| fact | 役割 | 現状の主な格納先 | 備考 |
|------|------|------------------|------|
| `teamSize` | 想定ユーザー規模 | `EstimateFormDraft.teamSize`, `visitorJourney.estimateSignals.teamSize` | トップの `A_SCOPE` / `B_SCOPE` から近似反映済み |
| `timeline` | いつ頃までに判断・着手したいか | `EstimateFormDraft.timeline`, `visitorJourney.estimateSignals.timeline` | 見積・問い合わせどちらでも重要 |
| `integration` | 既存ツール連携の有無 | `EstimateFormDraft.integration`, `visitorJourney.estimateSignals.integration` | 工数に直結 |
| `hostingContext` | 社内だけ / 閉域 / インターネット利用など | `EstimateFormDraft.hostingContext` | セキュリティ・工数の前提 |
| `usageSurface` | Web / LINE / 社内のみなどの利用面 | `EstimateFormDraft.usageSurface`, `visitorJourney.estimateSignals.usageSurface` | 体験導線との接続にも重要 |
| `dataSensitivity` | 個人情報や機微情報の有無 | `EstimateFormDraft.dataSensitivity` | 狭帯見積ブロックにも効く |
| `audienceScope` | 社内だけ / 外部あり | `EstimateFormDraft.audienceScope`, `visitorJourney.estimateSignals.audienceScope` | ログインや公開範囲の前提 |
| `currentWorkflow` | Excel / 紙 / メールなど今の運用 | `EstimateFormDraft.currentWorkflow` | 置き換え難度の把握 |
| `updateFrequency` | 更新頻度 | `EstimateFormDraft.updateFrequency` | 単体運用では非表示になる場合あり |
| `designExpectation` | 見た目の期待値 | `EstimateFormDraft.designExpectation` | 見積下限より上限に効きやすい |
| `loginModel` | ログイン方式のイメージ | `EstimateFormDraft.loginModel` | 条件により非表示 |
| `budgetBand` | 予算感 | `EstimateFormDraft.budgetBand` | 計算より比較・会話の補助 |
| `constraints` | 制約や決定済み条件 | `EstimateFormDraft.constraints`, `ContactForm.constraintsSummary` | 自由記述を許すが、facts 抽出候補でもある |

### E. 送信判断・本気度 facts

| fact | 役割 | 現状の主な格納先 | 備考 |
|------|------|------------------|------|
| `inquiryIntent` | 今回の相談でいちばん知りたいこと | `InquiryIntent`, `inquiryBrief.inquiryIntent` | 問い合わせ送信前の主意図 |
| `decisionTimeline` | いつまでに判断したいか | `ContactForm.decisionTimeline`, `inquiryBrief.timelineSummary` | `timeline` と近いが、送信文脈では別に持つ価値あり |
| `decisionMaker` | 誰が最終判断するか | 未実装 | 本気度を見る最終質問の有力候補 |
| `whyNow` | なぜ今進めたいか | 未実装 | 優先度・緊急度・案件化意志の判定に有効 |
| `contactReadiness` | このまま送信してよいか | `inquiryBrief.readiness` | `ready / ready_with_gaps / not_ready` |

---

## 現状で canonical に近い facts

現状コード上で、すでに「共通 facts の種」として機能しているのは次の3群。

### 1. `visitorJourneySummary`

```1:76:src/lib/journey/visitor-journey.ts
export const visitorJourneySummarySchema = z.object({
  visitorId: z.string().min(1).max(80),
  interestBias: visitorJourneyInterestBiasSchema,
  journeyDepth: visitorJourneyDepthSchema,
  latestEntryIntent: z
    .enum(["learn", "compare", "consult", "estimate"])
    .optional(),
  industryBundle: visitorJourneyIndustryBundleSchema.optional(),
  viewedDemoSlugs: z.array(z.string().min(1).max(120)).max(8).default([]),
  recentPageKinds: z.array(visitorJourneyPageKindSchema).max(6).default([]),
  lastFreeformSummary: z.string().max(280).optional(),
  estimateSignals: visitorJourneyEstimateSignalsSchema.optional(),
  journeySummary: z.string().max(600),
});
```

これは「サイト内で把握できている軽量文脈」の canonical に最も近い。

### 2. `EstimateFormDraft`

```1:20:src/lib/estimate-core/question-model.ts
export const ESTIMATE_QUESTION_LABELS = {
  industry: "業種",
  summary: "いまいちばんやりたいこと・課題",
  teamSize: "会社やチームの人数のイメージ",
  timeline: "いつ頃までに、という希望",
  integration: "今お使いのツールや、他のシステムとのつなぎ",
  hostingContext: "データやシステムの置き場所のイメージ",
  usageSurface: "主な使い方・載せる場所",
  dataSensitivity: "扱う情報に個人情報は含まれますか",
  audienceScope: "誰が使う・見るか（社内・外部）",
```

詳細見積は、実装上もっとも structured な facts を持っている。

### 3. `InquiryBrief`

```68:86:src/lib/inquiry/inquiry-brief.ts
export const inquiryBriefSchema = z.object({
  readiness: inquiryReadinessSchema,
  inquiryIntent: inquiryIntentSchema,
  inquiryIntentLabel: z.string().min(1).max(80),
  desiredReply: inquiryDesiredReplySchema,
  desiredReplyLabel: z.string().min(1).max(80),
  problemSummary: z.string().min(1).max(700),
  requestedReplySummary: z.string().min(1).max(500),
  targetSummary: z.string().min(1).max(300),
  timelineSummary: z.string().min(1).max(220),
  constraintsSummary: z.string().min(1).max(400),
```

問い合わせ直前の「初回返信しやすいか」の評価軸としては、これが canonical。

---

## これから中心に据えたい facts セット

今後、全チャットの共通言語として優先的に揃えたいのは次の 12 個。

1. `industryBundle`
2. `productCategory`
3. `productArchetype`
4. `problemSummary`
5. `targetSummary`
6. `teamSize`
7. `timeline`
8. `integration`
9. `usageSurface`
10. `audienceScope`
11. `dataSensitivity`
12. `inquiryIntent`

### 理由

- 1〜5: 何の案件かを表す中核
- 6〜11: 見積や要件定義の精度へ効く中核
- 12: 最終的にどんな返答を返すべきかを決める中核

この12個が揃えば、トップ・demo・services・詳細見積・問い合わせのどこからでも、次に何を聞くべきかを判断しやすい。

### Phase 3 時点の扱い

- `productCategory` はトップ・demo・services すべてで `emitsFacts` の対象に入れる。
- `productArchetype` はトップの `A3` / `D2`、services の一部 preset、見積 `summary` から主に `candidate` として出す。
- `desiredOutcomeLevel` はまだ `canonical-facts.ts` の canonical key には含めず、Phase 3 では「質問定義上の意味ラベル」として扱う。
- `targetSummary` は demo の役割軸や問い合わせ前整理から候補化されるが、canonical owner は引き続き `inquiryBrief` とする。

### owner の固定方針

| fact | canonical owner | Phase 1 の扱い |
|------|------------------|----------------|
| `industryBundle` | `visitorJourney` | 入口文脈の canonical |
| `productCategory` | `visitorJourney` | 入口分類の canonical |
| `productArchetype` | `estimateFormDraft` | 現状は `summary` から candidate として解釈し、後続で分離 |
| `problemSummary` | `estimateFormDraft` | 現状は `summary` と freeform から candidate/direct を切り分ける |
| `targetSummary` | `inquiryBrief` | 問い合わせ前整理で canonical 化 |
| `teamSize` | `estimateFormDraft` | structured で確定 |
| `timeline` | `estimateFormDraft` | 開発時期の canonical |
| `integration` | `estimateFormDraft` | structured で確定 |
| `usageSurface` | `estimateFormDraft` | structured で確定 |
| `audienceScope` | `estimateFormDraft` | structured で確定 |
| `dataSensitivity` | `estimateFormDraft` | structured で確定 |
| `inquiryIntent` | `inquiryBrief` | 送信判断の canonical |

### readiness の最低 facts セット

- 詳細見積 / 送信前ヒアリングの最低セット:
  - `problemSummary`
  - `teamSize`
  - `timeline`
  - `integration`
  - `usageSurface`
  - `audienceScope`
  - `dataSensitivity`
- 問い合わせ判断の最低セット:
  - `problemSummary`
  - `targetSummary`
  - `timeline`
  - `integration`
  - `usageSurface`
  - `audienceScope`
  - `dataSensitivity`
  - `inquiryIntent`

---

## 自由記述・音声入力の位置づけ

### 原則

- 自由記述は「structured ではないので困る入力」ではなく、**言語化前の事実候補**として扱う。
- 音声入力も同じく、**freeform の一種**として扱う。

### 役割

1. structured choice で拾い切れない希望を受け止める
2. 曖昧な言い方から canonical facts 候補を抽出する
3. 次の structured question を選ぶ材料にする

### 注意点

- 自由記述そのものを永続的な canonical facts にしない
- まず `freeformMemo` として保持し、必要なら AI / ルールで facts に変換する
- 抽出結果は確信度つきで扱い、低確信なら「確認質問」へ戻す

---

## 変換ルールの基本

### 1. 直接確定

- 選択式から確定できるものは、そのまま facts にする
- 例: `industryBundle`, `teamSize`, `integration`

### 2. 近似確定

- 上位カテゴリから、見積用 facts を近似反映する
- 例: トップの `A_SCOPE` から `teamSize` / `integration` を近似反映

### 3. 要確認

- 自由記述や曖昧な選択から、候補はあるが断定できない状態
- 例: `productArchetypeCandidate`, `targetSummaryCandidate`

### 4. 未収集

- まだ聞いていない / どの導線でも拾えていない

---

## 参照すべき主な実装ファイル

- `src/lib/facts/canonical-facts.ts`
- `src/lib/journey/visitor-journey.ts`
- `src/lib/chat/estimate-handoff.ts`
- `src/lib/journey/visitor-journey-estimate-prefill.ts`
- `src/lib/contact/parse-estimate-answers-to-form-draft.ts`
- `src/lib/estimate-core/question-model.ts`
- `src/lib/inquiry/inquiry-brief.ts`

---

## 次に読むドキュメント

- [`チャット質問棚卸し表.md`](./チャット質問棚卸し表.md)
- [`問い合わせポリシー.md`](./問い合わせポリシー.md)
- [`問い合わせ改善PLAN.md`](./問い合わせ改善PLAN.md)

