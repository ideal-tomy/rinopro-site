/** トップページ（BtoB）用コピー。表記は AXEON に統一。 */

export const homeLandingCopy = {
  firstView: {
    headlineLine1: "AIという最先端技術で",
    headlineLine2: "人にしかできないことに集中できる社会へ",
    subheadline: "",
    body:
      "手作業や定型業務を自動化し、\n人は、人にしか生み出せない価値へ。\n\nAXEONは、業務効率化のその先にある企業の本質的な変革を支援します。",
    serviceSectionKicker: "ー Service ー",
    serviceOfferCards: [
      {
        title: "コンサルティング",
        description: "コンサル&開発、運用保守",
        href: "/services/consulting",
      },
      {
        title: "IT部門半内製化",
        description: "月額、3か月毎更新",
        href: "/services/insourcing-enablement",
      },
    ],
    servicesCta: "サービス詳細を見る",
    servicesHref: "/services",
  },

  empathy: {
    sectionIndex: "02",
    sectionKicker: "ABOUT NAME / MISSION",
    heading: "AXEON という名前に込めた、二つの意味。",
    cards: [
      {
        title: "Axis × On（アクシス・オン）",
        body:
          "英語で読めば、「軸」と「前へ」。ぶれない軸を持って、確実に前進する。\n\nビジネスの中心となるシステム、組織の中心となる仕組み、変革の中心となる戦略。私たちは、企業の「軸」を共につくるパートナーです。",
      },
      {
        title: "軸 × 恩（じく・おん）",
        body:
          "日本語で読めば、「軸」と「恩」。社会から、人から、私たちはたくさんのものを受け取って育ちました。\n\nその恩を、次の世代に、社会に返していく。私たちが取り組むのは、その先にある「恩送り」のための仕事です。",
      },
    ],
    photoBandLines: [
      "AXEONは、企業の軸を共につくるパートナーとして、戦略と実装を同じテーブルに置き、理想を現場で動く仕組みに変えていきます。",
      "日本の国力を上げる。この言葉を、私たちは理念ではなく、実務で証明します。",
    ],
  },

  mission: {
    sectionIndex: "03",
    sectionKicker: "OUR MISSION",
    heading: "日本の国力を上げる。",
    leadParagraphs: [
      "少子高齢化と人手不足。",
      "日本企業は、これからますます「人」が貴重な資源になります。",
    ],
    intro:
      "私たち AXEON が目指すのは、AI で人を置き換えることではありません。人にしかできないことに集中できる仕組みをつくること。",
    footerParagraphs: [
      "それが、私たちの考える「AI 活用」の本質です。",
      "そして、それこそが、これからの日本企業に必要な、「次の生産性」だと信じています。",
    ],
  },

  values: {
    sectionIndex: "04",
    sectionKicker: "VALUES",
    heading: "私たちの、5つの約束。",
    items: [
      {
        iconKey: "user",
        title: "01. 人を中心に、設計する。",
        body: "AIの都合ではなく、人の働き方の都合から仕組みを考えます。",
      },
      {
        iconKey: "sprout",
        title: "02. 派手さより、続くもの。",
        body: "使い続けられることを最優先に、定着する仕組みをつくります。",
      },
      {
        iconKey: "arrowLeftRight",
        title: "03. 翻訳の品質に、こだわる。",
        body: "経営の言葉と現場の言葉と技術の言葉。その間にある翻訳を最も大切にします。",
      },
      {
        iconKey: "hourglass",
        title: "04. 短期成果と、長期視点。",
        body: "早く効果を出しながら、3年後10年後の社会も見据えます。",
      },
      {
        iconKey: "bookOpen",
        title: "05. 知見を、隠さない。",
        body: "ノウハウは渡すもの。お客様が自走できる状態こそ、私たちの目標です。",
      },
    ],
  },

  // 互換用: 旧コンポーネント参照を壊さないため残置（G-4で整理予定）
  pillars: {
    sectionIndex: "04",
    sectionKicker: "VALUES",
    heading: "私たちの、5つの約束。",
    intro: "戦略と実装を分断せず、長く使える仕組みをつくります。",
    items: [
      {
        title: "人を中心に、設計する。",
        body: "AIの都合ではなく、人の働き方から逆算して仕組みを設計します。",
        detailLabel: "詳しく",
        detailHref: "/services",
      },
      {
        title: "派手さより、続くもの。",
        body: "導入直後の見た目より、継続利用される運用のしやすさを優先します。",
        detailLabel: "詳しく",
        detailHref: "/services",
      },
      {
        title: "翻訳の品質にこだわる。",
        body: "経営・現場・技術の言葉をつなぎ、実行できる形に落とし込みます。",
        detailLabel: "詳しく",
        detailHref: "/about",
      },
    ],
  },

  ceo: {
    sectionIndex: "05",
    sectionKicker: "CEO MESSAGE",
    heading: "代表メッセージ",
    intro: "",
    messageHeading: "想いを、形に。",
    name: "秋吉 莉乃",
    role: "代表取締役 CEO",
    imageSrc: "/images/about.jpg",
    imageAlt: "AXEON代表プロフィール写真",
    message:
      "UCLA卒業後、外資系コンサルティングファームにて大手企業の変革に関わる中で、戦略と実装の分断を何度も見てきました。AXEONでは、構想から運用まで一気通貫で伴走し、現場で成果が残る形に落とし込みます。",
    profileHref: "/about",
    profileLabel: "詳細プロフィールを見る",
  },

  solutions: {
    sectionIndex: "06",
    sectionKicker: "OUR SOLUTIONS",
    heading: "戦略から実装まで、必要な支援を一気通貫で。",
    intro:
      "経営課題の整理から実装、運用定着まで。分断しがちな工程を一つのチームで推進します。",
    items: [
      {
        iconKey: "brainCircuit",
        title: "DX戦略設計",
        body: "課題を構造化し、実装可能な戦略に落とし込みます。",
        href: "/services/dx-strategy",
      },
      {
        iconKey: "code",
        title: "AI業務アプリ開発",
        body: "現場運用を前提にした高速実装で、PoC止まりを防ぎます。",
        href: "/services/ai-apps",
      },
      {
        iconKey: "database",
        title: "データ活用基盤構築",
        body: "分散データを整理し、意思決定に使える形に統合します。",
        href: "/services/data-platform",
      },
      {
        iconKey: "graduationCap",
        title: "内製化支援",
        body: "ツール導入だけで終わらず、チームに知見を移管します。",
        href: "/services/insourcing-enablement",
      },
      {
        iconKey: "building2",
        title: "業界別ソリューション",
        body: "業種固有の制約を踏まえた導入設計を行います。",
        href: "/services/industry-solutions",
      },
      {
        iconKey: "trendingUp",
        title: "伴走型改善運用",
        body: "導入後の改善サイクルまで伴走し、成果を積み上げます。",
        href: "/services/continuous-improvement",
      },
    ],
  },

  flow: {
    sectionIndex: "07",
    sectionKicker: "APPROACH",
    heading: "4つのステップで、確実に成果へ。",
    intro: "ヒアリングから運用定着まで、段階的に進めます。",
    steps: [
      {
        title: "ヒアリング",
        duration: "1〜2週間",
        consultRole: "経営課題と現場課題を同時に整理し、論点を可視化します。",
        techRole: "データ・ツール・運用実態を把握し、実装前提を揃えます。",
      },
      {
        title: "戦略設計",
        duration: "1〜2週間",
        consultRole: "優先順位と投資対効果を整理し、実行計画へ落とし込みます。",
        techRole: "PoC単位に分解し、短期間で検証できる設計にします。",
      },
      {
        title: "実装",
        duration: "1〜3ヶ月",
        consultRole: "経営サイドとの合意を維持し、スコープを適切に管理します。",
        techRole: "AI駆動開発でスピードを出しつつ、品質と運用性を担保します。",
      },
      {
        title: "運用定着",
        duration: "継続",
        consultRole: "社内説明・運用ルール整備まで伴走し、定着を支援します。",
        techRole: "モニタリングと改善サイクルを実装し、継続利用を支えます。",
      },
    ],
  },

  /** About 直下：実装事例6カード（Industry Showcase） */
  implementationShowcase: {
    sectionIndex: "03",
    sectionKicker: "INDUSTRY SHOWCASE",
    heading: "業界別、実装demo",
    intro:
      "飲食・農業・介護・M&A・建設・人事など、業種の異なる6つの実装例です。",
    allCasesLabel: "すべてのdemoを見る",
    allCasesHref: "/experience",
  },

  demoEvidence: {
    sectionIndex: "03",
    sectionKicker: "INDUSTRY SHOWCASE",
    heading: "業界別プロダクト例",
    intro:
      "提案資料だけでなく、動くサンプルで実装力を確認できます。実導入時は御社業務に合わせて設計します。",
    moreDemosLabel: "体験デモをもっと見る",
    moreDemosHref: "/experience",
  },

  // 互換用
  seoEntries: {
    sectionIndex: "03",
    sectionKicker: "INDUSTRY",
    heading: "業種別・業務別の入口",
    intro:
      "自社に近い文脈から、課題の置きどころと打ち手のイメージを掴めます。",
  },

  faq: {
    sectionIndex: "08",
    sectionKicker: "FAQ",
    heading: "よくある質問",
    items: [
      {
        q: "中堅企業向けの支援実績はありますか？",
        a: "中堅・大手企業の変革プロジェクトに参画した経験を持つメンバーが対応します。案件の詳細は非公開のものも多いですが、初回の対話で近接事例と進め方をご説明します。",
      },
      {
        q: "料金体系はどうなっていますか？",
        a: "コンサル（診断・設計）と開発（実装・運用支援）で、フェーズごとに見積もりします。まずは初回(無料)で課題の輪郭を共有いただき、そのうえで最小の PoC から始めることも可能です。",
      },
      {
        q: "相談だけでも大丈夫ですか？",
        a: "はい。課題の言語化や優先順位づけだけのご相談も歓迎です。開発に進むかどうかは、ご納得いただいたうえでご判断ください。",
      },
      {
        q: "AIに詳しくない経営者でも大丈夫？",
        a: "専門用語に頼らず、経営判断に必要なトレードオフ（コスト・期間・リスク）が伝わるように説明します。必要に応じて社内説明用の資料構成もご一緒します。",
      },
      {
        q: "小規模事業者からの相談も受け付けていますか？",
        a: "はい、ご相談に応じて対応しております。事業規模に応じた最適なアプローチをご提案します。",
      },
    ],
  },

  company: {
    sectionIndex: "09",
    sectionKicker: "会社案内",
    heading: "Company",
    lead:
      "AXEON は、経営・事業の視点とAI実装力を統合した少数精鋭チームです。",
    body:
      "「言葉にならないモヤモヤ」を経営判断と現場ツールにつなぎ、過剰提案ではなく検証可能な単位で前進します。",
    linkLabel: "会社情報を見る",
    linkHref: "/about",
  },

  closing: {
    sectionIndex: "10",
    sectionKicker: "CONTACT",
    headline: "初回コンサルティングのご相談",
    body: "専門家との対話で、課題の輪郭と次のアクションを整理します。",
    primaryCta: "初回コンサルティングのご相談",
    auxiliaryLinks: [
      { label: "サービス詳細を見る", href: "/services" },
      { label: "会社情報を見る", href: "/about" },
    ],
  },
} as const;
