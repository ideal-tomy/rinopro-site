# 作成済みデモ/モック一覧

最終更新: 2026-03-26  
参照元: [`scripts/seed-ai-demos.ts`](../scripts/seed-ai-demos.ts) の `existingDemos` ＋ [`scripts/demo-batches/`](../scripts/demo-batches/) の `nextMockDemos` 結合（計102本）

**ポートフォリオ運用**: [demo-portfolio-governance.md](demo-portfolio-governance.md) ／ **トリアージ（主ラベル・保留）**: [demo-portfolio-triage.md](demo-portfolio-triage.md)（100行は `npx tsx scripts/generate-demo-portfolio-triage-md.ts` でインベントリから再生成可）

**Live Sync（`audio_text`）**: `driver-voice-incident-draft` を除く各 slug は `/experience/{slug}` で Live Sync UI（モードは [live-sync-audio-text-matrix.md](live-sync-audio-text-matrix.md)）。`/demo/{slug}` は `immersiveOnDemoDetail` で体験 UI を先頭表示。

## 1) 現在の作成済み一覧

| No | タイトル | slug | runMode | industry（スキーマ） | inputType | 成果物ペア（要約） | 主な functionTags |
|---:|---|---|---|---|---|---|---|
| 1 | 現場監督の影武者 | `construction-shadow-foreman` | mock_preview | construction | audio_text | 点検報告書 / 協力会社指示メール | 音声入力, 報告書生成 |
| 2 | 10年分の記憶を持つ秘書 | `legal-memory-secretary` | mock_preview | legal | text_only | 検索要約 / 次アクション | 検索, 要約 |
| 3 | クレームをファンに変える返信下書き | `service-claim-reply-assist` | ai_live | manufacturing | text_only | 返信文 / 社内共有メモ | 問い合わせ対応, 返信生成 |
| 4 | 議事録を3秒で | `meeting-minutes-auto` | mock_preview | legal | audio_text | 議事録 / 社内共有メモ | 音声入力, 議事録生成 |
| 5 | 受注書を即作成 | `order-form-generator` | mock_preview | manufacturing | text_only | 受注書 / 社内メモ | 帳票生成, 受注管理 |
| 6 | プレゼン資料の骨子作成 | `presentation-outline` | mock_preview | legal | text_only | プレゼン骨子 / 補足メモ | 資料作成, 要約 |
| 7 | 契約書レビューサマリ | `contract-review-summary` | mock_preview | legal | text_only | レビューサマリ / 確認推奨事項 | 契約レビュー, 要約 |
| 8 | 見積書ドラフト | `quote-draft-generator` | mock_preview | manufacturing | text_only | 見積ドラフト / 社内メモ | 見積作成, 帳票生成 |
| 9 | 日報・週報の要約 | `daily-weekly-report-summary` | mock_preview | construction | text_only | 週報サマリ / 上司向け共有メモ | 報告書生成, 要約 |
| 10 | 写真から点検報告 | `photo-inspection-report` | mock_preview | construction | image_text | 点検報告書 / 次アクション | 画像入力, 報告書生成 |
| 11 | ヒヤリハット是正プラン生成 | `near-miss-correction-plan` | mock_preview | construction | text_only | 是正指示書 / 朝礼共有文 | 安全管理, 報告書生成 |
| 12 | 雨天時の工程リスケ案 | `rain-schedule-reschedule` | mock_preview | construction | text_only | 工程変更案 / 関係者連絡文 | 工程調整, 連絡文生成 |
| 13 | 現場コスト異常検知メモ | `site-cost-anomaly-memo` | mock_preview | construction | text_only | 異常要因サマリ / 対応タスク表 | 原価管理, 要約 |
| 14 | 協力会社評価コメント下書き | `subcontractor-eval-draft` | mock_preview | construction | text_only | 評価シート文案 / 改善依頼文 | 協力会社管理, 評価 |
| 15 | 申請・更新期限アラート整理 | `deadline-alert-organizer` | mock_preview | legal | text_only | 期限一覧 / リマインド文面 | 期限管理, 要約 |
| 16 | 契約修正提案ドラフト | `contract-amendment-draft` | mock_preview | legal | text_only | 修正条項案 / 相手方送付文 | 契約交渉, 文書生成 |
| 17 | 初回相談ヒアリング設計 | `first-consult-hearing-design` | mock_preview | legal | text_only | 質問リスト / 面談メモ雛形 | 面談準備, ヒアリング |
| 18 | 月次請求チェック補助 | `monthly-billing-check` | mock_preview | legal | text_only | 請求差分一覧 / 修正依頼文 | 請求管理, 要約 |
| 19 | 不良報告の原因仮説整理 | `defect-cause-hypothesis` | mock_preview | manufacturing | text_only | 原因仮説表 / 再発防止案 | 品質管理, 要約 |
| 20 | 設備点検チェック項目生成 | `equipment-inspection-checklist` | mock_preview | manufacturing | text_only | 点検チェックリスト / 作業指示 | 保全, チェックリスト |
| 21 | 在庫偏り是正提案 | `inventory-balance-proposal` | mock_preview | manufacturing | text_only | 在庫調整案 / 発注修正案 | 在庫管理, 要約 |
| 22 | シフト引継ぎサマリ生成 | `shift-handover-summary` | mock_preview | manufacturing | text_only | 引継ぎ要約 / 優先対応一覧 | 引継ぎ, 要約 |
| 23 | レビューから改善案抽出 | `review-improvement-extract` | mock_preview | manufacturing | text_only | 改善優先度表 / 商品説明修正文 | 商品企画, 要約 |
| 24 | キャンペーン訴求文AB案 | `campaign-copy-ab` | mock_preview | manufacturing | text_only | LP訴求文2案 / 店頭POP文案 | 販促, 文書生成 |
| 25 | 返品理由の分類と対策 | `return-reason-classification` | mock_preview | manufacturing | text_only | 理由分類表 / FAQ改善案 | CS効率化, 要約 |
| 26 | 物件内見メモ自動整理 | `property-viewing-memo` | mock_preview | legal | audio_text | 内見サマリ / 次アクション | 音声入力, 案件整理 |
| 27 | 内見後フォローメール下書き | `post-viewing-followup-mail` | mock_preview | legal | text_only | 顧客向け文面 / 社内共有メモ | 追客, 文書生成 |
| 28 | 申し送り要点圧縮 | `handover-points-compress` | mock_preview | legal | text_only | 申し送り文 / 注意観察ポイント | 記録業務, 要約 |
| 29 | 遅延連絡テンプレ自動化 | `delay-notice-template` | mock_preview | manufacturing | text_only | 顧客連絡文 / 社内配車メモ | 配送管理, 文書生成 |
| 30 | 面接評価コメント整理 | `interview-eval-comment` | mock_preview | legal | text_only | 評価サマリ / 次回面接質問案 | 採用, 要約 |
| 31 | 朝礼メモから日報ドラフト | `morning-meeting-daily-draft` | mock_preview | construction | audio_text | 日報ドラフト / 現場共有メモ | 音声入力, 報告書生成 |
| 32 | 店頭接客ボイスメモの共有整理 | `retail-floor-voice-handoff` | mock_preview | manufacturing | audio_text | 接客サマリ / 本部・翌番共有メモ | 音声入力, 引継ぎ |
| 33 | ドライバー音声から配送インシデント草案 | `driver-voice-incident-draft` | mock_preview | manufacturing | audio_text | インシデント報告草案 / 荷主連絡メモ | 音声入力, 報告書生成 |
| 34 | 外観・共用部写真から物件状況メモ | `property-exterior-photo-memo` | mock_preview | legal | image_text | 状況記録メモ / 次アクション | 画像入力, 案件整理 |
| 35 | 納品写真から配送完了レポート | `delivery-photo-completion-report` | mock_preview | manufacturing | image_text | 配送完了レポート / 異常時用メモ | 画像入力, 報告書生成 |
| 36 | 一般問い合わせの返信骨子（注意書き付き） | `clinic-general-inquiry-skeleton` | mock_preview | legal | text_only | 返信骨子 / 院内共有メモ | 問い合わせ対応, 返信生成 |
| 37 | 窓口・電話問い合わせの回答骨子 | `civic-counter-reply-outline` | mock_preview | legal | text_only | 回答骨子 / 法令・要確認メモ | 問い合わせ対応, 要約 |
| 38 | 仕様確認メールの返信草案 | `b2b-spec-clarification-reply` | mock_preview | manufacturing | text_only | 顧客向け返信草案 / 社内確認チェックリスト | 問い合わせ対応, 文書生成 |
| 39 | 作業手順の該当箇所要約 | `ops-manual-spot-summary` | mock_preview | manufacturing | text_only | 手順サマリ / 安全・品質チェックポイント | 要約, マニュアル |
| 40 | 類似チケット要約と返信たたき台 | `helpdesk-similar-ticket-summary` | mock_preview | legal | text_only | 類似事例サマリ / 返信たたき台・エスカレ条件 | 要約, 問い合わせ対応 |
| 41 | 棚卸・陳列写真から差異メモ | `stocktake-photo-variance-memo` | mock_preview | manufacturing | image_text | 棚卸・差異メモ / 本部・物流共有文 | 画像入力, 在庫管理 |
| 42 | 損害写真から事故報告のたたき台 | `damage-photo-incident-draft` | mock_preview | legal | image_text | 事故・損害報告たたき台 / 保険・関係者連絡メモ | 画像入力, 報告書生成 |
| 43 | 現地調査ボイスから調査メモ | `site-survey-voice-memo` | mock_preview | construction | audio_text | 現地調査メモ / 見積・設計引き継ぎ | 音声入力, 報告書生成 |
| 44 | 面談ボイスから記録サマリ | `parent-meeting-voice-summary` | mock_preview | legal | audio_text | 面談記録サマリ / 校内共有・次アクション | 音声入力, 議事録生成 |
| 45 | 研修アンケートから改善サマリ | `training-survey-improvement-summary` | mock_preview | manufacturing | text_only | 改善サマリ / 次回開催アクション | 要約, 教育 |
| 46 | 書類選考メモから評価コメント整理 | `resume-screening-eval-notes` | mock_preview | legal | text_only | 書類選考コメント / 面接依頼・見送りメモ | 採用, 要約 |
| 47 | 店舗巡回所見から改善指示と本部報告 | `store-audit-action-hq-report` | mock_preview | manufacturing | text_only | 店舗向け改善指示 / 本部報告サマリ | 報告書生成, 要約 |
| 48 | 解約検討の問い合わせに返信草案 | `saas-churn-intent-reply-draft` | mock_preview | manufacturing | text_only | 顧客向け返信草案 / CS・営業共有メモ | 問い合わせ対応, 返信生成 |
| 49 | 宿泊レビューへの返信草案 | `hospitality-review-reply-draft` | mock_preview | manufacturing | text_only | 公開返信草案 / 館内改善メモ | 返信生成, 要約 |
| 50 | 障害対応の顧客向けお知らせ草案 | `outage-customer-notice-draft` | mock_preview | manufacturing | text_only | 顧客向けお知らせ草案 / 社内インシデントメモ | 文書生成, 要約 |
| 51 | 留守電メモから折り返し返信草案 | `voicemail-followup-reply-draft` | mock_preview | manufacturing | audio_text | 折り返し用メモ / 顧客向け返信草案 | 音声入力, 返信生成 |
| 52 | 介護シフト申し送りボイス要約 | `care-shift-voice-handover` | mock_preview | legal | audio_text | 申し送りサマリ / 夜勤・翌朝への注意 | 音声入力, 記録業務 |
| 53 | 表示ラベル写真から確認メモ | `product-label-photo-check-memo` | mock_preview | manufacturing | image_text | 表示確認メモ / 社内・取引先共有文 | 画像入力, 品質管理 |
| 54 | 提案依頼書から要件抜き出し | `rfp-requirements-extract` | mock_preview | manufacturing | text_only | 要件一覧 / ギャップ・確認質問リスト | 要約, 資料作成 |
| 55 | 競合メモから比較サマリ | `competitive-notes-battlecard` | mock_preview | manufacturing | text_only | 比較サマリ / トークポイント・注意喚起 | 要約, 資料作成 |
| 56 | 条件メモから内定通知の文面骨子 | `job-offer-draft-from-terms` | mock_preview | legal | text_only | 内定通知の文面骨子 / 法務・人事確認メモ | 採用, 文書生成 |
| 57 | メールスレッドから決定事項とTODO | `email-thread-decisions-todos` | mock_preview | legal | text_only | 決定事項 / TODO・未決一覧 | 要約, 議事録生成 |
| 58 | 取引先審査メモから与信所見のたたき台 | `vendor-credit-review-memo` | mock_preview | manufacturing | text_only | 与信所見たたき台 / 追加確認・条件案 | 要約, 帳票生成 |
| 59 | ウェビナー案内メールの草案 | `webinar-invite-email-draft` | mock_preview | manufacturing | text_only | 招待メール草案 / リマインド・フォロー文 | 販促, 文書生成 |
| 60 | 案件ブリーフからDD論点リスト | `legal-dd-topics-from-brief` | mock_preview | legal | text_only | DD論点リスト / 資料依頼文の骨子 | 契約レビュー, 要約 |
| 61 | 定例レビューのボイスからサマリ | `cs-qbr-voice-summary` | mock_preview | manufacturing | audio_text | 定例サマリ / 社内アクション | 音声入力, 要約 |
| 62 | 打ち合わせボイスから見積前提メモ | `event-brief-voice-to-quote-memo` | mock_preview | legal | audio_text | 要件メモ（見積用） / 見積提出時の確認事項 | 音声入力, 見積作成 |
| 63 | 圃場写真から生育観察メモ | `field-crop-photo-observation` | mock_preview | manufacturing | image_text | 生育観察メモ / 次の作業提案 | 画像入力, 報告書生成 |
| 64 | ホワイトボード写真からアクション整理 | `whiteboard-photo-action-extract` | mock_preview | legal | image_text | 論点・決定の整理 / アクション一覧（案） | 画像入力, 議事録生成 |
| 65 | SLA未達の顧客向け説明文草案 | `sla-miss-customer-explanation-draft` | mock_preview | manufacturing | text_only | 顧客向け説明文草案 / 社内報告メモ | 返信生成, 要約 |
| 66 | 雑メモから会議アジェンダ整形 | `bullet-mess-to-meeting-agenda` | mock_preview | legal | text_only | アジェンダ（整形版） / 事前共有・準備依頼 | 資料作成, 要約 |
| 67 | 入社手続きチェックリスト生成 | `onboarding-checklist-from-role` | mock_preview | legal | text_only | チェックリスト / 担当割り当てメモ | 採用, チェックリスト |
| 68 | 内部通報の受付メモ整理 | `internal-report-intake-memo` | mock_preview | legal | text_only | 受付メモ（整理稿） / 次ステップ案 | 要約, 記録業務 |
| 69 | セキュリティ疑いの初動トリアージメモ | `security-suspicion-triage-memo` | mock_preview | manufacturing | text_only | トリアージメモ / 即時アクション案 | 要約, 報告書生成 |
| 70 | 原文メモから翻訳依頼ブリーフ | `translation-brief-from-notes` | mock_preview | legal | text_only | 翻訳依頼ブリーフ / ベンダーへの確認事項 | 文書生成, 要約 |
| 71 | 要件メモからユーザーストーリー草案 | `user-story-draft-from-bullets` | mock_preview | manufacturing | text_only | ユーザーストーリー案 / 受け入れ条件・未決メモ | 資料作成, 要約 |
| 72 | 変更メモからリリースノート草案 | `release-note-draft-from-ship-list` | mock_preview | manufacturing | text_only | リリースノート（ユーザー向け） / 社内メモ | 文書生成, 要約 |
| 73 | 事業メモから融資面談用の説明骨子 | `loan-interview-business-outline` | mock_preview | legal | text_only | 事業計画・資金計画のたたき台（体験UI）／面談用骨子・想定質問 | 資料作成, 要約 |
| 74 | 予約状況から仕込みリスト草案 | `restaurant-prep-list-from-bookings` | mock_preview | manufacturing | text_only | 仕込みリスト草案 / 当日注意メモ | チェックリスト, 要約 |
| 75 | 問い合わせスレッドからヘルプ記事草案 | `help-article-draft-from-ticket` | mock_preview | manufacturing | text_only | ヘルプ記事草案 / 公開前チェックメモ | 要約, 文書生成 |
| 76 | モニタリングメモからフィードバック文 | `call-monitor-feedback-coaching` | mock_preview | manufacturing | audio_text | オペレーター向けフィードバック / 品質管理共有メモ | 音声入力, 要約 |
| 77 | 受付シフトの申し送りボイス要約 | `clinic-reception-voice-handover` | mock_preview | legal | audio_text | 申し送りサマリ（受付・事務） / 翌朝の確認事項 | 音声入力, 引継ぎ |
| 78 | 領収書写真から経費入力メモ | `receipt-photo-expense-memo` | mock_preview | legal | image_text | 経費入力メモ / 承認・添付チェック | 画像入力, 帳票生成 |
| 79 | 売場作り込み写真から完了報告 | `vm-display-photo-completion-report` | mock_preview | manufacturing | image_text | 作り込み完了報告 / 本部フィードバック依頼メモ | 画像入力, 報告書生成 |
| 80 | 監査所見から是正要求の骨子 | `supplier-audit-corrective-draft` | mock_preview | manufacturing | text_only | 是正要求書の骨子 / 社内メモ（購買・品質） | 報告書生成, 品質管理 |
| 81 | プライバシー通知の改定骨子 | `privacy-notice-update-draft` | mock_preview | legal | text_only | プライバシー通知改定骨子 / 社内・法務確認メモ | 契約レビュー, 文書生成 |
| 82 | 退去時の原状回復説明の骨子 | `lease-moveout-explanation-draft` | mock_preview | legal | text_only | 入居者向け説明骨子 / 社内・オーナー共有メモ | 文書生成, 要約 |
| 83 | 学会参加メモから報告書骨子 | `conference-trip-report-outline` | mock_preview | legal | text_only | 参加報告骨子 / 経理・申請メモ | 報告書生成, 要約 |
| 84 | 補助金申請の論点チェックリスト | `subsidy-application-topic-checklist` | mock_preview | legal | text_only | 論点チェックリスト / ギャップ・リスクメモ | チェックリスト, 要約 |
| 85 | ペット預かり引き渡しボイスメモ | `pet-hotel-handover-voice-memo` | mock_preview | manufacturing | audio_text | お迎え時サマリ / 次回利用向けメモ | 音声入力, 記録業務 |
| 86 | 展示解説のナレーション原稿たたき台 | `gallery-exhibit-voice-script-draft` | mock_preview | legal | audio_text | ナレーション原稿たたき台 / キャプション・注意書きメモ | 音声入力, 資料作成 |
| 87 | 現場写真から5S指摘メモ | `gemba-5s-photo-findings-memo` | mock_preview | manufacturing | image_text | 5S観点の指摘メモ / 改善依頼文（班長向け） | 画像入力, 報告書生成 |
| 88 | 駐車トラブル写真から連絡メモ | `parking-violation-photo-contact-memo` | mock_preview | legal | image_text | 状況記録メモ / 管理会社・オーナー向け連絡骨子 | 画像入力, 文書生成 |
| 89 | 退職ヒアリングからナレッジQ&A草案 | `exit-knowledge-qa-draft` | mock_preview | legal | text_only | ナレッジQ&A草案 / 公開範囲・機密メモ | 要約, 文書生成 |
| 90 | アクセシビリティ監査メモから優先リスト | `a11y-audit-priority-backlog` | mock_preview | manufacturing | text_only | 対応優先リスト / リリース・工数メモ | 要約, チェックリスト |
| 91 | 鮮度管理のボイスから廃棄ログ草案 | `grocery-freshness-voice-waste-log` | mock_preview | manufacturing | audio_text | 廃棄・ロス記録草案 / 本部・発注共有メモ | 音声入力, 報告書生成 |
| 92 | OSSライセンス表記のREADME断片 | `oss-attribution-readme-snippet` | mock_preview | manufacturing | text_only | NOTICE断片草案 / 法務・開発確認メモ | 文書生成, 契約レビュー |
| 93 | 仮設・バリケード写真から安全巡回メモ | `construction-barrier-photo-safety-round` | mock_preview | construction | image_text | 安全巡回メモ / 是正依頼骨子 | 画像入力, 安全管理 |
| 94 | 経営会議メモからサマリと宿題 | `exec-meeting-notes-to-summary` | mock_preview | legal | text_only | 会議サマリ / 宿題・フォロー一覧 | 議事録生成, 要約 |
| 95 | 寄付感謝レターの草案 | `nonprofit-donor-thanks-letter-draft` | mock_preview | legal | text_only | 感謝レター草案 / 事務・税務メモ | 文書生成, 返信生成 |
| 96 | クラファン支援者向け進捗レター草案 | `crowdfunding-milestone-update-draft` | mock_preview | manufacturing | text_only | 支援者向け更新文草案 / プラットフォーム・社内メモ | 文書生成, 返信生成 |
| 97 | 発明メモから先行調査の計画書骨子 | `patent-search-plan-from-memo` | mock_preview | legal | text_only | 先行調査計画骨子 / 発明者インタビュー論点 | 要約, 資料作成 |
| 98 | 施策リストからESG開示の数値骨子 | `esg-kpi-draft-from-initiatives` | mock_preview | manufacturing | text_only | 開示用KPI骨子 / データギャップ・収集メモ | 要約, 報告書生成 |
| 99 | 搬入立ち合いボイスからタイムライン | `venue-loadin-voice-timeline` | mock_preview | legal | audio_text | タイムライン草案 / リスク・連絡メモ | 音声入力, 議事録生成 |
| 100 | 医療機器卸の訪問記録草案 | `medical-device-visit-report-draft` | mock_preview | manufacturing | text_only | 訪問記録草案 / コンプライアンスメモ | 報告書生成, 要約 |
| 101 | 社内ナレッジ共有BOT（業種別・二画面体験） | `internal-knowledge-share-bot` | mock_preview | manufacturing | text_only | 体験導線説明 / 補助メモ（本編は `/experience`） | 問い合わせ対応, 要約 |
| 102 | Live Sync：音声入力のリアルタイム翻訳 | `live-sync-voice-translation` | mock_preview | manufacturing | audio_text | ライブ翻訳モック / 体験補足（本編は `/experience`） | 音声入力, 要約 |

