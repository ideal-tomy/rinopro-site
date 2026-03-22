# デモポートフォリオ・トリアージ表

最終更新（自動生成）: スクリプト実行日時は git で確認。手編集した列がある場合、再実行すると **未査定行が上書きされる** ので、再生成前にバックアップするか、スクリプトを拡張すること。

**運用ルール**: [demo-portfolio-governance.md](demo-portfolio-governance.md)

**再生成**: `npx tsx scripts/generate-demo-portfolio-triage-md.ts`

## 列の意味

| 列 | 説明 |
|----|------|
| 主ラベル | `①` 文章カタログ / `②` 体験 / `③` プロダクト / `④` 保留 / `未査定` |
| ②URL | 体験用アプリ・外部デモの URL（②または③で使用） |
| ③メモ | プロダクト化・見積用の1行（誰が・何が減るか） |
| ④Rank | ④のとき **A〜D**（定義は [demo-portfolio-governance.md](demo-portfolio-governance.md) の「④保留ランク A〜D」）。①〜③のときは空でよい |
| 保留タグ | 例: `需要不明` `成果物曖昧` など（governance 参照） |
| 需要・難易・わかりやすさ | 高/中/低 や短文メモ |

## 査定サマリ（2026-03-22）

- ① 文章デモ: **56本**
- ② 体験: **24本**
- ③ プロダクト: **10本**
- ④ 保留: **10本**（A/B/C/D あり）

> 査定基準: [demo-portfolio-governance.md](demo-portfolio-governance.md)

---

## マスター（100本）

