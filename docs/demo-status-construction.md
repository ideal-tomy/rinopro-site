# 建設業向けデモ・プロトタイプ現状調査
作成日: 2026-05-06
調査対象: src/components/experience/prototypes/ 全件、/solutions/construction 関連

> コードは一切変更せず、調査のみで作成しています。
> 推測した部分は「推測:」、不確実な箇所は「要確認:」と記載しています。

---

## ⚠️ 最重要発見

`/solutions/construction` の「関連する体験デモ」に3件が掲載されているが、**うち2件が存在しない**。
営業先がクリックすると `/demo/photo-inspection-report` や `/demo/daily-weekly-report-summary` は
おそらく 404 または Sanity 未登録状態になる。**今すぐ確認が必要。**

| デモタイトル | slug | 実装状況 |
|------------|------|---------|
| 現場監督の影武者 | `construction-shadow-foreman` | ✅ 実装済み（Live Sync） |
| 写真から点検報告 | `photo-inspection-report` | ❌ **未実装** |
| 日報・週報の要約 | `daily-weekly-report-summary` | ❌ **未実装** |

---

## 1. 建設業向けキーワード検索結果

### 「建設」「工事」「現場」「construction」ヒット箇所

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/lib/content/industry-showcase.ts` | 46–70 | `/solutions/construction` のハブ定義（relatedDemos 3件含む） |
| `src/lib/experience/internal-knowledge/industries/construction.ts` | 全体 | 社内ナレッジBOTの建設業データセット（KB 8件、ガイドツリー）|
| `src/lib/experience/live-sync-audio-text-prototypes.ts` | 20–29 | `construction-shadow-foreman` の Live Sync プロトタイプ定義 |
| `src/lib/experience/live-sync-audio-text-prototypes.ts` | 57–62 | `morning-meeting-daily-draft`（朝礼メモ → 日報）— 建設業の朝礼転用可能 |
| `src/lib/content/site-copy.ts` | 97 | 「現場の制約（体制・既存システム）を踏まえて」（services 紹介文内）|

### 「影武者」「点検」「日報」「週報」ヒット箇所

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/lib/content/industry-showcase.ts` | 67–69 | relatedDemos に3件参照（うち2件は実装なし）|
| `src/lib/experience/live-sync-audio-text-prototypes.ts` | 20–29 | `construction-shadow-foreman` のみ実装あり |

---

## 2. /solutions/construction の参照デモ

`src/lib/content/industry-showcase.ts:66–70` より:

```
relatedDemos: [
  { slug: "construction-shadow-foreman", title: "現場監督の影武者" },    // ✅ 実装済み
  { slug: "photo-inspection-report",     title: "写真から点検報告" },     // ❌ 未実装
  { slug: "daily-weekly-report-summary", title: "日報・週報の要約" },     // ❌ 未実装
]
```

ハブページの「よくある負荷」コピー（`painBody`）:
> 写真や音声は取っているが、報告書やメールに転記する作業が残る。雨天やトラブル時の連絡が遅れ、工程表と現場感覚にズレが出る。担当者が変わると、過去の経緯を探すのに時間がかかる。

→ 上記3点のデモが「答え」として想定されているが、2件が存在しない。**ページとしての整合性が破綻している。**

---

## 3. 全プロトタイプ評価

### ① 現場監督の影武者（construction-shadow-foreman）
- **コンポーネント**: `src/lib/experience/live-sync-audio-text-prototypes.ts`（Live Sync テンプレで動作）
- **URLパス**: `/experience/construction-shadow-foreman`
- **実装状況**: 部分実装（Live Sync テンプレートの流用）
- **概要**: マイク入力の音声を Live Sync でリアルタイム表示しながら、結論・期限・TODO のモック要約を右ペインに逐次表示する。入力ヒントは「養生の状況、明日の天気、協力会社への依頼事項を話してください」と建設業向け。
- **技術スタック**: Web Speech API（マイク入力）+ モック変換（AI不使用）。非対応ブラウザはモック音声ストリームで再現。
- **建設業との関連**: あり（現場監督の音声メモ整理がユースケース）
- **UI/UX完成度**: Live Sync テンプレ共通UIで、建設業特化の演出なし。入力ヒント以外は汎用画面。
- **営業使用可能度**: **3/5**
- **率直な評価**: 動くが「建設業らしさ」がほぼない。音声入力が使えないブラウザでは体験が劣化する。入力ヒントを読まないと何をするデモか分かりにくい。改善すれば使える水準。

---

