/**
 * 業種ごとの DB + プロンプト（思考ロジック）差し替えマップ
 * RRINO-AI 基盤図で業種タグ切替時に、この2要素のみを同時に差し替える
 */

export type IndustryKey = "construction" | "legal" | "manufacturing";

export interface SwappableModuleState {
  db: {
    id: string;
    label: string;
    short: string;
  };
  promptLogic: {
    id: string;
    label: string;
    short: string;
  };
}

export const INDUSTRY_MODULE_MAP: Record<IndustryKey, SwappableModuleState> = {
  construction: {
    db: { id: "db-construction", label: "現場案件DB", short: "案件・図面索引" },
    promptLogic: {
      id: "prompt-construction",
      label: "施工判断ロジック",
      short: "現場文脈を優先",
    },
  },
  legal: {
    db: { id: "db-legal", label: "法務文書DB", short: "条文・判例索引" },
    promptLogic: {
      id: "prompt-legal",
      label: "法的整合ロジック",
      short: "根拠と一貫性重視",
    },
  },
  manufacturing: {
    db: {
      id: "db-manufacturing",
      label: "製造ナレッジDB",
      short: "工程・不良履歴索引",
    },
    promptLogic: {
      id: "prompt-manufacturing",
      label: "工程最適化ロジック",
      short: "歩留まり改善優先",
    },
  },
} as const;

export const INDUSTRY_KEYS: IndustryKey[] = [
  "construction",
  "legal",
  "manufacturing",
];
