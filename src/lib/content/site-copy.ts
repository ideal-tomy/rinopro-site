/**
 * ページ文言の一元管理
 * 営業トーンを抑え、技術力と相談導線を両立する表現に統一
 */

// --- トップ ---
export const topCopy = {
  tagline: "ビジネスを再設計する",
  subline:
    "日報作成、写真整理、顧客対応……。現場に潜む『定型作業』をAIが担います。人にしかできない業務に集中できる環境を、実装から定着まで創り上げます。",
} as const;

/** トップページ「開発について」セクション */
export const homeDevelopmentSectionCopy = {
  sectionTitle: "開発について",
  lead: "現状整理から本実装まで、段階的な検証で判断を積み重ねる。",
  body: "「作ります」だけではなく、どのような品質管理と工程で構築されるかを開示します。以下は、rinopro の開発ライフサイクルにおける標準的な進め方です。",
  ctaLabel: "開発の流れ",
  ctaHref: "/flow",
} as const;

/** トップページ「コンサルティングについて」セクション */
export const homeConsultingSectionCopy = {
  sectionTitle: "コンサルティングについて",
  lead: "業務診断から定着支援まで。検証可能な範囲で、過剰提案しない。",
  body: "チャットを開かずに、コンサルティングの進め方と判断の軸をここで把握いただけます。",
  ctaLabel: "コンサルティングを見る",
  ctaHref: "/consulting",
} as const;

// --- サービス ---
export const servicesCopy = {
  title: "サービス",
  purpose: "開発とコンサルティング。プロセスを透明にし、判断の根拠を共有する。",
  cta: "相談する",
  development: {
    title: "開発",
    desc: "現状整理から要件化、試作、現場検証を経て本実装まで。段階的な検証でリスクを抑える。",
    href: "/flow",
  },
  consulting: {
    title: "コンサルティング",
    desc: "業務診断、優先順位設計、PoC設計、定着支援。過剰提案せず、検証可能な範囲で進める。",
    href: "/consulting",
  },
} as const;

// --- 開発の流れ ---
export const developmentFlowCopy = {
  title: "開発の流れ",
  purpose: "現状整理から本実装まで、段階的な検証で判断を積み重ねる。",
  steps: [
    {
      label: "現状整理",
      desc: "業務フローと負荷ポイントを可視化し、改善余地を特定する。",
    },
    {
      label: "要件化",
      desc: "AIで扱うタスクを明確化。入力・出力・判定基準を定義する。",
    },
    {
      label: "試作・現場検証",
      desc: "小規模な試作で検証し、現場のフィードバックを反映する。",
    },
    {
      label: "本実装",
      desc: "既存システムとの連携、運用設計、改善ループの仕組みを構築する。",
    },
  ],
  cta: "相談する",
} as const;

// --- コンサルティング ---
export const consultingCopy = {
  title: "コンサルティング",
  purpose: "業務診断から定着支援まで。検証可能な範囲で、過剰提案しない。",
  items: [
    {
      label: "業務診断",
      desc: "現場の業務を分解し、効率化の余地と優先順位を整理する。",
    },
    {
      label: "優先順位設計",
      desc: "ROIと実現可能性を踏まえ、着手順序を設計する。",
    },
    {
      label: "PoC設計・定着支援",
      desc: "短期間の検証で効果を確認し、現場に定着させるまで伴走する。",
    },
  ],
  cta: "相談する",
} as const;