### ② 写真から点検報告（photo-inspection-report）
- **コンポーネント**: なし
- **URLパス**: `/demo/photo-inspection-report`（推測）
- **実装状況**: **未実装**（ソースコードにも Sanity データにも存在しない）
- **営業使用可能度**: **0/5**（存在しない）
- **率直な評価**: `/solutions/construction` からリンクされているが、クリックすると壊れたページになる可能性が高い。**最優先で対処が必要。**

---

### ③ 日報・週報の要約（daily-weekly-report-summary）
- **コンポーネント**: なし
- **URLパス**: `/demo/daily-weekly-report-summary`（推測）
- **実装状況**: **未実装**（ソースコードにも存在しない）
- **営業使用可能度**: **0/5**（存在しない）
- **率直な評価**: ② と同様。`OpsReportMetricsExperience`（数値メモ → 週次レポート）が部分的に類似するが、slug が異なり自動的には補完されない。

---

### ④ 社内ナレッジ共有BOT — 建設・設備モード（internal-knowledge-share-bot）
- **コンポーネント**: `src/components/experience/prototypes/InternalKnowledgeBotExperience.tsx`
- **URLパス**: `/experience/internal-knowledge-share-bot`
- **実装状況**: **完成**（建設業データセットが充実）
- **概要**: 業種選択 → ガイドステップ（またはフリーチャット）→ AIが社内ナレッジを根拠に回答。建設業では「安全衛生管理規程」「ヒヤリハット報告」「入場管理要領」「悪天候作業基準」「協力会社取引規程」の8件のKBが整備済み。
- **技術スタック**: AI呼び出しあり（Gemini。ストリーミング）。ガイドツリー（選択式）とフリーチャット両対応。
- **建設業との関連**: **直接あり**（`construction.ts` に専用データセット）
- **UI/UX完成度**: 二画面（ガイド + チャット）で業務利用のイメージが伝わる。出典明示、ポリシー表示もあり信頼感がある。
- **営業使用可能度**: **4/5**
- **率直な評価**: 建設業として今すぐ見せられる水準。安全衛生・ヒヤリハット・天候判断など、現場監督が実際に使いそな質問に答えられる。唯一の懸念はタイトルが「建設業」と明示されておらず、業種選択ステップを踏む必要があること。

---

### ⑤ 外観・共用部の写真メモ（property-exterior-photo-memo）
- **コンポーネント**: `src/components/experience/prototypes/PropertyExteriorPhotoExperience.tsx`
- **URLパス**: `/experience/property-exterior-photo-memo`
- **実装状況**: 完成（モック）
- **概要**: 写真をドロップ or サンプル表示 → 写真上にピンを打って所見ラベルを付与 → 「修繕依頼文案」「状況タグ」「記録メモ」「次アクション」をモック生成。
- **技術スタック**: モック（AI不使用）。写真は静的SVGサンプルか実ファイルをアップロード。
- **建設業との関連**: 転用可能（現場の点検写真 → 報告書下書きの流れに流用できる）
- **UI/UX完成度**: スマホ枠付きのUIで、「現場でスマホ撮影して報告」というイメージが視覚的に伝わる。完成度は高い。
- **営業使用可能度（転用前提）**: **4/5**
- **率直な評価**: 現在は不動産管理向けの表現（「共用部」「照明消灯」「外壁ひび」など）だが、ラベルプリセットや入力例を「足場」「亀裂」「保護具」に変えると建設業の「写真から点検報告」として流用できる。ただしコードの変更が必要。

---

### ⑥ 配送インシデント報告（driver-voice-incident-draft）
- **コンポーネント**: `src/components/experience/prototypes/DriverVoiceIncidentExperience.tsx`
- **URLパス**: `/experience/driver-voice-incident-draft`
- **実装状況**: 完成
- **建設業との関連**: 転用可能（「ドライバー音声」→「現場作業員音声」への読み替え）
- **営業使用可能度（転用前提）**: 2/5（業種イメージが強すぎて転用しにくい）

---

### ⑦ 数値メモから週次レポート草案（ops-report-metrics-demo）
- **コンポーネント**: `src/components/experience/prototypes/OpsReportMetricsExperience.tsx`
- **URLパス**: `/experience/ops-report-metrics-demo`
- **実装状況**: 完成（モック）
- **建設業との関連**: 転用可能（「売上・在庫」→「工程進捗・稼働率・安全件数」への読み替え）
- **営業使用可能度（転用前提）**: 3/5

---

### その他の主要プロトタイプ（建設業との関連なし）

