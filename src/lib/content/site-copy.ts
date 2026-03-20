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
  ctaCases: "事例を見る",
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
    href: "/services/development",
  },
  consulting: {
    title: "コンサルティング",
    desc: "業務診断、優先順位設計、PoC設計、定着支援。過剰提案せず、検証可能な範囲で進める。",
    href: "/services/consulting",
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
