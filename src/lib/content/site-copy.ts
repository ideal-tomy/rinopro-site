/**
 * ページ文言の一元管理
 * 営業トーンを抑え、技術力と相談導線を両立する表現に統一
 */

// --- トップ ---
export const topCopy = {
  tagline: "現場業務を、AIで再設計して実装まで伴走する。",
  subline:
    "建設・士業など、現場に根ざした業務の効率化と、AIによる判定・要約・検索の実装。",
  ctaDemo: "ツールdemoを見る",
  ctaExperience: "体験を見る",
  nextAction: "次に見る",
  nextActionTarget: "サービス",
  nextActionHref: "/services",
  approach: {
    title: "アプローチ",
    items: [
      {
        label: "現場理解",
        desc: "業務を分解し、どこに負荷があるかを可視化する。",
      },
      {
        label: "AI設計",
        desc: "判定・要約・検索など、用途に応じたモデル選定とプロンプト設計。",
      },
      {
        label: "実装運用",
        desc: "既存システムとの連携、検証サイクル、改善ループまで。",
      },
    ],
  },
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

/** /flow 詳細ページ（Engineering Lifecycle） */
export const flowDetailPageCopy = {
  title: developmentFlowCopy.title,
  purpose: developmentFlowCopy.purpose,
  lifecycleLabel: "Engineering Lifecycle",
  lifecycleSub: "技術的裏付け",
  intro:
    "「作ります」だけではなく、どのような品質管理と工程で構築されるかを開示します。以下は、rinopro の開発ライフサイクルにおける標準的な進め方です。",
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
  cta: developmentFlowCopy.cta,
} as const;

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

// --- 問い合わせ ---
export const contactCopy = {
  title: "課題整理の相談窓口",
  purpose:
    "売り込みではなく、現場の課題を一緒に棚卸しする場。初回は要件整理が中心です。",
  form: {
    nameLabel: "お名前",
    namePlaceholder: "山田 太郎",
    emailLabel: "メールアドレス",
    emailPlaceholder: "example@example.com",
    triedExperienceLabel: "触れた体験・デモ（任意）",
    triedExperiencePlaceholder:
      "例: 体験ページの〇〇、ツールdemoの△△ など。未入力でも構いません。",
    messageLabel: "ご相談内容",
    messagePlaceholder:
      "業務内容、困りごと、検討中の時期など、わかる範囲でお書きください。",
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