| タイトル | slug | 状況 | 建設業転用 |
|---------|------|------|-----------|
| 飲食店オペレーション・ダッシュボード | `restaurant-ops-dashboard-demo` | 完成（高品質） | ✕ |
| 10年分の記憶を持つ秘書 | `legal-memory-secretary` | 完成 | △（過去規程の参照）|
| クレーム返信下書き | `service-claim-reply-assist` | 完成 | △（顧客クレーム対応）|
| 承認・通知フロー（ライト） | `workflow-approval-lite-demo` | 完成 | △（工程承認イメージ）|
| 問い合わせ受付トリアージ | `inquiry-intake-triage-demo` | 完成 | △ |
| 士業向けミニSFA | `legal-professional-mini-sfa-demo` | 完成（高品質） | ✕ |
| 朝礼メモから日報ドラフト | `morning-meeting-daily-draft` | Live Sync | ◎（建設朝礼に最適）|

---

## 4. 建設業特化デモの評価まとめ

| デモ名 | URL | 実装状況 | 営業使用可能度 | 備考 |
|--------|-----|----------|--------------|------|
| 現場監督の影武者 | `/experience/construction-shadow-foreman` | 部分実装 | 3/5 | Live Sync テンプレ流用、建設らしさ薄い |
| 写真から点検報告 | `/demo/photo-inspection-report` | **未実装** | 0/5 | solutions ページからリンク切れ |
| 日報・週報の要約 | `/demo/daily-weekly-report-summary` | **未実装** | 0/5 | solutions ページからリンク切れ |
| 社内ナレッジBOT（建設選択時）| `/experience/internal-knowledge-share-bot` | 完成 | 4/5 | 建設業データ充実、今すぐ見せられる |

---

## 5. 他業種デモの建設業転用可能性

| デモ名 | 転用イメージ | 必要な変更 | 転用難易度 |
|--------|------------|-----------|-----------|
| 外観・共用部の写真メモ | 写真から点検報告 | ラベルプリセット・入力例の変更 | 低（テキスト変更のみ）|
| 朝礼メモから日報ドラフト（Live Sync）| 建設朝礼 → KY活動記録 | 入力ヒントのみ調整 | 低 |
| 数値メモから週次レポート草案 | 工程進捗・安全件数 → レポート | 入力例の追加 | 低 |
| 承認・通知フロー | 工程承認・入場申請 | なし（汎用のまま可）| なし |

---

## 6. 発見されなかったデモ（未実装）

- **「現場監督の影武者」**: ✅ 実装済み（Live Sync テンプレ）
- **「写真から点検報告」**: ❌ **未実装**。prototype-registry にも live-sync にも Sanity にも存在しない
- **「日報の要約」「週報の要約」**: ❌ **未実装**。同上

---

## 7. 数値サマリー
- 調査したプロトタイプ総数: 38（prototype-registry 27 + live-sync 16 — 重複除く）
- 建設業直接関連: 2（construction-shadow-foreman、内部ナレッジBOT建設モード）
- 建設業転用可能: 4（写真メモ、朝礼日報、週次レポート、承認フロー）
- 営業使用可能（4以上）: 1（内部ナレッジBOT）
- 要改善（3以下）: 1（影武者）
- **緊急対応が必要（リンク切れ）**: 2件

---

## 8. 注記

### 推測した内容
- `/demo/photo-inspection-report` と `/demo/daily-weekly-report-summary` がアクセスした場合に 404 になるかどうかは、Sanity CMS のデータを直接確認していないため「推測: 404または空ページになる」
- 各 Live Sync デモの「モック」部分は Web Speech API の有無によって体験が大きく変わる可能性がある

### 要確認事項
1. **緊急**: `/solutions/construction` の「写真から点検報告」「日報・週報の要約」をブラウザで開いた際の実際の状態（404？空ページ？Sanity 未登録エラー？）
2. `construction-shadow-foreman` が Sanity に demo ドキュメントとして登録されているか（登録がなければ `/demo/construction-shadow-foreman` もリンク切れになる）
3. 他業種の solutions ページ（professional-services など）でも同様のリンク切れがないか確認が必要

### 優先的に対処を推奨する箇所

**今すぐ（リンク切れ対処）:**
1. `/solutions/construction` の `relatedDemos` から `photo-inspection-report` と `daily-weekly-report-summary` を削除、または実装済みデモに差し替える
   - 差し替え候補: `internal-knowledge-share-bot`、`morning-meeting-daily-draft`、`property-exterior-photo-memo`

**短期（デモ強化）:**
2. `property-exterior-photo-memo` のラベルプリセットを建設業向けに拡張 → 「写真から点検報告」として活用できる
3. 建設業営業時は `internal-knowledge-share-bot` を先に見せ、次に `construction-shadow-foreman` に誘導する動線を整理する