/** /consulting 詳細ページ（チャット以外で流れを確認する向け） */
export const consultingDetailPageCopy = {
  title: consultingCopy.title,
  purpose: consultingCopy.purpose,
  intro:
    "チャットを開かずに、コンサルティングの進め方と判断の軸をここで把握いただけます。",
  sections: [
    {
      kicker: "セクション1：業務診断",
      heading: "現場の解像度を、知性の深度へ。",
      body: "私たちのコンサルティングは、現場の観察から始まります。単なるヒアリングに留まらず、業務フローの中に埋もれた「非構造化データ」と「暗黙知」を可視化。DXの失敗要因となる「現場の抵抗」や「慣習の壁」を事前に特定し、AIが真に機能する余地を精密に診断します。",
    },
    {
      kicker: "セクション2：優先順位設計",
      heading: "投資対効果を、数学的に設計する。",
      body: "すべての業務をAI化する必要はありません。私たちは、実装の「容易性」と「事業インパクト」の二軸で全タスクを評価。最短2週間で成果が出る「クイックウィン」を定義し、中長期的なスケーラビリティを見据えた戦略的なロードマップを策定します。",
    },
    {
      kicker: "セクション3：PoC設計・定着支援",
      heading: "ツールではなく、変革（Change）を定着させる。",
      body: "優れたAIも、現場に受け入れられなければ価値はゼロです。実機デモを用いた現場検証（PoC）を繰り返し、UI/UXの微調整からプロンプトの最適化までをアジャイルに実行。システムが自律的に運用され、文化として定着するまで伴走します。",
    },
  ],
  reassurance:
    "スコープと成功条件は文書で共有し、合意した範囲内で反復します。検証結果を踏まえ、次フェーズを冷静に決められます。",
  cta: consultingCopy.cta,
} as const;

/**
 * `/flow` タブ識別子。
 * 将来追加候補: `ai_automation`（文書生成・問い合わせトリアージ・ナレッジ検索等）、
 * `operations_enablement`（運用・定着・権限設計の伴走）など。
 */
export type FlowTrackKey = "common" | "website" | "app" | "dashboard";

export const FLOW_TRACK_ORDER: readonly FlowTrackKey[] = [
  "common",
  "website",
  "app",
  "dashboard",
] as const;

export type FlowDetailStepCopy = {
  step: string;
  labelJa: string;
  labelEn: string;
  body: string;
  deliverables: readonly string[];
};

export type FlowDetailPageTrackCopy = {
  /** タブに表示する短いラベル */
  tabLabel: string;
  title: string;
  purpose: string;
  lifecycleLabel: string;
  lifecycleSub: string;
  intro: string;
  steps: readonly FlowDetailStepCopy[];
  reassurance: string;
  architectureTitle: string;
  architectureBody: string;
  /** 見積もり導線（本文では金額を明示しない） */
  cta: string;
  ctaHref: string;
};

/** /flow 詳細ページ：トラック別コピー */
export const flowDetailPageCopyByTrack: Record<
  FlowTrackKey,
  FlowDetailPageTrackCopy
