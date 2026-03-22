/**
 * バッチ04: 追加10本モック（runMode: mock_preview 固定）
 * 問い合わせ×audio、画像×コンプライアンス、B2B・採用・法務の text を拡張。
 */

export const batch04NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "留守電メモから折り返し返信草案",
    slug: { _type: "slug" as const, current: "voicemail-followup-reply-draft" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "cs_support" as const,
    inputPlaceholder: "留守電の内容を音声で話すか、聞き取りメモをテキストで入力してください",
    mockOutputPrimary: `## 1. 折り返し用メモ（担当者向け）

- 用件要約: 配送日変更希望。希望日は翌週火曜
- 顧客の温度感: やや急ぎ。明日午前までに連絡希望
- 確認が必要な番号・品番: 伝票末尾1234、品目は冷蔵セット`,
    mockOutputSecondary: `## 2. 顧客向け返信草案（SMS/メール）

お問い合わせありがとうございます。配送日変更の件、確認のうえ明日午前までにご連絡いたします。お急ぎのところお待たせしております。`,
    systemPrompt: "あなたは留守電・音声メモの内容から折り返し用メモと顧客向け短い返信草案を作成するアシスタントです。",
    outputStructure: "折り返し用メモ（担当者向け）と顧客向け返信草案（SMS/メール）の2セクションで出力すること。",
    sampleData: [
      "配送を金曜から月曜に変えたい。仕事が入ったので。至急",
      "注文番号が分からないが、昨日の夕方に電話した件の続き",
      "返品のラベルが同封されていない。どうすればいいか",
    ],
    ctaTitle: "あなたのコールセンター運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "留守電の内容から担当メモと短い返信案を即作成。折り返しの初動を揃えます。",
    industryTags: ["小売", "EC", "サービス"],
    functionTags: ["音声入力", "返信生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "留守電メモから返信草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "介護シフト申し送りボイス要約",
    slug: { _type: "slug" as const, current: "care-shift-voice-handover" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "care" as const,
    inputPlaceholder: "申し送り内容を音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. 申し送りサマリ

- バイタル・服薬: 血圧安定。夕食後の服薬は完了
- 行動・歩行: トイレ誘導は2回。ふらつきは夕方のみ
- 家族連絡: 明日午前に電話希望あり`,
    mockOutputSecondary: `## 2. 夜勤・翌朝への注意

転倒リスクあり。夜間は照明と呼び鈴の位置を確認。家族電話は記録に残す。`,
    systemPrompt: "あなたは介護現場の申し送り音声から要約を作成するアシスタントです。医療判断は行いません。",
    outputStructure: "申し送りサマリと夜勤・翌朝への注意の2セクションで出力すること。",
    sampleData: [
      "Aさんは今日は食欲あり。入浴はキャンセル。家族が様子を聞きたいと",
      "Bさんが少し熱っぽいと言っていた。体温は平熱だった",
      "Cさんは薬の時間に寝ていた。後で服薬確認が必要",
    ],
    ctaTitle: "あなたの記録様式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "申し送りの音声からサマリと注意事項を即整理。シフト間の情報欠落を減らします（記録は施設基準に従ってください）。",
    industryTags: ["介護", "医療"],
    functionTags: ["音声入力", "記録業務"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "介護申し送りボイスを即要約",
  },
  {
    _type: "aiDemo" as const,
    title: "表示ラベル写真から確認メモ",
    slug: { _type: "slug" as const, current: "product-label-photo-check-memo" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "原材料表示・賞味期限などのラベル写真をアップロードし、品目をテキストで補足してください",
    mockOutputPrimary: `## 1. 表示確認メモ

- 賞味期限表示: 年月日形式。可読性は良好
- アレルゲン表示: 特定原材料7品目の記載あり
- 栄養成分・内容量: 基準単位と実重量の整合は要確認`,
    mockOutputSecondary: `## 2. 社内・取引先共有文

ラベル写真〇枚を添付。賞味期限表記とアレルゲン表記は問題なし。内容量表記のみ再確認依頼。`,
    systemPrompt: "あなたは商品ラベルの写真と補足から社内向け確認メモを作成するアシスタントです。最終適合判定は行いません。",
    outputStructure: "表示確認メモと社内・取引先共有文の2セクションで出力すること。",
    sampleData: [
      "新規SKUの試作品。原材料とアレルゲン表記のチェック用",
      "輸入菓子。日本語表示シールが貼ってあるか確認したい",
      "冷凍食品。解凍後の賞味期限の書き方が新基準か確認",
    ],
    ctaTitle: "あなたの品質・表示チェック表に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "ラベル写真から確認メモと共有文を即作成。表示まわりのレビューを前倒しします。",
    industryTags: ["小売", "製造", "飲食"],
    functionTags: ["画像入力", "品質管理"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "ラベル写真から表示確認メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "提案依頼書から要件抜き出し",
    slug: { _type: "slug" as const, current: "rfp-requirements-extract" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "RFP・提案依頼の本文または抜粋を入力してください",
    mockOutputPrimary: `## 1. 要件一覧

- 必須: 既存基幹とのAPI連携、月次レポート、SLA 99.5%
- 任意: 多言語UI、オンプレ併用
- 納期・契約: 発注から4ヶ月以内本番。3年契約想定`,
    mockOutputSecondary: `## 2. ギャップ・確認質問リスト

連携対象システムのバージョン。データ保持期間。個人情報の取り扱い範囲。セキュリティ監査の有無。`,
    systemPrompt: "あなたはRFP・提案依頼書から要件を整理するアシスタントです。",
    outputStructure: "要件一覧とギャップ・確認質問リストの2セクションで出力すること。",
    sampleData: [
      "システム刷新のRFP。予算レンジと必須機能が散らばって書いてある",
      "保守入札の要件。人月単価と常駐日数の条件がある",
      "マーケ支援の提案募集。KPIとレポート形式が曖昧",
    ],
    ctaTitle: "あなたの提案プロセスに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "RFPから要件表と確認質問を即整理。提案準備の初日を短縮します。",
    industryTags: ["製造", "SaaS", "商社"],
    functionTags: ["要約", "資料作成"],
    moduleTags: ["LLM"],
    oneLiner: "RFPから要件と質問リストを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "競合メモから比較サマリ",
    slug: { _type: "slug" as const, current: "competitive-notes-battlecard" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "自社・競合の特徴メモ（箇条書き可）を入力してください",
    mockOutputPrimary: `## 1. 比較サマリ（営業向け）

- 当社の強み: 導入支援の手厚さ、国内サポート窓口
- 競合A: 価格帯は低め。カスタマイズは弱い
- 競合B: 機能は豊富。学習コストが高いという声`,
    mockOutputSecondary: `## 2. トークポイント・注意喚起

価格で詰められたらTCOと移行リスクを提示。機能比較はデモで差を見せる。誇大表現は避ける。`,
    systemPrompt: "あなたは競合メモから営業向け比較サマリを作成するアシスタントです。",
    outputStructure: "比較サマリ（営業向け）とトークポイント・注意喚起の2セクションで出力すること。",
    sampleData: [
      "当社はサポートが強い。A社は安いが問い合わせが遅いと聞く",
      "B社は広告が強い。機能は似ているがワークフローが違う",
      "新興C社はUIがきれい。エンタープライズ実績はまだ少ない",
    ],
    ctaTitle: "あなたの営業ツールに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "断片メモから比較サマリとトークポイントを即作成。商談準備を揃えやすくします。",
    industryTags: ["SaaS", "製造", "商社"],
    functionTags: ["要約", "資料作成"],
    moduleTags: ["LLM"],
    oneLiner: "競合メモから比較サマリを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "条件メモから内定通知の文面骨子",
    slug: { _type: "slug" as const, current: "job-offer-draft-from-terms" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "年収・勤務地・入社日などの条件メモを入力してください",
    mockOutputPrimary: `## 1. 内定通知の文面骨子

- 採用の旨と喜びの表現
- 条件の要約（職種、勤務地、想定年収、入社予定日）
- 次の手続（返信期限、提出書類の案内）
- 問い合わせ窓口`,
    mockOutputSecondary: `## 2. 法務・人事確認メモ

労働条件通知書との整合。固定残業代の記載要否。試用期間の明記。テンプレ差し替え禁止箇所。`,
    systemPrompt: "あなたは採用条件メモから内定通知の文面骨子を作成するアシスタントです。",
    outputStructure: "内定通知の文面骨子と法務・人事確認メモの2セクションで出力すること。",
    sampleData: [
      "年収500〜550、東京、4月1日入社、正社員、試用3ヶ月",
      "リモート週3、残業月20h想定、役職は一般職",
      "契約社員から正社員内定。条件は別紙労働条件通知書で送付",
    ],
    ctaTitle: "あなたの採用文書テンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "条件メモから通知文の骨子と確認事項を即整理。採用アドミンの負荷を下げます。",
    industryTags: ["人材", "士業"],
    functionTags: ["採用", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "条件メモから内定文面の骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "メールスレッドから決定事項とTODO",
    slug: { _type: "slug" as const, current: "email-thread-decisions-todos" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "メールスレッドを貼り付け、または要点を要約して入力してください",
    mockOutputPrimary: `## 1. 決定事項

- 来週水曜にキックオフ。参加者は営業・開発・CS
- 仕様はv1.2で固定。追加要望はフェーズ2へ
- 契約書は法務レビュー後に送付`,
    mockOutputSecondary: `## 2. TODO・未決一覧

佐藤: 会議招待送付（期限: 明日）。鈴木: 見積再提出。未決: 保守料金の年払い可否。`,
    systemPrompt: "あなたはメールスレッドから決定事項とTODOを抽出するアシスタントです。",
    outputStructure: "決定事項とTODO・未決一覧の2セクションで出力すること。",
    sampleData: [
      "長い返信のやり取り。最後の方で納期だけ合意したように見える",
      "別件が混ざったスレッド。本題は契約更新だけ抜き出したい",
      "英語と日本語が混在。重要なのは署名プロセスの話",
    ],
    ctaTitle: "あなたのプロジェクト運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "スレッドから決定とTODOを即整理。会議後のフォロー漏れを減らします。",
    industryTags: ["士業", "SaaS", "製造"],
    functionTags: ["要約", "議事録生成"],
    moduleTags: ["LLM"],
    oneLiner: "メールスレッドから決定とTODOを即抽出",
  },
  {
    _type: "aiDemo" as const,
    title: "取引先審査メモから与信所見のたたき台",
    slug: { _type: "slug" as const, current: "vendor-credit-review-memo" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "決算概要・取引実績・ヒアリングメモを入力してください",
    mockOutputPrimary: `## 1. 与信所見（たたき台）

- 業況: 売上微増、利益率は横ばい
- 財務: 自己資本比率は業界平均並み。短期借入の返済計画は確認済み
- 取引リスク: 新規大口案件への集中度が高い`,
    mockOutputSecondary: `## 2. 追加確認・条件案

直近四半期のキャッシュフロー資料。親会社保証の要否。与信枠は段階的引き上げを提案。`,
    systemPrompt: "あなたは取引先審査メモから与信所見のたたき台を作成するアシスタントです。最終与信判断は行いません。",
    outputStructure: "与信所見（たたき台）と追加確認・条件案の2セクションで出力すること。",
    sampleData: [
      "上場子会社。売上は安定。親会社の支援体制は口頭のみ確認",
      "創業3年のスタートアップ。成長は早いが黒字化はこれから",
      "海外拠点あり。為替リスクの説明は会議で聞いた",
    ],
    ctaTitle: "あなたの与信フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "審査メモから所見のたたき台と確認事項を即整理。稟議準備を速くします。",
    industryTags: ["製造", "商社", "金融"],
    functionTags: ["要約", "帳票生成"],
    moduleTags: ["LLM"],
    oneLiner: "与信審査メモから所見のたたき台を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "ウェビナー案内メールの草案",
    slug: { _type: "slug" as const, current: "webinar-invite-email-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "イベント名・日時・ターゲット・話者メモを入力してください",
    mockOutputPrimary: `## 1. 招待メール草案

- 件名案: 【招待】〇〇で学ぶ△△の最前線（日時）
- 本文: 誰向けか、得られること、登録リンク、開催概要
- 締め: 問い合わせ先と配信停止の案内`,
    mockOutputSecondary: `## 2. リマインド・フォロー文

前日リマインドの短い文面。開催後のお礼と資料送付の骨子。`,
    systemPrompt: "あなたはウェビナー・セミナー案内メールの草案を作成するアシスタントです。",
    outputStructure: "招待メール草案とリマインド・フォロー文の2セクションで出力すること。",
    sampleData: [
      "製造業向けDX。来月第2水曜15時。社長向け30分",
      "採用ブランディングの無料セミナー。人事・広報向け",
      "新機能リリースの説明会。既存顧客限定",
    ],
    ctaTitle: "あなたのマーケトーンに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "イベント概要から招待メールとリマインド文を即作成。集客コミュニケーションを短時間で揃えます。",
    industryTags: ["SaaS", "製造", "サービス"],
    functionTags: ["販促", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "ウェビナー招待メールを即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "案件ブリーフからDD論点リスト",
    slug: { _type: "slug" as const, current: "legal-dd-topics-from-brief" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "legal" as const,
    inputPlaceholder: "案件のブリーフ（業種・スキーム・懸念）を入力してください",
    mockOutputPrimary: `## 1. DD論点リスト

- 法務: 重要契約の変更制限、知的財産の帰属、訴訟・係争
- 労務: 雇用継承、退職金・手当、労使協定
- コンプライアンス: 許認可、個人情報、下請法`,
    mockOutputSecondary: `## 2. 資料依頼文の骨子

相手方へ送付する資料リストの見出し案。提出期限の例示。機密保持に関する一文。`,
    systemPrompt: "あなたはM&A・投資案件のブリーフからデューデリジェンスの論点リストを作成するアシスタントです。",
    outputStructure: "DD論点リストと資料依頼文の骨子の2セクションで出力すること。",
    sampleData: [
      "中小製造の株式取得。親族株主が複数。土地あり",
      "IT子会社のスピンオフ。ライセンス契約が複雑",
      "海外子会社あり。現地法務は別ファームと連携予定",
    ],
    ctaTitle: "あなたのDDテンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "ブリーフから論点と資料依頼の骨子を即整理。初動のDD設計を速くします。",
    industryTags: ["士業", "金融"],
    functionTags: ["契約レビュー", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "案件ブリーフからDD論点を即リスト化",
  },
];
