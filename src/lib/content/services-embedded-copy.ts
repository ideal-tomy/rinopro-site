import type { ServiceJourneyStep } from "@/lib/content/service-offerings";

export const servicesValueBandCopy = {
  title: "成功の大半は、作る前に決まる",
  lead: "課題の抽出と設計を同じチームで行い、開発・定着まで一気通貫で伴走します。",
  pillars: ["課題抽出", "設計・優先順位", "開発・定着"] as const,
  journeySteps: [
    {
      number: "01",
      title: "戦略コンサル",
      duration: "課題抽出",
      description: "経営と現場の論点を整理し、どこから手を付けるかを可視化します。",
    },
    {
      number: "02",
      title: "ITコンサル",
      duration: "設計",
      description: "何を作るか・何を検証するかを決め、過剰な要件膨張を抑えます。",
    },
    {
      number: "03",
      title: "システム開発",
      duration: "試作・実装",
      description: "小さく試してから本実装へ。同じチームがコードまで担います。",
    },
    {
      number: "04",
      title: "導入・展開",
      duration: "定着準備",
      description: "現場に乗る運用設計と、関係者への共有まで整えます。",
    },
    {
      number: "05",
      title: "運用・保守",
      duration: "継続",
      description: "監視と改善サイクルを回し、使われ続ける状態を維持します。",
    },
  ] satisfies readonly ServiceJourneyStep[],
} as const;

export const servicesDevelopmentEmbeddedCopy = {
  lead: "いきなり作り始めません。現場の流れを整理し、触れる試作で合意を取ってから、本実装の範囲を決めます。",
} as const;

export type ConsultingZigzagStep = {
  step: string;
  title: string;
  subtitle: string;
  body: string;
  mediaKey: string;
};

export type ConsultingDeliverableItem = {
  label: string;
  caption: string;
  src: string;
  alt: string;
  objectPosition?: string;
};

export type ConsultingCostCard = {
  title: string;
  body: string;
};

export type ConsultingFaqItem = {
  q: string;
  a: string;
};

export type ConsultingBlockCopy =
  | {
      id: string;
      variant: "cards";
      kicker: string;
      heading: string;
      items: readonly string[];
    }
  | {
      id: string;
      variant: "band";
      kicker: string;
      heading: string;
      body: string;
    }
  | {
      id: string;
      variant: "zigzag";
      kicker: string;
      heading: string;
      steps: readonly ConsultingZigzagStep[];
    }
  | {
      id: string;
      variant: "thumbnails";
      kicker: string;
      heading: string;
      items: readonly ConsultingDeliverableItem[];
      note?: string;
    }
  | {
      id: string;
      variant: "assurance";
      kicker: string;
      heading: string;
      costCards: readonly ConsultingCostCard[];
      faq: readonly ConsultingFaqItem[];
    };

export const consultingBlocksCopy = [
  {
    id: "empathy",
    variant: "cards",
    kicker: "よくあるご相談",
    heading: "こんな課題はありませんか",
    items: [
      "経営と現場で課題認識がズレており、どこから手を付けるべきか決めきれない",
      "PoCは終わったが、本実装のスコープと優先順位が固まらない",
      "ベンダーへ丸投げすると要件が膨らみ、途中で認識が食い違う",
      "データや権限の整理が追いつかず、AI活用の前提がそろわない",
      "短期で効果を示したいが、現場の運用負荷も無視できない",
    ],
  },
  {
    id: "approach",
    variant: "band",
    kicker: "アプローチ",
    heading: "戦略と実装のあいだを、同じチームでつなぐ",
    body: "コンサルティングは「資料を書いて終わり」ではありません。経営が意味を持つ優先順位と、現場で回るスコープを同じテーブルで決めます。AIやシステムが効く場所だけを切り出し、次の一手が実行に移せる粒度まで落とし込みます。",
  },
  {
    id: "process",
    variant: "zigzag",
    kicker: "進め方",
    heading: "診断から小さく試すまで、3段階で進める",
    steps: [
      {
        step: "01",
        title: "業務診断",
        subtitle: "いまの業務を一緒に整理する",
        body: "どこで時間がかかっているか、誰が困っているかを整理します。ヒアリングだけで終わらせず、業務の流れ・扱う情報・現場の負荷を見ながら、AIやシステム化が効く場所を見つけます。",
        mediaKey: "diagnosis",
      },
      {
        step: "02",
        title: "優先順位設計",
        subtitle: "何から始めるかを決める",
        body: "全部を一度に変えるのではなく、効果が出やすく現場の負担が少ないものから順に決めます。短期間で試せる案と、あとで広げる案を分けて、無理のない進め方を作ります。",
        mediaKey: "priority",
      },
      {
        step: "03",
        title: "PoC設計・定着支援",
        subtitle: "小さく試して、使える形に整える",
        body: "試作やデモを見ながら、画面の分かりやすさや使い勝手を調整します。導入して終わりではなく、現場で続けられる形になるまで、運用面も含めて一緒に整えます。",
        mediaKey: "poc",
      },
    ],
  },
  {
    id: "deliverables",
    variant: "thumbnails",
    kicker: "成果物",
    heading: "プロジェクトを通じてお渡しするもの（例）",
    items: [
      {
        label: "課題マップ",
        caption: "現状業務を可視化",
        src: "/images/services01.jpg",
        alt: "業務整理と課題マップのイメージ",
        objectPosition: "8% center",
      },
      {
        label: "優先順位案",
        caption: "効果と実現性を比較",
        src: "/images/demo_images/m&a_demo01.png",
        alt: "優先順位づけのたたき台イメージ",
      },
      {
        label: "PoC設計",
        caption: "検証範囲を具体化",
        src: "/images/demo_images/farm_demo01.png",
        alt: "PoCスコープ設計のイメージ",
      },
      {
        label: "共有資料の型",
        caption: "社内説明に使える形",
        src: "/images/demo_images/kaigo-operation-demo01.png",
        alt: "ステークホルダー向け共有資料のイメージ",
      },
    ],
    note: "※正式な成果物リストはキックオフ時に合意します。",
  },
  {
    id: "assurance",
    variant: "assurance",
    kicker: "規模感・FAQ",
    heading: "費用の目安と、よくある質問",
    costCards: [
      {
        title: "PoC・検証",
        body: "数週間〜数ヶ月。小さく試して効果と運用負荷を確認します。",
      },
      {
        title: "本実装",
        body: "数ヶ月単位が一般的。設計済みのスコープを段階的に広げます。",
      },
      {
        title: "継続支援",
        body: "数百万円〜数億円（規模・範囲による）。詳細はヒアリング後にご提案します。",
      },
    ],
    faq: [
      {
        q: "まだ要件が固まっていなくても相談できますか？",
        a: "はい。初回の対話で輪郭を一緒に整理することを目的としています。",
      },
      {
        q: "開発も別会社に任せたい場合は？",
        a: "スコープと引き継ぎの単位を早期に設計し、連携しやすい成果物の形を選べます。",
      },
      {
        q: "社内データを外に出せない場合は？",
        a: "オンプレ・閉域・匿名化など、前提に合わせた検証設計から進めます。",
      },
    ],
  },
] as const satisfies readonly ConsultingBlockCopy[];
