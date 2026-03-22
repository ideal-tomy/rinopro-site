/**
 * バッチ06: 追加10本モック（runMode: mock_preview 固定）
 */

export const batch06NextMockDemos = [
  {
    _type: "aiDemo" as const,
    title: "要件メモからユーザーストーリー草案",
    slug: { _type: "slug" as const, current: "user-story-draft-from-bullets" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "やりたいことを箇条書きで入力してください",
    mockOutputPrimary: `## 1. ユーザーストーリー案

- 〇〇として、△△したい。なぜなら□□だからだ。
- 管理者として、権限を部門単位で一括付与したい。監査のため履歴が欲しい。
- 利用者として、スマホで承認したい。PCに戻るのが負担だから。`,
    mockOutputSecondary: `## 2. 受け入れ条件・未決メモ

境界条件: オフライン時は不可。未決: 通知チャネルはメールのみか。非機能: 応答2秒以内を目標。`,
    systemPrompt: "あなたは要件の箇条書きからユーザーストーリー案を作成するアシスタントです。",
    outputStructure: "ユーザーストーリー案と受け入れ条件・未決メモの2セクションで出力すること。",
    sampleData: [
      "請求の二段階承認。部門長のあと経理。スマホ対応",
      "在庫アラートをSlackにも飛ばしたい。閾値は倉庫ごと",
      "顧客ポータルに請求PDF。ダウンロード履歴を残す",
    ],
    ctaTitle: "あなたの開発プロセスに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "箇条書きからストーリー案と受け入れ条件のたたき台を即作成。バックログ整備を速くします。",
    industryTags: ["SaaS", "製造"],
    functionTags: ["資料作成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "要件メモからユーザーストーリーを即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "変更メモからリリースノート草案",
    slug: { _type: "slug" as const, current: "release-note-draft-from-ship-list" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "今回のリリースに入った変更・修正を箇条書きで入力してください",
    mockOutputPrimary: `## 1. リリースノート（ユーザー向け）

### 新機能
- レポートに「昨対比」列を追加

### 改善
- 一覧の読み込み速度を改善

### 修正
- 特定条件下で保存に失敗する不具合を修正`,
    mockOutputSecondary: `## 2. 社内メモ（サポート・営業向け）

顧客影響: なし。既知の制限: 旧ブラウザではグラフ非表示。FAQ更新要。`,
    systemPrompt: "あなたはリリース内容のメモからリリースノート草案を作成するアシスタントです。",
    outputStructure: "リリースノート（ユーザー向け）と社内メモ（サポート・営業向け）の2セクションで出力すること。",
    sampleData: [
      "APIのレート制限を緩和。破壊的変更なし",
      "UIの色コントラスト修正。アクセシビリティ",
      "請求ジョブのリトライ回数を増やした。ユーザーには見えない",
    ],
    ctaTitle: "あなたのリリース運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "変更メモから外部向けノートと社内メモを即作成。リリース当日の文書作業を短縮します。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["文書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "変更メモからリリースノートを即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "事業メモから融資面談用の説明骨子",
    slug: { _type: "slug" as const, current: "loan-interview-business-outline" },
    industry: "legal" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "事業内容・売上・資金使途のメモを入力してください",
    mockOutputPrimary: `## 1. 面談用説明骨子（3分版）

- 事業概要: 地域向け〇〇サービス。開業から△年
- 実績: 売上推移、主要顧客層、収益性の要点
- 資金使途: 設備〇〇、運転資金△△。返済原資は□□`,
    mockOutputSecondary: `## 2. 想定質問と準備メモ

担保・保証人の方針。他借入の残高。直近決算のポイント。追加で持参する資料リスト。`,
    systemPrompt: "あなたは中小事業者の融資面談用に事業説明の骨子を作成するアシスタントです。",
    outputStructure: "面談用説明骨子（3分版）と想定質問と準備メモの2セクションで出力すること。",
    sampleData: [
      "飲食店2号店。内装に800万。既存店は黒字",
      "製造の設備更新。受注はあるが手元資金が薄い",
      "IT受託。案件は先行。人件費の前払いが課題",
    ],
    ctaTitle: "あなたの事業説明スタイルに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "事業メモから面談用の骨子と準備事項を即整理。金融機関との対話を整えます。",
    industryTags: ["士業", "飲食", "製造"],
    functionTags: ["資料作成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "融資面談用の事業説明骨子を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "予約状況から仕込みリスト草案",
    slug: { _type: "slug" as const, current: "restaurant-prep-list-from-bookings" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "本日の予約組数・コース・特記事項を入力してください",
    mockOutputPrimary: `## 1. 仕込みリスト（草案）

- だし・スープ: 鍋2本分（予約8組ベース）
- 主菜下処理: 魚〇尾、肉△kg（アレルギー2件は別コンテナ）
- デザート: プレート仕込み14食`,
    mockOutputSecondary: `## 2. 当日注意メモ

アレルギー: 卵1、乳2。早番: 開店1時間前にスープ味見。遅番: コースBの焼き加減確認。`,
    systemPrompt: "あなたは飲食店の予約情報から仕込みリストの草案を作成するアシスタントです。",
    outputStructure: "仕込みリスト（草案）と当日注意メモの2セクションで出力すること。",
    sampleData: [
      "ランチ20、ディナー予約6組。コース3とアラカルト混在",
      "団体30名。ビュッフェ。ベジタリアン5名",
      "通常だが仕入れが魚少なめ。メニュー差し替え検討",
    ],
    ctaTitle: "あなたの店舗オペに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "予約とメモから仕込み案と注意事項を即作成。キッチンの段取りを前日に固めます。",
    industryTags: ["飲食", "小売"],
    functionTags: ["チェックリスト", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "予約状況から仕込みリストを即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "問い合わせスレッドからヘルプ記事草案",
    slug: { _type: "slug" as const, current: "help-article-draft-from-ticket" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "cs_support" as const,
    inputPlaceholder: "よくある問い合わせの内容と回答メモを入力してください",
    mockOutputPrimary: `## 1. ヘルプ記事草案

**タイトル案:** 〇〇ができないときの確認手順

1. 前提条件（対象プラン・権限）
2. 手順（画面名は一般化）
3. それでも解消しない場合の連絡先`,
    mockOutputSecondary: `## 2. 公開前チェックメモ

スクリーンショット要否。個人情報のマスキング。関連記事へのリンク。検索キーワード案。`,
    systemPrompt: "あなたはサポート対応メモからヘルプセンター記事の草案を作成するアシスタントです。",
    outputStructure: "ヘルプ記事草案と公開前チェックメモの2セクションで出力すること。",
    sampleData: [
      "請求書の再発行が月1回しかできないと言われた件。実は権限の話だった",
      "二段階認証の機種変更でハマる。バックアップコードの案内",
      "APIキーのローテ手順。古いキーの失効タイミング",
    ],
    ctaTitle: "あなたのナレッジ基盤に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "問い合わせ対応からヘルプ記事と公開チェックを即草案。ナレッジ化の速度を上げます。",
    industryTags: ["SaaS", "サービス"],
    functionTags: ["要約", "文書生成"],
    moduleTags: ["LLM"],
    oneLiner: "問い合わせからヘルプ記事を即草案",
  },
  {
    _type: "aiDemo" as const,
    title: "モニタリングメモからフィードバック文",
    slug: { _type: "slug" as const, current: "call-monitor-feedback-coaching" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "cs_support" as const,
    inputPlaceholder: "通話監視の所見を音声で話すか、メモをテキストで入力してください",
    mockOutputPrimary: `## 1. オペレーター向けフィードバック（草案）

- 良かった点: 待たせた際の一言お詫びが自然
- 改善点: 確認の復唱が1問飛び。次は番号をゆっくり繰り返す
- 次回目標: クロージングで次のアクション日を明示`,
    mockOutputSecondary: `## 2. 品質管理共有メモ

スコア傾向: 傾聴は高水準。情報確認がやや弱い。研修テーマ案: 復唱トレーニング。`,
    systemPrompt: "あなたはコールセンター品質監視のメモからフィードバック文を作成するアシスタントです。",
    outputStructure: "オペレーター向けフィードバック（草案）と品質管理共有メモの2セクションで出力すること。",
    sampleData: [
      "オープニングは良い。中盤で専門用語が多すぎた",
      "顧客が怒っているのにペースが早い。間を取れた",
      "正確だが声が棒読み。共感の一言を足せる",
    ],
    ctaTitle: "あなたの品質基準に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "監視メモからフィードバックと品管メモを即作成。コーチングの文面化を速くします。",
    industryTags: ["サービス", "小売"],
    functionTags: ["音声入力", "要約"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "モニタリングメモからフィードバック文を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "受付シフトの申し送りボイス要約",
    slug: { _type: "slug" as const, current: "clinic-reception-voice-handover" },
    industry: "legal" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "care" as const,
    inputPlaceholder: "受付の申し送りを音声で話すか、テキストで入力してください",
    mockOutputPrimary: `## 1. 申し送りサマリ（受付・事務）

- 予約: 明日午前に検査予約のキャンセル枠2件。電話フォロー済み
- 会計: 〇〇様の領収書再発行依頼。明日取りに来られる
- 物品: レセコン側で紙の問診在庫が少ない`,
    mockOutputSecondary: `## 2. 翌朝の確認事項

キャンセル枠の埋め立て可否。再発行の本人確認方法。備品発注の担当者。`,
    systemPrompt: "あなたはクリニック受付の申し送り音声から事務向けサマリを作成するアシスタントです。診療内容の判断は行いません。",
    outputStructure: "申し送りサマリ（受付・事務）と翌朝の確認事項の2セクションで出力すること。",
    sampleData: [
      "明日の午後診、医師1名欠勤の可能性。患者にはまだ連絡していない",
      "窓口の印紙が切れた。急ぎで補充依頼した",
      "保険証の読み取りエラーが多い日だった。機器再起動済み",
    ],
    ctaTitle: "あなたの受付運用に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "受付の音声申し送りからサマリと翌朝確認を即整理。事務引き継ぎを明確にします。",
    industryTags: ["医療"],
    functionTags: ["音声入力", "引継ぎ"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "受付申し送りボイスを即要約",
  },
  {
    _type: "aiDemo" as const,
    title: "領収書写真から経費入力メモ",
    slug: { _type: "slug" as const, current: "receipt-photo-expense-memo" },
    industry: "legal" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "領収書・レシートの写真をアップロードし、用途をテキストで補足してください",
    mockOutputPrimary: `## 1. 経費入力メモ

- 日付・金額: （写真・入力から要約）
- 支払先: 交通系ICチャージ／店舗名など
- 用途: 出張移動、接待（要承認）、消耗品など
- 税率区分: 10%対象／非課税のメモ`,
    mockOutputSecondary: `## 2. 承認・添付チェック

社内規程での上限超過の有無。同席者名の要否。電帳法の保存要件メモ。`,
    systemPrompt: "あなたは領収書写真と補足から経費精算用の入力メモを作成するアシスタントです。確定仕訳は行いません。",
    outputStructure: "経費入力メモと承認・添付チェックの2セクションで出力すること。",
    sampleData: [
      "新幹線とタクシー。出張申請番号は別紙",
      "取引先との会食。5名。部長承認済みとメモにある",
      "文房具とコピー代。混在レシート",
    ],
    ctaTitle: "あなたの経費規程に合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "レシート写真から入力メモと確認事項を即作成。精算の手戻りを減らします。",
    industryTags: ["士業", "サービス", "製造"],
    functionTags: ["画像入力", "帳票生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "領収書写真から経費メモを即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "売場作り込み写真から完了報告",
    slug: { _type: "slug" as const, current: "vm-display-photo-completion-report" },
    industry: "manufacturing" as const,
    inputType: "image_text" as const,
    runMode: "mock_preview" as const,
    inputPlaceholder: "売場・POPの写真をアップロードし、店舗名・期間をテキストで補足してください",
    mockOutputPrimary: `## 1. 作り込み完了報告

- 対象: 春キャンペーンエンド台
- 実施内容: 吊りPOP設置、価格帯別面付け、在庫補充
- 品質確認: 価格タグの向き統一。在庫は基準値以上`,
    mockOutputSecondary: `## 2. 本部フィードバック依頼メモ

写真3枚添付。改善希望: 隣接カテゴリとの色分け。次回巡回は週後半。`,
    systemPrompt: "あなたは売場作り込みの写真と補足から完了報告メモを作成するアシスタントです。",
    outputStructure: "作り込み完了報告と本部フィードバック依頼メモの2セクションで出力すること。",
    sampleData: [
      "新店のオープン前陳列。センター什器の写真",
      "季節商材のメイン通路。在庫は十分",
      "値下げシール貼替え後。旧POPは撤去済み",
    ],
    ctaTitle: "あなたのVMD・店舗報告フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真とメモから完了報告と本部連絡を即作成。キャンペーン横展開の記録を揃えます。",
    industryTags: ["小売", "EC"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "売場写真から作り込み報告を即作成",
  },
  {
    _type: "aiDemo" as const,
    title: "監査所見から是正要求の骨子",
    slug: { _type: "slug" as const, current: "supplier-audit-corrective-draft" },
    industry: "manufacturing" as const,
    inputType: "text_only" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder: "サプライヤ監査の所見メモを入力してください",
    mockOutputPrimary: `## 1. 是正要求書の骨子

- 指摘1: ロットトレーサビリティ記録の欠落 → 期限〇日までに手順書と実施記録を提出
- 指摘2: 測定器校正ラベルの更新漏れ → 校正計画と責任者の明記
- 総括: 重大度は中。再監査の目安時期を別途協議`,
    mockOutputSecondary: `## 2. 社内メモ（購買・品質）

供給継続可否の判断材料。代替供給の検討要否。エスカレ先。`,
    systemPrompt: "あなたはサプライヤ監査の所見から是正要求の骨子を作成するアシスタントです。",
    outputStructure: "是正要求書の骨子と社内メモ（購買・品質）の2セクションで出力すること。",
    sampleData: [
      "保管温度のログが一部空白。説明は口頭のみ",
      "作業者教育の記録が古い。更新が2年止まり",
      "副資材の受け入れ検査がサンプリングのみで基準が曖昧",
    ],
    ctaTitle: "あなたの監査テンプレに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "所見メモから是正要求の骨子と社内判断メモを即作成。サプライチェーン改善の文書化を速くします。",
    industryTags: ["製造", "商社"],
    functionTags: ["報告書生成", "品質管理"],
    moduleTags: ["LLM"],
    oneLiner: "監査所見から是正要求の骨子を即作成",
  },
];
