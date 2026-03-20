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

export interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  image?: { url: string };
}
