/**
 * バッチ05: 追加10本モック（runMode: mock_preview 固定）
 */

export const batch05NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "定例レビューのボイスからサマリ",
    slug: { _type: "slug" as const, current: "cs-qbr-voice-summary" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "顧客定例の内容を音声で話すか、メモをテキストで入力してください",
    mockOutputPrimary: `## 1. 定例サマリ

- 利用状況: アクティブユーザーは前四半期比+8%。主要ワークフローは安定
- 課題: レポート出力が月末に遅い。権限設計で現場が戸惑い
- 顧客の期待: 来月までにレポート速度の改善見込みを共有してほしい`,
    mockOutputSecondary: `## 2. 社内アクション

プロダクト: レポートクエリ見直し。CS: 権限の簡易ガイド送付。営業: 拡張ライセンスの提案タイミングを次回に。`,
    systemPrompt: "あなたは顧客向け定例レビュー（QBR）の音声メモからサマリを作成するアシスタントです。",
    outputStructure: "定例サマリと社内アクションの2セクションで出力すること。",
    sampleData: [
      "先方は満足しているがダッシュボードの並び順を変えたいと言っていた",
      "来期の予算は確保できそう。追加モジュールの話は次回に持ち越し",
      "サポート応答は良いが、エスカレが多いプロセスを整理したい",
    ],
    ctaTitle: "あなたのカスタマーサクセス運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description:
      "定例の音声メモからサマリと社内アクションを即整理。顧客フォローの記録を揃えます。インタラクティブ体験: /experience/cs-qbr-voice-summary（Live Sync）。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["音声入力", "要約"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "QBRのボイスから定例サマリを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "打ち合わせボイスから見積前提メモ",
    slug: { _type: "slug" as const, current: "event-brief-voice-to-quote-memo" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "real_estate" as const,
    inputPlaceholder: "イベント要件の打ち合わせ内容を音声で話すか、メモを入力してください",
    mockOutputPrimary: `## 1. 要件メモ（見積用）

- 日時・会場規模: 来年春。ゲスト約80名。屋内希望
- 必須: 音響・司会進行、ケータリング、記念撮影
- オプション: ライブ配信、余興手配
- 予算感: 中位帯。上限は要相談`,
    mockOutputSecondary: `## 2. 見積提出時の確認事項

設営時間の制限。電源容量。キャンセル規定。追加人数時の単価。`,
    systemPrompt: "あなたはイベント・式典の打ち合わせ音声から見積前提の要件メモを作成するアシスタントです。",
    outputStructure: "要件メモ（見積用）と見積提出時の確認事項の2セクションで出力すること。",
    sampleData: [
      "披露宴と二次会。親族中心。アルコールは控えめ希望",
      "社内表彰式。配信は社内向けのみ。受賞者20名",
      "屋外も検討。雨天時は会場変更の条項が欲しい",
    ],
    ctaTitle: "あなたのイベント見積フローに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description:
      "打ち合わせの音声から要件整理と確認事項を即作成。見積ミスマッチを減らします。インタラクティブ体験: /experience/event-brief-voice-to-quote-memo（Live Sync）。",
    industryTags: ["サービス", "小売"],
    functionTags: ["音声入力", "見積作成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "イベント打合せボイスから見積メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "圃場写真から生育観察メモ",
    slug: { _type: "slug" as const, current: "field-crop-photo-observation" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "圃場・作物の写真をアップロードし、品目・生育段階をテキストで補足してください",
    mockOutputPrimary: `## 1. 生育観察メモ

- 全体印象: 葉色は良好。一部で虫食いの痕跡
- 生育段階: 入力情報に基づき、収穫までの目安は要フィールド確認
- 気象リスク: 直近の雨予報あり。排水の様子は次回確認`,
    mockOutputSecondary: `## 2. 次の作業提案

防除のタイミング検討。葉のサンプル持ち帰り可否。農協・指導員への相談要否。`,
    systemPrompt: "あなたは圃場・作物の写真と補足から生育観察メモのたたき台を作成するアシスタントです。確定診断は行いません。",
    outputStructure: "生育観察メモと次の作業提案の2セクションで出力すること。",
    sampleData: [
      "トマトハウス。花が咲き始め。害虫はまだ目立たない",
      "水稲の田んぼ。稲穂の出方を記録したい",
      "果樹。実の着色がまばら。肥料の話もメモに含めたい",
    ],
    ctaTitle: "あなたの栽培記録フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真とメモから観察記録と次作業の提案を即整理。現場記録の定型化に使えます。",
    industryTags: ["農業", "食品"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "圃場写真から生育メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "ホワイトボード写真からアクション整理",
    slug: { _type: "slug" as const, current: "whiteboard-photo-action-extract" },
    industry: "legal" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "ホワイトボードや掲示の写真をアップロードし、会議名をテキストで補足してください",
    mockOutputPrimary: `## 1. 論点・決定の整理

- テーマ: 新規施策のスケジュール
- 書き出し内容より: フェーズ1は来月開始、KPIは申込数
- 決定らしき記載: デザインは外部委託で進める`,
    mockOutputSecondary: `## 2. アクション一覧（案）

担当未定: 要件定義書ドラフト（期限: 金曜）。田中: 見積依頼。未決: 予算上限の確定。`,
    systemPrompt: "あなたはホワイトボードの写真から会議内容の整理案を作成するアシスタントです。読み取れない部分は推測しすぎない。",
    outputStructure: "論点・決定の整理とアクション一覧（案）の2セクションで出力すること。",
    sampleData: [
      "プロジェクトキックオフの板。付箋が多い",
      "週次の数字メモ。矢印で優先順位が書いてある",
      "ブレスト。アイデアだけで決定はまだ",
    ],
    ctaTitle: "あなたの議事運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "白板の写真から論点とアクション案を即整理。写真だけ残した会議の後片付けを速くします。",
    industryTags: ["士業", "SaaS", "製造"],
    functionTags: ["画像入力", "議事録生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "ホワイトボード写真からアクション整理",
  },
  {
    _type: "aiDemo" as const,
    title: "SLA未達の顧客向け説明文草案",
    slug: { _type: "slug" as const, current: "sla-miss-customer-explanation-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "cs_support" as const,
    inputPlaceholder: "障害・遅延の事実、影響、原因区分（分かる範囲）を入力してください",
    mockOutputPrimary: `## 1. 顧客向け説明文（草案）

- 事象の概要と期間
- SLA上の目標と今回の結果（数値が分かる場合は記載）
- 原因の説明（確定分と調査中の切り分け）
- 再発防止の取り組みの方向性とお詫び`,
    mockOutputSecondary: `## 2. 社内報告メモ

エラーバジェット消費状況。クレジット適用要否。エスカレ有無。`,
    systemPrompt: "あなたはSLA未達時の顧客向け説明文の草案を作成するアシスタントです。",
    outputStructure: "顧客向け説明文（草案）と社内報告メモの2セクションで出力すること。",
    sampleData: [
      "API応答が4時間遅延。目標99.9%を1日だけ下回った。原因はDBメンテ延長",
      "サポート初回応答が遅れた。人員不足と大型障害の重なり",
      "月次レポート配信が翌営業日にずれ込み。ジョブ失敗が原因",
    ],
    ctaTitle: "あなたのSLA運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "事実メモから顧客向け説明と社内メモを即作成。トラブル時のトーンを揃えます。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["返信生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "SLA未達の顧客向け説明を即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "雑メモから会議アジェンダ整形",
    slug: { _type: "slug" as const, current: "bullet-mess-to-meeting-agenda" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "話したいことを箇条書きで入力してください",
    mockOutputPrimary: `## 1. アジェンダ（整形版）

1. 前回フォロー（5分）
2. 売上速報と課題（15分）
3. 新規施策のスコープ確認（20分）
4. その他・次回日程（5分）`,
    mockOutputSecondary: `## 2. 事前共有・準備依頼

参加者へ: 各拠点の数字を表で共有。法務: 契約ドラフトv0.3を事前送付。`,
    systemPrompt: "あなたは雑なメモから会議アジェンダを整形するアシスタントです。",
    outputStructure: "アジェンダ（整形版）と事前共有・準備依頼の2セクションで出力すること。",
    sampleData: [
      "売上、人手、あと新システムの話、法務にもちょっと",
      "A案件の遅延理由、B案件の請求、来月の展示会",
      "キックオフ。誰が何するか決めたいだけ",
    ],
    ctaTitle: "あなたの会議テンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "箇条書きメモからアジェンダと準備依頼を即整形。会議の準備時間を短縮します。",
    industryTags: ["士業", "製造", "SaaS"],
    functionTags: ["資料作成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "雑メモから会議アジェンダを即整形",
  },
  {
    _type: "aiDemo" as const,
    title: "入社手続きチェックリスト生成",
    slug: { _type: "slug" as const, current: "onboarding-checklist-from-role" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "職種・勤務地・入社日・雇用形態のメモを入力してください",
    mockOutputPrimary: `## 1. チェックリスト（入社初日〜1週間）

- 労務: 雇用契約署名、労働条件通知、マイナンバー、口座登録
- IT: アカウント発行、端末手配、情報セキュリティ研修
- 現場: 職場見学、安全衛生教育、緊急連絡網`,
    mockOutputSecondary: `## 2. 担当割り当てメモ

人事: 契約・給与。総務: 備品・入館証。IT: アカウント。現場: OJT担当の指名。`,
    systemPrompt: "あなたは採用情報から入社オンボーディングのチェックリストを生成するアシスタントです。",
    outputStructure: "チェックリスト（入社初日〜1週間）と担当割り当てメモの2セクションで出力すること。",
    sampleData: [
      "正社員、開発、リモート週3、来月1日",
      "アルバイト、店舗販売、週20時間、駅前店舗",
      "中途、営業、海外出張あり、来週月曜入社",
    ],
    ctaTitle: "あなたのオンボーディング手順に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "職種と条件からチェックリストと担当割りを即作成。入社初日の抜け漏れを減らします。",
    industryTags: ["人材", "小売", "SaaS"],
    functionTags: ["採用", "チェックリスト"],
    moduleTags: ["LLM"],
    oneLiner: "職種メモから入社チェックリストを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "内部通報の受付メモ整理",
    slug: { _type: "slug" as const, current: "internal-report-intake-memo" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "legal" as const,
    inputPlaceholder: "通報窓口が聞き取った内容のメモを入力してください（個人名は伏せて可）",
    mockOutputPrimary: `## 1. 受付メモ（整理稿）

- 区分のたたき台: ハラスメント疑い／コンプライアンス／その他（要確認）
- 時系列・事実関係: 申告者の主張の要約（推測は書かない）
- 緊急度: 安全・法令上の緊急性の有無（所見）`,
    mockOutputSecondary: `## 2. 次ステップ案

一次担当の割当。関係者への接触禁止・証拠保全の要否。外部窓口への相談タイミング。`,
    systemPrompt: "あなたは内部通報の受付メモを整理するアシスタントです。真偽の断定は行いません。",
    outputStructure: "受付メモ（整理稿）と次ステップ案の2セクションで出力すること。",
    sampleData: [
      "上司の言葉遣いがきつい。具体例は後日メールで送るとのこと",
      "取引先からの接待が過剰ではないか。営業部門の話",
      "個人情報の持ち出しを見たという申告。詳細は曖昧",
    ],
    ctaTitle: "あなたの通報規程に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "聞き取りメモから整理稿と次ステップ案を即作成。受付の記録体裁を揃えます（実運用は社内規程に従ってください）。",
    industryTags: ["士業", "製造", "サービス"],
    functionTags: ["要約", "記録業務"],
    moduleTags: ["LLM"],
    oneLiner: "内部通報の受付メモを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "セキュリティ疑いの初動トリアージメモ",
    slug: { _type: "slug" as const, current: "security-suspicion-triage-memo" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "検知内容・ログ断片・申告文を入力してください",
    mockOutputPrimary: `## 1. トリアージメモ

- 事象: 管理外IPからの管理画面ログイン試行
- 影響範囲: 現時点で成功ログは未確認（入力ベース）
- 深刻度のたたき台: 中。認証ログの保全を最優先`,
    mockOutputSecondary: `## 2. 即時アクション案

アカウント一時ロックの要否。ログ保全範囲。CSIRT/ベンダー連絡。顧客連絡の閾値。`,
    systemPrompt: "あなたはセキュリティ疑いの初動向けトリアージメモを作成するアシスタントです。",
    outputStructure: "トリアージメモと即時アクション案の2セクションで出力すること。",
    sampleData: [
      "WAFで大量の404のあと管理URLにPOSTが来ている",
      "従業員が怪しいメールを転送してきた。添付は開いていない",
      "クラウドの通知で異常なAPI呼び出し",
    ],
    ctaTitle: "あなたのインシデント手順に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "断片情報からトリアージメモと即時アクション案を即整理。初動の抜け漏れを減らします。",
    industryTags: ["SaaS", "金融", "製造"],
    functionTags: ["要約", "報告書生成"],
    moduleTags: ["LLM"],
    oneLiner: "セキュリティ疑いの初動メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "原文メモから翻訳依頼ブリーフ",
    slug: { _type: "slug" as const, current: "translation-brief-from-notes" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "翻訳したい内容のメモ、用途、言語ペアを入力してください",
    mockOutputPrimary: `## 1. 翻訳依頼ブリーフ

- 言語: 日本語→英語
- 用途: 海外子会社向けマニュアル更新
- トーン: 敬語禁止。手順は命令形で統一
- 禁止訳: 製品名〇〇はカタカナのまま`,
    mockOutputSecondary: `## 2. ベンダーへの確認事項

納期、字数単価、用語集の有無、レイアウト再現の範囲、機密保持。`,
    systemPrompt: "あなたは翻訳依頼のブリーフを作成するアシスタントです。",
    outputStructure: "翻訳依頼ブリーフとベンダーへの確認事項の2セクションで出力すること。",
    sampleData: [
      "契約書の概要を社内説明用に英語で。厳密な法訳ではない",
      "マーケのキャッチコピー。短く。複数案",
      "技術仕様書の一部。専門用語は既存の対訳表に合わせたい",
    ],
    ctaTitle: "あなたの翻訳発注フローに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "メモから依頼ブリーフと確認事項を即作成。ベンダー折衝の手戻りを減らします。",
    industryTags: ["士業", "製造", "SaaS"],
    functionTags: ["文書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "翻訳依頼のブリーフを即作成",
  },
];
