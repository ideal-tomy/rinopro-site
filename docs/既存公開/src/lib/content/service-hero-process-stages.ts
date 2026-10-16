export type ServiceHeroProcessStageId = 1 | 2 | 3 | 4 | 5;

export type ServiceHeroProcessStageDetail = {
  whatWeDo: readonly string[];
  whyNeeded: string;
  clientInfo: readonly string[];
};

export type ServiceHeroProcessStage = {
  id: ServiceHeroProcessStageId;
  title: string;
  shortDescription: string;
  detail: ServiceHeroProcessStageDetail;
};

/** Hero 工程図の共通データ（services01.jpg の内容を転記） */
export const SERVICE_HERO_PROCESS_STAGES: readonly ServiceHeroProcessStage[] = [
  {
    id: 1,
    title: "戦略コンサルティング",
    shortDescription: "目標と取り組む順番を整理",
    detail: {
      whatWeDo: [
        "事業課題の整理",
        "業務課題の可視化",
        "DX戦略立案",
        "投資対効果試算",
        "ロードマップ策定",
      ],
      whyNeeded:
        "システム導入そのものではなく、「何を実現すべきか」を明確にするため。",
      clientInfo: [
        "経営課題・組織体制",
        "事業計画・現行業務フロー",
        "KPI",
      ],
    },
  },
  {
    id: 2,
    title: "ITコンサルティング",
    shortDescription: "業務とシステムの方針を整理",
    detail: {
      whatWeDo: [
        "要件定義",
        "業務分析",
        "システム構想策定",
        "ソリューション選定",
        "RFP支援",
      ],
      whyNeeded:
        "作るべきシステムの仕様とゴールを関係者間で一致させるため。",
      clientInfo: [
        "現行システム構成・利用部門の要望",
        "業務フロー・予算感",
        "課題一覧",
      ],
    },
  },
  {
    id: 3,
    title: "システム開発",
    shortDescription: "必要な仕組みを設計・開発",
    detail: {
      whatWeDo: ["設計・UI/UX設計", "実装", "テスト", "リリース"],
      whyNeeded:
        "業務改善や事業成長を実現する実用的なシステムを構築するため。",
      clientInfo: [
        "要件定義書・マスタデータ",
        "業務ルール・利用者情報",
        "デザイン方針",
      ],
    },
  },
  {
    id: 4,
    title: "導入・展開",
    shortDescription: "現場で使える状態にする",
    detail: {
      whatWeDo: [
        "環境構築",
        "データ移行",
        "教育支援",
        "運用設計",
        "利用定着支援",
      ],
      whyNeeded: "作ったシステムを現場で確実に活用できる状態にするため。",
      clientInfo: [
        "既存データ・権限設計",
        "利用部門情報・教育対象者",
        "運用ルール",
      ],
    },
  },
  {
    id: 5,
    title: "運用・保守",
    shortDescription: "運用を支え、改善を続ける",
    detail: {
      whatWeDo: [
        "監視",
        "障害対応",
        "改善提案",
        "機能追加",
        "セキュリティ対応",
      ],
      whyNeeded: "システム価値を継続的に高め、安定運用を維持するため。",
      clientInfo: [
        "問い合わせ窓口・障害情報",
        "利用状況・運用ポリシー",
        "改善要望",
      ],
    },
  },
];

export type ServiceHeroProcessPageKey = "consulting" | "enablement";

export type ServiceHeroProcessPageConfig = {
  highlightedStageIds: readonly ServiceHeroProcessStageId[];
  scopeNote: string;
};

export const SERVICE_HERO_PROCESS_OVERVIEW =
  "戦略の整理から開発・運用まで";

export const SERVICE_HERO_PROCESS_PAGE_CONFIG: Record<
  ServiceHeroProcessPageKey,
  ServiceHeroProcessPageConfig
> = {
  consulting: {
    highlightedStageIds: [1, 2],
    scopeNote:
      "このページで主に説明する範囲：戦略・ITコンサルティング",
  },
  enablement: {
    highlightedStageIds: [3, 4, 5],
    scopeNote: "このページで主に説明する範囲：開発・導入・運用",
  },
};