> = {
  common: {
    tabLabel: "共通の進め方",
    title: "開発の進め方（共通）",
    purpose: developmentFlowCopy.purpose,
    lifecycleLabel: "Engineering Lifecycle",
    lifecycleSub: "技術的裏付け",
    intro:
      "「作ります」だけではなく、どのような品質管理と工程で構築されるかを開示します。以下は、rinopro の開発ライフサイクルにおける標準的な進め方です。費用は案件ごとに異なるため、**選択式の見積もり**で要件を整理したうえで目安をご案内します。",
    steps: [
      {
        step: "01",
        labelJa: "現状整理",
        labelEn: "Discovery",
        body: "業務プロセスのマッピングを行い、情報のボトルネックを特定。",
        deliverables: [
          "業務フロー図",
          "課題抽出レポート",
          "AI適応定義書",
        ],
      },
      {
        step: "02",
        labelJa: "要件化",
        labelEn: "Structuring",
        body: "AIが扱う「入力データ」と「期待される出力」のプロトコルを定義。独自のプロンプト・エンジニアリングにより、回答の精度と一貫性を保証するためのロジックを設計します。",
        deliverables: [
          "プロンプト構成案",
          "データ連携仕様書",
          "KPI設計書",
        ],
      },
      {
        step: "03",
        labelJa: "試作・現場検証",
        labelEn: "Validation",
        body: "Gemini 3 Flash等の軽量・高速モデルを用いたラピッド・プロトタイピング。実際の現場環境でのストレス操作を行い、実務に耐えうるレスポンス速度と精度を磨き上げます。",
        deliverables: [
          "プロトタイプ実機",
          "フィードバックログ",
          "精度検証報告書",
        ],
      },
      {
        step: "04",
        labelJa: "本実装",
        labelEn: "Integration",
        body: "セキュリティ、スケーラビリティ、メンテナンス性を考慮した本番環境への実装。Vercel等のモダンなインフラを活用し、ダウンタイムを最小限に抑えたデプロイメントを実現します。",
        deliverables: [
          "本番システム",
          "運用マニュアル",
          "管理者向けダッシュボード",
        ],
      },
    ],
    reassurance:
      "各マイルストーンで受入基準をすり合わせ、仕様の自然増殖を抑えます。運用開始後の改善サイクルも設計に含めます。",
    architectureTitle: "Architecture Logic",
    architectureBody:
      "私たちは、大規模言語モデル（LLM）のポテンシャルを最大限に引き出すため、**「軽量モデル（Flash等）の最適化」と「コンテキスト設計」**に特化しています。これにより、高額な演算リソースに依存せず、圧倒的な高速レスポンスと運用コストの最適化を両立。ITリテラシーに依存しない、直感的なUXを技術で支えています。",
    cta: "見積もりで要件を整理する",
    ctaHref: "/estimate-detailed",
  },
  website: {
    tabLabel: "Webサイト制作",
    title: "Webサイト制作の進め方",
    purpose:
      "ブランド体験と運用性を両立し、公開後の改善まで見据えて構築します。",
    lifecycleLabel: "Web Delivery",
    lifecycleSub: "導線と運用",
    intro:
      "コーポレート、LP、採用など、サイトの役割と導線を先に定め、更新・計測まで含めた設計で進めます。費用はページ構成や連携範囲で変わるため、**選択式の見積もり**で整理したうえで目安をご確認ください。",
    steps: [
      {
        step: "01",
        labelJa: "現状整理",
        labelEn: "Discovery",
        body: "導線、コンテンツ更新の体制、計測の有無を整理し、改善の優先度を決めます。",
        deliverables: [
          "導線の整理",
          "更新体制メモ",
          "計測の前提整理",
        ],
      },
      {
        step: "02",
        labelJa: "要件化",
        labelEn: "Structuring",
        body: "サイトマップとページ役割、CMSや権限、計測イベントの定義を固めます。",
        deliverables: [
          "サイトマップ",
          "画面設計",
          "CMS運用設計",
          "計測定義",
        ],
      },
      {
        step: "03",
        labelJa: "試作・検証",
        labelEn: "Validation",
        body: "ワイヤーやプロトタイプで実機確認し、表示速度と読みやすさを検証します。",
        deliverables: [
          "プロトタイプ",
          "レビュー記録",
          "表示速度の確認",
        ],
      },
      {
        step: "04",
        labelJa: "本実装",
        labelEn: "Integration",
        body: "本番公開に向け、監視・バックアップ、公開後の改善サイクルを設計します。",
        deliverables: [
          "本番サイト",
          "運用マニュアル",
          "計測ダッシュボード",
        ],
      },
    ],
    reassurance:
      "公開前に受入基準をすり合わせ、リリース後の更新・計測の見直しも前提に置きます。",
    architectureTitle: "Experience & Performance",
    architectureBody:
      "**表示速度・検索・読みやすさ**を設計段階から組み込み、モダンなフロント基盤で保守しやすい構成にします。ブランドのトーンと運用負荷のバランスを、実装で支えます。",
    cta: "見積もりで要件を整理する",
    ctaHref: "/estimate-detailed",
  },
  app: {
    tabLabel: "アプリ開発",
    title: "アプリ開発の進め方",
    purpose:
      "利用シーンから逆算し、継続利用される操作体験と運用を設計します。",
    lifecycleLabel: "Product Engineering",
    lifecycleSub: "体験と運用",
    intro:
      "Webアプリやスマホ向けの利用想定から、認証・通知・データ連携までを一つの体験として設計します。費用は機能範囲と連携先に左右されるため、**選択式の見積もり**で要件を選び、目安をご確認ください。",
    steps: [
      {
        step: "01",
        labelJa: "現状整理",
        labelEn: "Discovery",
        body: "利用者・利用端末、オフライン要否、既存システムとの連携前提を整理します。",
        deliverables: [
          "利用シナリオ",
          "連携一覧",
          "前提制約",
        ],
      },
      {
        step: "02",
        labelJa: "要件化",
        labelEn: "Structuring",
        body: "画面遷移、API・権限、通知・監査の要件を定義します。",
        deliverables: [
          "画面遷移図",
          "API要件定義",
          "通知仕様",
        ],
      },
      {
        step: "03",
        labelJa: "試作・検証",
        labelEn: "Validation",
        body: "試作ビルドで操作感とエラーハンドリングを検証します。",
        deliverables: [
          "試作ビルド",
          "フィードバックログ",
          "負荷の目安",
        ],
      },
      {
        step: "04",
        labelJa: "本実装",
        labelEn: "Integration",
        body: "本番リリース、運用・監視、改善のリリースサイクルを設計します。",
        deliverables: [
          "本番アプリ",
          "運用設計",
          "リリース手順",
        ],
      },
    ],
    reassurance:
      "権限とデータの境界を早い段階で固定し、仕様の自然増殖を抑えます。",
    architectureTitle: "Reliability & Security",
    architectureBody:
      "**認証・権限・監査**を設計に組み込み、運用で追いやすいログとリリース手順を用意します。利用者の負荷を下げる操作設計を優先します。",
    cta: "見積もりで要件を整理する",
    ctaHref: "/estimate-detailed",
  },
  dashboard: {
    tabLabel: "業務ダッシュボード",
    title: "業務ダッシュボード開発の進め方",
    purpose:
      "意思決定に必要な数字とアクションを、一画面で判断できる状態を作ります。",
    lifecycleLabel: "Operations Intelligence",
    lifecycleSub: "指標と権限",
    intro:
      "KPI・権限・データの更新頻度を揃え、現場の判断が遅れないダッシュボードを目指します。費用は指標・データソースの数に依存するため、**選択式の見積もり**で範囲を選び、目安をご確認ください。",
    steps: [
      {
        step: "01",
        labelJa: "現状整理",
        labelEn: "Discovery",
        body: "業務の意思決定フローと、必要な指標・例外を洗い出します。",
        deliverables: [
          "業務フロー図",
          "KPI候補",
          "データソース一覧",
        ],
      },
      {
        step: "02",
        labelJa: "要件化",
        labelEn: "Structuring",
        body: "KPI定義、データソース、更新頻度、権限・監査ログを設計します。",
        deliverables: [
          "KPI辞書",
          "データマッピング",
          "権限設計",
        ],
      },
      {
        step: "03",
        labelJa: "試作・検証",
        labelEn: "Validation",
        body: "試作画面で数字の見え方と操作を現場検証します。",
        deliverables: [
          "プロトタイプ",
          "検証ログ",
          "改善メモ",
        ],
      },
      {
        step: "04",
        labelJa: "本実装",
        labelEn: "Integration",
        body: "本番運用、データ連携の監視、指標の改善サイクルを設計します。",
        deliverables: [
          "本番ダッシュボード",
          "運用ルール",
          "管理者向け手順",
        ],
      },
    ],
    reassurance:
      "指標の定義とデータの鮮度を合意し、運用でブレない見え方を維持します。",
    architectureTitle: "Data & Governance",
    architectureBody:
      "**データの出所と更新頻度**を明確にし、権限に応じた表示と監査に耐える構成を設計します。現場の意思決定が止まらないUIを優先します。",
    cta: "見積もりで要件を整理する",
    ctaHref: "/estimate-detailed",
  },
};