| No | slug | タイトル | 主ラベル | ②URL | ③メモ | ④Rank | 保留タグ | 需要 | 難易 | わかりやすさ | 備考 |
|---:|------|----------|----------|------|------|---------|----------|------|------|-------------|------|
| 1 | `construction-shadow-foreman` | 現場監督の影武者 | ③ | （体験URL未設定） | 現場報告→内勤調整を一元化し、再確認工数を削減 |  |  | 高 | 高 | 高 | MVP化候補 |
| 2 | `legal-memory-secretary` | 10年分の記憶を持つ秘書 | ③ | `/experience/legal-memory-secretary` | 社内文書検索ボット化で、過去案件確認の一次対応を短縮 |  |  | 高 | 高 | 高 | MVP化候補 |
| 3 | `service-claim-reply-assist` | クレームをファンに変える返信下書き | ③ | `/experience/service-claim-reply-assist` | 問い合わせ一次返信を標準化し、対応品質と速度を平準化 |  |  | 高 | 高 | 高 | MVP化候補 |
| 4 | `meeting-minutes-auto` | 議事録を3秒で | ③ | （体験URL未設定） | 会議音声→議事録運用を定着化し、記録漏れを削減 |  |  | 高 | 高 | 高 | MVP化候補 |
| 5 | `order-form-generator` | 受注書を即作成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 6 | `presentation-outline` | プレゼン資料の骨子作成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 7 | `contract-review-summary` | 契約書レビューサマリ | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 8 | `quote-draft-generator` | 見積書ドラフト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 9 | `daily-weekly-report-summary` | 日報・週報の要約 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 10 | `photo-inspection-report` | 写真から点検報告 | ③ | （体験URL未設定） | 現場写真→報告書化の定型運用で、報告の品質差を削減 |  |  | 高 | 高 | 高 | MVP化候補 |
| 11 | `near-miss-correction-plan` | ヒヤリハット是正プラン生成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 12 | `rain-schedule-reschedule` | 雨天時の工程リスケ案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 13 | `site-cost-anomaly-memo` | 現場コスト異常検知メモ | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 14 | `subcontractor-eval-draft` | 協力会社評価コメント下書き | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 15 | `deadline-alert-organizer` | 申請・更新期限アラート整理 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 16 | `contract-amendment-draft` | 契約修正提案ドラフト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 17 | `first-consult-hearing-design` | 初回相談ヒアリング設計 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 18 | `monthly-billing-check` | 月次請求チェック補助 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 19 | `defect-cause-hypothesis` | 不良報告の原因仮説整理 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 20 | `equipment-inspection-checklist` | 設備点検チェック項目生成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 21 | `inventory-balance-proposal` | 在庫偏り是正提案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 22 | `shift-handover-summary` | シフト引継ぎサマリ生成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 23 | `review-improvement-extract` | レビューから改善案抽出 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 24 | `campaign-copy-ab` | キャンペーン訴求文AB案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 25 | `return-reason-classification` | 返品理由の分類と対策 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 26 | `property-viewing-memo` | 物件内見メモ自動整理 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 27 | `post-viewing-followup-mail` | 内見後フォローメール下書き | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 28 | `handover-points-compress` | 申し送り要点圧縮 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 29 | `delay-notice-template` | 遅延連絡テンプレ自動化 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 30 | `interview-eval-comment` | 面接評価コメント整理 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 31 | `morning-meeting-daily-draft` | 朝礼メモから日報ドラフト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 32 | `retail-floor-voice-handoff` | 店頭接客ボイスメモの共有整理 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 33 | `driver-voice-incident-draft` | ドライバー音声から配送インシデント草案 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 34 | `property-exterior-photo-memo` | 外観・共用部写真から物件状況メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 35 | `delivery-photo-completion-report` | 納品写真から配送完了レポート | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 36 | `clinic-general-inquiry-skeleton` | 一般問い合わせの返信骨子（注意書き付き） | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 37 | `civic-counter-reply-outline` | 窓口・電話問い合わせの回答骨子 | ③ | （体験URL未設定） | 窓口 FAQ 支援で新人の案内精度を安定化 |  |  | 高 | 高 | 高 | MVP化候補 |
| 38 | `b2b-spec-clarification-reply` | 仕様確認メールの返信草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 39 | `ops-manual-spot-summary` | 作業手順の該当箇所要約 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 40 | `helpdesk-similar-ticket-summary` | 類似チケット要約と返信たたき台 | ③ | （体験URL未設定） | 過去チケット検索＋返信案で一次切り分けを短縮 |  |  | 高 | 高 | 高 | MVP化候補 |
| 41 | `stocktake-photo-variance-memo` | 棚卸・陳列写真から差異メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 42 | `damage-photo-incident-draft` | 損害写真から事故報告のたたき台 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 43 | `site-survey-voice-memo` | 現地調査ボイスから調査メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 44 | `parent-meeting-voice-summary` | 面談ボイスから記録サマリ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 45 | `training-survey-improvement-summary` | 研修アンケートから改善サマリ | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 46 | `resume-screening-eval-notes` | 書類選考メモから評価コメント整理 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 47 | `store-audit-action-hq-report` | 店舗巡回所見から改善指示と本部報告 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 48 | `saas-churn-intent-reply-draft` | 解約検討の問い合わせに返信草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 49 | `hospitality-review-reply-draft` | 宿泊レビューへの返信草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 50 | `outage-customer-notice-draft` | 障害対応の顧客向けお知らせ草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 51 | `voicemail-followup-reply-draft` | 留守電メモから折り返し返信草案 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 52 | `care-shift-voice-handover` | 介護シフト申し送りボイス要約 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 53 | `product-label-photo-check-memo` | 表示ラベル写真から確認メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 54 | `rfp-requirements-extract` | 提案依頼書から要件抜き出し | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 55 | `competitive-notes-battlecard` | 競合メモから比較サマリ | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 56 | `job-offer-draft-from-terms` | 条件メモから内定通知の文面骨子 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 57 | `email-thread-decisions-todos` | メールスレッドから決定事項とTODO | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 58 | `vendor-credit-review-memo` | 取引先審査メモから与信所見のたたき台 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 59 | `webinar-invite-email-draft` | ウェビナー案内メールの草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 60 | `legal-dd-topics-from-brief` | 案件ブリーフからDD論点リスト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 61 | `cs-qbr-voice-summary` | 定例レビューのボイスからサマリ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 62 | `event-brief-voice-to-quote-memo` | 打ち合わせボイスから見積前提メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 63 | `field-crop-photo-observation` | 圃場写真から生育観察メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 64 | `whiteboard-photo-action-extract` | ホワイトボード写真からアクション整理 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 65 | `sla-miss-customer-explanation-draft` | SLA未達の顧客向け説明文草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 66 | `bullet-mess-to-meeting-agenda` | 雑メモから会議アジェンダ整形 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 67 | `onboarding-checklist-from-role` | 入社手続きチェックリスト生成 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 68 | `internal-report-intake-memo` | 内部通報の受付メモ整理 | ③ | （体験URL未設定） | 内部通報受付フローの文書化を標準化 |  |  | 高 | 高 | 高 | MVP化候補 |
| 69 | `security-suspicion-triage-memo` | セキュリティ疑いの初動トリアージメモ | ③ | （体験URL未設定） | 初動トリアージを定型化し、エスカレ判断を高速化 |  |  | 高 | 高 | 高 | MVP化候補 |
| 70 | `translation-brief-from-notes` | 原文メモから翻訳依頼ブリーフ | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 71 | `user-story-draft-from-bullets` | 要件メモからユーザーストーリー草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 72 | `release-note-draft-from-ship-list` | 変更メモからリリースノート草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 73 | `loan-interview-business-outline` | 事業メモから融資面談用の説明骨子 | ④ |  |  | A | 需要不明 | 中 | 中 | 中 | 文面と対象ユーザーを絞れば①へ昇格可能 |
| 74 | `restaurant-prep-list-from-bookings` | 予約状況から仕込みリスト草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 75 | `help-article-draft-from-ticket` | 問い合わせスレッドからヘルプ記事草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 76 | `call-monitor-feedback-coaching` | モニタリングメモからフィードバック文 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 77 | `clinic-reception-voice-handover` | 受付シフトの申し送りボイス要約 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 78 | `receipt-photo-expense-memo` | 領収書写真から経費入力メモ | ② | `/experience/receipt-photo-expense-memo` |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 79 | `vm-display-photo-completion-report` | 売場作り込み写真から完了報告 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 80 | `supplier-audit-corrective-draft` | 監査所見から是正要求の骨子 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 81 | `privacy-notice-update-draft` | プライバシー通知の改定骨子 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 82 | `lease-moveout-explanation-draft` | 退去時の原状回復説明の骨子 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 83 | `conference-trip-report-outline` | 学会参加メモから報告書骨子 | ④ |  |  | A | 需要不明 | 中 | 中 | 中 | 文面と対象ユーザーを絞れば①へ昇格可能 |
| 84 | `subsidy-application-topic-checklist` | 補助金申請の論点チェックリスト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 85 | `pet-hotel-handover-voice-memo` | ペット預かり引き渡しボイスメモ | ④ |  |  | B | 需要不明 | 中 | 中 | 中 | 操作導線の体験設計が必要（②候補） |
| 86 | `gallery-exhibit-voice-script-draft` | 展示解説のナレーション原稿たたき台 | ④ |  |  | C | 成果物曖昧 | 低 | 高 | 低 | 複数ステップの業務フロー設計が前提 |
| 87 | `gemba-5s-photo-findings-memo` | 現場写真から5S指摘メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 88 | `parking-violation-photo-contact-memo` | 駐車トラブル写真から連絡メモ | ④ |  |  | C | 成果物曖昧 | 低 | 高 | 低 | 複数ステップの業務フロー設計が前提 |
| 89 | `exit-knowledge-qa-draft` | 退職ヒアリングからナレッジQ&A草案 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 90 | `a11y-audit-priority-backlog` | アクセシビリティ監査メモから優先リスト | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 91 | `grocery-freshness-voice-waste-log` | 鮮度管理のボイスから廃棄ログ草案 | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 92 | `oss-attribution-readme-snippet` | OSSライセンス表記のREADME断片 | ④ |  |  | D | 需要不明/成果物曖昧 | 低 | 中 | 低 | 現時点は削除優先 |
| 93 | `construction-barrier-photo-safety-round` | 仮設・バリケード写真から安全巡回メモ | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 94 | `exec-meeting-notes-to-summary` | 経営会議メモからサマリと宿題 | ① |  |  |  |  | 中 | 低 | 高 | 文章デモで成立 |
| 95 | `nonprofit-donor-thanks-letter-draft` | 寄付感謝レターの草案 | ④ |  |  | A | 需要不明 | 中 | 中 | 中 | 文面と対象ユーザーを絞れば①へ昇格可能 |
| 96 | `crowdfunding-milestone-update-draft` | クラファン支援者向け進捗レター草案 | ④ |  |  | A | 需要不明 | 中 | 中 | 中 | 文面と対象ユーザーを絞れば①へ昇格可能 |
| 97 | `patent-search-plan-from-memo` | 発明メモから先行調査の計画書骨子 | ④ |  |  | C | 成果物曖昧 | 低 | 高 | 低 | 複数ステップの業務フロー設計が前提 |
| 98 | `esg-kpi-draft-from-initiatives` | 施策リストからESG開示の数値骨子 | ④ |  |  | C | 成果物曖昧 | 低 | 高 | 低 | 複数ステップの業務フロー設計が前提 |
| 99 | `venue-loadin-voice-timeline` | 搬入立ち合いボイスからタイムライン | ② | （体験URL未設定） |  |  |  | 中 | 中 | 中 | 画面体験があると訴求しやすい |
| 100 | `medical-device-visit-report-draft` | 医療機器卸の訪問記録草案 | ③ | （体験URL未設定） | 訪問記録入力の標準化で営業報告の欠損を削減 |  |  | 高 | 高 | 高 | MVP化候補 |

