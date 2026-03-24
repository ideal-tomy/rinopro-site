# インタラクティブ体験プロトタイプ仕様（③4本 + ②3本）

対象URL: `/experience/[slug]`  
関連: [demo-portfolio-triage.md](demo-portfolio-triage.md)・[demo-portfolio-governance.md](demo-portfolio-governance.md)

チャット型の文章デモは従来どおり `/demo/[slug]`。本ページは **画面体験（2ペイン・疑似承認など）** を優先する。

---

## 共通

| 項目 | 内容 |
|------|------|
| 画面ステップ | 入力 → 結果（最大3ステップ相当を1画面に集約） |
| 出力 | **主成果物** + **補助（社内メモ等）** の2系統 |
| データ | DBなし・MVPは **クライアント側モック**（入力に応じたテンプレ差し替え） |
| 実AI | 必要なら `/demo/[slug]` の `ai_live` を案内 |

---

## ③ `legal-memory-secretary`（10年分の記憶を持つ秘書）

| 項目 | 内容 |
|------|------|
| 誰が | 士業・社内法務・PMO（過去案件・文書を探す側） |
| 何が減る | フォルダ横断検索・口頭確認の往復 |
| 入力3パターン | 曖昧な自然言語質問（例: 港区・賃貸・3年前）／NDA期限／委託解約条項 |
| 画面 | 左: **ヒット文書3件＋引用抜粋**、右: **要約＋次アクション** |
| 成功指標 | 30秒で「探せた感」、根拠箇所が見える、次の一手が1つ以上 |

---

## ③ `service-claim-reply-assist`（クレーム返信下書き）

| 項目 | 内容 |
|------|------|
| 誰が | CS・店舗責任者（一次返信を書く側） |
| 何が減る | 返信の言い回し迷い・エスカレ前の整え |
| 入力3パターン | 配送遅延／不良・交換／再問い合わせ |
| 画面 | 左: **お客様向け返信案（タブでトーン違い3案）**、右: **社内共有メモ**、下: **疑似承認ステップ** |
| 成功指標 | 返信がそのまま送れる粒度、社内メモが1〜3行で要約されている |

---

## ② `property-exterior-photo-memo`（外観・共用部写真）

| 項目 | 内容 |
|------|------|
| 誰が | 不動産営業・管理会社巡回 |
| 何が減る | 写真後の記録文案作成 |
| 入力 | 画像（任意）＋テキスト補足 |
| 画面 | 左: **状況タグ・所見**、右: **記録メモ＋次アクション** |
| 成功指標 | タグが3〜5個、次アクションが1つ以上具体的 |

---

## ② `receipt-photo-expense-memo`（領収書写真）

| 項目 | 内容 |
|------|------|
| 誰が | 経理補助・出張精算する社員 |
| 何が減る | 手入力の取り違え・承認差し戻し |
| 入力 | 画像＋（任意）メモ |
| 画面 | 左: **抽出フィールド（日付・金額・店名・税）**、右: **精算チェックリスト** |
| 成功指標 | チェック項目が明示、不足が1行で分かる |

---

## ② `driver-voice-incident-draft`（配送インシデント）

| 項目 | 内容 |
|------|------|
| 誰が | ドライバー・配送管理者 |
| 何が減る | 報告書の取りこぼし・荷主連絡の遅れ |
| 入力 | テキスト（音声の代用） |
| 画面 | 左: **インシデント報告ドラフト**、右: **荷主連絡メモ** |
| 成功指標 | 時系列・影響・直応が埋まっている形で見える |

---

## ③ `internal-knowledge-share-bot`（社内ナレッジ共有BOT）

| 項目 | 内容 |
|------|------|
| 誰が | 情シス・業務部門・導入検討者（社内FAQ・ガバナンスの見せ方を確認する側） |
| 何が減る | 「チャットだけ／ガイドだけ」の説明の薄さ、ポリシー説明の抽象論 |
| 入力 | ウィザードで業種→分岐をタップ。「その他」から自由入力。 |
| 画面 | **モーダル型ウィザード**（フェード・スタッガー）。回答は **Gemini** が参照ナレッジに基づきストリーミング生成。引用元ナレッジを別ブロックで静的表示。 |
| 成功指標 | 迷わず最後まで進める／ナレッジ外はエスカレ文言／引用とポリシーが見える |
| データ | [`src/lib/experience/internal-knowledge/`](../src/lib/experience/internal-knowledge/)（業種別KB）＋ API [`/api/experience/knowledge-bot`](../src/app/api/experience/knowledge-bot/route.ts) |

