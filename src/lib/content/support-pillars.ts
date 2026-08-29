/** ご支援内容ハブ：コンサル／半内製化の2本立て */

export type SupportPillarId = "consulting" | "insourcing";

export type SupportWorkItem = {
  title: string;
  body: string;
};

export type SupportPillarCopy = {
  id: SupportPillarId;
  kicker: string;
  title: string;
  href: string;
  audience: string;
  lead: string;
  workHeading: string;
  workItems: readonly SupportWorkItem[];
  ctaLabel: string;
};

export const supportHubCopy = {
  title: "ご支援内容",
  purpose:
    "提供の入り口は、コンサルと半内製化の2つです。課題の整理から実装・社内への移管まで、必要な範囲を同じチームで進めます。",
} as const;

export const supportPillars: readonly SupportPillarCopy[] = [
  {
    id: "consulting",
    kicker: "CONSULTING",
    title: "コンサル",
    href: "/services/consulting",
    audience: "何から着手すべきか、経営と現場で論点が揃っていないときに。",
    lead:
      "課題の言語化、優先順位、実装可能な戦略まで。資料で終わらせず、次の一手が実行できる粒度に落とします。",
    workHeading: "提供業務",
    workItems: [
      {
        title: "DX戦略設計",
        body: "経営と現場の認識ギャップを縮め、一期で終える範囲と検証単位を一枚にまとめます。",
      },
      {
        title: "優先順位と実行計画",
        body: "効果と実現性の両面で着手順を決め、PoCと本実装の境界が会話できる状態にします。",
      },
      {
        title: "業界前提の整理",
        body: "安全規程・取引慣行・個人情報など、業種固有の制約を最初に固定します。",
      },
    ],
    ctaLabel: "コンサルの詳細を見る",
  },
  {
    id: "insourcing",
    kicker: "ENABLEMENT",
    title: "半内製化",
    href: "/services/insourcing-enablement",
    audience: "外注のままだと改善が止まってしまう、社内に知見を残したいときに。",
    lead:
      "作って渡して終わりにしない。開発・データ基盤・運用を一緒に回しながら、判断と改善の型をチームへ移します。月額の伴走、3か月ごとの更新が基本です。",
    workHeading: "提供業務",
    workItems: [
      {
        title: "AI業務アプリ開発",
        body: "現場運用を前提に、小さく試してから本実装へ。権限・監査まで含めて作ります。",
      },
      {
        title: "データ活用基盤",
        body: "分散データを意思決定に使える形へ整え、内製で回せる更新と権限の型を残します。",
      },
      {
        title: "伴走型改善運用",
        body: "導入後の計測・振り返り・改善バックログまで伴走し、自走できるリズムを残します。",
      },
    ],
    ctaLabel: "半内製化の詳細を見る",
  },
] as const;