/** 後方互換・metadata 用：共通トラック */
export const flowDetailPageCopy: FlowDetailPageTrackCopy =
  flowDetailPageCopyByTrack.common;

// --- 会社紹介 ---
export const aboutCopy = {
  title: "代表の戦略的知見と、パートナーの技術的資産。",
  purpose: "現場課題を構造化し、実装まで落とす。過剰提案せず、検証を優先する。",
  values: {
    title: "価値観",
    items: [
      "過剰提案しない。検証可能な範囲で進める。",
      "現場の負荷を理解したうえで、段階的に改善する。",
    ],
  },
  approach: {
    title: "進め方",
    items: [
      "短い検証サイクルで、効果を早く確認する。",
      "判断の根拠と説明責任を重視する。",
    ],
  },
  domains: {
    title: "対応領域",
    items: [
      "建設業・士業など、現場業務の効率化",
      "AIによる判定・要約・検索の導入",
      "既存システムとの連携設計",
    ],
  },
  cta: "相談する",
} as const;

// --- 詳細見積もり（非IT向け・スマホ想定） ---
export const estimateDetailedCopy = {
  kicker: "詳しい見積もりの目安",
  title: "いくつか質問に答えると、内容の整理と金額の目安が出ます",
  intro:
    "専門知識は不要です。わからない項目は「未定」で大丈夫です。出てくる金額はあくまで目安で、正式なお見積もりではありません。",
  requirementDefinitionNote:
    "開発に必要な内容の整理（仮）",
  disclaimerTitle: "ご利用前に",
  disclaimerBody:
    "ここに出る金額や文章は「正式なお見積もり」ではありません。チャットでの選択をもとにした、検討用のたたき台です。正式な金額はお話を伺ってからご案内します。",
  roughEstimateTitle: "概算見積もりから引き継いだ内容",
  roughEstimateSubtitle:
    "すでに伺っている内容です。あなたの回答とあわせて整理に使います。",
  roughTrackLabel: "ご用件の方向",
  roughStepsHeading: "チャットでの選択",
  roughNotesHeading: "概算のメモ・補足",
  sectionHearing: "簡単な質問（目安: 2〜3分）",
  sectionResult: "内容の整理（自動）",
  resultIntro:
    "内容を読んで問題なければ「内容を確認し金額を表示」で金額の目安へ。入力を直す場合は「質問に戻って直す」からどうぞ。",
  /** 結果ページ：作成された要件定義書アコーディオン */
  requirementDefinitionAccordionTitle: "作成された要件定義書",
  /** 結果ページ：ヒアリング回答の Q&A */
  selectedAnswersAccordionTitle: "選択した内容",
  /** 結果ページ：確認事項とリスクの統合 */
  followUpMergedTitle: "詳しく確認が必要なこと",
  sectionRange: "金額の目安",
  processingTitle: "いま、内容を整理しています",
  processingSub:
    "数十秒かかることがあります。止まっているのではなく、お待ちください。",
  processingProgressLabel: "整理の進行状況",
  processingTipHeading: "待ち時間のひとこと",
  processingVideoHeading: "動画で流れる（設定時のみ）",
  processingVideoEmptyHint:
    "※ 動画が未設定のときは、下のリンクから開発の流れや体験をご覧いただけます。",
  processingLinkFlow: "開発の流れを読む（別タブ）",
  processingLinkDemo: "体験・demo を見る（別タブ）",
  processingTips: [
    "いま入力いただいた内容を、わかりやすい文章に整えています。",
    "正式なお見積もりは、範囲や運用の決まり方で変わることがあります。",
    "小さく試してから広げる進め方も、よくある形です。",
    "連携やセキュリティは、後から詳しく決めても大丈夫です。",
    "不明な点は「未定」のままでも、たたき台は作れます。",
  ],
  processingError: "整理に失敗しました。質問ページからやり直してください。",
  processingBackToForm: "質問ページに戻る",
  amountPageKicker: "金額の目安",
  amountPageTitle: "だいたいの幅はこのくらいです",
  amountPageSub:
    "あくまで目安です。正式なお見積もりは、内容のすり合わせのうえでお出しします。",
  amountHeroPrefix: "約",
  amountHeroSuffix: "万円くらい（税別・目安）",
  amountBetween: "〜",
  backToResult: "内容の整理に戻る",
  fieldIndustry: "業種・仕事の種類",
  fieldIndustryHint: "いちばん近いものを選んでください",
  fieldSummary: "いま、いちばんやりたいこと（必須）",
  fieldSummaryHint: "8文字以上で、やさしい言葉で大丈夫です",
  fieldPain: "うまくいっていないこと（任意）",
  fieldPainHint: "なくても進められます",
  fieldTeam: "会社やチームの人数のイメージ",
  fieldTimeline: "いつ頃までに、という希望",
  fieldIntegration: "今お使いのツールや、他のシステムとのつなぎ",
  fieldIntegrationHint: "「つながなくてよい」でも構いません",
  fieldUsageSurface: "主な使い方・載せる場所",
  fieldUsageSurfaceHint:
    "近いものを選ぶと、画面づくりや連携の手間を踏まえた目安に絞りやすくなります。未定でも大丈夫です。",
  sectionCostDrivers: "開発費用に関わりやすい点",
  sectionCostDriversSub:
    "近いものを選んでください。「わからない」でも進められますが、はっきりしているほど金額の幅を絞りやすくなります。",
  fieldDataSensitivity: "扱う情報に、お客様の名前・連絡先などの個人情報は含まれますか？",
  fieldDataSensitivityHint: "ログや権限の厳しさの目安に使います。",
  fieldAudienceScope: "社内だけですか？ お客様や取引先にも見せますか？",
  fieldAudienceScopeHint: "公開範囲やログインの要否の目安に使います。",
  fieldCurrentWorkflow: "いまは、Excel・メール・紙のどれが中心ですか？",
  fieldCurrentWorkflowHint: "移行や入力のしかたの目安に使います。",
  fieldUpdateFrequency: "情報の更新は、どのくらいの頻度ですか？",
  fieldUpdateFrequencyHint: "運用やつなぎ込みの目安に使います。",
  fieldDesignExpectation: "見た目はどのくらいまで整えたいですか？",
  fieldDesignExpectationHint: "画面づくりの手間の目安に使います。",
  fieldLoginModel: "ログインはどのイメージに近いですか？",
  fieldLoginModelHint: "アカウントや権限まわりの目安に使います。",
  fieldBudgetBand: "ご予算のイメージ（任意）",
  fieldBudgetNote: "予算について、もう少しだけ補足（任意）",
  fieldConstraints: "気になること・決まっていること（任意）",
  fieldConstraintsHint:
    "例: 個人情報を扱う／外出先から使いたい など。なくても構いません",
  btnGenerate: "この内容で整理する",
  /** 必須フィールド未充足時（ボタンがグレーのときの案内） */
  btnGenerateDisabledHint:
    "一番上の「いま、いちばんやりたいこと（必須）」に、8文字以上入力するとこのボタンが押せます。",
  btnGenerating: "整理しています…",
  /** 結果ページの主ボタン（金額ページへ直行） */
  btnConfirmAndShowAmount: "内容を確認し金額を表示",
  btnEditAnswers: "質問に戻って直す",
  btnBackToQuestionsShort: "質問に戻る",
  btnContact: "この内容で問い合わせる",
  rangeDisclaimer: "最終的な開発費用は、お話を伺ったうえでお出しします。",
  /** 結果・金額ページの要約ブロック見出し */
  overviewTitle: "概略",
  overviewTitleRecap: "概略（再掲）",
  /** 任意の予算帯が見積上限以下に収まるとき */
  budgetWithinMessage: "希望のご予算で開発可能です",
  assumptionsTitle: "こういう前提で整理しています",
  industryOptions: [
    { value: "construction", label: "建設・土木・現場系" },
    { value: "professional", label: "士業・コンサル・事務所" },
    { value: "medical", label: "医療・福祉" },
    { value: "retail", label: "小売・店舗・ネット販売" },
    { value: "manufacturing", label: "製造・ものづくり" },
    { value: "education", label: "教育・研修" },
    { value: "other", label: "その他" },
    { value: "unknown", label: "わからない／まだ決めていない" },
  ],
  teamOptions: [
    { value: "1-10", label: "〜10人くらい" },
    { value: "11-50", label: "11〜50人くらい" },
    { value: "51-200", label: "51〜200人くらい" },
    { value: "201+", label: "201人以上" },
    { value: "unknown", label: "未定" },
  ],
  timelineOptions: [
    { value: "1m", label: "1ヶ月以内に知りたい" },
    { value: "3m", label: "2〜3ヶ月くらいで" },
    { value: "6m", label: "半年以内が目安" },
    { value: "unknown", label: "まだ決めていない" },
  ],
  integrationOptions: [
    { value: "required", label: "今のツールとつなぐ必要がある" },
    { value: "nice", label: "できればつなぎたい" },
    { value: "standalone", label: "まずは単体でよい" },
    { value: "unknown", label: "わからない／未定" },
  ],
  usageSurfaceOptions: [
    { value: "line", label: "LINEの友だち・LINE連携で使う" },
    { value: "dedicated_app", label: "スマホの専用アプリとして使う" },
    { value: "web_embed", label: "自社のWebページに埋め込む" },
    { value: "web_browser", label: "ブラウザだけで使う（URLにアクセス）" },
    { value: "internal_only", label: "社内ツール・管理画面だけ（外部に公開しない）" },
    { value: "multi", label: "複数（例: WebとLINEの両方）" },
    { value: "unknown", label: "まだ決めていない／相談したい" },
  ],
  dataSensitivityOptions: [
    { value: "yes", label: "はい、含まれる" },
    { value: "no", label: "いいえ、含まれない想定" },
    { value: "partial", label: "一部だけ" },
    { value: "unknown", label: "わからない／これから決める" },
  ],
  audienceScopeOptions: [
    { value: "internal_only", label: "社内だけ" },
    { value: "external_too", label: "お客様や取引先にも見せる" },
    { value: "mixed", label: "社内が中心だが、一部は外部にも" },
    { value: "unknown", label: "わからない／相談したい" },
  ],
  currentWorkflowOptions: [
    { value: "excel", label: "Excelやスプレッドシート" },
    { value: "mail", label: "メールやチャット" },
    { value: "paper", label: "紙・手書き・ホワイトボード" },
    { value: "system", label: "すでに何かシステムがある" },
    { value: "mixed", label: "複数が混在" },
    { value: "unknown", label: "わからない／まだ決まっていない" },
  ],
  updateFrequencyOptions: [
    { value: "daily", label: "ほぼ毎日" },
    { value: "weekly", label: "週に数回" },
    { value: "monthly", label: "月に数回" },
    { value: "rare", label: "それより少ない" },
    { value: "unknown", label: "わからない" },
  ],
  designExpectationOptions: [
    { value: "simple", label: "シンプルでよい（見やすければ十分）" },
    { value: "match_site", label: "自社サイトや資料に合わせたい" },
    { value: "polished", label: "見た目にもこだわりたい" },
    { value: "unknown", label: "わからない／相談したい" },
  ],
  loginModelOptions: [
    { value: "per_user", label: "社員ごとにログインして使い分けたい" },
    { value: "shared", label: "共有アカウントでよい" },
    { value: "none", label: "ログインなしでよい想定" },
    { value: "unknown", label: "わからない／相談したい" },
  ],
  budgetBandOptions: [
    { value: "under50", label: "〜50万円くらいまで" },
    { value: "50to150", label: "50〜150万円くらい" },
    { value: "150to300", label: "150〜300万円くらい" },
    { value: "over300", label: "300万円より大きめ" },
    { value: "discuss", label: "相談して決めたい" },
    { value: "unknown", label: "未定／わからない" },
  ],
} as const;