**カウント**: 102本（`ai_live` 1 ／ `mock_preview` 101）

**書類たたき台シェル**（`/experience/{slug}`・`immersiveOnDemoDetail`）: `loan-interview-business-outline` に加え、`bullet-mess-to-meeting-agenda`・`exec-meeting-notes-to-summary`・`presentation-outline`・`rfp-requirements-extract`・`order-form-generator`・`quote-draft-generator`・`webinar-invite-email-draft`・`nonprofit-donor-thanks-letter-draft`・`contract-amendment-draft`・`release-note-draft-from-ship-list`・`job-offer-draft-from-terms`・`privacy-notice-update-draft`・`subsidy-application-topic-checklist`・`onboarding-checklist-from-role`（実装は [`document-shell-presets.ts`](../src/lib/experience/document-shell-presets.ts) を参照）。

## 2) 他業種にも連携可能なデモ（横展開候補）

以下は業務構造が業種横断しやすく、テンプレ差し替えで展開しやすい候補。

| タイトル | 横展開しやすい理由 | 展開候補業種 |
|---|---|---|
| クレームをファンに変える返信下書き | 問い合わせ/クレーム対応は全業種に存在 | 小売、EC、飲食、SaaS、不動産、医療 |
| 議事録を3秒で | 会議記録は共通業務 | 製造、建設、士業、医療、教育、自治体 |
| プレゼン資料の骨子作成 | 提案資料作成は営業/企画で共通 | 士業、製造、SaaS、人材、広告 |
| 見積書ドラフト | 見積作成業務はB2B全般で共通 | 建設、IT受託、保守、商社、設備 |
| 日報・週報の要約 | 日次/週次報告は現場業務全般で共通 | 物流、保守、医療、介護、警備 |
| 写真から点検報告 | 写真起点の点検/報告は多業種に適用可能 | 不動産、保険査定、設備保守、インフラ |
| 受注書を即作成 | 受発注事務は広範囲で共通 | 卸、商社、製造、EC、建材 |

