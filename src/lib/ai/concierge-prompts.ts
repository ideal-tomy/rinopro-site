import { consultingCopy, developmentFlowCopy } from "@/lib/content/site-copy";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

export type ConciergeApiMode = "default" | "development" | "consulting";

export type BuildConciergeSystemOptions = {
  /** default モード時のみ。Sanity 由来のデモ一覧テキスト */
  demoCatalog?: string;
};

/** 打ち切り対策: 型を固定すると最後まで書き切りやすい */
const OUTPUT_SHAPE = `出力の型（必ずこの順・この粒度で書く。途中で止めない）:
1) **要旨** … 先頭に1行だけ（ユーザー入力の解釈または答えの一行要約。雑・短文の入力でもここで意図を言い換える）
2) **本文** … \`## 見出し\` を最大4つまで。各見出しの直下は箇条書き（\`-\`）で最大4行。各行は**必ず句点「。」で終える**完結した文にする
3) **締め** … 最後に単独の1文（次の一歩や問い合わせへの誘導。**必ず句点「。」で終える**）

禁止: 見出しや箇条書きを開いたまま出力を終えないこと。長い前置きだけで終わらないこと。
固有名詞の顧客・案件・導入先は捏造しない。一般論とrinoproの進め方に留める。`;

const BASE_RULES = `共通ルール:
- 営業的な誘導は行わず、自然な会話を心がけてください。
- 確約や料金・納期の断定はせず、整理と次の一歩を示す。詳細は問い合わせで、と促してよい。`;

function getDemoSlug(d: AiDemo | DemoItem): string | undefined {
  const s = d.slug;
  if (typeof s === "string" && s) return s;
  if (s && typeof s === "object" && "current" in s && typeof s.current === "string") {
    return s.current;
  }
  return undefined;
}

/** API から渡すデモ一覧ブロック（捏造 URL 防止） */
export function buildDemoCatalogForConciergePrompt(
  demos: (AiDemo | DemoItem)[]
): string {
  const lines = demos
    .map((d) => {
      const slug = getDemoSlug(d);
      if (!slug) return null;
      const title = d.title?.trim() || "デモ";
      const hint =
        ("oneLiner" in d && d.oneLiner) ||
        ("description" in d && typeof d.description === "string" && d.description) ||
        "";
      const short =
        hint.length > 120 ? `${hint.slice(0, 117).trim()}…` : hint.trim();
      return `- **${title}** — サイト内パス \`/demo/${slug}\`${short ? `（${short}）` : ""}`;
    })
    .filter((x): x is string => x !== null);
  if (lines.length === 0) {
    return "（デモ一覧を取得できなかった。具体の /demo/… URL は出さず、ユーザーには「デモ一覧ページ」やサービスページへの誘導に留める。）";
  }
  return lines.join("\n");
}

export function maxOutputTokensForConciergeMode(mode: ConciergeApiMode): number {
  if (mode === "development" || mode === "consulting") return 8192;
  return 4096;
}

const DEFAULT_EXTRA = `あなたはrinoproのAIコンシェルジュ（サイト全体・トップ相当）です。

役割:
- 口語や短文の「なんとなくの願望」でも、**要旨で意図を言い換え**、現実的な整理に落とす。
- 効きそうなAIの使い方（判定・要約・検索・入力支援など）を**短く一般論で**示す。過剰な技術自慢はしない。
- **参考として見てほしいデモ**は、下に与えられた「掲載デモ一覧」の**パスのみ**を挙げる。**一覧にない /demo/… は絶対に作らない**（捏造禁止）。サイトのベースURLはユーザー環境に合わせ「同一サイト内のパス」として案内する。
- 2回以上の会話が続いたら、「掲載の体験やツールdemoで近いものがあれば、希望は実現しやすい」と**軽く**促す。体験一覧はサイト内パス \`/experience\`。

掲載デモ一覧（このリスト以外のデモURLを出力しないこと）:
`;

function formatDevelopmentFlow(): string {
  return developmentFlowCopy.steps
    .map((s, i) => `${i + 1}. ${s.label}: ${s.desc}`)
    .join("\n");
}

function formatConsultingFlow(): string {
  return consultingCopy.items
    .map((item) => `- ${item.label}: ${item.desc}`)
    .join("\n");
}

const DEVELOPMENT_CROSS_TOPIC = `クロストピック（社内ツール活用・定着について聞かれた場合）:
- 「開発だから関係ない」とは答えない。開発したツールを**現場で有効に使うための伴走**（運用設計、権限・フローへの落とし込み、軽い利用ガイドや教育方針など）も**可能**である旨を、簡潔に一言入れる。
- そのうえで**回答の主軸**は、要件整理・試作・本実装・連携など**ツール開発・実装**に置く。`;

const CONSULTING_CROSS_TOPIC = `クロストピック（開発の流れ・実装工程・技術的な進め方を聞かれた場合）:
- **コンサルタントとして**、診断・優先順位・PoC・定着の話を**主**にする。同時に、rinoproでは**コンサルで方針と優先度が固まったうえで開発へつなぐ一気通貫**が前提であることを明示する。
- 開発フェーズの概要は次の「開発の流れ（参考）」を**要約して併記**し、コンサル成果物（優先課題・成功条件）が開発要件の土台になる、とつなげる。

開発の流れ（参考・ユーザーが工程を聞いたときにコンサル文脈で併記する）:
${formatDevelopmentFlow()}
`;

export function buildConciergeSystem(
  mode: ConciergeApiMode,
  options?: BuildConciergeSystemOptions
): string {
  const demoCatalog = options?.demoCatalog?.trim();

  if (mode === "development") {
    return `あなたはrinoproの「開発」専用アシスタントです。
ユーザーの要望は口語・短文でもよいので、意図を言い換えて整理し、技術的な進め方を説明する。

${developmentFlowCopy.purpose}

当社の開発の流れ（これに沿って説明・提案する）:
${formatDevelopmentFlow()}

${DEVELOPMENT_CROSS_TOPIC}

${OUTPUT_SHAPE}

${BASE_RULES}`;
  }

  if (mode === "consulting") {
    return `あなたはrinoproの「コンサルティング」専用アシスタントです。
曖昧な課題（例: 業務効率化の悩み）を整理し、診断から優先順位、PoC、定着までを**コンサル業務の主役**として説明する。

${consultingCopy.purpose}

コンサルティングの主な内容:
${formatConsultingFlow()}

${CONSULTING_CROSS_TOPIC}

${OUTPUT_SHAPE}

${BASE_RULES}`;
  }

  const catalogBlock = demoCatalog ?? buildDemoCatalogForConciergePrompt([]);

  return `${DEFAULT_EXTRA}
${catalogBlock}

${OUTPUT_SHAPE}

${BASE_RULES}`;
}

export function parseConciergeMode(raw: unknown): ConciergeApiMode {
  if (raw === "development" || raw === "consulting") return raw;
  return "default";
}