---

## 削除候補（Dランク確定）

運用: **D に確定した slug** を下に追記する（実行は governance の削除チェックリストに従う）。

- `oss-attribution-readme-snippet`

---

## アーカイブ判定（2026-03-22 ルール修正版）

適用ルール:

- **④保留はすべてアーカイブ**
- 残す対象は **②** と **③**（需要順で優先）

### アーカイブ確定（④保留の全件）

- `loan-interview-business-outline`（A）
- `conference-trip-report-outline`（A）
- `pet-hotel-handover-voice-memo`（B）
- `gallery-exhibit-voice-script-draft`（C）
- `parking-violation-photo-contact-memo`（C）
- `nonprofit-donor-thanks-letter-draft`（A）
- `crowdfunding-milestone-update-draft`（A）
- `patent-search-plan-from-memo`（C）
- `esg-kpi-draft-from-initiatives`（C）
- `oss-attribution-readme-snippet`（D）

### 継続（作成候補として残す）

- **② 体験**
- **③ プロダクト**

---

## 作成候補一覧（需要順）

以下は、アーカイブ判定後に残った候補を **②（需要: 高→中）**、**③（需要: 高→中）** の順で整理したもの。

### ② 体験（需要順）

#### 需要: 高

- 該当なし

#### 需要: 中