ツールdemo（文章）: `/demo/internal-knowledge-share-bot`（モック本文は体験URLへの導線）。

---

## ③ `restaurant-ops-dashboard-demo`（飲食店オペレーション・ダッシュボード）

| 項目 | 内容 |
|------|------|
| 誰が | 飲食店オーナー・店長・本部（多店舗・シフト・経費をまとめて見たい側） |
| 何が減る | 「ツールがバラバラ」「承認と可視化が追いづらい」説明の抽象さ |
| 入力 | 「最初から再生」「次のステップ」「サイドナビ・ホーム8カード（一部のみ操作可）」 |
| 画面 | **白基調の業務SaaS風シェル**（サイト本体デザインと差別化）。**初回・1周終了後**: 全画面イントロでタイトルを約5秒表示→**再生**ボタンへクロスフェード（`DemoIntroOverlay`）。**768px未満**は再生後 **固定モーダル** 内でテロップ／メイン／ログを **1画面ずつ** `AnimatePresence` でフェード切替（スクロール縦長化を抑制）。**768px以上**は従来のシェル内レイアウト（イントロ中は背面を低不透明度）。各シーンは **テロップ→`DURATION_SMOOTH` 相当のクロスフェードでログ・章表示→ホールド**。終了後 **約5秒でログ消去・イントロを再表示**（`LOOP_RESET_HOME_MS` 後に `introPhase=title`）。 |
| 成功指標 | 1シーンあたり約10秒前後で読み切れる／連携の流れが追える／給与・税目はデモ表示と明示されている |
| データ | [`src/lib/experience/restaurant-dashboard/`](../src/lib/experience/restaurant-dashboard/)（`scenario.ts`・`timing.ts`・モック定数のみ、API・DBなし） |

**免責**: 給与計算・確定申告区分は **イメージ表示** です。本番利用には労務・税務の専門確認が必要です。

ツールdemo（文章）: 未整備の場合は体験URLのみ（`demoSlug` は体験ホワイトリスト用に slug と同一）。

---

## 体験URL一覧（本番ではオリジンを付与）

| slug | パス |
|------|------|
| legal-memory-secretary | `/experience/legal-memory-secretary` |
| service-claim-reply-assist | `/experience/service-claim-reply-assist` |
| internal-knowledge-share-bot | `/experience/internal-knowledge-share-bot` |
| restaurant-ops-dashboard-demo | `/experience/restaurant-ops-dashboard-demo` |
| property-exterior-photo-memo | `/experience/property-exterior-photo-memo` |
| receipt-photo-expense-memo | `/experience/receipt-photo-expense-memo` |
| driver-voice-incident-draft | `/experience/driver-voice-incident-draft` |
| inquiry-intake-triage-demo | `/experience/inquiry-intake-triage-demo` |
| workflow-approval-lite-demo | `/experience/workflow-approval-lite-demo` |
| ops-report-metrics-demo | `/experience/ops-report-metrics-demo` |

---

## ③ `inquiry-intake-triage-demo`（問い合わせ受付トリアージ）

| 項目 | 内容 |
|------|------|
| 誰が | CS・窓口（一次分類と返信草案が欲しい側） |
| 何が減る | カテゴリ判断と初回返信の迷い |
| 入力 | 問い合わせ本文（サンプルワンタップ可） |
| 画面 | 分類・優先度・タグ・顧客向け草案・社内メモ（**クライアントモック**） |

## ③ `workflow-approval-lite-demo`（承認・通知フロー ライト）

| 項目 | 内容 |
|------|------|
| 誰が | バックオフィス・承認者 |
| 何が減る | 承認待ちの可視化・通知連携の説明コスト |
| 入力 | 各行の承認 / 差し戻しボタン |
| 画面 | 一覧から状態更新のみの最小UI（モック） |

## ③ `ops-report-metrics-demo`（数値メモから週次レポート草案）

| 項目 | 内容 |
|------|------|
| 誰が | 店舗・現場マネージャー |
| 何が減る | 週次まとめの手作業 |
| 入力 | 数値・メモの箇条書き |
| 画面 | KPIカード・要約・次アクション案（**クライアントモック**） |
