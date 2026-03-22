/**
 * バッチ07: 追加10本モック（runMode: mock_preview 固定）
 */

export const batch07NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "プライバシー通知の改定骨子",
    slug: { _type: "slug" as const, current: "privacy-notice-update-draft" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "legal" as const,
    inputPlaceholder: "改定理由・新しい取扱い・対象サービスをメモで入力してください",
    mockOutputPrimary: `## 1. プライバシー通知（改定骨子）

- 改定日・施行日
- 取得する情報の追加・変更点の要約
- 利用目的の追加・変更
- 第三者提供・委託の変更がある場合の説明枠
- 問い合わせ窓口`,
    mockOutputSecondary: `## 2. 社内・法務確認メモ

同意の取得要否。既存ユーザーへの周知方法。関連規程（社内規程）との整合。`,
    systemPrompt: "あなたは個人情報保護方針・プライバシー通知の改定骨子を作成するアシスタントです。最終文面の法的妥当性は担当者が確認します。",
    outputStructure: "プライバシー通知（改定骨子）と社内・法務確認メモの2セクションで出力すること。",
    sampleData: [
      "解析用のCookieを追加。オプトアウトの導線を明示したい",
      "グループ会社間での共有範囲を明確化",
      "新サービス立ち上げに伴い、取得項目が増える",
    ],
    ctaTitle: "あなたの法務チェックフローに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "改定ポイントのメモから通知の骨子と確認事項を即整理。周知文書のたたき台を速く作れます。",
    industryTags: ["SaaS", "サービス", "小売"],
    functionTags: ["契約レビュー", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "プライバシー通知の改定骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "退去時の原状回復説明の骨子",
    slug: { _type: "slug" as const, current: "lease-moveout-explanation-draft" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "real_estate" as const,
    inputPlaceholder: "物件の状況・契約上の取り決めメモを入力してください",
    mockOutputPrimary: `## 1. 入居者向け説明文（骨子）

- 退去立会いの日程案内
- 原状回復の一般的な考え方（契約・特約に基づく）
- 負担区分の例（通常損耗とそれ以外の切り分けの説明枠）
- 連絡先・次のステップ`,
    mockOutputSecondary: `## 2. 社内・オーナー共有メモ

リスクになりそうな箇所。写真で残すべきポイント。修繕見積の取得要否。`,
    systemPrompt: "あなたは賃貸退去に関する入居者向け説明文の骨子を作成するアシスタントです。個別契約の解釈は断定しません。",
    outputStructure: "入居者向け説明文（骨子）と社内・オーナー共有メモの2セクションで出力すること。",
    sampleData: [
      "築15年。壁紙の汚れとフローリングの傷が論点",
      "ペット飼育あり。特約でクロス全面負担の記載",
      "エアコンは残置。取り外し痕の説明が必要",
    ],
    ctaTitle: "あなたの管理物件フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "状況メモから説明の骨子と社内共有事項を即整理。退去対応の説明負荷を下げます。",
    industryTags: ["不動産", "士業"],
    functionTags: ["文書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "退去時の説明骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "学会参加メモから報告書骨子",
    slug: { _type: "slug" as const, current: "conference-trip-report-outline" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "参加したセッション・所感・出張目的をメモで入力してください",
    mockOutputPrimary: `## 1. 参加報告（骨子）

- 目的と概要（学会名・期間・自分の発表の有無）
- 得られた知見・トレンド（3点以内）
- 自社・研究開発への示唆
- 次のアクション（資料共有、社内勉強会など）`,
    mockOutputSecondary: `## 2. 経理・申請メモ

交通宿泊の領収書添付リスト。出張規程での申請期限。共著者・謝辞の記載要否。`,
    systemPrompt: "あなたは学会・カンファレンス参加のメモから報告書の骨子を作成するアシスタントです。",
    outputStructure: "参加報告（骨子）と経理・申請メモの2セクションで出力すること。",
    sampleData: [
      "医療AIの特別セッション。規制の話が中心だった",
      "ポスター発表あり。名刺20枚。フォローアップ3件",
      "社費で参加。次回は共著者と分担したい",
    ],
    ctaTitle: "あなたの社内報告様式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "メモから報告の骨子と申請チェックを即整理。出張後の事務処理を速くします。",
    industryTags: ["医療", "製造", "士業"],
    functionTags: ["報告書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "学会参加メモから報告骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "補助金申請の論点チェックリスト",
    slug: { _type: "slug" as const, current: "subsidy-application-topic-checklist" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "募集要領の要点または申請予定事業のメモを入力してください",
    mockOutputPrimary: `## 1. 論点チェックリスト

- 採択要件との適合（対象地域・業種・事業段階）
- 経費の対象・非対象の切り分け
- 必要書類（登記簿、納税証明、見積、事業計画）
- スケジュール（公募締切、実績報告）`,
    mockOutputSecondary: `## 2. ギャップ・リスクメモ

要件に曖昧な項目。追記が必要な数値根拠。他制度との重複申請の有無。`,
    systemPrompt: "あなたは補助金・助成金申請の準備用に論点チェックリストを作成するアシスタントです。採択可否は判断しません。",
    outputStructure: "論点チェックリストとギャップ・リスクメモの2セクションで出力すること。",
    sampleData: [
      "設備投資系。既に別枠で申請中の案件がある",
      "人材育成。研修費は対象か要確認",
      "デジタル化。クラウド費用の按分が課題",
    ],
    ctaTitle: "あなたの申請フローに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "要領とメモからチェックリストとリスクメモを即作成。申請準備の抜け漏れを減らします。",
    industryTags: ["製造", "小売", "士業"],
    functionTags: ["チェックリスト", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "補助金申請の論点を即チェックリスト化",
  },
  {
    _type: "aiDemo" as const,
    title: "ペット預かり引き渡しボイスメモ",
    slug: { _type: "slug" as const, current: "pet-hotel-handover-voice-memo" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "real_estate" as const,
    inputPlaceholder: "預かり中の様子や注意事項を音声で話すか、メモを入力してください",
    mockOutputPrimary: `## 1. お迎え時サマリ

- 体調・食欲: 良好。排便は通常
- 行動: 他犬との距離は保てる。吠えは入室直後のみ
- 与薬: 朝夕問題なく実施（入力ベース）`,
    mockOutputSecondary: `## 2. 次回利用向けメモ

苦手なしつけ項目。フードの残量。次回予約の希望時間帯。`,
    systemPrompt: "あなたはペットホテル・サロンなどの引き渡し用に音声メモを整理するアシスタントです。診断は行いません。",
    outputStructure: "お迎え時サマリと次回利用向けメモの2セクションで出力すること。",
    sampleData: [
      "今日はよく遊んだ。夕方少し興奮気味だった",
      "初日は食事が遅かったが翌日から平常",
      "耳の掃除は未実施。オーナー希望で次回に",
    ],
    ctaTitle: "あなたのカルテ様式に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "音声メモからお迎え時のサマリと次回メモを即整理。引き渡しの説明を短時間にまとめます。",
    industryTags: ["サービス", "小売"],
    functionTags: ["音声入力", "記録業務"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "ペット預かりの引き渡しメモを即整理",
  },
  {
    _type: "aiDemo" as const,
    title: "展示解説のナレーション原稿たたき台",
    slug: { _type: "slug" as const, current: "gallery-exhibit-voice-script-draft" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "展示の要点を音声で話すか、箇条書きで入力してください",
    mockOutputPrimary: `## 1. ナレーション原稿（たたき台・90秒想定）

- 導入: 展示の位置づけと見どころ
- 本論: 作品（資料）の背景と見方の手がかり
- 締め: 関連展示への誘導`,
    mockOutputSecondary: `## 2. キャプション・注意書きメモ

年号・作家名の表記統一。撮影可否の一文。児童向けの言い換え案。`,
    systemPrompt: "あなたは美術館・博物館向けに展示解説のナレーションたたき台を作成するアシスタントです。学術的断定は避け、一般向けに書く。",
    outputStructure: "ナレーション原稿（たたき台・90秒想定）とキャプション・注意書きメモの2セクションで出力すること。",
    sampleData: [
      "地域出土の土器。同時期の他地域との違いを話したい",
      "現代美術。作家の意図はインタビューベースで",
      "子ども向けツアー用。専門用語を減らす",
    ],
    ctaTitle: "あなたの館のトーンに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "学芸メモからナレーションとキャプション注意を即草案。音声ガイド・動画台本の初稿を速くします。",
    industryTags: ["教育", "観光"],
    functionTags: ["音声入力", "資料作成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "展示解説のナレーションたたき台を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "現場写真から5S指摘メモ",
    slug: { _type: "slug" as const, current: "gemba-5s-photo-findings-memo" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "工場・倉庫の写真をアップロードし、エリア名をテキストで補足してください",
    mockOutputPrimary: `## 1. 5S観点の指摘メモ

- 整理: 不要品の混在の可能性（仮置きのまま）
- 整頓: 工具の定位置からのずれ
- 清掃: 床の粉塵、油のにじみ
- 清潔・躾: 表示物の脱落、通路占有`,
    mockOutputSecondary: `## 2. 改善依頼文（班長向け）

指摘の優先度（高: 安全関連）。期限案。再点検日。`,
    systemPrompt: "あなたは工場・倉庫の写真と補足から5S巡視の指摘メモのたたき台を作成するアシスタントです。",
    outputStructure: "5S観点の指摘メモと改善依頼文（班長向け）の2セクションで出力すること。",
    sampleData: [
      "組立ライン横の工具棚。引き出しが一つ開きっぱなし",
      "倉庫通路。パレットがラインをはみ出している",
      "休憩室。私物と備品が同じ棚にある",
    ],
    ctaTitle: "あなたの巡視シートに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真から5S指摘と班長向け依頼文を即整理。現場改善の記録を揃えます。",
    industryTags: ["製造", "物流"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "現場写真から5S指摘メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "駐車トラブル写真から連絡メモ",
    slug: { _type: "slug" as const, current: "parking-violation-photo-contact-memo" },
    industry: "legal" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "駐車状況の写真をアップロードし、物件名・規約のメモをテキストで補足してください",
    mockOutputPrimary: `## 1. 状況記録メモ

- 撮影日時・場所（入力より）
- 写真から読み取れる状況: 他区画はみ出し、無断駐車の可能性
- 車両特定: ナンバーは記録用に別途（プライバシー配慮の注意）`,
    mockOutputSecondary: `## 2. 管理会社・オーナー向け連絡骨子

事実の記載。規約上の根拠の確認依頼。是正期限の設定案。`,
    systemPrompt: "あなたは駐車場トラブルの写真と補足から連絡用メモを作成するアシスタントです。相手方への断定は避ける。",
    outputStructure: "状況記録メモと管理会社・オーナー向け連絡骨子の2セクションで出力すること。",
    sampleData: [
      "マンション访客用。常駐車が占拠している",
      "契約区画に別ナンバー。夜間撮影",
      "消防庁前に車両。規約上の禁止箇所か確認したい",
    ],
    ctaTitle: "あなたの管理連絡フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真とメモから記録と連絡骨子を即作成。駐車トラブルの初動を揃えます。",
    industryTags: ["不動産", "自治体"],
    functionTags: ["画像入力", "文書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "駐車トラブル写真から連絡メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "退職ヒアリングからナレッジQ&A草案",
    slug: { _type: "slug" as const, current: "exit-knowledge-qa-draft" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "退職者ヒアリングのメモを入力してください",
    mockOutputPrimary: `## 1. ナレッジQ&A（草案）

**Q:** 〇〇システムの権限申請は誰に依頼するか  
**A:** 情シス窓口。申請フォームは△△。承認は部門長。

**Q:** 取引先Aの例外運用は  
**A:** 月末のみ紙FAX。担当は□□部。`,
    mockOutputSecondary: `## 2. 公開範囲・機密メモ

社外秘の項目。個人名のマスキング要否。Wikiへの転載前のレビュー担当。`,
    systemPrompt: "あなたは退職者ヒアリングメモから引き継ぎ用Q&A草案を作成するアシスタントです。",
    outputStructure: "ナレッジQ&A（草案）と公開範囲・機密メモの2セクションで出力すること。",
    sampleData: [
      "仕入れルートは担当が変わるたびに口頭だけの伝承",
      "顧客Bは請求書の宛名が本社と支社で違う",
      "サーバのバックアップは手動で週1。場所は共有ドライブ",
    ],
    ctaTitle: "あなたのナレッジ管理方針に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "ヒアリングメモからQ&Aと公開時の注意を即整理。暗黙知の形式知化を助けます。",
    industryTags: ["士業", "SaaS", "製造"],
    functionTags: ["要約", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "退職ヒアリングからQ&A草案を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "アクセシビリティ監査メモから優先リスト",
    slug: { _type: "slug" as const, current: "a11y-audit-priority-backlog" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "監査ツールの結果メモや手動確認メモを入力してください",
    mockOutputPrimary: `## 1. 対応優先リスト

- P0（ブロッキング）: 主要フォームのラベル欠落、キーボード操作不能
- P1: コントラスト不足、見出し階層の飛び
- P2: 代替テキストの改善、フォーカス表示の弱さ`,
    mockOutputSecondary: `## 2. リリース・工数メモ

スプリントに載せる候補。デザイン変更が必要な項目。法対応の期限メモ。`,
    systemPrompt: "あなたはアクセシビリティ監査のメモから修正優先度リストを作成するアシスタントです。",
    outputStructure: "対応優先リストとリリース・工数メモの2セクションで出力すること。",
    sampleData: [
      "Lighthouseでコントラストとボタン名が大量に出た",
      "スクリーンリーダーでモーダルにフォーカストラップがない",
      "動画に字幕なし。社内配信のみ",
    ],
    ctaTitle: "あなたのプロダクトバックログ運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "監査メモから優先度付きバックログ案を即整理。アクセシビリティ対応の順序付けを速くします。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["要約", "チェックリスト"],
    moduleTags: ["LLM"],
    oneLiner: "a11y監査メモから優先リストを即作成",
  },
];
