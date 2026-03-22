export type PolicyFlag =
  | "pricing_kb_only"
  | "no_diagnosis"
  | "cite_required"
  | "no_legal_advice"
  | "no_investment_advice";

export interface KbChunk {
  id: string;
  title: string;
  section: string;
  body: string;
}

export interface GuidedChoice {
  label: string;
  nextNodeId?: string;
  /** 末端: これらのKBをAIに渡す */
  kbRefIds?: string[];
  /** 「その他（自由入力）」へ */
  freeform?: boolean;
}

export interface GuidedNode {
  id: string;
  breadcrumb: string;
  prompt: string;
  choices: GuidedChoice[];
}

export interface IndustryDataset {
  id: string;
  label: string;
  /** 業種ボタン用（絵文字1文字推奨） */
  icon: string;
  /** AI system の文体・禁止事項 */
  toneInstruction: string;
  policies: PolicyFlag[];
  /** 画面に出すポリシー説明（1〜2行） */
  policyDescription: string;
  kb: KbChunk[];
  guidedNodes: Record<string, GuidedNode>;
  guidedRootId: string;
  /** 業種固有の前提（法令・社内規程の位置づけ） */
  systemPreamble: string;
  /** ナレッジ外のとき案内する窓口 */
  escalationContact: string;
}

/** UI 用（ストリーミング完了後の回答表示） */
export interface KnowledgeBotUiAnswer {
  body: string;
  /** リクエストで参照したナレッジ（メタ） */
  citations: { id: string; title: string; section: string }[];
  policyLine: string;
}
