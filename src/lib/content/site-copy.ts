/**
 * ページ文言の一元管理
 * 営業トーンを抑え、技術力と相談導線を両立する表現に統一
 */

// --- トップ ---
export const topCopy = {
  tagline: "「話す」だけで、次が見えてくる。",
  subline:
    "AXEONは、ただ情報を載せるだけのサイトではありません。\nAIとの対話を通じて、あなたの頭の中にある「漠然とした悩み」を最短ルートで構造化します。\n日報、写真、顧客対応——。\n定型業務に奪われる時間を減らし、『人にしかできない判断と創造』に\n集中できる環境をつくります。",
} as const;

/**
 * 右下FAB「AIに相談」付近の先回り吹き出し（`ConciergeFabNudge`）
 * ページIDごとに3文をローテ。v2 で閉じる状態のキー変更（v1 無効化）。
 */
export const conciergeFabNudgeShared = {
  storageKey: "AXEON:fab-nudge:v2" as const,
  rotationIntervalMs: 9000,
  /** 吹き出しの操作は閉じるのみ（`ConciergeFabNudge`） */
  controls: {
    close: "閉じる",
  },
} as const;

export type ConciergeFabNudgePageId =
  | "home"
  | "demo_hub"
  | "demo_list"
  | "demo_detail"
  | "services"
  | "contact"
  | "consulting"
  | "flow"
  | "other";

type FabNudgePageContent = {
  regionAriaLabel: string;
  lines: readonly [string, string, string];
};

export const conciergeFabNudgeByPageId: Record<
  ConciergeFabNudgePageId,
  FabNudgePageContent
> = {
  home: {
    regionAriaLabel: "AIコンシェルジュからの案内",
    lines: [
      "経営課題がまだ言葉になっていなくても、初回相談から整理できます。",
      "コンサルと開発を分けずに話せるので、提案書だけで終わりにくい進め方です。",
      "状況が固まっていない段階でも、お気軽にご相談ください。",
    ],
  },
  demo_hub: {
    regionAriaLabel: "体験ラボの案内",
    lines: [
      "いま感じている課題のキーワードを、短く教えてください。",
      "例：書類探し、写真の振り分け、問い合わせ返信、など。",
      "目的に近い体験の探し方や、比較の相談も受け付けます。",
    ],
  },
  demo_list: {
    regionAriaLabel: "デモ一覧の案内",
    lines: [
      "比較したい観点（業種・用途・工数感など）を教えてください。",
      "一覧が多くて迷う場合は、候補を一緒に絞れます。",
      "短くメモのように送っても、質問形式で整えてもOKです。",
    ],
  },
  demo_detail: {
    regionAriaLabel: "体験デモの案内",
    lines: [
      "この体験で確かめたいこと、うまく言語化しきれなければ雑多でもOKです。",
      "うまくいかなかった点や、自社に当てはめた疑問を投げてください。",
      "他のデモ候補や、応用のイメージも相談できます。",
    ],
  },
  services: {
    regionAriaLabel: "サービス案内",
    lines: [
      "開発とコンサル、どちらに近い相談か、迷っていても構いません。",
      "今の制約（期日感・社内合意のしやすさなど）は、ざっくりで大丈夫です。",
      "文書を読んでも整理が難しければ、会話の方が早いこともあります。",
    ],
  },
  contact: {
    regionAriaLabel: "お問い合わせ案内",
    lines: [
      "問い合わせ前に、用件の骨子を一緒に整えたい方へ。",
      "言葉に詰まる場合は、質問に答えるだけで文章の素案にできます。",
      "営業を迫るものではありません。必要な事実だけ抜き出します。",
    ],
  },
  consulting: {
    regionAriaLabel: "コンサルティング案内",
    lines: [
      "現場の制約（体制・工数感・いつまでに結論欲しいか）を、短くで構いません。",
      "いま起きていることと、欲しい形のギャップを一緒に言語化します。",
      "過剰な提案に進みすぎないよう、次の一歩に絞って話せます。",
    ],
  },
  flow: {
    regionAriaLabel: "開発の流れの案内",
    lines: [
      "いま何が見えていて、次に知りたいのは何ですか。",
      "試作の範囲、現場検証、本実装、など段階の相談もできます。",
      "うまく言えなければ、質問形式で一緒に形にします。",
    ],
  },
  other: {
    regionAriaLabel: "AIコンシェルジュからの案内",
    lines: [
      "いま手が止まっている点や、聞きたいことを、短く送ってください。",
      "専門用語が出たら、かみ砕いて説明します。",
      "うまく言えなければ、質問に答えていく形でも大丈夫です。",
    ],
  },
};

