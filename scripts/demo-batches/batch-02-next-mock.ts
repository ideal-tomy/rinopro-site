/**
 * バッチ02: 追加10本モック（runMode: mock_preview 固定）
 * タクソノミー上の空き（audio_text / image_text / 検索要約・問い合わせの業種展開）を優先。
 */

export const batch02NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "朝礼メモから日報ドラフト",
    slug: { _type: "slug" as const, current: "morning-meeting-daily-draft" },
    industry: "construction" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "朝礼で話した内容を音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. 日報ドラフト

- 日付: 本日
- 天候・安全KY: 実施済み。特記事項なし
- 本日の作業: 外壁下地。養生確認と補修1箇所
- 使用機材: 足場・高所作業車
- 人数・体制: 常勤6名、協力会社4名`,
    mockOutputSecondary: `## 2. 現場共有メモ

朝礼で共有: 午後から風速注意。養生剥がれ箇所は補修完了まで近寄らないこと。`,
    systemPrompt: "あなたは朝礼内容から日報ドラフトを作成するアシスタントです。",
    outputStructure: "日報ドラフトと現場共有メモの2セクションで出力すること。",
    sampleData: [
      "朝礼で風速注意と養生の話。午後は外壁続き。KYは問題なし",
      "新人2名入場。安全靴とヘルメット確認。今日は内装の搬入",
      "雨天のため午前は屋内。午後から天候見て外壁再開の予定",
    ],
    ctaTitle: "あなたの日報フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "朝礼の内容を入力するだけで、日報ドラフトと現場共有メモを即生成。帰社後の記録作業を短縮します。",
    industryTags: ["建設", "製造"],
    functionTags: ["音声入力", "報告書生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "朝礼メモから日報を即ドラフト",
  },
  {
    _type: "aiDemo" as const,
    title: "店頭接客ボイスメモの共有整理",
    slug: { _type: "slug" as const, current: "retail-floor-voice-handoff" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "接客の要点を音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. 接客サマリ

- ご来店目的: サイズ交換の相談
- 顧客の関心: 在庫と納期
- 提案内容: 代替サイズを試着案内。次回取り寄せも説明
- 結果: 代替を購入意向。明日まで保留`,
    mockOutputSecondary: `## 2. 本部・翌番共有メモ

在庫は倉庫に残1。明日までフォローコール。クレームではなく要望レベル。`,
    systemPrompt: "あなたは店頭接客のボイスメモを共有向けに整理するアシスタントです。",
    outputStructure: "接客サマリと本部・翌番共有メモの2セクションで出力すること。",
    sampleData: [
      "お客様がサイズ違いで交換希望。在庫はあるが色が微妙とのこと",
      "常連の方。新商品の予約を聞かれた。発売日は来週",
      "クレームではないが配送が1日遅れたと不満。お詫びと次回特典を案内",
    ],
    ctaTitle: "あなたの店舗報告フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "接客メモからサマリと共有メモを即整理。シフト引き継ぎと本部報告を速くします。",
    industryTags: ["小売", "飲食", "サービス"],
    functionTags: ["音声入力", "引継ぎ"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "接客メモを共有用に即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "ドライバー音声から配送インシデント草案",
    slug: { _type: "slug" as const, current: "driver-voice-incident-draft" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "現場の状況を音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. インシデント報告書（草案）

- 発生日時: 本日 14:20頃
- 便・ルート: 〇〇便。△△エリア配送中
- 概要: 荷降し時にパレット一角破損の可能性
- 直応: 配送継続可否を上司に確認。写真取得済み
- 顧客影響: 該当1件。到着遅延見込み30分`,
    mockOutputSecondary: `## 2. 荷主連絡メモ（草案）

配送遅延のお詫びと到着見込み時刻の連絡。破損の有無は開梱後にご確認いただく旨。`,
    systemPrompt: "あなたはドライバー報告から配送インシデント報告の草案を作るアシスタントです。",
    outputStructure: "インシデント報告書（草案）と荷主連絡メモ（草案）の2セクションで出力すること。",
    sampleData: [
      "14時過ぎ、卸先でパレットが擦った。商品は見た目問題なさそうだが一応報告",
      "渋滞で30分遅れ。3件目以降に影響。顧客には連絡済み",
      "車両のエンジン警告灯。サービス入場。本日の便は代替で対応",
    ],
    ctaTitle: "あなたの配送報告フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "音声メモからインシデント報告と荷主連絡の草案を即作成。記録の抜け漏れを減らします。",
    industryTags: ["物流", "小売"],
    functionTags: ["音声入力", "報告書生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "ドライバー報告からインシデント草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "外観・共用部写真から物件状況メモ",
    slug: { _type: "slug" as const, current: "property-exterior-photo-memo" },
    industry: "legal" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "写真をアップロードし、棟・部屋・目的をテキストで補足してください",
    mockOutputPrimary: `## 1. 状況記録メモ

- 撮影箇所: 外観北面・共用廊下
- 確認できた点: 外壁塗装の経年色あせ。ひびは目立つものなし
- 気になる点: 排水溝周りに落ち葉堆積。清掃推奨
- 総合: 構造上の即時指摘はなし。詳細は専門業者確認を推奨`,
    mockOutputSecondary: `## 2. 次アクション

管理会社へ清掃依頼の可否確認。内見説明時に「経年」について一言補足する。`,
    systemPrompt: "あなたは不動産物件の写真と補足から状況記録メモを作成するアシスタントです。",
    outputStructure: "状況記録メモと次アクションの2セクションで出力すること。",
    sampleData: [
      "2階建て戸建の外観。内見前の記録用。築15年",
      "マンション共用廊下。照明と床の汚れが気になる",
      "駐車場から見た外壁。雨樋の位置を確認したい",
    ],
    ctaTitle: "あなたの物件記録フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真と短いメモから状況記録と次アクションを即整理。内見・契約前の共有を速くします。",
    industryTags: ["不動産", "士業"],
    functionTags: ["画像入力", "案件整理"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "物件写真から状況メモを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "納品写真から配送完了レポート",
    slug: { _type: "slug" as const, current: "delivery-photo-completion-report" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "納品現場の写真をアップロードし、便名・数量をテキストで補足してください",
    mockOutputPrimary: `## 1. 配送完了レポート

- 納品日時: 本日（入力より）
- 荷姿: 段ボール6箱。破損見当たらず
- 受領: 受付に署名済み
- 特記: 搬入経路に段差あり。手押し車使用`,
    mockOutputSecondary: `## 2. 異常時用メモ（該当なしテンプレ）

異常なし。万一開梱後に破損が判明した場合は写真番号と届出窓口を記載する。`,
    systemPrompt: "あなたは納品写真と補足から配送完了レポートを作成するアシスタントです。",
    outputStructure: "配送完了レポートと異常時用メモの2セクションで出力すること。",
    sampleData: [
      "6箱まとめて納品。受付でサイン済み。エレベーター利用",
      "店舗裏口納品。雨のためビニールかぶせあり",
      "大型1パレット。フォークリフト搬入。時間どおり完了",
    ],
    ctaTitle: "あなたの配送レポート形式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "納品写真とメモから完了レポートを即作成。トラブル時の記録も抜けにくくします。",
    industryTags: ["物流", "製造", "小売"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "納品写真から完了レポートを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "一般問い合わせの返信骨子（注意書き付き）",
    slug: { _type: "slug" as const, current: "clinic-general-inquiry-skeleton" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "care" as const,
    inputPlaceholder: "患者・利用者からの質問文を入力してください（個人名は伏せて可）",
    mockOutputPrimary: `## 1. 返信骨子（一般案内）

- お礼と受領の確認
- 一般的な説明（待ち時間・持ち物・受付の流れなど、質問に対応する範囲）
- 個別の診断・治療内容はお答えできない旨を明記
- 不安が強い場合は窓口・電話での相談を案内`,
    mockOutputSecondary: `## 2. 院内共有メモ

問い合わせの種類（初診／検査結果など）。テンプレ更新の要否。対応担当の引き継ぎ事項。`,
    systemPrompt: "あなたは医療・健診施設の一般問い合わせに対する返信骨子を作成するアシスタントです。診断や治療の断定は行いません。",
    outputStructure: "返信骨子（一般案内）と院内共有メモの2セクションで出力すること。",
    sampleData: [
      "初診で何を持っていけばいいか。待ち時間はどのくらいか",
      "検査結果が気になる。ネットで調べた症状と一致するか教えてほしい",
      "予約変更したい。キャンセル料はかかるか",
    ],
    ctaTitle: "あなたの問い合わせ対応方針に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "質問文から返信骨子と院内メモを即整理。個別医療判断は避け、案内業務の負荷を下げます（実運用では院内規程に従ってください）。",
    industryTags: ["医療", "介護"],
    functionTags: ["問い合わせ対応", "返信生成"],
    moduleTags: ["LLM"],
    oneLiner: "一般問い合わせの返信骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "窓口・電話問い合わせの回答骨子",
    slug: { _type: "slug" as const, current: "civic-counter-reply-outline" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "legal" as const,
    inputPlaceholder: "市民・利用者からの質問内容を入力してください",
    mockOutputPrimary: `## 1. 回答骨子（来庁・電話用）

- 受付の挨拶と確認（用件の要約）
- 根拠となる制度・手続の要点（一般論）
- 必要書類・窓口・申請期限の案内
- 個別案件の確定判断は担当部署確認が必要な旨`,
    mockOutputSecondary: `## 2. 法令・要確認メモ

関連しそうな条例・通達の確認ポイント。エスカレ先。記録に残す質問の要約。`,
    systemPrompt: "あなたは自治体・公的窓口の問い合わせに対する回答骨子を作成するアシスタントです。",
    outputStructure: "回答骨子（来庁・電話用）と法令・要確認メモの2セクションで出力すること。",
    sampleData: [
      "転入手続きに必要な書類と市役所の窓口番号を知りたい",
      "補助金の申請はまだ間に合うか。収入要件があるか",
      "ゴミの出し方が分からない。大型ごみの予約方法",
    ],
    ctaTitle: "あなたの窓口マニュアルに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "質問内容から回答骨子と確認メモを即整理。初任者でも抜け漏れなく案内しやすくします。",
    industryTags: ["自治体"],
    functionTags: ["問い合わせ対応", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "窓口質問から回答骨子を即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "仕様確認メールの返信草案",
    slug: { _type: "slug" as const, current: "b2b-spec-clarification-reply" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "顧客からの仕様・見積に関する質問文を入力してください",
    mockOutputPrimary: `## 1. 顧客向け返信草案

- 質問の受領確認
- 回答できる事項（納期目安、対応範囲、オプションの有無）
- 追加で必要な情報（図面版、数量、環境条件など）
- 次回連絡の目安`,
    mockOutputSecondary: `## 2. 社内確認チェックリスト

技術: 仕様の解釈は設計と一致か。営業: 見積条件の前提は妥当か。製造: ロットとキャパの余裕。`,
    systemPrompt: "あなたはB2Bの仕様確認メールに対する返信草案を作成するアシスタントです。",
    outputStructure: "顧客向け返信草案と社内確認チェックリストの2セクションで出力すること。",
    sampleData: [
      "見積の納期は条件付きか。サンプル提供は可能か",
      "材質をステンレスに変えた場合の価格差とリードタイム",
      "既製品とカスタムの境界。どこまでが標準対応か",
    ],
    ctaTitle: "あなたの営業テンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "顧客の質問から返信草案と社内確認リストを即作成。営業と技術の握り合わせを短縮します。",
    industryTags: ["製造", "商社", "SaaS"],
    functionTags: ["問い合わせ対応", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "仕様確認メールの返信草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "作業手順の該当箇所要約",
    slug: { _type: "slug" as const, current: "ops-manual-spot-summary" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "知りたい作業名と、手順書から抜き出した文章（またはページ要点）を入力してください",
    mockOutputPrimary: `## 1. 手順サマリ

- 対象作業: ロックアウト手順
- 手順の流れ（3〜5行）: 停止→表示→解除→再開前確認
- 必須装備: 保護具、専用キー
- 禁止事項: 一人作業での復帰`,
    mockOutputSecondary: `## 2. 安全・品質チェックポイント

復帰前の試運転条件。記録に残す項目。異常時の第一連絡先。`,
    systemPrompt: "あなたは作業手順書の抜粋から現場向けサマリを作成するアシスタントです。",
    outputStructure: "手順サマリと安全・品質チェックポイントの2セクションで出力すること。",
    sampleData: [
      "清掃後のライン再開手順。CIPの記録が必要な箇所だけ知りたい",
      "フォークリフトの日常点検。油圧とタイヤの確認項目",
      "異物混入時の隔離と報告ルート。手順書の該当章の要約",
    ],
    ctaTitle: "あなたのマニュアル体裁に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "手順書の抜粋からサマリとチェックポイントを即作成。現場確認と教育を短時間にします。",
    industryTags: ["製造", "物流", "建設"],
    functionTags: ["要約", "マニュアル"],
    moduleTags: ["LLM"],
    oneLiner: "手順書の該当箇所を即サマリ",
  },
  {
    _type: "aiDemo" as const,
    title: "類似チケット要約と返信たたき台",
    slug: { _type: "slug" as const, current: "helpdesk-similar-ticket-summary" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "新規チケットの内容と、過去に近い事例メモを入力してください",
    mockOutputPrimary: `## 1. 類似事例サマリ

- 今回の症状: VPN接続後に社内アプリのみ不安定
- 過去事例: 証明書期限切れが2件。ルート変更が1件
- 共通点: 端末は同型。OS更新直後に多い`,
    mockOutputSecondary: `## 2. 返信たたき台・エスカレ条件

まず証明書と日付を確認する案内文。解消しない場合はネットワーク担当へ。緊急度は中。`,
    systemPrompt: "あなたは社内ヘルプデスク向けに類似チケットの要約と返信たたき台を作成するアシスタントです。",
    outputStructure: "類似事例サマリと返信たたき台・エスカレ条件の2セクションで出力すること。",
    sampleData: [
      "VPNは繋がるが共有ドライブが開けない。先週同じ部署で似た件があった",
      "メールが遅延。過去にサーバメンテと混同した事例あり",
      "新入社員アカウントで二段階認証が通らない。手順書どおり実施済み",
    ],
    ctaTitle: "あなたのチケット運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "新規チケットと過去メモから類似整理と返信たたき台を即作成。一次対応の速度を上げます。",
    industryTags: ["SaaS", "士業"],
    functionTags: ["要約", "問い合わせ対応"],
    moduleTags: ["LLM"],
    oneLiner: "類似チケットを要約し返信のたたき台に",
  },
];
