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
  oneLiner?: string;
  storyLead?: string;
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