/**
 * 現在のパスに対応する FAB 吹き出しのページID
 */
export function getConciergeFabNudgePageId(
  pathname: string | null
): ConciergeFabNudgePageId {
  if (!pathname || pathname === "/") {
    return "home";
  }
  if (pathname === "/demo" || pathname === "/experience") {
    return "demo_hub";
  }
  if (pathname === "/demo/list") {
    return "demo_list";
  }
  if (/^\/demo\/[^/]+$/.test(pathname)) {
    return "demo_detail";
  }
  if (pathname === "/services" || pathname.startsWith("/services/")) {
    return "services";
  }
  if (pathname === "/contact") {
    return "contact";
  }
  if (pathname === "/consulting") {
    return "consulting";
  }
  if (pathname === "/flow") {
    return "flow";
  }
  return "other";
}

/** トップ：会話を使わない導線（3カード直下） */
export const homeSelfServeRowCopy = {
  lead: "会話を使わずに見る",
  links: [
    { href: "/experience", label: "体験デモ" },
    { href: "/services", label: "サービス概要" },
  ],
} as const;

/** トップページ：相談・体験・料金の3カード（見出しリードは非表示のため未使用フィールドあり） */
export const homeQuickStartCopy = {
  title: "おすすめの進み方",
  intro:
    "気になる入口からどうぞ。途中で別の進み方に切り替えても問題ありません。",
  consult: {
    title: "対話で、思考を整える。",
    body: "AIの問いに答えるだけで、頭の中の「漠然とした悩み」が構造化されます。\nまずは短いメモを送る感覚で、整理を始めてください。",
    ctaLabel: "悩みを1行で送る",
  },
  experience: {
    title: "実例から、可能性を掴む。",
    body: "厳選された活用シナリオから、自社に最適な導入イメージを具体化します。\n「何ができるか」を直感的に理解しましょう。",
    ctaLabel: "活用事例を見る",
    ctaHref: "/experience",
  },
  estimate: {
    title: "数字で、実現を具体化する。",
    body: "わずか数問の回答で、プロジェクトに必要な期間と概算費用を算出します。\n予算計画の最初のステップとしてご活用ください。",
    ctaLabel: "概算を確認する",
    ctaHref: "/estimate-detailed",
  },
} as const;

/** トップページ「開発について」セクション */
export const homeDevelopmentSectionCopy = {
  sectionTitle: "開発について",
  lead: "迷いを断ち切り、ビジネスを加速させる実装力。",
  body: "「何を作るか」が曖昧なまま開発をスタートさせることはありません。\n私たちは、対話を通じて磨き上げた「本当に必要な機能」だけを、確かな技術で形にします。\n一段ずつ、納得感を持って進めるプロセスで、開発にありがちな「認識のズレ」を徹底排除。\nプロフェッショナルの手で、現場が手放せなくなる高品質なシステムを構築します。",
  ctaLabel: "開発の流れ",
  ctaHref: "/services/development",
} as const;

/** トップページ「コンサルティングについて」セクション */
export const homeConsultingSectionCopy = {
  sectionTitle: "コンサルティングについて",
  lead: "机上の空論を捨て、現場に結果を。",
  body: "私たちは現場の最前線に飛び込み、ITが「当たり前の道具」として定着するまで並走し続けます。\n過剰な提案でコストを膨らませるのではなく、今の組織にとって最も効果的な「次の一手」を共に実行し、\n自走できる組織へと導きます。",
  ctaLabel: "コンサルティングを見る",
  ctaHref: "/services/consulting",
} as const;

