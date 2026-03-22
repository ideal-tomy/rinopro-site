import type { AiDemoWritingTone } from "@/lib/demo/writing-tone-presets";

export type { AiDemoWritingTone };

export interface CaseStudy {
  _id: string;
  title: string;
  slug?: { current: string };
  industry?: string;
  description?: string;
  image?: { url: string };
}

export interface DemoItem {
  _id: string;
  title: string;
  slug?: string | { current: string };
  description?: string;
  image?: { url: string };
  /** 機能タグ（例: 音声入力、DB検索、要約） */
  functionTags?: string[];
  /** 業種タグ（例: 建設、士業、製造） */
  industryTags?: string[];
  /** モジュールタグ（例: Whisper、Vector DB、LLM wrapper） */
  moduleTags?: string[];
  featuredRank?: number;
  featured?: boolean;
  videoUrl?: string;
  videoPoster?: string;
  highlights?: string[];
  howItHelps?: string;
  useCases?: string[];
  steps?: string[];
  expectedResult?: string;
  oneLiner?: string;
  storyLead?: string;
  embedUrl?: string;
  embedTitle?: string;
}

/** 入力タイプ: テキストのみ / 音声+テキスト / 画像+テキスト */
export type AiDemoInputType = "text_only" | "audio_text" | "image_text";

/** 実行モード: 実AI / モック演出 */
export type AiDemoRunMode = "ai_live" | "mock_preview";

/** Intelligent Concierge（aiDemo 拡張メタ） */
export type AiDemoAudienceRole = "field" | "management" | "executive";
export type AiDemoIssueTag =
  | "reporting"
  | "search"
  | "customer_response"
  | "document_work"
  | "coordination";
export type AiDemoAutomationDepth = "full_auto" | "semi_auto" | "centralized";
export type AiDemoWorkStyle = "desk" | "onsite" | "either";

/** ポートフォリオ主ラベル（Sanity primaryPortfolioTrack） */
export type AiDemoPortfolioTrack =
  | "catalog_text"
  | "experience"
  | "product"
  | "hold";

/** ④保留時の救出／削除判断（Sanity holdRank） */
export type AiDemoHoldRank = "A" | "B" | "C" | "D";

/** aiDemo（量産用）型。Sanity aiDemo スキーマに対応 */
export interface AiDemo {
  _id: string;
  _type: "aiDemo";
  title: string;
  slug?: string;
  industry?: string;
  inputType?: AiDemoInputType;
  inputPlaceholder?: string;
  runMode?: AiDemoRunMode;
  /** 文体プリセット（モック口調・実AI system 追記） */
  writingTone?: AiDemoWritingTone;
  mockOutputPrimary?: string;
  mockOutputSecondary?: string;
  systemPrompt?: string;
  outputStructure?: string;
  sampleData?: string[];
  ctaTitle?: string;
  ctaButtonText?: string;
  description?: string;
  image?: { url: string };
  functionTags?: string[];
  industryTags?: string[];
  moduleTags?: string[];
  /** 想定読者・役割（コンシェルジュ用・任意） */
  audienceRole?: AiDemoAudienceRole;
  /** 課題軸（コンシェルジュ用・任意） */
  issueTags?: AiDemoIssueTag[];
  /** 自動化の深度（コンシェルジュ用・任意） */
  automationDepth?: AiDemoAutomationDepth;
  /** 内勤 / 現場（コンシェルジュ用・任意） */
  workStyle?: AiDemoWorkStyle;
  oneLiner?: string;
  storyLead?: string;
  /** ①②③④ のどれを主とするか（未設定可） */
  primaryPortfolioTrack?: AiDemoPortfolioTrack;
  /** ②③ 用の外部体験 URL */
  experienceUrl?: string;
  /** ④ のとき A〜D */
  holdRank?: AiDemoHoldRank;
  /** ④ の保留理由タグ */
  holdReasonTags?: string[];
  /** false のとき一覧・コンシェルジュ候補から除外（未設定は表示） */
  listedOnCatalog?: boolean;
  /** DemoItem 互換（一覧・詳細表示用） */
  videoUrl?: string;
  videoPoster?: string;
  highlights?: string[];
  howItHelps?: string;
}

/** 一覧・詳細で共通利用するデモ型。AiDemo をベースに DemoItem 互換フィールドを含む */
export type DemoForDisplay = AiDemo;

export interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  image?: { url: string };
}