1. 物件内見メモ自動整理（`property-viewing-memo`）
   - 作るべき体験デモ: 音声メモ入力→要点抽出→「顧客向けフォロー文」と「社内ToDo」が同時に出る2ペインUI。
2. 店頭接客ボイスメモの共有整理（`retail-floor-voice-handoff`）
   - 作るべき体験デモ: 接客メモ入力→店舗引継ぎカード生成→本部共有文をワンタップで切替表示するUI。
3. ドライバー音声から配送インシデント草案（`driver-voice-incident-draft`）
   - 作るべき体験デモ: 音声入力→事故報告フォーム自動補完→荷主連絡テンプレ生成までを1フロー表示。
4. 外観・共用部写真から物件状況メモ（`property-exterior-photo-memo`）
   - 作るべき体験デモ: 写真アップロード→状況タグ抽出→記録メモと次アクションを同時生成する画面。
5. 納品写真から配送完了レポート（`delivery-photo-completion-report`）
   - 作るべき体験デモ: 納品写真＋メモ入力→完了レポート自動生成→異常時テンプレ切替表示。
6. 棚卸・陳列写真から差異メモ（`stocktake-photo-variance-memo`）
   - 作るべき体験デモ: 写真比較入力→差異ポイント抽出→本部共有文を生成する監査ビュー。
7. 損害写真から事故報告のたたき台（`damage-photo-incident-draft`）
   - 作るべき体験デモ: 損害写真入力→事故報告ドラフト→保険・関係者向け連絡文出力。
8. 現地調査ボイスから調査メモ（`site-survey-voice-memo`）
   - 作るべき体験デモ: ボイス記録→調査記録の章立て自動生成→見積/設計向け引継ぎタブを分離。
9. 面談ボイスから記録サマリ（`parent-meeting-voice-summary`）
   - 作るべき体験デモ: 面談音声→議事録化→校内共有と次回タスクを時系列で表示。
10. 留守電メモから折り返し返信草案（`voicemail-followup-reply-draft`）
    - 作るべき体験デモ: 留守電テキスト化→折返し返信案→担当者メモを同時生成するコールバックUI。
11. 介護シフト申し送りボイス要約（`care-shift-voice-handover`）
    - 作るべき体験デモ: 申し送り音声→夜勤向け注意事項抽出→翌朝確認リスト表示。
12. 表示ラベル写真から確認メモ（`product-label-photo-check-memo`）
    - 作るべき体験デモ: ラベル写真→確認チェックリスト→取引先共有文を生成するレビュー画面。
13. 定例レビューのボイスからサマリ（`cs-qbr-voice-summary`）
    - 作るべき体験デモ: 定例音声→顧客課題サマリ→社内アクションボードへ整形表示。
