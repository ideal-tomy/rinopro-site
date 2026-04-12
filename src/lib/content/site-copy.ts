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

export const homeQuickStartCopy = {
  title: "おすすめの進み方",
  intro:
    "気になる入口からどうぞ。途中で別の進み方に切り替えても問題ありません。",
  consult: {
    title: "相談から始める",
    body: "AIコンシェルジュが、目的や悩みを短く整理します。",
    ctaLabel: "相談してみる",
  },
  experience: {
    title: "体験から始める",
    body: "厳選した体験を見ながら、できそうなことをつかめます。",
    ctaLabel: "体験ハブを見る",
    ctaHref: "/demo",
  },
  estimate: {
    title: "料金感から始める",
    body: "2〜3分の質問で、内容の整理と金額の目安を確認できます。",
    ctaLabel: "目安を見てみる",
    ctaHref: "/estimate-detailed",
  },
} as const;

/** トップページ「開発について」セクション */
export const homeDevelopmentSectionCopy = {
  sectionTitle: "開発について",
  lead: "現状整理から本実装まで、段階的な検証で判断を積み重ねる。",
  body: "「作ります」だけではなく、どのような品質管理と工程で構築されるかを開示します。以下は、Axeon の開発ライフサイクルにおける標準的な進め方です。",
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

export const demoHubCopy = {
  title: "体験ハブ",
  intro:
    "ここでは、まず触って雰囲気をつかみやすい体験をまとめています。気になるテーマが見つかったら、一覧ページで広く比較できます。",
  guide: "まずは注目体験から入り、近いタイプや目的を見つけたあと、必要に応じて一覧で比較するのがおすすめです。",
  featuredTitle: "まずはここから",
  featuredBody:
    "短時間で操作感や画面の雰囲気をつかみやすい体験を並べています。",
  catalogTitle: "一覧で広く比較する",
  catalogBody:
    "このページは厳選した入口です。業種や用途を横断して探したい場合は、一覧ページでまとめて比べられます。",
} as const;

// --- サービス ---
export const servicesCopy = {
  title: "サービス",
  purpose:
    "まず読んで把握することも、すぐ相談することもできます。開発とコンサルティングの進め方を、見える形で共有します。",
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
      heading: "いまの業務を一緒に整理する",
      body: "まずは、どこで時間がかかっているか、誰が困っているかを整理します。ヒアリングだけで終わらせず、業務の流れ・扱う情報・現場の負荷を見ながら、AIやシステム化が効く場所を見つけます。",
    },
    {
      kicker: "セクション2：優先順位設計",
      heading: "何から始めるかを決める",
      body: "全部を一度に変えるのではなく、効果が出やすく、現場の負担が少ないものから順に決めます。短期間で試せる案と、あとで広げる案を分けて、無理のない進め方を作ります。",
    },
    {
      kicker: "セクション3：PoC設計・定着支援",
      heading: "小さく試して、使える形に整える",
      body: "試作やデモを見ながら、画面の分かりやすさや使い勝手を調整します。導入して終わりではなく、現場で続けられる形になるまで、運用面も含めて一緒に整えます。",
    },
  ],
  reassurance:
    "進める範囲と確認ポイントは文書で共有し、合意した範囲で進めます。試した結果を見てから、次に広げるかどうかを落ち着いて決められます。",
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
    lifecycleLabel: "開発の全体像",
    lifecycleSub: "何を決めて、何を渡すか",
    intro:
      "「作ります」で終わらせず、どの順番で整理し、どこで確認しながら進めるかを先に共有します。以下は Axeon の標準的な進め方です。費用は案件ごとに異なるため、**選択式の見積もり**で要件を整理したうえで目安をご案内します。",
    steps: [
      {
        step: "01",
        labelJa: "現状整理",
        labelEn: "Discovery",
        body: "今の業務の流れを整理し、どこで時間や手間がかかっているかを見つけます。",
        deliverables: [
          "業務フロー図",
          "課題整理メモ",
          "AI活用の整理",
        ],
      },
      {
        step: "02",
        labelJa: "要件化",
        labelEn: "Structuring",
        body: "何を入力して、何が返ってくると役立つかを決めます。答えの基準や、つなぐ先もここで整理します。",
        deliverables: [
          "入力と出力の整理",
          "連携方法の整理",
          "確認したい指標",
        ],
      },
      {
        step: "03",
        labelJa: "試作・現場検証",
        labelEn: "Validation",
        body: "小さく試せる画面や動きを先に作り、実際の使い勝手を見ながら直します。ここで速さや分かりやすさも確認します。",
        deliverables: [
          "試作画面",
          "フィードバックログ",
          "確認結果のメモ",
        ],
      },
      {
        step: "04",
        labelJa: "本実装",
        labelEn: "Integration",
        body: "本番で使える形に整え、権限・運用・改善方法まで含めて引き渡します。公開後に直しやすい構成にしておきます。",
        deliverables: [
          "本番システム",
          "運用マニュアル",
          "管理者向けの手順",
        ],
      },
    ],
    reassurance:
      "各マイルストーンで受入基準をすり合わせ、仕様の自然増殖を抑えます。運用開始後の改善サイクルも設計に含めます。",
    architectureTitle: "技術面で大切にしていること",
    architectureBody:
      "高価な仕組みを積み上げるより、**速く・分かりやすく・続けやすいこと**を優先します。応答速度、運用コスト、直しやすさのバランスを取り、ITに詳しくない人でも扱いやすい体験を実装で支えます。",
    cta: "見積もりで要件を整理する",
    ctaHref: "/estimate-detailed",
  },
  website: {
    tabLabel: "Webサイト制作",
    title: "Webサイト制作の進め方",
    purpose:
      "ブランド体験と運用性を両立し、公開後の改善まで見据えて構築します。",
    lifecycleLabel: "Web制作の流れ",
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
    architectureTitle: "体験と表示速度",
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
    lifecycleLabel: "アプリ開発の流れ",
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
    architectureTitle: "安定性と安全性",
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
    lifecycleLabel: "ダッシュボード開発の流れ",
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
    architectureTitle: "データと権限設計",
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
  title: "現場の困りごとを整理し、実装まで進めるチームです。",
  purpose:
    "業務の流れを一緒に整理し、小さく試しながら形にします。必要以上に広げず、合意した範囲で進めます。",
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
    "専門知識は不要です。わからない項目は「未定」で大丈夫です。サイト内で整理できている内容は引き継ぎつつ、出てくる金額はあくまで目安として表示します。",
  requirementDefinitionNote:
    "開発に必要な内容の整理（仮）",
  disclaimerTitle: "ご利用前に",
  disclaimerBody:
    "ここに出る金額や文章は「正式なお見積もり」ではありません。チャットでの選択をもとにした、検討用のたたき台です。正式な金額はお話を伺ってからご案内します。",
  roughEstimateTitle: "概算見積もりから引き継いだ内容",
  roughEstimateSubtitle:
    "すでに伺っている内容です。あなたの回答とあわせて整理に使います。",
  /** コンシェルジュ path から人数・つなぎをフォームに反映したとき */
  pathPrefillFromChatNotice:
    "チャットで選んだ規模とつなぎのイメージを、下の質問の一部に反映済みです。サイト内で整理済みの内容は冒頭に表示し、必要ならこのあと変えられます。",
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
  scopeInTitle: "スコープ（含む想定）",
  scopeOutTitle: "スコープ（含まない想定）",
  openQuestionsTitle: "まだ決まっていない点",
  regulatoryNotesTitle: "規制・セキュリティまわりの注意",
  /** 金額ページ：レンジの要因 */
  estimateDriversTitle: "この目安に効いていること",
  estimateDriverEffectUp: "全体を押し上げる要因",
  estimateDriverEffectDown: "抑えめに見ている要因",
  estimateDriverEffectWide: "幅が広がる要因",
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
  processingRetryHint:
    "通信が一時的に不安定なことがあります。自動で再試行しています…",
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
  fieldIndustryWhyMatters: "業種によって、守るべき情報や運用の前提が変わることがあるための質問です。",
  fieldSummary: "いま、いちばんやりたいこと（必須）",
  fieldSummaryHint: "8文字以上で、やさしい言葉で大丈夫です",
  fieldSummaryWhyMatters: "何を作るかの芯がずれると金額も変わるため、いちばん大事な一文を伺います。",
  fieldPain: "うまくいっていないこと（任意）",
  fieldPainHint: "なくても進められます",
  fieldPainWhyMatters: "優先して直したい点が分かると、範囲の絞り込みに使います。",
  fieldTeam: "会社やチームの人数のイメージ",
  fieldTeamWhyMatters: "利用の広がりと権限まわりの目安に効きます。",
  fieldTimeline: "いつ頃までに、という希望",
  fieldTimelineWhyMatters: "進め方の段取り（一気に／小さく試す）の前提に使います。",
  fieldIntegration: "今お使いのツールや、他のシステムとのつなぎ",
  fieldIntegrationHint: "「つながなくてよい」でも構いません",
  fieldIntegrationWhyMatters: "つなぐ数や深さが、工数とリスクに直結します。",
  fieldHostingContext: "データやシステムの置き場所のイメージ",
  fieldHostingContextHint:
    "「クラウドかオンプレか」ではなく、社内だけか・インターネット越しに使うか、で費用の幅が変わりやすい、という意味です。月額の利用料とは別に、開発や運用の工数も変わります。",
  fieldHostingContextWhyMatters:
    "社内閉域やVPNなどが絡むと、接続・権限・ログの扱いで工数が増えやすいです。ここで近いものを選ぶと、目安の幅を現実に寄せやすくなります。",
  fieldUsageSurface: "主な使い方・載せる場所",
  fieldUsageSurfaceHint:
    "近いものを選ぶと、画面づくりや連携の手間を踏まえた目安に絞りやすくなります。未定でも大丈夫です。",
  fieldUsageSurfaceWhyMatters: "スマホ・LINE・社内だけなどで、必要な作りが変わります。",
  sectionCostDrivers: "開発費用に関わりやすい点",
  sectionCostDriversSub:
    "近いものを選んでください。「わからない」でも進められますが、はっきりしているほど金額の幅を絞りやすくなります。",
  fieldDataSensitivity: "扱う情報に、お客様の名前・連絡先などの個人情報は含まれますか？",
  fieldDataSensitivityHint: "ログや権限の厳しさの目安に使います。",
  fieldDataSensitivityWhyMatters: "個人情報の有無で、守り方と確認作業の量が変わります。",
  fieldAudienceScope: "社内だけですか？ お客様や取引先にも見せますか？",
  fieldAudienceScopeHint: "公開範囲やログインの要否の目安に使います。",
  fieldAudienceScopeWhyMatters: "外に見せるかどうかで、安全面の設計が変わります。",
  fieldCurrentWorkflow: "いまは、Excel・メール・紙のどれが中心ですか？",
  fieldCurrentWorkflowHint: "移行や入力のしかたの目安に使います。",
  fieldCurrentWorkflowWhyMatters: "いまの置き場所が分かると、移し替えの手間を見積もりやすくなります。",
  fieldUpdateFrequency: "情報の更新は、どのくらいの頻度ですか？",
  fieldUpdateFrequencyHint: "運用やつなぎ込みの目安に使います。",
  fieldUpdateFrequencyWhyMatters: "更新が多いほど、運用や自動化の比重が上がります。",
  fieldDesignExpectation: "見た目はどのくらいまで整えたいですか？",
  fieldDesignExpectationHint: "画面づくりの手間の目安に使います。",
  fieldDesignExpectationWhyMatters: "デザインに時間をかけるほど、画面まわりの工数が増えます。",
  fieldLoginModel: "ログインはどのイメージに近いですか？",
  fieldLoginModelHint: "アカウントや権限まわりの目安に使います。",
  fieldLoginModelWhyMatters: "アカウントの分け方で、権限設計の広さが変わります。",
  fieldBudgetBand: "ご予算のイメージ（任意）",
  fieldBudgetBandWhyMatters: "希望は金額の計算には使わず、あとで「希望との比較」にだけ使います。",
  fieldBudgetNote: "予算について、もう少しだけ補足（任意）",
  fieldBudgetNoteWhyMatters: "段取りや外注の有無など、短い補足があると会話が早くなります。",
  fieldConstraints: "気になること・決まっていること（任意）",
  fieldConstraintsHint:
    "例: 個人情報を扱う／外出先から使いたい など。なくても構いません",
  fieldConstraintsWhyMatters: "決まっている条件は、見積の前提にそのまま載せやすくなります。",
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
  inquiryPrepTitle: "問い合わせ前の確認",
  inquiryPrepIntro:
    "ここでは、サイト内で整理済みの内容を土台にして、最初の返信を具体的にするために不足点だけを補います。長いヒアリングではなく、必要な確認だけに絞ります。",
  inquiryPrepIntentLabel: "今回の相談でいちばん知りたいこと",
  inquiryPrepDesiredReplyLabel: "今回の返信でほしい内容",
  inquiryPrepPrimaryHint:
    "まずは、今回どんな返答を求めているかを選んで問い合わせ用の整理を作ります。",
  inquiryPrepFollowUpHint:
    "追加で確認したい点だけを並べています。埋めると、送信時点でかなり具体的な問い合わせになります。",
  inquiryPrepGenerateCta: "不足点を整理する",
  inquiryPrepRefreshCta: "この回答で問い合わせ内容を更新する",
  inquiryPrepLoading: "整理しています…",
  inquiryPrepFollowUpTitle: "追加で確認したいこと",
  inquiryPrepRequiredMark: "（必須）",
  inquiryPrepAnswerPlaceholder: "わかる範囲で大丈夫です",
  inquiryPrepMissingHint: "残り {count} 問の必須回答があります。",
  inquiryPrepBriefTitle: "送信される相談内容の要点",
  inquiryPrepProblemTitle: "課題の要約",
  inquiryPrepReplySummaryTitle: "今回の返信で答えてほしいこと",
  inquiryPrepTargetTitle: "対象業務・想定利用者",
  inquiryPrepTimelineTitle: "判断したい時期",
  inquiryPrepScopeTitle: "今回の相談範囲",
  inquiryPrepConstraintsTitle: "制約・前提",
  inquiryPrepReplyFocusTitle: "初回返信でまず触れるべき論点",
  inquiryPrepUnresolvedTitle: "まだ確認が必要な点",
  inquiryPrepContactGate:
    "問い合わせの前に、上の確認を一度実行してください。送信時点でこちらが返しやすい状態まで整理します。",
  inquiryPrepError: "問い合わせ前整理に失敗しました。時間を置いて再度お試しください。",
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
    { value: "staffing", label: "人材・派遣・登録支援" },
    { value: "food_service", label: "飲食・外食" },
    { value: "food_wholesale", label: "食品・卸・商社" },
    { value: "logistics_wholesale", label: "流通・物流・卸（総合）" },
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
  hostingContextOptions: [
    {
      value: "internet",
      label: "主にインターネット経由で使う想定（一般的なクラウドやURLでアクセス）",
    },
    {
      value: "internal_network",
      label: "主に社内ネットワークだけ（社内PC・社内Wi‑Fiからなど）",
    },
    {
      value: "closed_requirements",
      label: "社内ルールで閉じた環境が必要そう（VPN・専用線などはまだ決めていない）",
    },
    { value: "unknown", label: "まだ分からない／相談したい" },
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
    "売り込みではなく、サイト内で整理した内容をこちらへ渡す最終確認の場です。初回返信で具体的に返せるよう、必要な情報をそろえて送ります。",
  /** 問い合わせページ：詳細見積フローへ（説明は出さずボタンのみ） */
  estimateShortcutCta: "詳しい見積もりの目安へ進む",
  estimateShortcutHint:
    "先に料金感や要件のたたき台を作ると、問い合わせ時点でかなり具体的な状態まで整理できます。",
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
      "例: 社内共有の事情、連絡方法の希望、前提として伝えておきたいこと など",
    attachEstimateLabel: "見積もりのメモ（自動）も一緒に送る",
    attachEstimateHint:
      "オフにすると、問い合わせブリーフと追加補足だけ送ります。",
    estimateSummaryTitle: "同封される見積もりメモ（確認用）",
    overviewRevealLabel: "整理内容の概要を表示",
    inquirySummaryTitle: "送信される相談内容の要点",
    inquirySummaryHint:
      "ここに出ている内容をもとに、初回返信では要点を絞ってお返しします。",
    directGuideTitle: "まだ詳細見積を使っていない場合",
    directGuideBody:
      "このフォームだけでも送れますが、自由文だけでは送れません。サイト内で整理できた文脈も使いながら、課題・求める返答・対象業務が分かる状態まで整えてから送ります。",
    intentLabel: "今回の相談でいちばん知りたいこと",
    desiredReplyLabel: "今回の返信でほしい内容",
    directProblemLabel: "いま困っていること・変えたいこと",
    directProblemPlaceholder:
      "例: 問い合わせ対応に毎日2時間かかっており、一次受付を自動化したい",
    directTargetLabel: "誰のどの業務の話か",
    directTargetPlaceholder:
      "例: 営業事務2名が行う問い合わせ一次対応。将来的には店舗側でも確認したい",
    directTimelineLabel: "いつ頃までに判断したいか",
    directTimelinePlaceholder:
      "例: 今期中に方向性を決めたい / まず来月までに概算を知りたい",
    directConstraintsLabel: "制約や前提（任意）",
    directConstraintsPlaceholder:
      "例: 個人情報あり、既存のSalesforceと連携したい、社内だけで使いたい など",
    additionalNoteLabel: "最後に補足したいこと（任意）",
    additionalNoteHint:
      "連絡手段の希望や、社内事情など補足があればここに書いてください。",
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

export const footerCopy = {
  tagline: "ビジネスを再設計する",
  subline:
    "AIコンシェルジュと業務改善の体験を、相談から実装までつなげます。",
} as const;
