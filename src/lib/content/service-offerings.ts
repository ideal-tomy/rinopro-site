/**
 * LP「OUR SOLUTIONS」6カードに対応するサービス下層ページ用コンテンツ。
 * ルート: /services/[slug]（consulting / development 静的ルートと非競合）
 */

export type ServiceOfferingCallout = {
  label: string;
  text: string;
};

export type ServiceOfferingIssueCard = {
  title: string;
  body: string;
};

export type ServiceOfferingRelatedLink = {
  href: string;
  label: string;
};

export type ServiceJourneyStep = {
  number: string;
  title: string;
  duration: string;
  description: string;
};

export type ServiceOfferingDetail = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    /** ヒーロー上段ラベル */
    eyebrow: string;
    title: string;
    lead: string;
    /** /contact に付与するクエリ（任意） */
    contactQuery?: string;
  };
  why: {
    heading: string;
    paragraphs: readonly string[];
    callouts?: readonly ServiceOfferingCallout[];
  };
  issues: {
    heading: string;
    cards: readonly ServiceOfferingIssueCard[];
  };
  journey: {
    heading: string;
    intro: string;
    steps: readonly ServiceJourneyStep[];
  };
  pitfalls: {
    heading: string;
    stumblingTitle: string;
    stumblingItems: readonly string[];
    supportTitle: string;
    supportItems: readonly string[];
  };
  outcomes: {
    heading: string;
    bullets: readonly string[];
    futureParagraph: string;
  };
  relatedLinks: {
    heading: string;
    links: readonly ServiceOfferingRelatedLink[];
  };
  /** true のとき /solutions の業種カード一覧を表示（industry-solutions のみ） */
  showIndustryGrid?: boolean;
};