export const demoHubCopy = {
  title: "DXの種が見つかる、体験ラボ",
  intro: "漠然としたDX化のイメージを膨らませる場所です。",
  guide:
    "実装サンプルを通じて、私たちの開発品質と進め方をご確認いただけます。",
  /** 体験ハブ：条件ウィザードを開く（カード内はボタンのみ） */
  conciergeCtaLabel: "絞り込み補助を使う",
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
    href: "/services/development",
  },
  consulting: {
    title: "コンサルティング",
    desc: "業務診断、優先順位設計、PoC設計、定着支援。検証可能な範囲で進める。",
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

/** /consulting 詳細ページ（チャット以外で流れを確認する向け） */
export const consultingDetailPageCopy = {
  title: consultingCopy.title,
  sections: [
    {
      kicker: "セクション1：よくあるご相談",
      heading: "こんな課題はありませんか",
      body:
        "・経営と現場で課題認識がズレており、どこから手を付けるべきか決めきれない\n・PoCは終わったが、本実装のスコープと優先順位が固まらない\n・ベンダーへ丸投げすると要件が膨らみ、途中で認識が食い違う\n・データや権限の整理が追いつかず、AI活用の前提がそろわない\n・短期で効果を示したいが、現場の運用負荷も無視できない",
    },
    {
      kicker: "セクション2：アプローチ",
      heading: "戦略と実装のあいだを、同じチームでつなぐ",
      body:
        "私たちのコンサルティングは「資料を書いて終わり」ではありません。経営が意味を持つ優先順位と、現場で回るスコープを同じテーブルで決めます。AIやシステムが効く場所だけを切り出し、過剰な要件膨張を抑えつつ、次の一手が実行に移せる粒度まで落とし込みます。",
    },
    {
      kicker: "セクション3：業務診断",
      heading: "いまの業務を一緒に整理する",
      body: "まずは、どこで時間がかかっているか、誰が困っているかを整理します。ヒアリングだけで終わらせず、業務の流れ・扱う情報・現場の負荷を見ながら、AIやシステム化が効く場所を見つけます。",
    },
    {
      kicker: "セクション4：優先順位設計",
      heading: "何から始めるかを決める",
      body: "全部を一度に変えるのではなく、効果が出やすく、現場の負担が少ないものから順に決めます。短期間で試せる案と、あとで広げる案を分けて、無理のない進め方を作ります。",
    },
    {
      kicker: "セクション5：PoC設計・定着支援",
      heading: "小さく試して、使える形に整える",
      body: "試作やデモを見ながら、画面の分かりやすさや使い勝手を調整します。導入して終わりではなく、現場で続けられる形になるまで、運用面も含めて一緒に整えます。",
    },
    {
      kicker: "セクション6：成果物",
      heading: "プロジェクトを通じてお渡しするもの（例）",
      body:
        "・現状業務の整理と課題マップ\n・優先順位付けのたたき台（効果×実現性）\n・PoCスコープと検証設計\n・ステークホルダー向けの共有資料の型\n※正式な成果物リストはキックオフ時に合意します。",
    },
    {
      kicker: "セクション7：規模感",
      heading: "費用・納期の目安",
      body:
        "プロジェクト規模は数百万円〜数億円（継続支援含む）が一般的なレンジです。PoCであれば数週間から、本実装に至る場合は数ヶ月単位を見込むことが多いです。前提や制約によって変動するため、詳細はヒアリングのうえでご提案します。",
    },
    {
      kicker: "セクション8：FAQ",
      heading: "よくある質問",
      body:
        "Q. まだ要件が固まっていなくても相談できますか？\nA. はい。初回の対話で輪郭を一緒に整理することを目的としています。\n\nQ. 開発も別会社に任せたい場合は？\nA. スコープと引き継ぎの単位を早期に設計し、連携しやすい成果物の形を選べます。\n\nQ. 社内データを外に出せない場合は？\nA. オンプレ・閉域・匿名化など、前提に合わせた検証設計から進めます。",
    },
  ],
  reassurance:
    "進める範囲と確認ポイントは文書で共有し、合意した範囲で進めます。試した結果を見てから、次に広げるかどうかを落ち着いて決められます。",
  cta: consultingCopy.cta,
} as const;

/** `/services/development`（開発の進め方）向け FAQ（第4章テンプレの不足ブロック補完） */
export const servicesDevelopmentFaqCopy = {
  kicker: "FAQ",
  heading: "開発・実装についてよくある質問",
  intro:
    "タブで進め方の詳細は切り替えられます。ここでは複数トラック共通で聞かれる論点をまとめています。",
  items: [
    {
      q: "いきなり本開発に入れますか？",
      a: "小さく試してから広げる進め方を推奨します。試作と現場検証の結果を見て、本実装のスコープを確定します。",
    },
    {
      q: "既存システムとの連携はどう進めますか？",
      a: "API・ファイル連携・バッチなど、既存の成熟度に合わせて選択します。最初から全面連携を前提にせず、境界を決めて進めることが多いです。",
    },
    {
      q: "保守・運用はどうなりますか？",
      a: "監視項目と権限設計を初期から織り込み、引き継ぎドキュメントと運用ルールまで含めて整理します。",
    },
  ],
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
      "「作ります」で終わらせず、どの順番で整理し、どこで確認しながら進めるかを先に共有します。以下は AXEON の標準的な進め方です。費用は案件ごとに異なるため、**選択式の見積もり**で要件を整理したうえで目安をご案内します。",
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

// --- 会社紹介（/about Phase F-1）---
export const aboutCopy = {
  hero: {
    kicker: "AXEON とは",
    headline: "中堅企業のDX推進を、戦略から実装まで伴走するチームです。",
    sub:
      "経営・事業の視点とAI開発の実装力を統合し、企画で止まらないDXを支援します。",
  },
  founding: {
    kicker: "OUR STORY",
    heading: "創業の経緯と問題意識",
    paragraphs: [
      "DXや生成AIが実用域に入った一方で、現場では「戦略資料はあるが動くものがない」「PoCで止まり本実装に進めない」というギャップが残っています。AXEONは、そのギャップを埋めるために、経営と現場の「翻訳」で培ってきた視点と、AIを前提とした実装のスピードを同じチームで届けることを選びました。",
      "代表は企業変革支援の現場で製造・金融・流通・医療など幅広い業界の変革プロジェクトに関わり、「机上の戦略」と「現場で回る実装」のズレを何度も見てきました。",
      "技術責任者は大規模AIシステムの開発・運用に深く関与し、精度だけでなく運用コストとガバナンスまで見据えた設計を担ってきました。",
      "私たちが目指すのは、お客様が自走できる状態まで伴走し、継続的に改善できる仕組みを残すことです。",
    ],
  },
  leaderProfiles: {
    kicker: "PROFILE",
    heading: "代表・技術責任者",
    intro: "",
    profiles: [
      {
        title: "代表 / Strategy Lead",
        name: "秋吉 莉乃",
        body:
          "企業変革とDXの立案に携わり、経営課題の構造化と優先順位設計に強みを持ちます。製造・金融・流通・医療・公共など業界横断の経験から、現場と経営の両面で実装可能な計画へ落とし込みます。",
      },
      {
        title: "共同創業者 / AI Engineering Lead",
        name: "（公開準備中）",
        body:
          "大規模なAIプロダクト開発と運用に携わり、アーキテクチャ設計・品質担保・既存システム連携をリードします。プロンプトやモデル選定にとどまらず、ログ・権限・監査など本番運用を見据えた実装を担当します。",
      },
    ],
  },
  principles: {
    kicker: "OUR PRINCIPLES",
    heading: "私たちが大切にしている、3つの考え方",
    items: [
      {
        index: "01",
        title: "「実装できる戦略」しか提案しない",
        body:
          "提案や上流設計が中心の支援では「こうあるべき」が提案の中心になりがちです。\n実装フェーズに移った瞬間、別チームが現実と擦り合わせ、\n当初の戦略は影が薄くなる。\n\n私たちは、その先の「では、どう実装するか」までを、\n同じテーブルで考え抜くことを身上としています。",
      },
      {
        index: "02",
        title: "PoCで終わらせない、定着まで伴走する",
        body:
          "DXが失敗する多くのパターンは、PoCで止まり、\n本実装と運用、組織への定着につながらないところにあります。\n\n私たちは、最初の戦略策定の段階から、\n「誰がどう運用し、どう組織に根付かせるか」を\n設計の前提に組み込みます。",
      },
      {
        index: "03",
        title: "翻訳の品質を、最重要視する",
        body:
          "戦略のプロは「方針」を語りがちで、\n技術者は「実装」を語りがちです。\n\n私たちが見ているのは、その間にある「翻訳」の品質。\n言葉が通じないチームでは、良いシステムは生まれません。\n\n経営の意図を技術要件に翻訳し、\n技術の制約を経営判断の材料に翻訳する。\nそれが、私たちの最も得意とすることです。",
      },
    ],
  },
  background: {
    kicker: "BACKGROUND",
    heading: "戦略と技術、両方の最前線で。",
    paragraphs: [
      "私たちは、大規模な企業変革プロジェクトと、大手企業向けのAIシステム開発、その両方の現場で実務経験を重ねてきた少数精鋭です。",
      "製造、金融、流通、医療、公共領域における数十のプロジェクト経験から、業界横断で通用する原則と、業界ごとの肌感覚を併せ持っています。",
      "スタートアップという立場ですが、それは「経験が浅い」ではなく、「組織の慣性に縛られず、最短距離で価値提供できる」という意味です。大手では難しい柔軟な進め方と、大手と同等の専門性、その両方を提供することを目指しています。",
    ],
  },
  approach: {
    kicker: "OUR APPROACH",
    heading: "4つのステップで、確実に成果につなげる。",
    intro:
      "全部を一度に変えようとしません。小さな成功体験を積み上げ、組織が「使える形」に育てていきます。",
    consultLabel: "コンサル視点",
    techLabel: "AI・技術視点",
    steps: [
      {
        stepIndex: "01",
        title: "現状理解",
        duration: "1〜2週間",
        consult: [
          "インタビューや資料レビューだけでなく、業務に同伴して実際の流れを観察します。",
          "言語化されていない暗黙知を発掘することが、真の課題発見の出発点です。",
        ],
        tech: [
          "データやツールの現状もあわせて可視化し、実装の前提を揃えます。",
          "何ができて、何が難しいかを早期に明確化します。",
        ],
      },
      {
        stepIndex: "02",
        title: "優先順位設計",
        duration: "1〜2週間",
        consult: [
          "効果と着手のしやすさで2軸マップを作り、小さな成功から始める順序を設計します。",
        ],
        tech: [
          "プロトタイプやPoCで動くものを早期に用意し、現場フィードバックを取り込みます。",
        ],
      },
      {
        stepIndex: "03",
        title: "本実装",
        duration: "1〜3ヶ月",
        consult: [
          "スコープと成功指標を経営サイドと共有しながら、実装の優先度をコントロールします。",
        ],
        tech: [
          "AI-assistedな実装でスピードを出しつつ、品質と運用しやすさを両立します。",
        ],
      },
      {
        stepIndex: "04",
        title: "運用・定着",
        duration: "継続",
        consult: [
          "定着に必要な運用設計・社内説明の型まで含めて伴走します。",
        ],
        tech: [
          "モニタリングと改善サイクルを組み込み、使われ続けるシステムに育てます。",
        ],
      },
    ],
  },
  teamModel: {
    kicker: "OUR TEAM",
    heading: "1プロジェクトに対する、標準的な体制",
    intro:
      "規模や内容によって柔軟に編成しますが、標準的には以下のチーム構成でプロジェクトを進めます。",
    fusionLabel: "戦略×技術の融合",
    strategyLead: {
      title: "Strategy Lead",
      bullets: [
        "戦略設計と優先順位",
        "経営層との対話",
        "プロジェクトマネジメント",
        "定着・組織開発の設計",
      ],
    },
    aiEngineeringLead: {
      title: "AI Engineering Lead",
      bullets: [
        "実装設計と品質保証",
        "AI活用領域の見極め",
        "運用設計",
        "既存システムとの連携",
      ],
    },
    footnotes: [
      "両Leadが全工程に同伴することを基本とし、「戦略策定はコンサル、実装は別会社」という分断のないプロジェクトを実現します。",
      "規模に応じて、追加メンバーやパートナーリソースを柔軟に編成します。",
    ],
  },
  scope: {
    kicker: "OUR SCOPE",
    heading: "ご支援可能な領域",
    rows: [
      { label: "支援業界", value: "製造、金融、流通、医療、建設、士業、公共 ほか" },
      {
        label: "支援テーマ",
        value:
          "業務自動化、データ活用、生成AI導入、社内DX、内製化支援、組織開発",
      },
      { label: "プロジェクト規模", value: "数百万円〜数億円（継続支援含む）" },
      {
        label: "標準納期",
        value:
          "PoC：3〜6週間 / 本実装：2〜6ヶ月（規模・内容により応相談）",
      },
      { label: "提供形態", value: "常駐 / 週次レビュー / フレキシブル" },
    ],
  },
  company: {
    kicker: "COMPANY",
    heading: "会社概要",
    /** 住所・表記は確定次第差し替え */
    rows: [
      { label: "社名", value: "AXEON株式会社" },
      {
        label: "所在地",
        value: "東京都目黒区",
      },
      { label: "設立", value: "2026年6月" },
      {
        label: "代表取締役",
        value: "秋吉 莉乃",
      },
      {
        label: "事業内容",
        value:
          "DX戦略設計 / AI駆動による業務システム開発 / 内製化支援・組織開発 / AI導入支援",
      },
      { label: "連絡先", value: "contact@axeon.jp" },
      { label: "URL", value: "https://axeon.jp" },
    ],
  },
  cta: {
    heading: "まずは、お話を聞かせてください。",
    sub:
      "1時間の初回相談で、課題の輪郭をご一緒に整理します。うまく言語化できなくても問題ありません。",
    primaryLabel: "初回コンサルティングのご相談",
    primaryHref: "/contact",
    secondaryLabel: "サービス詳細を見る",
    secondaryHref: "/services",
  },
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
  fieldProductArchetype: "何を作りたいですか（必須）",
  fieldProductArchetypeHint: "名前が曖昧でも、近い言い方で大丈夫です",
  fieldProductArchetypeWhyMatters:
    "作るものの形が見えると、必要な画面や機能の方向を合わせやすくなります。",
  fieldProblemSummary: "いま困っていること・変えたいこと（必須）",
  fieldProblemSummaryHint: "やさしい言葉で、短くても大丈夫です",
  fieldProblemSummaryWhyMatters:
    "困りごとの芯が分かると、何を優先して解決するかと金額の前提をそろえやすくなります。",
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
    "必須の質問がまだ埋まっていません。「何を作りたいですか」と「いま困っていること・変えたいこと」を入力すると進めます。",
  requiredStepHint: "この質問は必須です。短い一文でも大丈夫です。",
  btnGenerating: "整理しています…",
  /** 結果ページの主ボタン（金額ページへ直行） */
  btnConfirmAndShowAmount: "内容を確認し金額を表示",
  btnEditAnswers: "質問に戻って直す",
  btnBackToQuestionsShort: "質問に戻る",
  btnContact: "この内容で問い合わせる",
  inquiryPrepTitle: "問い合わせ前の確認",
  inquiryPrepIntro:
    "ここでは任意で、サイト内で整理済みの内容を土台にして、最初の返信を具体化するための不足点だけを補えます。実行しなくても、そのまま「この内容で問い合わせる」からお進みいただけます。",
  inquiryPrepIntentLabel: "今回の相談でいちばん知りたいこと",
  inquiryPrepDesiredReplyLabel: "今回の返信でほしい内容",
  inquiryPrepPrimaryHint:
    "ご希望に応じて、返答のイメージを選んで問い合わせ用の整理を作れます（任意）。",
  inquiryPrepFollowUpHint:
    "追加で確認したい点だけを並べています。埋めると、送信時点でより具体的な問い合わせになります（任意）。",
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
    "（参考）問い合わせ前の整理は任意です。未整理でもお問い合わせフォームから送信できます。",
  inquiryPrepError: "問い合わせ前整理に失敗しました。時間を置いて再度お試しください。",
  rangeDisclaimer: "最終的な開発費用は、お話を伺ったうえでお出しします。",
  /** 結果・金額ページの要約ブロック見出し */
  overviewTitle: "概略",
  overviewTitleRecap: "概略（再掲）",
  /** 任意の予算帯が見積上限以下に収まるとき */
  budgetWithinMessage: "希望のご予算で開発可能です",
  assumptionsTitle: "こういう前提で整理しています",
  productArchetypeQuickOptions: [
    { value: "Webアプリ", label: "Webアプリ" },
    { value: "社内ツール", label: "社内ツール" },
    { value: "LINE連携", label: "LINE連携" },
    { value: "業務ダッシュボード", label: "業務ダッシュボード" },
    { value: "データ整備・自動化", label: "データ整備・自動化" },
  ],
  problemSummaryQuickOptions: [
    { value: "手作業が多くて時間がかかる", label: "手作業が多くて時間がかかる" },
    { value: "情報が分散して確認に手間がかかる", label: "情報が分散して確認に手間がかかる" },
    { value: "対応品質が担当者によってばらつく", label: "対応品質が担当者によってばらつく" },
    { value: "現場状況をすぐ把握できない", label: "現場状況をすぐ把握できない" },
    { value: "既存ツール同士が連携できていない", label: "既存ツール同士が連携できていない" },
  ],
  painQuickOptions: [
    { value: "入力ミスや抜け漏れが起きる", label: "入力ミスや抜け漏れが起きる" },
    { value: "問い合わせ対応が遅れやすい", label: "問い合わせ対応が遅れやすい" },
    { value: "進捗共有に時間がかかる", label: "進捗共有に時間がかかる" },
    { value: "優先順位付けが難しい", label: "優先順位付けが難しい" },
  ],
  budgetFeelQuickOptions: [
    { value: "まずは小さく試したい", label: "まずは小さく試したい" },
    { value: "効果が見えれば段階的に広げたい", label: "効果が見えれば段階的に広げたい" },
    { value: "できるだけ早く本運用に乗せたい", label: "できるだけ早く本運用に乗せたい" },
    { value: "費用よりも安定運用を重視したい", label: "費用よりも安定運用を重視したい" },
  ],
  constraintsQuickOptions: [
    { value: "個人情報を扱うためセキュリティが重要", label: "個人情報を扱うためセキュリティが重要" },
    { value: "既存システムと連携したい", label: "既存システムと連携したい" },
    { value: "社内ネットワーク内で完結したい", label: "社内ネットワーク内で完結したい" },
    { value: "スマホでも使えることが必要", label: "スマホでも使えることが必要" },
  ],
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
  title: "お問い合わせ",
  purpose:
    "ご相談内容を短く書いて送ってください。2営業日以内に担当者よりご返信します。",
  /** 問い合わせページ下部：詳細見積フローへ（任意） */
  depthPromptLine:
    "もう少し整理してから送りたい場合は、次のリンクからヒアリングに進めます。",
  /** 問い合わせページ：短いヒアリング（詳細見積フロー）へ */
  estimateShortcutCta: "ヒアリングで要点をそろえる",
  estimateShortcutHint:
    "内容は担当者に届き、初回返信で具体的にご案内します。料金の目安まで先に整理したい場合も、同じヒアリングで進められます。",
  flow: {
    sectionTitle: "お問い合わせの流れ",
    mobileSwipeHint: "横にスワイプして全体を確認できます",
    footnote:
      "その後は、内容に応じてオンライン打ち合わせ、コンサル契約、本要件定義のヒアリングなどをご案内します。",
    steps: [
      {
        title: "質問に回答",
        body: "2〜3分でOK。やさしい言葉で大丈夫です。",
      },
      {
        title: "内容を自動整理",
        body: "仮の要件メモとして、こちらに届く形にまとまります。",
      },
      {
        title: "担当者が確認して返信",
        body: "初回返信で、次に決めることや選択肢を具体化します。",
      },
      {
        title: "打ち合わせ / 次の進め方",
        body: "双方の前提が合った場合に、30分程度の打ち合わせや開発に向けたすり合わせへ進むことがあります。",
      },
    ],
  },
  form: {
    nameLabel: "お名前",
    namePlaceholder: "山田 太郎",
    emailLabel: "メールアドレス",
    emailPlaceholder: "example@example.com",
    companyLabel: "会社名（任意）",
    companyPlaceholder: "株式会社○○",
    messageLabel: "ご相談内容",
    messagePlaceholder:
      "例: 営業事務の問い合わせ一次対応を自動化したい。今期中に方向性を決めたい。",
    messageHint:
      "現状の困りごとや、期待することを自由に書いてください。長文でも箇条書きでも構いません。",
    triedExperienceLabel: "最も近かった体験・デモ",
    triedExperiencePlaceholder: "選択してください",
    triedExperienceOtherPlaceholder:
      "体験名が一覧にない場合だけ、ここに入力してください",
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
      "ここに出ている内容をもとに、初回返信では要点を絞ってお返しします。送信前に内容をご確認ください。",
    directGuideTitle: "まずは質問から始めましょう",
    directGuideBody:
      "このページ内の短いヒアリングで、送信前に必要な要点をそろえます。確認が完了すると、連絡先と送信フォームが表示されます。",
    contactIntakeAnsweredSummaryTitle: "見積で伺った内容（再掲）",
    contactIntakeAnsweredSummaryHint:
      "不足がある場合だけ、下の質問に追加で答えてください。",
    contactSyntheticEstimateHint:
      "問い合わせページのヒアリングのみのため、金額レンジは含まれていません。",
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
      "初回のご連絡では、正式契約や確定見積のご案内には進みません。",
    ],
  },
} as const;

export const footerCopy = {
  tagline: "ビジネスを再設計する",
  subline:
    "戦略策定から実装まで、企業のIT変革を一気通貫で支援します。",
} as const;
