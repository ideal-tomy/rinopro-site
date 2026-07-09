/**
 * /prototype-showroom — 営業・共同開発向けプロトタイプショールーム LP
 */

export type PrototypeScreenshotRole = "hero" | "flow" | "after";

export type PrototypeScreenshot = {
  src: string;
  alt: string;
  role: PrototypeScreenshotRole;
};

export type PrototypeDemo = {
  id: string;
  eyebrow: string;
  title: string;
  oneLineValue: string;
  industries: string[];
  before: string;
  workflow: readonly string[];
  aiRoles: readonly string[];
  humanRoles: readonly string[];
  after: string;
  industryApplications: readonly string[];
  crossIndustryPrinciple: string;
  crossIndustryTargets: readonly string[];
  screenshots: readonly PrototypeScreenshot[];
  demoUrl: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export type CrossIndustryStructure = {
  id: string;
  label: string;
  examples: readonly string[];
  principle: string;
};

export const PROTOTYPE_SHOWROOM_CONTACT_HREF = "/contact" as const;

export const PROTOTYPE_SHOWROOM_HERO = {
  eyebrow: "AXEON / INDUSTRY WORKFLOW SHOWROOM",
  title: "現場の「いま」を、次の判断につなげる。",
  subtitle:
    "建設、介護、農業、施設管理。現場で生まれる情報をAIが整理し、管理側の判断、報告、次のアクションまでを一つの流れにします。",
  flowLine:
    "FIELD INPUT → AI ORGANIZE → RISK / PRIORITY → MANAGEMENT DECISION → NEXT ACTION",
  heroImageSrc: "/lp/bill_os/top.png",
  heroImageAlt: "建物OSコンソールの統合ダッシュボード画面",
  primaryCtaLabel: "代表プロトタイプを見る",
  primaryCtaHref: "#prototypes",
  secondaryCtaLabel: "業界課題を相談する",
} as const;

export const PROTOTYPE_SHOWROOM_PROBLEM = {
  title: "現場には情報がある。でも、管理側には届くのが遅い。",
  body: "多くの現場では、情報そのものが足りないのではありません。電話、LINE、口頭、紙、Excel、写真、音声、別々の業務システム。情報は存在していても、整理されるまでに時間がかかり、誰が確認するのか、何を優先するのか、どこへ報告するのかが人に依存します。",
  painPoints: [
    "現場入力が面倒で、報告が後回しになる",
    "同じ内容を複数システムへ転記する",
    "管理側が情報を読み解き、整理し直している",
    "異常やリスクが埋もれる",
    "優先順位が人によって変わる",
    "報告書作成に時間がかかる",
    "現場と内勤で「見えている状況」が違う",
  ] as const,
  closing:
    "現場の入力を増やすのではなく、入ってきた情報を判断可能な状態に変える。",
} as const;

export const PROTOTYPE_SHOWROOM_CORE_FLOW = {
  title: "入力を楽に。AIが整理。人が判断する。",
  body: "AXEONが試作するのは、単発のAIチャットや要約機能ではありません。現場から情報が入り、人が次に動ける状態になるまでの流れをプロトタイプ化します。",
  steps: [
    {
      id: "input",
      title: "INPUT",
      description: "音声、写真、短文、センサー、映像、既存システム",
    },
    {
      id: "organize",
      title: "ORGANIZE",
      description: "AIが内容を分類・構造化",
    },
    {
      id: "risk",
      title: "RISK / PRIORITY",
      description: "異常、リスク、優先順位、不足情報を提示",
    },
    {
      id: "route",
      title: "ROUTE",
      description: "担当者、部署、対応先へ振り分け",
    },
    {
      id: "report",
      title: "REPORT",
      description: "日報、申し送り、レポート、履歴へ変換",
    },
    {
      id: "next",
      title: "NEXT ACTION",
      description: "人が確認し、次の対応を決定",
    },
  ] as const,
  closing:
    "AIに最終判断を丸投げするのではなく、人が判断しやすい状態まで整える。",
} as const;

export const PROTOTYPE_SHOWROOM_DEMOS: readonly PrototypeDemo[] = [
  {
    id: "gempo",
    eyebrow: "PROTOTYPE 01 / CONSTRUCTION FIELD OPERATIONS",
    title: "現場の入力は簡単に。管理側の情報は、整理された状態で。",
    oneLineValue:
      "スマホから現場情報を簡単に入力し、進捗・写真・日報・人員を管理側へつなぐ現場業務基盤。",
    industries: [
      "建設会社",
      "設備工事",
      "工務店",
      "リフォーム",
      "施工管理",
      "現場DX",
    ],
    before:
      "現場情報が、電話、LINE、写真、口頭、Excelに分散。現場側は報告が負担になり、管理側は内容確認、転記、担当振り分け、報告書作成に時間を使う。",
    workflow: [
      "現場選択",
      "音声・テキスト・写真で報告",
      "進捗・日報・人員情報を整理",
      "管理画面へ集約",
      "現場別状況を比較",
      "報告書・次アクションへ",
    ],
    aiRoles: [
      "音声・短文の整理",
      "報告内容の分類",
      "問題・進捗・要対応事項の抽出",
      "担当候補の振り分け",
      "日報・報告書ドラフト生成",
    ],
    humanRoles: [
      "現場状況の最終確認",
      "是正の要否",
      "優先順位",
      "責任者決定",
      "正式な承認",
    ],
    after:
      "現場は、スマホから簡単に入力する。管理側は、複数現場の進捗、写真、日報、問題を一つの画面で確認し、次に見るべき現場や対応を判断できる。",
    industryApplications: [
      "安全報告",
      "KY活動",
      "是正報告",
      "品質管理",
      "設備工事",
      "リフォーム進捗",
      "施工写真管理",
    ],
    crossIndustryPrinciple:
      "現場入力 → AI整理 → 振り分け → 報告書 → 管理者確認",
    crossIndustryTargets: [
      "設備点検",
      "工場保全",
      "店舗巡回",
      "清掃点検",
      "車両点検",
      "施設管理",
    ],
    screenshots: [
      {
        src: "/lp/genpo/top.png",
        alt: "GENPO 現場管理アプリの管理ダッシュボード",
        role: "hero",
      },
      {
        src: "/lp/genpo/input.png",
        alt: "GENPO 現場からの入力画面",
        role: "flow",
      },
      {
        src: "/lp/genpo/check.png",
        alt: "GENPO 進捗・現場状況の確認画面",
        role: "after",
      },
    ],
    demoUrl: "https://kanri-kensetsu.vercel.app/",
    primaryCtaLabel: "建設現場管理デモを体験する",
    secondaryCtaLabel: "自社の現場業務で相談する",
  },
  {
    id: "kaigo-care-dx",
    eyebrow: "PROTOTYPE 02 / CARE & HOME MEDICAL OPERATIONS",
    title: "話すだけで、次の担当者が動ける記録へ。",
    oneLineValue:
      "音声や簡単入力を、利用者別の記録、重要事項、申し送り、管理者確認へつなぐ業務基盤。",
    industries: [
      "介護施設",
      "デイサービス",
      "訪問看護",
      "訪問診療",
      "クリニック",
      "リハビリ",
    ],
    before:
      "忙しい現場で長文入力が求められ、口頭・手書き・複数システムに情報が分散する。次の担当者が必要情報を探し、重要な体調変化や服薬、ヒヤリハット、家族連絡事項が埋もれる可能性がある。",
    workflow: [
      "音声・短文入力",
      "文字化",
      "利用者別に整理",
      "重要事項・リスク候補を抽出",
      "申し送り・記録形式へ変換",
      "管理者・医療連携側が確認",
    ],
    aiRoles: [
      "音声の文字化",
      "対象者別分類",
      "発言内容の構造化",
      "重要事項・リスク候補抽出",
      "申し送り・記録フォーマットへの整形",
    ],
    humanRoles: [
      "記録の正確性確認",
      "医療・介護上の判断",
      "重大リスクへの対応",
      "正式な承認・修正",
    ],
    after:
      "現場スタッフは長文を打たず、話す・選ぶ・短く入力する。管理側や次の担当者には、利用者別・重要事項別に整理された記録が届く。",
    industryApplications: [
      "訪問看護記録",
      "訪問診療記録",
      "介護申し送り",
      "バイタル管理",
      "服薬チェック",
      "ヒヤリハット記録",
      "家族向け報告",
    ],
    crossIndustryPrinciple:
      "音声・短文 → 整理 → 重要事項抽出 → 形式変換 → 次担当者確認",
    crossIndustryTargets: [
      "保育",
      "学校",
      "店舗引き継ぎ",
      "ホテル",
      "コールセンター",
      "営業引き継ぎ",
      "保守点検",
    ],
    screenshots: [
      {
        src: "/lp/kaigo/top.png",
        alt: "介護・訪問診療業務基盤の管理画面",
        role: "hero",
      },
      {
        src: "/lp/kaigo/input.png",
        alt: "介護現場スタッフ向けの音声・簡単入力画面",
        role: "flow",
      },
      {
        src: "/lp/kaigo/check.png",
        alt: "管理者向けの記録・申し送り確認画面",
        role: "after",
      },
    ],
    demoUrl:
      "https://kaigo-operation-demo.vercel.app/experience/kaigo-care-dx",
    primaryCtaLabel: "介護・訪問診療デモを体験する",
    secondaryCtaLabel: "自社の記録・申し送り業務で相談する",
  },
  {
    id: "smart-agri-copilot",
    eyebrow: "PROTOTYPE 03 / SMART AGRICULTURE AI",
    title: "24の現場を、AIが見守る。",
    oneLineValue:
      "複数圃場の状態、作業、天候、リスクを一つの画面へ集約し、優先して見るべき場所と次の作業を提示する。",
    industries: [
      "農業法人",
      "生産者組織",
      "農業支援会社",
      "アグリテック",
      "複数拠点管理事業者",
    ],
    before:
      "複数圃場の状態や作業記録が、担当者の記憶、紙、表計算、個別連絡に分散。管理者は、どの圃場にリスクがあり、今日・今週どこを優先するか判断するために情報を集め直す。",
    workflow: [
      "圃場・作業データ",
      "天候・作業履歴と統合",
      "AIがリスクを整理",
      "優先圃場を可視化",
      "今週の重点作業を提案",
      "現場が実行",
      "記録・証跡を残す",
    ],
    aiRoles: [
      "複数データの整理",
      "圃場別リスク候補",
      "優先順位付け",
      "今週の重点作業提案",
      "複数拠点の状況要約",
    ],
    humanRoles: [
      "実際の作業実施",
      "天候・現地状況を踏まえた最終判断",
      "農薬・肥料・水管理等の正式判断",
      "現場責任者の承認",
    ],
    after:
      "管理者は、すべての圃場を同じ深さで確認する必要がない。高リスク、証跡不足、作業遅延などを先に見て、どこへ人と時間を配分するか判断できる。",
    industryApplications: [
      "複数圃場管理",
      "農作業計画",
      "品質管理",
      "記録・証跡",
      "異常・リスク把握",
      "作業優先順位",
    ],
    crossIndustryPrinciple:
      "複数拠点を監視 → リスクを見つける → 優先順位を出す → 作業につなぐ",
    crossIndustryTargets: [
      "太陽光発電所",
      "工場設備",
      "建設現場",
      "物流拠点",
      "店舗",
      "ビル・施設",
      "データセンター",
    ],
    screenshots: [
      {
        src: "/lp/farm/top.png",
        alt: "スマート農業AIの経営ダッシュボード",
        role: "hero",
      },
      {
        src: "/lp/farm/map.png",
        alt: "圃場リスクマップ画面",
        role: "flow",
      },
      {
        src: "/lp/farm/input.png",
        alt: "週間作業・AI提案画面",
        role: "after",
      },
    ],
    demoUrl: "https://oriza-copilot.vercel.app/",
    primaryCtaLabel: "スマート農業AIデモを体験する",
    secondaryCtaLabel: "複数拠点管理への応用を相談する",
  },
  {
    id: "building-os",
    eyebrow: "PROTOTYPE 04 / BUILDING OS",
    title: "建物の「いま」を、ひとつの画面に。",
    oneLineValue:
      "入退館、駐車場、警備、設備など、分散する建物システムを統合し、AIが横断的に状況を読み解く未来の業務基盤。",
    industries: [
      "ビル管理",
      "不動産管理",
      "商業施設",
      "ホテル",
      "病院",
      "工場",
      "学校",
      "物流施設",
    ],
    before:
      "建物の中には、入退館、駐車場、防犯、設備、トイレ、空調など複数のシステムが存在する。それぞれが別画面・別運用になり、建物全体の「いま」を横断して把握しにくい。",
    workflow: [
      "複数システムから状態取得",
      "統合ダッシュボード",
      "異常・関連事象をまとめる",
      "AIへ自然言語で質問",
      "インシデントとして統合",
      "対応・履歴・運用へ",
    ],
    aiRoles: [
      "複数システム情報の横断整理",
      "関連インシデント候補の統合",
      "自然言語での状況要約",
      "優先イベント候補",
      "運用担当者向け確認補助",
    ],
    humanRoles: [
      "現場確認",
      "施設対応",
      "警備・通報・保守判断",
      "重大インシデントの最終判断",
    ],
    after:
      "担当者はシステムを行き来するのではなく、建物全体の状況を一つの画面で確認し、AIに質問しながら、次に確認すべきことを絞り込める。",
    industryApplications: [
      "オフィスビル",
      "商業施設",
      "マンション",
      "ホテル",
      "病院",
      "工場",
      "学校",
      "物流施設",
    ],
    crossIndustryPrinciple:
      "複数システム → 統合 → 関連事象 → 状況理解 → 人の判断",
    crossIndustryTargets: [
      "スマートシティ",
      "工場統合監視",
      "病院オペレーション",
      "大型物流拠点",
      "複数店舗管理",
      "エネルギー管理",
    ],
    screenshots: [
      {
        src: "/lp/bill_os/top.png",
        alt: "建物OSコンソールの統合ダッシュボード",
        role: "hero",
      },
      {
        src: "/lp/bill_os/input.png",
        alt: "建物OSのAIアシスタント画面",
        role: "flow",
      },
      {
        src: "/lp/bill_os/web_camera.png",
        alt: "建物OSの監視・インシデント統合画面",
        role: "after",
      },
    ],
    demoUrl: "https://obs-demo.vercel.app/",
    primaryCtaLabel: "建物OSデモを体験する",
    secondaryCtaLabel: "施設管理への応用を相談する",
  },
] as const;

export const PROTOTYPE_SHOWROOM_CROSS_INDUSTRY = {
  title: "業界が違っても、同じ「業務構造」はある。",
  body: "建設の画面を、そのまま介護や農業に持ち込むわけではありません。見るのは、業界名の奥にある仕事の構造です。",
  structures: [
    {
      id: "field-report",
      label: "構造A — 現場報告・管理型",
      examples: ["建設", "設備点検", "工場保全", "店舗巡回", "清掃", "車両"],
      principle: "現場入力 → AI整理 → 振り分け → 報告書 → 管理者確認",
    },
    {
      id: "voice-handover",
      label: "構造B — 音声・引き継ぎ型",
      examples: [
        "介護",
        "訪問診療",
        "保育",
        "店舗",
        "営業",
        "コールセンター",
      ],
      principle:
        "音声・短文 → 対象別整理 → 重要事項抽出 → 形式変換 → 次担当者",
    },
    {
      id: "multi-site",
      label: "構造C — 複数拠点・リスク監視型",
      examples: ["農業", "太陽光", "工場", "建設", "物流", "店舗"],
      principle: "複数拠点 → 状況集約 → リスク → 優先順位 → 作業",
    },
    {
      id: "system-integration",
      label: "構造D — システム統合・横断判断型",
      examples: ["建物", "工場", "病院", "物流", "スマートシティ"],
      principle: "複数システム → 統合 → 関連事象 → 状況理解 → 人の判断",
    },
  ] as const satisfies readonly CrossIndustryStructure[],
  closing:
    "あなたの業界にも、まだ名前の付いていない共通構造があるかもしれません。",
} as const;

export const PROTOTYPE_SHOWROOM_TO_BUSINESS = {
  title: "デモで終わらせず、業界向けサービスへ。",
  body: "業界特有のサービスは、AI技術だけでは作れません。現場の例外、商習慣、判断基準、導入時の壁、顧客との関係。それを知る業界事業者と、AI・UI・プロトタイプ開発を組み合わせることで、初めて実際に使われるサービスへ近づきます。",
  flow: [
    "業界課題",
    "仮説",
    "動くプロトタイプ",
    "業界事業者が検証",
    "共同開発",
    "業界向けサービス化",
    "販売・横展開",
  ] as const,
  closing:
    "私たちは、仕様書どおりに作るだけの受託先ではなく、業界知識を持つパートナーと新しい業界向けAIサービスを形にする側に立ちます。",
} as const;

export const PROTOTYPE_SHOWROOM_COLLABORATION = {
  title: "業界を知るあなたと、動く形にする私たちで。",
  subtitle:
    "業界の「当たり前」は、外から見るだけでは分かりません。だからこそ、現場を知る人と一緒に作りたい。",
  body: "あなたが持つのは、現場のリアル、例外、顧客課題、業界の信頼、販売の可能性。私たちが持つのは、業務フローを分解し、AIと人の役割を整理し、短期間で触れるプロトタイプへ変える力。まず小さく動かし、現場で検証し、価値が見えたものは共同開発や業界向けサービスへ育てます。",
  partners: [
    "業界事業者",
    "中堅企業",
    "スタートアップ",
    "コンサル会社",
    "SaaS事業者",
    "開発会社",
    "業界団体",
  ] as const,
  primaryCtaLabel: "共同開発について話す",
  secondaryCtaLabel: "業界課題を相談する",
} as const;

export const PROTOTYPE_SHOWROOM_FINAL_CTA = {
  title: "あなたの現場の“こうなったらいい”を、次のデモに。",
  body: "まだ仕様が決まっていなくても構いません。",
  signals: [
    "この報告を毎回人が整理している",
    "情報が複数の場所に散らばる",
    "判断できる人が限られている",
    "現場と管理側で見えている情報が違う",
  ] as const,
  closing: "そんな違和感から、まず動くプロトタイプを作ります。",
  primaryCtaLabel: "業界課題を話してみる",
  secondaryCtaLabel: "共同開発について相談する",
} as const;

export const PROTOTYPE_SHOWROOM_METADATA = {
  title: "プロトタイプ・ショールーム",
  description:
    "建設、介護、農業、施設管理。現場で生まれる情報をAIが整理し、管理側の判断と次のアクションまでを一つの流れにする代表プロトタイプを紹介します。",
} as const;