// --- 問い合わせ ---
export const contactCopy = {
  title: "課題整理の相談窓口",
  purpose:
    "売り込みではなく、現場の課題を一緒に棚卸しする場。初回は要件整理が中心です。",
  /** 問い合わせページ：詳細見積フローへ（説明は出さずボタンのみ） */
  estimateShortcutCta: "詳しい見積もりの目安へ進む",
  form: {
    nameLabel: "お名前",
    namePlaceholder: "山田 太郎",
    emailLabel: "メールアドレス",
    emailPlaceholder: "example@example.com",
    triedExperienceLabel: "触れた体験・デモ（任意）",
    triedExperiencePlaceholder:
      "例: demoページの〇〇、モックdemoの△△ など。未入力でも構いません。",
    additionalRequestLabel: "追加で伝えたいこと（任意）",
    additionalRequestPlaceholder:
      "例: 社内で共有したい／電話でも相談したい など",
    attachEstimateLabel: "見積もりのメモ（自動）も一緒に送る",
    attachEstimateHint:
      "オフにすると、下のメッセージ欄の文章だけ送られます（社内用に短くしたい場合など）。",
    estimateSummaryTitle: "同封される見積もりメモ（確認用）",
    messageLabel: "お問い合わせ内容",
    messagePlaceholder:
      "業務内容、困りごと、検討中の時期など、わかる範囲でお書きください。",
    messageHintFromEstimate:
      "上の「追加で伝えたいこと」に書いた内容と、下の自動メモがあわせて送信されます。",
    overviewRevealLabel: "概略を開く",
    submit: "送信する",
    submitting: "送信中...",
    success: "送信しました。2営業日以内にご返信します。",
  },
  assurance: {
    title: "ご安心ください",
    items: [
      "個人情報は相談目的以外に使用しません。",
      "返信目安は2営業日以内です。",
      "初回の相談は、費用発生のご案内はありません。",
    ],
  },
} as const;