## 3) 重複防止チェック（新規作成前に必須）

1. まず本ファイルの「現在の作成済み一覧」を確認する  
2. **slug** が既存と重複していないか、`scripts/seed-ai-demos.ts`・`scripts/demo-batches/**/*.ts` で検索する  
3. 同一テーマ・同一成果物ペア・同一入力形式が既存にないか確認する（迷う場合は [`docs/demo-mock-taxonomy-matrix.md`](demo-mock-taxonomy-matrix.md) の空きセルを優先）  
4. 重複する場合は「新規作成」ではなく、既存デモの **業種タグ展開** または **入力タイプ変更** で差別化する  
5. 新規追加後は本ファイルを更新する（No は末尾に連番で追加）

## 4) 運用リズム（約100本スケール）

- **週3〜5本**、または **10〜20本/バッチ** で Sanity または `npm run seed:ai-demos` 投入  
- **各バッチ終了時**に本ファイルと [`docs/demo-mock-taxonomy-matrix.md`](demo-mock-taxonomy-matrix.md) を更新  
- **品質**は各本 [`docs/demo-mock-quality-gate.md`](demo-mock-quality-gate.md) を満たすこと  
- 詳細手順: [`docs/新規デモ追加手順.md`](新規デモ追加手順.md)

## 5) 運用メモ

- 既定方針: `問い合わせ文→返信案` 以外は `mock_preview` で量産  
- 昇格方針: 反応が良いもののみ `ai_live` に変更  
- `runMode` の変更だけで昇格できるよう、入力UIは共通で維持  
- 新バッチのコード置き場: [`scripts/demo-batches/`](../scripts/demo-batches/)（`index.ts` で `nextMockDemos` に結合）
- **`/demo` ハブの見せ方**: 4段構成（Featured → タイプ別固定3件 → 目的別ショートカット → `/demo/list` 誘導）の責務は [demo-portfolio-governance.md](demo-portfolio-governance.md) の「`/demo` ハブの4段構成」を参照。放置・低優先のカタログ行は Sanity の `listedOnCatalog: false` で一覧から外し、詳細URL直アクセスは方針に応じて許容

## 6) インタラクティブ体験のみ（`/experience`・Sanity ツールdemo と別系統）

| タイトル（要約） | slug | 備考 |
|---|---|---|
| 飲食店オペレーション・ダッシュボード（シナリオ再生） | `restaurant-ops-dashboard-demo` | 画面体験。ツールdemo本文は未投入可。重複テーマ確認時は本行を参照 |