const OFFERINGS: readonly ServiceOfferingDetail[] = [
  {
    slug: "dx-strategy",
    metaTitle: "DX戦略設計 | サービス | AXEON",
    metaDescription:
      "経営と現場の認識ギャップを縮め、実装可能な優先順位へ落とし込むDX戦略設計。論点整理から実行計画までの進め方と検討項目を解説します。",
    hero: {
      eyebrow: "SERVICE",
      title: "DX戦略設計",
      lead:
        "「何から着手すべきか」「どこまでを一期で終えるか」を、現場運用とデータ前提まで含めて設計します。戦略が机上で終わらない粒度まで落とし込みます。",
      contactQuery: "topic=dx-strategy",
    },
    why: {
      heading: "なぜ今、戦略設計が重要か",
      paragraphs: [
        "生成AIやクラウドの選択肢が増えた結果、「ツール選定」だけが先行し、組織・データ・権限の前提が後追いになるケースが増えています。経営が期待するスピードと、現場が守るべき品質・法令・社内ルールへの適合は両立可能ですが、そのために最初に整えるべき論点が異なります。",
        "戦略設計の役割は、スローガンを置くことではなく、投資判断の材料になる「優先順位」と「検証単位」を一枚にまとめることです。そこが揃うと、試作検証（PoC）と本実装の境界、関係部署の役割分担、外部パートナーへの依頼範囲まで会話が速くなります。",
      ],
      callouts: [
        {
          label: "経営視点",
          text: "収益・コスト・リスクのどこに効かせるかを先に固定し、施策の並びをブレさせません。",
        },
        {
          label: "現場視点",
          text: "運用コストと例外処理が見える化され、「いつもの業務」として回る条件が明文化されます。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "成功の定義と計測",
          body: "売上・原価・リードタイム・品質指標のどれを一期の成果とみなすか、現状値と取得頻度を先に合意します。",
        },
        {
          title: "データの所在と役割の切り分け",
          body: "いつ・誰が・どの粒度でデータを更新するか。システム間のマスター権限と逸脱時の扱いを決めます。",
        },
        {
          title: "権限・監査・個人情報",
          body: "閲覧権限、ログ保持、マスキング方針を「後から付け足す」のではなく、設計の前提に置きます。",
        },
        {
          title: "組織とルール・管理体制",
          body: "意思決定の承認段取り（誰が何を承認するか）、変更管理の頻度、教育計画まで含めて設計します。",
        },
        {
          title: "既存システムとの関係",
          body: "リプレイス連動か、連携で段階導入か。インターフェースとデータ鮮度の許容範囲を整理します。",
        },
      ],
    },
    journey: {
      heading: "設計から実行計画までの流れ",
      intro:
        "ヒアリングで暗黙知を拾い、優先順位と検証スコープを確定します。次の試作検証（PoC）や実装に繋がる成果物の形まで含めてすり合わせます。",
      steps: [
        { number: "01", title: "現状把握", duration: "1〜2週間", description: "経営・現場・システムの実態をそろえ、課題の見取り図を作ります。" },
        { number: "02", title: "論点・ギャップ整理", duration: "1〜2週間", description: "理想像との差分を構造化し、先に解くべき論点を絞り込みます。" },
        { number: "03", title: "優先順位とロードマップ", duration: "1週間", description: "効果と実現性の両面で着手順を決め、投資判断の材料になる計画へ落とします。" },
        { number: "04", title: "実行・検証計画", duration: "合意", description: "次フェーズで迷わないよう、検証単位・体制・成果物を明文化します。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "現場の実態が各部署の説明だけに依存し、ボトルネックが特定できない",
        "ツール選定が先行し、データ整備と運用設計が後回しになる",
        "経営と現場で「完了」の定義が異なり、プロジェクトが伸びる",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "ヒアリングと資料レビューだけでなく、業務への同行観察を通じて実態を揃える",
        "優先順位は効果×実現性のマトリクスで可視化し、合意形成まで伴走",
        "実装フェーズに繋ぐ要件の粒度まで落とし込み、手戻りを減らす",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "経営・現場・情シスが同じロードマップを見ながら投資判断できる",
        "試作検証（PoC）と本実装の境界が明確になり、試行錯誤のコストが下がる",
        "データと権限の前提が揃い、AI活用や自動化の土台が整う",
      ],
      futureParagraph:
        "戦略が「宣言」ではなく週次・月次の運用に組み込まれ、改善サイクルへ自然に接続できる状態を目指します。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/services/consulting", label: "コンサルティングの詳細プロセス" },
        { href: "/case-studies", label: "実装事例一覧" },
        { href: "/services", label: "サービスハブ" },
      ],
    },
  },
  {
    slug: "ai-apps",
    metaTitle: "AI業務アプリ開発 | サービス | AXEON",
    metaDescription:
      "現場運用を前提にしたAI業務アプリ開発。試作検証で止まりがちな進め方を避けるコツ、検討すべき技術・運用論点、自社開発との役割分担までを整理します。",
    hero: {
      eyebrow: "SERVICE",
      title: "AI業務アプリ開発",
      lead:
        "入力・判断・記録のどこにAIを置くかを業務設計から決め、モニタリングと権限まで含めた「使われ続けるアプリ」として実装します。",
      contactQuery: "topic=ai-apps",
    },
    why: {
      heading: "なぜ「業務アプリ」として設計するか",
      paragraphs: [
        "デモで動くプロトタイプと、現場で止まらない本番運用では、求める堅牢性が異なります。入力誤り・例外フロー・権限・ログ・再学習の頻度までを設計に含めないと、導入直後に運用負荷が跳ね上がります。",
        "AI駆動開発はスピードの武器ですが、そのスピードを「検証に使う」か「本番に直結させる」かで管理のポイントが変わります。私たちは後者に耐える設計を初期から織り込みます。",
      ],
      callouts: [
        {
          label: "品質",
          text: "評価指標・テストデータ・人が必ず確認する範囲を先に定義し、精度のブレを運用で吸収できる構造にします。",
        },
        {
          label: "スピード",
          text: "スコープをフロー単位に分割し、早期に触れる画面から順にリリースします。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "入力と出力の契約",
          body: "ユーザーが渡す情報、システムが返す提案の範囲、必ず人が確認するポイントを明文化します。",
        },
        {
          title: "モデルとコスト",
          body: "オンライン推論とバッチ処理の切り分け、トークンコスト、キャッシュ方針を設計に含めます。",
        },
        {
          title: "監査・説明責任",
          body: "ログと参照根拠の出し方、誤り時の報連相の段取り（エスカレーション）、再実行ポリシーを決めます。",
        },
        {
          title: "既存連携",
          body: "システム連携（API）・ファイル・メッセージングのどれで繋ぐか、リトライと二重実行でも結果が崩れないこと（冪等性）の要件を整理します。",
        },
        {
          title: "運用オーナー",
          body: "誰がプロンプトやルールを更新し、誰が承認するか。リリース後の役割の切り分けを決めます。",
        },
      ],
    },
    journey: {
      heading: "実装〜定着までの流れ（イメージ）",
      intro:
        "業務フローに沿ってスコープを切り、試作で体感を取り、本実装で運用要件まで仕上げます。",
      steps: [
        { number: "01", title: "業務フロー確定", duration: "1〜2週間", description: "入力・判断・承認の流れを固定し、AIを置く位置を決めます。" },
        { number: "02", title: "試作・検証", duration: "2〜6週間", description: "短期間で触れる形を作り、現場フィードバックで要件を磨きます。" },
        { number: "03", title: "本実装", duration: "1〜3ヶ月", description: "権限・監査・連携を含めた本番仕様で実装し、品質を担保します。" },
        { number: "04", title: "運用・改善", duration: "継続", description: "利用指標を見ながら改善を継続し、定着と拡張を進めます。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "精度評価がデモ時点のデータだけになり、本番データで破綻する",
        "例外処理が未定義で、現場が手作業で埋める",
        "ログがなく、インシデント時に原因追跡できない",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "評価設計とデータ分割を最初に固定し、改善ループを回せる状態にする",
        "権限・監査・バックアップまで含めた本番基準で実装する",
        "運用手順書と管理者向けツールまでセットで渡す",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "現場の定型業務がアプリに吸収され、判断と創造に時間を戻せる",
        "リリース後も指標で健全性を見張り、継続的に改善できる",
        "他システムとの連携境界が明確で、保守コストが読みやすい",
      ],
      futureParagraph:
        "AIは「魔法」ではなく業務の一部として組み込まれ、現場主導の小さな改善が積み上がる環境をつくります。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/services/development", label: "開発の進め方（詳細タブ）" },
        { href: "/demo", label: "体験デモ" },
        { href: "/case-studies", label: "実装事例" },
      ],
    },
  },
  {
    slug: "data-platform",
    metaTitle: "データ活用基盤構築 | サービス | AXEON",
    metaDescription:
      "分散したデータを意思決定と現場の両方で使える形に整えるデータ活用基盤。設計論点、導入ステップ、内製との分担までを解説します。",
    hero: {
      eyebrow: "SERVICE",
      title: "データ活用基盤構築",
      lead:
        "生データの保管場所・分析向けの集約データベース・レポート用に整えたデータ（いわゆるレイク／ウェアハウス／マート）の役割分担から、品質・権限・更新スケジュールまでを一体で設計し、ダッシュボードとAIの両方に使えるデータを供給する基盤を構築します。",
      contactQuery: "topic=data-platform",
    },
    why: {
      heading: "なぜ基盤から整えるのか",
      paragraphs: [
        "ダッシュボードやAIは、入力データの鮮度・定義・系列が揃って初めて信頼されます。ツールだけ導入しても、定義が部署ごとに異なると数字が二重管理になり、意思決定が遅れます。",
        "基盤の目的は「すべてを一カ所に」ではなく、**出所・更新責任・利用許諾が追える状態**をつくることです。その上で、必要な粒度だけを分析・報告用に整えたデータ（マート）に載せ、現場と経営の両方に届けます。",
      ],
      callouts: [
        {
          label: "ルールと権限管理",
          text: "個人情報・機密区分ごとにマスキングと権限モデルを設計し、許可のない部門・用途への利用を防ぎます。",
        },
        {
          label: "運用",
          text: "データの取り込み〜加工の流れ（パイプライン）の監視と、処理の目標（SLA）を決め、気づかれない欠損に早期に気づけるようにします。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "データソースとオーナー",
          body: "各データの正／サブ、更新頻度、欠損時の扱い、問い合わせ窓口を決めます。",
        },
        {
          title: "マスター設計",
          body: "顧客・商品・組織コードの整合、歴史管理の要否を整理します。",
        },
        {
          title: "データ処理の流れの設計",
          body: "バッチとストリーミングの境界、リトライ、二重実行でも結果が崩れないこと（冪等性）、コスト上限を設計します。",
        },
        {
          title: "セキュリティ",
          body: "ネットワーク区分、鍵管理、最小権限、ログ監査を要件化します。",
        },
        {
          title: "利用シーン",
          body: "経営ダッシュボード、現場オペ、AI学習データで必要な粒度が異なることを前提に設計します。",
        },
      ],
    },
    journey: {
      heading: "構築の流れ（イメージ）",
      intro:
        "現状のデータ調査から始め、優先する業務領域を選び、データ処理の流れと権限を段階的に敷きます。",
      steps: [
        { number: "01", title: "データ棚卸し", duration: "2〜3週間", description: "ソース・更新頻度・責任者を明確化し、欠損リスクを把握します。" },
        { number: "02", title: "要件・モデル設計", duration: "2〜4週間", description: "業務定義と権限を反映したデータモデルと品質基準を定義します。" },
        { number: "03", title: "データ処理の実装", duration: "1〜3ヶ月", description: "収集・整備・配信の流れを実装し、監視とリトライを組み込みます。" },
        { number: "04", title: "運用移管・改善", duration: "継続", description: "運用手順を移管しながら、コストと品質の最適化を継続します。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "ツール選定だけ決まり、データ契約とオーナーが決まらない",
        "現場のExcel／個別DBが残り、公式の数値が定まらない",
        "データ処理の障害に気づく監視がなく、気付いたら数ヶ月壊れていた",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "業務領域単位でスコープを切り、早期に価値が出る経路を優先",
        "権限・ログ・コストの設計を初期から同居させる",
        "内製チームへの移管計画とドキュメントをセットで用意",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "経営と現場が同じ定義の数字を見ながら意思決定できる",
        "AIや自動化に渡せるデータの取り込み〜加工の流れが稼働する",
        "障害とデータ・設定のずれ（ドリフト）に早期に気づき、継続的に直せる",
      ],
      futureParagraph:
        "データがコストセンターではなく、改善と新規施策の両方を加速する資産として扱える状態へ移行します。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/services", label: "サービスハブ" },
        { href: "/demo", label: "データ活用に繋がるデモ" },
        { href: "/contact", label: "相談フォーム" },
      ],
    },
  },
  {
    slug: "insourcing-enablement",
    metaTitle: "内製化支援 | サービス | AXEON",
    metaDescription:
      "ツール導入で終わらせず、設計・実装・運用の知見を組織に移す内製化支援。論点、ロードマップ、よくある障壁と支援内容を整理します。",
    hero: {
      eyebrow: "SERVICE",
      title: "内製化支援",
      lead:
        "引き継ぎの粒度はお客様の体制に合わせます。設計レビュー、ペア実装、運用上のトラブル対応の伴走など、自走できる状態まで段階的に移します。",
      contactQuery: "topic=insourcing",
    },
    why: {
      heading: "なぜ内製化がDXを続けられるかの分かれ目になるか",
      paragraphs: [
        "外部頼みのままでは、小さな要件変更にも時間がかかり、現場の学習が蓄積しません。一方で、いきなり全面内製は採用・スキル・セキュリティの壁が高く、挫折しやすい領域でもあります。",
        "現実的な落としどころは、**コアな判断と運用は内製**、**初期の速度と品質はパートナー**というハイブリッドです。そこから徐々に境界を内側へ寄せていきます。",
      ],
      callouts: [
        {
          label: "知識移転",
          text: "設計意図・トレードオフ・運用ノウハウをドキュメントと実務の両方で残します。",
        },
        {
          label: "安全のためのレビュー",
          text: "レビューの観点と承認の段取りを先に決め、内製初期の品質とセキュリティを守ります。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "内製のスコープ",
          body: "どこまでを内製し、どこを外部に残すか。コアドメインと性能・セキュリティなどの品質要件の分担を決めます。",
        },
        {
          title: "人員計画",
          body: "プロダクトオーナー、開発、運用・安定稼働担当（SRE）、データ責任者の役割と人数感を現実的に見積もります。",
        },
        {
          title: "研修と評価",
          body: "スキルギャップを埋える研修計画と、内製チームの評価指標をセットで設計します。",
        },
        {
          title: "ツールチェーン",
          body: "CI/CD、監視、インフラをコードで管理する仕組み（IaC）をどこまで内製で触るか、許可されたクラウド操作範囲を決めます。",
        },
        {
          title: "ベンダー関係",
          body: "障害対応などの約束（SLA）、ソースコードの所在、ライセンス、引き継ぎ条件を契約に反映します。",
        },
      ],
    },
    journey: {
      heading: "内製化までの流れ（イメージ）",
      intro:
        "現状スキル棚卸しから始め、パイロット案件で実践し、運用と改善のループを内製へ移します。",
      steps: [
        { number: "01", title: "体制・スキル診断", duration: "1〜2週間", description: "現状の役割とスキル差分を可視化し、内製化の現実的な範囲を決めます。" },
        { number: "02", title: "パイロット実装", duration: "1〜2ヶ月", description: "小さな案件で実践し、レビューと改善の型をチームに定着させます。" },
        { number: "03", title: "運用引き継ぎ", duration: "並行", description: "監視・障害対応・変更管理を共同運用しながら段階的に移管します。" },
        { number: "04", title: "自律運用", duration: "移行後", description: "内製チーム主体で改善を回し、外部は専門支援に絞る体制へ移行します。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "ドキュメントがなく、担当交代でシステムがブラックボックス化する",
        "レビュー体制がなく、技術的負債が加速する",
        "インシデント対応の練習がなく、本番障害で対応が止まる",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "テンプレート化された設計書・運用手順書（Runbook）を共著で作成",
        "ペアレビューと承認の段取りの設計で初期の品質を担保",
        "障害訓練とポストモーテムの型を導入",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "要件の細かな調整を内製で回せるようになり、リードタイムが短縮される",
        "監視・リリース・権限管理が自走し、外部依存が計画的になる",
        "改善のアイデアが現場から上がりやすい文化が育つ",
      ],
      futureParagraph:
        "外部パートナーは「常駐開発」から「スポットの専門性」へ役割が移り、コストとスピードのバランスが取れる状態を目指します。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/services/development", label: "開発プロセス詳細" },
        { href: "/about", label: "チーム体制について" },
        { href: "/contact", label: "相談フォーム" },
      ],
    },
  },
  {
    slug: "industry-solutions",
    metaTitle: "業界別ソリューション | サービス | AXEON",
    metaDescription:
      "業種固有の制約を踏まえたDX・AI導入の考え方。業界ハブへの導線と、検討すべき論点・進め方のフレームをまとめています。",
    hero: {
      eyebrow: "SERVICE",
      title: "業界別ソリューション",
      lead:
        "現場の安全規程・取引慣行・個人情報区分など、業界特有の前提を最初に固定します。そのうえで最小リスクの検証から広げる設計が主流です。",
      contactQuery: "topic=industry",
    },
    why: {
      heading: "なぜ業界文脈が最初にあるべきか",
      paragraphs: [
        "同じ「チャットボット」でも、医療・建設・士業では守るべき境界とログ要件がまったく異なります。業界を無視した一般的な成功パターンをそのまま移植すると、現場で承認が通らないか、法令・社内ルール違反のリスクが残ります。",
        "AXEONでは、業界ごとの典型的な負荷と改善ヒントをハブとして整理し、実装事例・体験デモまで一本の導線で繋げています。",
      ],
      callouts: [
        {
          label: "現場との翻訳",
          text: "現場語彙で要件を捉え直し、システム設計に翻訳します。",
        },
        {
          label: "段階導入",
          text: "規制・協力会社・既存システムの境界を見ながら、スコープを段階的に広げます。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "規制・契約",
          body: "業法、個人情報、下請法、秘密保持など、前提となる規範をリスト化します。",
        },
        {
          title: "関係者",
          body: "協力会社・店舗・本社・監査の利害を整理し、承認の段取りを設計します。",
        },
        {
          title: "データの機密度",
          body: "現場写真、音声、顧客情報の取り扱い区分とマスキング方針を決めます。",
        },
        {
          title: "オフラインと現場通信",
          body: "電波状況・デバイス制約・タイムアウト許容を現実値で決めます。",
        },
        {
          title: "成果の見せ方",
          body: "現場の納得感と経営の数字の両方に効く指標をセットで設計します。",
        },
      ],
    },
    journey: {
      heading: "業界別プロジェクトの進め方（イメージ）",
      intro:
        "ハブで負荷の置きどころを共有し、試作検証（PoC）の範囲を業界前提で切ります。その後、現場検証と横展開の順序を決めます。",
      steps: [
        { number: "01", title: "業界ヒアリング", duration: "1〜2週間", description: "業界特有の制約と現場運用を把握し、前提条件を明文化します。" },
        { number: "02", title: "ユースケース選定", duration: "1週間", description: "効果と実現性の高いテーマを選び、検証スコープを限定します。" },
        { number: "03", title: "現場検証", duration: "2〜6週間", description: "実運用で検証し、ルール・UI・データ項目のズレを調整します。" },
        { number: "04", title: "横展開・標準化", duration: "計画", description: "拠点や部署へ展開できるよう、運用手順と標準設定を整備します。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "本社の合理性と現場の運用が衝突し、現場が使わないシステムになる",
        "協力会社連携が後追いになり、プロジェクトが停止する",
        "データ区分が曖昧で、監査・法務で差し戻しが続く",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "業界ハブで論点を言語化し、現場と経営の合意形成を支援",
        "実装事例・デモで「動くイメージ」を先に揃える",
        "権限・ログ・運用設計までセットで提案",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "業界固有の制約を踏まえたロードマップが共有される",
        "現場から改善提案が上がり、ナレッジが蓄積される",
        "協力会社や店舗まで含めた運用が設計される",
      ],
      futureParagraph:
        "「業界特有のしがらみ」をデータとプロセスの両面から解き、再現性ある改善サイクルへ載せ替えます。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/case-studies", label: "実装事例" },
        { href: "/demo", label: "体験デモ" },
        { href: "/services", label: "サービスハブ" },
      ],
    },
    showIndustryGrid: true,
  },
  {
    slug: "continuous-improvement",
    metaTitle: "伴走型改善運用 | サービス | AXEON",
    metaDescription:
      "リリース後のモニタリング・インシデント対応・改善バックログまで伴走する運用支援。自社運用との分担と進め方のフレームを解説します。",
    hero: {
      eyebrow: "SERVICE",
      title: "伴走型改善運用",
      lead:
        "ローンチはゴールではなく起点です。利用実態・エラー・コスト・ユーザー声を定例で整理し、優先度付きの改善バックログへ落とし込みます。",
      contactQuery: "topic=operations",
    },
    why: {
      heading: "なぜ運用伴走が成果を決めるか",
      paragraphs: [
        "現場はリリース直後に最も多くの例外と学びを生みます。この時期にフィードバックループがないと、画面は固定され、結局Excelやチャットに逆戻りします。",
        "伴走の目的は「ずっと外部依存」ではなく、**計測と優先順位付けの型を組織に残す**ことです。私たちはその型づくりにフォーカスします。",
      ],
      callouts: [
        {
          label: "モニタリング",
          text: "技術指標と業務指標の両方で健全性を見張ります。",
        },
        {
          label: "改善リズム",
          text: "定例での振り返りとバックログ整理をテンプレート化します。",
        },
      ],
    },
    issues: {
      heading: "検討すべき論点（チェック）",
      cards: [
        {
          title: "対応の目標時間とオンコール",
          body: "障害の深刻度別の対応時間、連絡経路、上位へつなぐ流れ（エスカレーション）を定義します。",
        },
        {
          title: "変更管理",
          body: "リリース頻度、ロールバック、機能の出し分け（フィーチャーフラグ）の運用を決めます。",
        },
        {
          title: "コスト監視",
          body: "クラウド・モデル利用の異常検知と上限アラートを設定します。",
        },
        {
          title: "ユーザー支援",
          body: "問い合わせ一次対応、ナレッジ更新、教育コンテンツの担当者を決めます。",
        },
        {
          title: "セキュリティパッチ",
          body: "依存ライブラリとインフラの更新サイクルを事前に合意します。",
        },
      ],
    },
    journey: {
      heading: "改善サイクルの流れ（イメージ）",
      intro:
        "定例レビューでデータと現場の声を突き合わせ、バックログを更新します。四半期ごとにロードマップを見直します。",
      steps: [
        { number: "01", title: "計測設計", duration: "初期", description: "業務成果とシステム健全性を追える指標・ダッシュボードを定義します。" },
        { number: "02", title: "定例レビュー", duration: "週次/月次", description: "データと現場の声を突き合わせ、課題を優先順位付きで整理します。" },
        { number: "03", title: "改善実装", duration: "スプリント", description: "優先課題から実装し、効果検証までを短い周期で回します。" },
        { number: "04", title: "振り返り", duration: "四半期", description: "成果と残課題を評価し、次期ロードマップへ反映します。" },
      ],
    },
    pitfalls: {
      heading: "自社だけで進めるときのつまずき",
      stumblingTitle: "よくある詰まり",
      stumblingItems: [
        "ログはあるが、見る人・見る順番が決まっておらず形骸化する",
        "インシデントのたびに場当たり対応になり、再発防止が共有されない",
        "改善要望が無制限に増え、優先順位が決まらない",
      ],
      supportTitle: "AXEONの支援の重点",
      supportItems: [
        "ダッシュボードとレビューアジェンダの型を導入",
        "バックログの優先順位付け（効果×緊急度）の進行を支援",
        "重大な障害ではサーバ側も含めて原因の切り分けと優先付け（トリアージ）を支援",
      ],
    },
    outcomes: {
      heading: "得られる状態・将来像",
      bullets: [
        "利用状況に基づく改善が継続し、システムが陳腐化しにくい",
        "障害対応が手順化され、心理的・組織的な負荷が下がる",
        "投資判断に必要なデータが蓄積される",
      ],
      futureParagraph:
        "プロダクトが「完成品」ではなく、環境変化に追随して育つ資産として扱える状態へ移行します。",
    },
    relatedLinks: {
      heading: "関連する入口",
      links: [
        { href: "/contact", label: "運用伴走の相談" },
        { href: "/services/ai-apps", label: "AI業務アプリ開発" },
        { href: "/case-studies", label: "実装事例" },
      ],
    },
  },
];

const bySlug = new Map(OFFERINGS.map((o) => [o.slug, o]));

export function getServiceOffering(slug: string): ServiceOfferingDetail | undefined {
  return bySlug.get(slug);
}

export function getAllServiceOfferingSlugs(): string[] {
  return OFFERINGS.map((o) => o.slug);
}
