/**
 * バッチ08: 追加10本モック（runMode: mock_preview 固定）
 * 約100本到達用の最終バッチ（batch-01〜08 合計90本 + existing 10本 = 100本）
 */

export const batch08NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "鮮度管理のボイスから廃棄ログ草案",
    slug: { _type: "slug" as const, current: "grocery-freshness-voice-waste-log" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "廃棄・値引き・在庫の状況を音声で話すか、メモを入力してください",
    mockOutputPrimary: `## 1. 廃棄・ロス記録（草案）

- 日付・担当: 本日・入力より
- 品目・数量: 葉物〇束、惣菜△パック（賞味当日）
- 理由区分: 鮮度、過剰発注、陳列過多
- 金額目安: （入力があれば要約）`,
    mockOutputSecondary: `## 2. 本部・発注への共有メモ

明日の発注量調整案。人気SKUの陳列面変更。週次レビューで扱う論点。`,
    systemPrompt: "あなたは食品小売の鮮度・廃棄に関する音声メモから記録草案を作成するアシスタントです。",
    outputStructure: "廃棄・ロス記録（草案）と本部・発注への共有メモの2セクションで出力すること。",
    sampleData: [
      "今日の廃棄は葉物が多かった。天気が悪くて客足が少なかった",
      "惣菜の作りすぎ。値引きシールは夕方に貼った",
      "納品が早すぎて売場に乗り切らない。明日は発注を減らす",
    ],
    ctaTitle: "あなたの店舗ログ様式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "口述メモから廃棄記録と改善共有を即整理。ロス可視化の入力を短くします。",
    industryTags: ["小売", "飲食"],
    functionTags: ["音声入力", "報告書生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "鮮度廃棄のボイスからログ草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "OSSライセンス表記のREADME断片",
    slug: { _type: "slug" as const, current: "oss-attribution-readme-snippet" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "利用しているOSS名・ライセンス種別のメモを入力してください",
    mockOutputPrimary: `## 1. NOTICE / Third-party 断片（草案）

本ソフトウェアは以下のオープンソースソフトウェアを含みます。

- 〇〇ライブラリ（ライセンス: MIT） Copyright (c) …
- △△（Apache-2.0）…

各ライセンス全文は同梱の licenses/ フォルダを参照。`,
    mockOutputSecondary: `## 2. 法務・開発確認メモ

GPL系の取り扱い。静的リンクと動的リンクの整理。SBOM出力の要否。`,
    systemPrompt: "あなたは利用OSSのメモからライセンス表記のREADME断片を作成するアシスタントです。最終適合は法務確認が必要です。",
    outputStructure: "NOTICE / Third-party 断片（草案）と法務・開発確認メモの2セクションで出力すること。",
    sampleData: [
      "React、lodash、社内製SDKは除く",
      "画像処理はLGPLのライブラリを動的リンク",
      "商用利用OKの範囲だけ列挙したい",
    ],
    ctaTitle: "あなたのOSS管理ポリシーに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "OSS一覧メモから表記断片と確認事項を即作成。リリース前のライセンス周りを揃えます。",
    industryTags: ["SaaS", "製造"],
    functionTags: ["文書生成", "契約レビュー"],
    moduleTags: ["LLM"],
    oneLiner: "OSS表記のREADME断片を即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "仮設・バリケード写真から安全巡回メモ",
    slug: { _type: "slug" as const, current: "construction-barrier-photo-safety-round" },
    industry: "construction" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "仮囲い・通路の写真をアップロードし、現場名をテキストで補足してください",
    mockOutputPrimary: `## 1. 安全巡回メモ

- 仮囲い: 足元の固定は良好。表示板は設置済み
- 通路: 歩行者誘導のバリケードに一部ずれ
- 夜間: 照明の死角が1箇所。反射材の追加を検討`,
    mockOutputSecondary: `## 2. 是正依頼（協力会社向け骨子）

バリケードの再固定を本日中に。照明死角には反射テープを追加。写真番号〇を参照。`,
    systemPrompt: "あなたは建設現場の仮設・通路の写真と補足から安全巡回メモを作成するアシスタントです。",
    outputStructure: "安全巡回メモと是正依頼（協力会社向け骨子）の2セクションで出力すること。",
    sampleData: [
      "歩道占用の横断工事。夜間はライトが足りなさそう",
      "ゲートの開閉式仮囲い。閉鎖時の鍵の扱いを確認したい",
      "資材置き場が通路に少しはみ出している",
    ],
    ctaTitle: "あなたの安全巡視フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真から巡回記録と是正依頼の骨子を即作成。仮設まわりの指摘を残しやすくします。",
    industryTags: ["建設"],
    functionTags: ["画像入力", "安全管理"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "仮設写真から安全巡回メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "経営会議メモからサマリと宿題",
    slug: { _type: "slug" as const, current: "exec-meeting-notes-to-summary" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "経営会議・取締役会の断片的メモを入力してください",
    mockOutputPrimary: `## 1. 会議サマリ

- 決定: 下期は投資枠を〇〇億に設定。優先はDXと人件費
- 議論の要点: 採用ペースと単価のトレードオフ
- 保留: 子会社の持ち株売却は次回継続`,
    mockOutputSecondary: `## 2. 宿題・フォロー一覧

CFO: 投資案の再試算（期限: 来週）。CHRO: 採用計画の改訂版。法務: 売却案のDD準備状況。`,
    systemPrompt: "あなたは経営会議の断片メモからサマリと宿題一覧を作成するアシスタントです。",
    outputStructure: "会議サマリと宿題・フォロー一覧の2セクションで出力すること。",
    sampleData: [
      "数字の話が長かった。最後は投資の優先順位だけ決まった",
      "子会社の話は時間切れ。次回最初に持ってくる",
      "ガバナンスの話と現場の話が混ざったメモ",
    ],
    ctaTitle: "あなたの議事運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "断片メモからサマリと宿題を即整理。幹部会のフォローを抜けにくくします。",
    industryTags: ["士業", "SaaS", "製造"],
    functionTags: ["議事録生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "経営会議メモからサマリと宿題を即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "寄付感謝レターの草案",
    slug: { _type: "slug" as const, current: "nonprofit-donor-thanks-letter-draft" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "care" as const,
    inputPlaceholder: "寄付者区分・金額帯・使途メモを入力してください（個人名は伏せて可）",
    mockOutputPrimary: `## 1. 感謝レター（草案）

- 冒頭のお礼と活動の一文
- ご支援の使途（具体的な成果イメージ）
- 今後の活動への期待と連絡先
- 差出人・団体名`,
    mockOutputSecondary: `## 2. 事務・税務メモ

領収・寄付金控除に関する記載要否。パーソナライズ版と汎用版の使い分け。`,
    systemPrompt: "あなたはNPO・社団向けの寄付感謝レターの草案を作成するアシスタントです。",
    outputStructure: "感謝レター（草案）と事務・税務メモの2セクションで出力すること。",
    sampleData: [
      "初回寄付の個人。少額。子ども支援プログラム向け",
      "法人からの年次寄付。前年比増",
      "災害義援金。使途は復興支援に限定",
    ],
    ctaTitle: "あなたの団体トーンに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "メモから感謝レターと事務上の注意を即草案。ドナーリレーションの文面化を速くします。",
    industryTags: ["サービス", "教育"],
    functionTags: ["文書生成", "返信生成"],
    moduleTags: ["LLM"],
    oneLiner: "寄付感謝レターを即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "クラファン支援者向け進捗レター草案",
    slug: { _type: "slug" as const, current: "crowdfunding-milestone-update-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "real_estate" as const,
    inputPlaceholder: "達成状況・遅延・次のマイルストーンのメモを入力してください",
    mockOutputPrimary: `## 1. 支援者向け更新文（草案）

- いつも応援ありがとうございます
- 現在の進捗（製造・配送・開発など）
- 遅延がある場合は理由と新しい見込み
- 次回アップデート予定`,
    mockOutputSecondary: `## 2. プラットフォーム・社内メモ

掲載規約に抵触しない表現。返金・規約変更の有無。広報承認。`,
    systemPrompt: "あなたはクラウドファンディングの支援者向け進捗レターの草案を作成するアシスタントです。",
    outputStructure: "支援者向け更新文（草案）とプラットフォーム・社内メモの2セクションで出力すること。",
    sampleData: [
      "原価高で特典の仕様を一部変更したい。了承を得たい",
      "製造は順調。配送は来月から順次",
      "目標未達だが縮小版で継続する旨を伝えたい",
    ],
    ctaTitle: "あなたのプロジェクト文面に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "進捗メモから支援者向け更新と確認事項を即草案。信頼を損なわない連絡のたたき台にします。",
    industryTags: ["小売", "製造", "サービス"],
    functionTags: ["文書生成", "返信生成"],
    moduleTags: ["LLM"],
    oneLiner: "クラファン支援者向け進捗文を即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "発明メモから先行調査の計画書骨子",
    slug: { _type: "slug" as const, current: "patent-search-plan-from-memo" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "legal" as const,
    inputPlaceholder: "発明の要点・差分になりそうな技術メモを入力してください",
    mockOutputPrimary: `## 1. 先行調査計画（骨子）

- 技術分野のIPC/FI分類のたたき台
- キーワード案（同義語・英語併記）
- 検索データベース（特許・非特許）の優先順
- クリアランスと出願戦略の切り分け`,
    mockOutputSecondary: `## 2. 発明者インタビュー論点

先行製品との差分。実施例の具体化が必要な箇所。公開済み情報の有無。`,
    systemPrompt: "あなたは発明メモから特許先行調査の計画骨子を作成するアシスタントです。新規性の判断は行いません。",
    outputStructure: "先行調査計画（骨子）と発明者インタビュー論点の2セクションで出力すること。",
    sampleData: [
      "既存の〇〇装置にセンサーを追加した構成。制御ロジックがポイント",
      "ソフトウェアのみ。UIとアルゴリズムのどちらを主張するか迷う",
      "海外論文に似た記述があるかもしれないと聞いている",
    ],
    ctaTitle: "あなたの知財フローに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "メモから調査計画とヒアリング論点を即整理。出願前のすり合わせを速くします。",
    industryTags: ["士業", "製造", "SaaS"],
    functionTags: ["要約", "資料作成"],
    moduleTags: ["LLM"],
    oneLiner: "発明メモから先行調査計画を即骨子化",
  },
  {
    _type: "aiDemo" as const,
    title: "施策リストからESG開示の数値骨子",
    slug: { _type: "slug" as const, current: "esg-kpi-draft-from-initiatives" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "実施中の環境・社会施策と把握している数値メモを入力してください",
    mockOutputPrimary: `## 1. 開示用KPI骨子

- 環境: スコープ1・2排出量（ベースイヤー比）、再生可能電力比率
- 社会: 女性管理職比率、研修時間、安全強度頻度
- ガバナンス: 取締役の独立性、コンプライアンス研修実施率`,
    mockOutputSecondary: `## 2. データギャップ・収集メモ

未計測の指標。算定方法の統一要否。第三者保証の対象範囲。`,
    systemPrompt: "あなたはESG・サステナビリティ報告向けにKPIの骨子を作成するアシスタントです。数値の正確性は担当部門が確認します。",
    outputStructure: "開示用KPI骨子とデータギャップ・収集メモの2セクションで出力すること。",
    sampleData: [
      "CO2は工場だけ集計済み。オフィスはこれから",
      "ダイバーシティは人数ベースのみ。役職定義がまだ曖昧",
      "サプライヤ監査は年2回。結果はスコア化していない",
    ],
    ctaTitle: "あなたの報告フレームに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "施策メモから開示KPIの骨子とデータギャップを即整理。レポート準備の初稿を速くします。",
    industryTags: ["製造", "商社", "金融"],
    functionTags: ["要約", "報告書生成"],
    moduleTags: ["LLM"],
    oneLiner: "ESG施策メモから開示KPI骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "搬入立ち合いボイスからタイムライン",
    slug: { _type: "slug" as const, current: "venue-loadin-voice-timeline" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "搬入・設営の進行を音声で話すか、メモを入力してください",
    mockOutputPrimary: `## 1. タイムライン（草案）

- 08:00 トラック到着・下ろし開始
- 09:30 ステージ骨組み完了
- 11:00 音響ライン確認。問題なし
- 12:00 昼食。午後は照明フォーカス`,
    mockOutputSecondary: `## 2. リスク・連絡メモ

電源容量の余裕は小。追加機材は要相談。警備との搬入経路確認は未。`,
    systemPrompt: "あなたはイベント搬入・設営の音声メモからタイムライン草案を作成するアシスタントです。",
    outputStructure: "タイムライン（草案）とリスク・連絡メモの2セクションで出力すること。",
    sampleData: [
      "リフトが30分遅れた。ステージは圧縮してなんとか",
      "バンドの機材が想定より重い。床荷重を確認したい",
      "ケータリングの搬入と被った。動線を変えた",
    ],
    ctaTitle: "あなたの進行表フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "立ち合いの音声からタイムラインとリスクメモを即整理。本番前の共有資料を速く作れます。",
    industryTags: ["サービス", "観光"],
    functionTags: ["音声入力", "議事録生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "搬入ボイスからタイムラインを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "医療機器卸の訪問記録草案",
    slug: { _type: "slug" as const, current: "medical-device-visit-report-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "訪問先・商談内容・次アクションのメモを入力してください",
    mockOutputPrimary: `## 1. 訪問記録（CRM貼り付け用草案）

- 訪問先・日時: （入力より）
- 目的: 新製品説明、在庫・納期の確認
- 反応: 評価は前向き。導入は来期予算待ち
- 次アクション: 見積送付、技術資料の共有`,
    mockOutputSecondary: `## 2. コンプライアンスメモ

招待の有無。サンプル提供の記録。競合比較の発言は一般論に留めたか。`,
    systemPrompt: "あなたは医療機器・医薬部外品などの法人営業向けに訪問記録草案を作成するアシスタントです。診療内容の助言は行いません。",
    outputStructure: "訪問記録（CRM貼り付け用草案）とコンプライアンスメモの2セクションで出力すること。",
    sampleData: [
      "病院材料部。新規採用は委員会通過が必要",
      "クリニックチェーン。本部一括ではなく院ごと判断",
      "展示会で名刺交換した先への初回訪問",
    ],
    ctaTitle: "あなたのSFAテンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "メモからCRM用の訪問記録とコンプラ確認を即草案。フィールドセールスの事後入力を短縮します。",
    industryTags: ["医療", "製造", "商社"],
    functionTags: ["報告書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "医療機器卸の訪問記録を即草案",
  },
];