14. 打ち合わせボイスから見積前提メモ（`event-brief-voice-to-quote-memo`）
    - 作るべき体験デモ: 打合せ音声→見積前提抽出→不足情報チェックを可視化。
15. 圃場写真から生育観察メモ（`field-crop-photo-observation`）
    - 作るべき体験デモ: 圃場写真→観察コメント生成→次作業提案を時系列で表示。
16. ホワイトボード写真からアクション整理（`whiteboard-photo-action-extract`）
    - 作るべき体験デモ: 白板写真→論点/ToDo抽出→担当者アサインUI（疑似）で見せる。
17. モニタリングメモからフィードバック文（`call-monitor-feedback-coaching`）
    - 作るべき体験デモ: モニタリング結果入力→本人向けFB文→品質管理向け要約を並列表示。
18. 受付シフトの申し送りボイス要約（`clinic-reception-voice-handover`）
    - 作るべき体験デモ: 受付音声→申し送りカード生成→翌朝確認項目をチェックリスト化。
19. 領収書写真から経費入力メモ（`receipt-photo-expense-memo`）
    - 作るべき体験デモ: 領収書画像→費目/金額抽出→承認前チェック項目表示。
20. 売場作り込み写真から完了報告（`vm-display-photo-completion-report`）
    - 作るべき体験デモ: 売場写真→完了報告生成→本部フィードバック依頼テンプレ表示。
21. 現場写真から5S指摘メモ（`gemba-5s-photo-findings-memo`）
    - 作るべき体験デモ: 写真→5S観点の指摘抽出→班長向け改善依頼文を即表示。
22. 鮮度管理のボイスから廃棄ログ草案（`grocery-freshness-voice-waste-log`）
    - 作るべき体験デモ: 音声入力→廃棄ログ整形→本部共有フォーマットに変換。
23. 仮設・バリケード写真から安全巡回メモ（`construction-barrier-photo-safety-round`）
    - 作るべき体験デモ: 写真→危険箇所メモ→是正依頼文を現場向け/本部向けで切替表示。
24. 搬入立ち合いボイスからタイムライン（`venue-loadin-voice-timeline`）
    - 作るべき体験デモ: 搬入音声→時系列タイムライン生成→リスクメモを並列表示。

### ③ プロダクト（需要順）

#### 需要: 高

1. 現場監督の影武者（`construction-shadow-foreman`）
   - 作るべき体験デモ: 現場報告入力→内勤調整タスク生成→承認/連絡ステータス管理までを1画面で体験。
2. 10年分の記憶を持つ秘書（`legal-memory-secretary`）
   - 作るべき体験デモ: 質問入力→関連文書検索→回答根拠表示（引用つき）を再現する社内ナレッジボット体験。
3. クレームをファンに変える返信下書き（`service-claim-reply-assist`）
   - 作るべき体験デモ: 問い合わせ入力→返信候補生成→承認/修正履歴を可視化する CS 運用フロー。
4. 議事録を3秒で（`meeting-minutes-auto`）
   - 作るべき体験デモ: 音声アップロード→議事録自動生成→決定事項をタスク化する会議運用体験。
5. 写真から点検報告（`photo-inspection-report`）
   - 作るべき体験デモ: 写真→点検報告→是正依頼までを連続処理する点検管理フロー。
6. 窓口・電話問い合わせの回答骨子（`civic-counter-reply-outline`）
   - 作るべき体験デモ: 住民問い合わせ入力→回答案→法令確認ステップを通す窓口支援フロー。
7. 類似チケット要約と返信たたき台（`helpdesk-similar-ticket-summary`）
   - 作るべき体験デモ: チケット入力→類似事例検索→返信案とエスカレ判断を同時提示するヘルプデスク体験。
8. セキュリティ疑いの初動トリアージメモ（`security-suspicion-triage-memo`）
   - 作るべき体験デモ: インシデント情報入力→重大度判定→初動手順と連絡先を自動提示するSOC初動体験。
9. 内部通報の受付メモ整理（`internal-report-intake-memo`）
   - 作るべき体験デモ: 通報受付入力→受付票整形→法務/監査エスカレーション分岐を示すフロー。
10. 医療機器卸の訪問記録草案（`medical-device-visit-report-draft`）
    - 作るべき体験デモ: 訪問メモ入力→CRM記録生成→コンプラ確認チェックを通す営業報告フロー。

#### 需要: 中

- 該当なし
