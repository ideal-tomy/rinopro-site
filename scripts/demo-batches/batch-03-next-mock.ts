/**
 * バッチ03: 追加10本モック（runMode: mock_preview 固定）
 * image_text 拡張、audio_text の未踏シーン、オペ・CS・採用・教育系 text を補完。
 */

export const batch03NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "棚卸・陳列写真から差異メモ",
    slug: { _type: "slug" as const, current: "stocktake-photo-variance-memo" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "棚や陳列の写真をアップロードし、SKU・数量のメモをテキストで補足してください",
    mockOutputPrimary: `## 1. 棚卸・差異メモ

- 撮影区分: 売場Aエンド台
- システム在庫との差: 〇〇SKUで実物+2（陳列過多の可能性）
- 破損・期限: △△は賞味期限接近。優先出しを推奨
- 写真で確認できた点: 面付けは基準内。価格POPは1箇所脱落`,
    mockOutputSecondary: `## 2. 本部・物流への共有文

差異SKUと写真番号を添えて共有。過剰分は翌便で調整可否を確認。期限接近品は本日中に売場配置変更を提案。`,
    systemPrompt: "あなたは棚卸・陳列写真と補足から差異メモを作成するアシスタントです。",
    outputStructure: "棚卸・差異メモと本部・物流への共有文の2セクションで出力すること。",
    sampleData: [
      "エンド台の菓子棚。システムより実物が多そう。期限近い商品あり",
      "倉庫のパレット写真。ラベルと数量メモ",
      "売り切れ続出の飲料棚。補充前の記録用",
    ],
    ctaTitle: "あなたの在庫・棚卸フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真とメモから差異整理と共有文を即作成。棚卸ミスと機会損失の発見を早めます。",
    industryTags: ["小売", "EC", "物流"],
    functionTags: ["画像入力", "在庫管理"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "棚卸写真から差異メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "損害写真から事故報告のたたき台",
    slug: { _type: "slug" as const, current: "damage-photo-incident-draft" },
    industry: "legal" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "損害状況の写真をアップロードし、日時・場所をテキストで補足してください",
    mockOutputPrimary: `## 1. 事故・損害報告（たたき台）

- 発見日時・場所: （入力より）
- 損害の概要: 外装パネル凹み、塗装剥がれ。範囲は写真〇枚目参照
- 推定要因: 接触痕の有無、天候影響の可能性は別途確認
- 応急対応: 立入禁止表示、二次被害防止の養生`,
    mockOutputSecondary: `## 2. 保険・関係者連絡メモ

連絡先窓口、証券番号の確認、写真保存。確定責任は調査後とする旨を記載する案内文の骨子。`,
    systemPrompt: "あなたは損害写真と補足から事故報告のたたき台を作成するアシスタントです。法的判断は行いません。",
    outputStructure: "事故・損害報告（たたき台）と保険・関係者連絡メモの2セクションで出力すること。",
    sampleData: [
      "駐車場の柱に車が接触したあと。夕方発見",
      "店舗ガラスにヒビ。原因不明。開店前の記録",
      "倉庫天井から雨染み。台風翌日",
    ],
    ctaTitle: "あなたの報告書形式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真とメモから報告のたたき台と連絡メモを即作成。初動記録を揃えやすくします（最終判断は担当者・専門家に委ねてください）。",
    industryTags: ["保険", "不動産", "小売"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "損害写真から報告のたたき台を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "現地調査ボイスから調査メモ",
    slug: { _type: "slug" as const, current: "site-survey-voice-memo" },
    industry: "construction" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "現地で見た内容を音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. 現地調査メモ

- 対象: 外壁改修候補箇所
- 状況: ひびは幅1mm程度。漏水痕は確認できず
- 周辺: 足場設置スペースに制限。搬入路は北側が有効
- 写真・スケッチ: 東面2箇所、南面1箇所を取得推奨`,
    mockOutputSecondary: `## 2. 見積・設計への引き継ぎ

補修範囲は仮置き。詳細寸法は次回レーザー採寸。安全上、高所作業は別途工程案を要する。`,
    systemPrompt: "あなたは現地調査の音声メモから調査記録を整理するアシスタントです。",
    outputStructure: "現地調査メモと見積・設計への引き継ぎの2セクションで出力すること。",
    sampleData: [
      "外壁のひびは細い。雨染みはなさそう。足場は狭いので北から入れたい",
      "屋上防水の膨れを確認。排水溝は詰まり気味",
      "解体跡の地盤は車両OK。フェンス外しが必要",
    ],
    ctaTitle: "あなたの調査票フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description:
      "現地の音声メモから調査記録と引き継ぎを即整理。帰社後の清書を短時間にします。インタラクティブ体験: /experience/site-survey-voice-memo（Live Sync）。",
    industryTags: ["建設", "士業", "不動産"],
    functionTags: ["音声入力", "報告書生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "現調ボイスから調査メモを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "面談ボイスから記録サマリ",
    slug: { _type: "slug" as const, current: "parent-meeting-voice-summary" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "面談の内容を音声で話すか、要点をテキストで入力してください",
    mockOutputPrimary: `## 1. 面談記録サマリ

- 日時・参加者: （入力より）
- 共有した内容: 学習の進捗、生活面の様子
- 保護者からの希望: 部活動と両立の相談
- 合意したフォロー: 週1の補習案内。次回面談は1ヶ月後`,
    mockOutputSecondary: `## 2. 校内共有・次アクション

学年主任へ共有。補習日程は教務と調整。個人情報の取り扱いに注意。`,
    systemPrompt: "あなたは学校・教育現場の面談メモから記録サマリを作成するアシスタントです。",
    outputStructure: "面談記録サマリと校内共有・次アクションの2セクションで出力すること。",
    sampleData: [
      "三者面談。成績は中位。保護者は英語が心配。塾との両立を相談",
      "欠席が続いていた件。理由は家庭の事情。フォロー計画を説明",
      "進路希望が固まってきた。工業系を希望。体験入学の案内",
    ],
    ctaTitle: "あなたの記録様式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description:
      "面談の音声やメモから記録と共有事項を即整理。文書化の負担を減らします。インタラクティブ体験: /experience/parent-meeting-voice-summary（Live Sync）。",
    industryTags: ["教育"],
    functionTags: ["音声入力", "議事録生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "面談ボイスから記録サマリを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "研修アンケートから改善サマリ",
    slug: { _type: "slug" as const, current: "training-survey-improvement-summary" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "研修後アンケートの自由記述や集計メモを入力してください",
    mockOutputPrimary: `## 1. 改善サマリ

- 満足度の傾向: 実習パートは高評価。資料の字が小さい指摘あり
- 上位要望: 時間配分の見直し、事例を自社業務に近づけてほしい
- 低評価ポイント: 説明が専門用語多め（新人層）`,
    mockOutputSecondary: `## 2. 次回開催アクション

資料のフォントと枚数削減。事例を2パターン用意。アイスブレイク5分を追加。`,
    systemPrompt: "あなたは研修アンケート内容から改善サマリを作成するアシスタントです。",
    outputStructure: "改善サマリと次回開催アクションの2セクションで出力すること。",
    sampleData: [
      "実習は良かった。講義が長くて集中できなかった声が複数",
      "内容は良いが初心者には難しい。もう半日欲しい",
      "講師は分かりやすい。教材のダウンロードリンクが分かりにくい",
    ],
    ctaTitle: "あなたの研修運用フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "アンケートの声から改善点と次回アクションを即整理。研修のPDCAを速く回します。",
    industryTags: ["製造", "サービス", "小売"],
    functionTags: ["要約", "教育"],
    moduleTags: ["LLM"],
    oneLiner: "研修アンケから改善サマリを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "書類選考メモから評価コメント整理",
    slug: { _type: "slug" as const, current: "resume-screening-eval-notes" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "履歴書・職務経歴の所見メモを入力してください",
    mockOutputPrimary: `## 1. 書類選考コメント（整理稿）

- 経験適合: 〇〇業務3年。必須スキルは満たす
- 懸念: 直近の転職間隔が短い。面接で動機確認
- 強み: 数値実績の記載が具体的`,
    mockOutputSecondary: `## 2. 面接依頼・見送りメモ

面接: 動機と定着意向を深掘り。見送りの場合はスキルよりカルチャーフィットで調整。`,
    systemPrompt: "あなたは採用担当の書類選考メモを整理するアシスタントです。",
    outputStructure: "書類選考コメント（整理稿）と面接依頼・見送りメモの2セクションで出力すること。",
    sampleData: [
      "エンジニア志望。スキルセットは合うが実務年数がやや浅い",
      "営業職。実績は良いが業界違い。学習意欲は高そう",
      "事務。資格あり。ブランク1年。理由を確認したい",
    ],
    ctaTitle: "あなたの採用基準に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "断片的なメモから選考コメントと次の打ち手を即整理。採用会議の準備を短縮します。",
    industryTags: ["人材", "士業"],
    functionTags: ["採用", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "書類選考メモを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "店舗巡回所見から改善指示と本部報告",
    slug: { _type: "slug" as const, current: "store-audit-action-hq-report" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "巡回で気づいた点を箇条書きで入力してください",
    mockOutputPrimary: `## 1. 店舗向け改善指示

- 衛生: 冷蔵庫表示の再確認。期限切れ近接品を前に出す
- 接客: レジ待ち列の誘導サインを入口側にも配置
- 安全: 倉庫通路の資材を片付け。当日中に是正`,
    mockOutputSecondary: `## 2. 本部報告サマリ

店番号・日付。良好点はPOP刷新済み。要フォローは冷蔵と通路。週次で再巡回予定。`,
    systemPrompt: "あなたは店舗巡回の所見から改善指示と本部報告を作成するアシスタントです。",
    outputStructure: "店舗向け改善指示と本部報告サマリの2セクションで出力すること。",
    sampleData: [
      "レジ3台中1台故障。客足は多い。冷蔵の賞味期限ラベルが見づらい",
      "スタッフの制服着用はOK。バックヤードの床が滑りやすい",
      "POPは新しい。欠品が2SKU。発注履歴を確認したい",
    ],
    ctaTitle: "あなたの監査シートに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "巡回メモから店舗指示と本部報告を即作成。現場と本社の認識合わせを速くします。",
    industryTags: ["小売", "飲食", "サービス"],
    functionTags: ["報告書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "巡回所見から指示と本部報告を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "解約検討の問い合わせに返信草案",
    slug: { _type: "slug" as const, current: "saas-churn-intent-reply-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "cs_support" as const,
    inputPlaceholder: "顧客からの解約・ダウングレード意向のメッセージを入力してください",
    mockOutputPrimary: `## 1. 顧客向け返信草案

- お問い合わせの受領とお詫び（負担がかかった点の共感）
- 理由のヒアリングを丁寧に依頼（選択肢でも可）
- 代替案の提示（プラン変更、一時休止、オンボーディング支援など一般例）
- 次の打ち合わせまたは資料送付の提案`,
    mockOutputSecondary: `## 2. CS・営業共有メモ

顧客セグメント、利用状況メモ、失注リスク、フォロー担当と期限。`,
    systemPrompt: "あなたはSaaSの解約・ダウングレード意向に対する返信草案を作成するアシスタントです。",
    outputStructure: "顧客向け返信草案とCS・営業共有メモの2セクションで出力すること。",
    sampleData: [
      "予算削減で来月末に解約したい。データのエクスポート方法を教えてほしい",
      "使いこなせていない。もっと簡単にしたい",
      "他社と比較中。機能差を一覧でほしい",
    ],
    ctaTitle: "あなたのカスタマーサクセス方針に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "解約検討の連絡から返信案と社内共有メモを即作成。離反防止の初動を揃えます。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["問い合わせ対応", "返信生成"],
    moduleTags: ["LLM"],
    oneLiner: "解約検討の連絡に返信草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "宿泊レビューへの返信草案",
    slug: { _type: "slug" as const, current: "hospitality-review-reply-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "real_estate" as const,
    inputPlaceholder: "ゲストのレビュー全文を入力してください",
    mockOutputPrimary: `## 1. 公開返信草案

- お礼と宿泊のお礼
- 具体的な良かった点への言及
- 改善点がある場合は真摯な受け止めと次回への改善の一言
- 署名は施設名・担当`,
    mockOutputSecondary: `## 2. 館内改善メモ

清掃・設備・朝食のどこに課題か。担当部署と優先度。個人名は出さない。`,
    systemPrompt: "あなたは宿泊施設のレビューに対する返信草案を作成するアシスタントです。",
    outputStructure: "公開返信草案と館内改善メモの2セクションで出力すること。",
    sampleData: [
      "部屋は綺麗。スタッフが親切。ただしエレベーターが遅い",
      "立地最高。シャワーの水圧が弱かった",
      "コスパ良し。また来たい。朝食のバリエーションがもっとあると嬉しい",
    ],
    ctaTitle: "あなたのブランドトーンに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "レビューから公開返信と館内改善メモを即作成。口コミ対応のスピードと品質を上げます。",
    industryTags: ["宿泊", "観光", "サービス"],
    functionTags: ["返信生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "宿泊レビューの返信草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "障害対応の顧客向けお知らせ草案",
    slug: { _type: "slug" as const, current: "outage-customer-notice-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "障害の事実・影響範囲・対応状況のメモを入力してください",
    mockOutputPrimary: `## 1. 顧客向けお知らせ（草案）

- 発生時刻と現在の状況（復旧済み／作業中）
- 影響範囲（サービス名、一部機能など）
- 回避策または代替手段があれば記載
- お詫びと問い合わせ窓口`,
    mockOutputSecondary: `## 2. 社内インシデントメモ

タイムライン要約、原因区分（調査中）、再発防止の起票要否、承認フロー。`,
    systemPrompt: "あなたはシステム障害の顧客向けお知らせ草案を作成するアシスタントです。",
    outputStructure: "顧客向けお知らせ（草案）と社内インシデントメモの2セクションで出力すること。",
    sampleData: [
      "APIが30分ダウン。既に復旧。認証だけ遅延していた",
      "夜間メンテを延長。2時間遅れて完了見込み",
      "サードパート障害の影響で決済だけ失敗。回避策は銀行振替",
    ],
    ctaTitle: "あなたのインシデントコミュニケーション方針に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "障害メモから顧客向け文章と社内メモを即作成。初報・復旧報の体裁を揃えます。",
    industryTags: ["SaaS", "金融", "EC"],
    functionTags: ["文書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "障害の顧客向けお知らせを即草案",
  },
];
