/**
 * シニアモード（高関与ユーザー向け）: 発火判定・要約デモカタログ・プロンプト追記。
 * クライアント／API の双方から import 可（サーバー専用依存なし）。
 */

import type { UIMessage } from "ai";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { getUIMessageText } from "@/lib/chat/uimessage-text";
import {
  CONSULTING_PRESET_LABELS,
  CON_STEP1_DEFS,
  DEVELOPMENT_PRESET_LABELS,
  DEV_STEP1_DEFS,
} from "@/lib/chat/service-card-preset-content";

/** ページ文脈（concierge-prompts の parse と同値） */
export type SeniorPageContext = "top" | "demo" | "services" | "other";

export type ConciergeSignals = {
  /** サービスウィザードでプリセット確定直後の次のユーザー送信のみ */
  postPreset?: boolean;
  presetLabel?: string;
  /** URL クエリ `concierge_from=case_study` 等で明示した事例・高関与流入 */
  fromCaseStudy?: boolean;
};

const FREE_FORM_LABEL = "自由記述で相談する";

/** 40文字以上で「具体的に書こうとしている」シグナル */
export const SENIOR_MIN_MESSAGE_LENGTH = 40;

/** 事例流入時の最低文字数（短すぎる1語だけでは発火しない） */
const SENIOR_MIN_WITH_CASE_STUDY = 24;

/**
 * 2つ以上含まれたらシグナル（部分一致・表記ゆれは今後拡張可）
 */
export const SENIOR_KEYWORDS = [
  "連携",
  "課題",
  "予算",
  "基幹",
  "現場",
  "システム",
  "自動化",
  "手間",
  "承認",
  "セキュリティ",
  "レガシー",
  "請求",
  "API",
  "データ",
  "運用",
  "PoC",
  "見積",
  "開発",
] as const;

const ALL_WIZARD_USER_LABELS: ReadonlySet<string> = new Set([
  ...DEVELOPMENT_PRESET_LABELS,
  ...CONSULTING_PRESET_LABELS,
  ...DEV_STEP1_DEFS.map((d) => d.label),
  ...CON_STEP1_DEFS.map((d) => d.label),
  FREE_FORM_LABEL,
]);

function getDemoSlug(d: AiDemo | DemoItem): string | undefined {
  const s = d.slug;
  if (typeof s === "string" && s) return s;
  if (s && typeof s === "object" && "current" in s && typeof s.current === "string") {
    return s.current;
  }
  return undefined;
}

function countSeniorKeywordHits(text: string): number {
  if (!text.trim()) return 0;
  let n = 0;
  for (const kw of SENIOR_KEYWORDS) {
    if (text.includes(kw)) n += 1;
  }
  return n;
}

/** ウィザード1通目が選択肢ラベルで、2通目以降にユーザーがいる */
export function detectPostWizardUserMessage(messages: UIMessage[]): boolean {
  const userMsgs = messages.filter((m) => m.role === "user");
  if (userMsgs.length < 2) return false;
  const first = getUIMessageText(userMsgs[0]).trim();
  return ALL_WIZARD_USER_LABELS.has(first);
}

export function parseConciergeSignals(raw: unknown): ConciergeSignals | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: ConciergeSignals = {};
  if (o.postPreset === true) out.postPreset = true;
  if (typeof o.presetLabel === "string" && o.presetLabel.length > 0 && o.presetLabel.length < 240) {
    out.presetLabel = o.presetLabel;
  }
  if (o.fromCaseStudy === true) out.fromCaseStudy = true;
  return Object.keys(out).length ? out : undefined;
}

function isSeniorEligibleContext(
  mode: "default" | "development" | "consulting",
  pageContext: SeniorPageContext,
  signals: ConciergeSignals | undefined
): boolean {
  if (mode === "development" || mode === "consulting") return true;
  if (pageContext === "demo" || pageContext === "services") return true;
  if (signals?.fromCaseStudy) return true;
  return false;
}

/**
 * 直近のユーザー発話に対する応答でシニアモードにするか。
 * 最終メッセージが user でない場合は false。
 */
export function inferSeniorEngagement(params: {
  messages: UIMessage[];
  mode: "default" | "development" | "consulting";
  pageContext: SeniorPageContext;
  signals?: ConciergeSignals | null;
}): boolean {
  const { messages, mode, pageContext, signals } = params;
  if (messages.length === 0) return false;
  const last = messages[messages.length - 1];
  if (last.role !== "user") return false;

  if (!isSeniorEligibleContext(mode, pageContext, signals ?? undefined)) return false;

  const text = getUIMessageText(last).trim();
  if (!text) return false;

  const kw = countSeniorKeywordHits(text);
  const postWizard = detectPostWizardUserMessage(messages);

  const engagement =
    text.length >= SENIOR_MIN_MESSAGE_LENGTH ||
    kw >= 2 ||
    signals?.postPreset === true ||
    postWizard ||
    (signals?.fromCaseStudy === true && text.length >= SENIOR_MIN_WITH_CASE_STUDY);

  return engagement;
}

const SENIOR_CATALOG_MAX = 10;

/**
 * シニア用・要約デモカタログ（最大10件、functionTags 先頭でグルーピング）。
 */
export function buildSeniorDemoCatalog(demos: (AiDemo | DemoItem)[]): string {
  const withSlug = demos
    .map((d) => ({ d, slug: getDemoSlug(d) }))
    .filter((x): x is { d: AiDemo | DemoItem; slug: string } => Boolean(x.slug));

  const featuredFirst = [...withSlug].sort((a, b) => {
    const fa = "featured" in a.d && a.d.featured ? 1 : 0;
    const fb = "featured" in b.d && b.d.featured ? 1 : 0;
    if (fb !== fa) return fb - fa;
    const ra =
      "featuredRank" in a.d && typeof a.d.featuredRank === "number" ? a.d.featuredRank : 999;
    const rb =
      "featuredRank" in b.d && typeof b.d.featuredRank === "number" ? b.d.featuredRank : 999;
    return ra - rb;
  });

  const picked = featuredFirst.slice(0, SENIOR_CATALOG_MAX);
  const groups = new Map<string, { d: AiDemo | DemoItem; slug: string }[]>();
  for (const item of picked) {
    const tag =
      "functionTags" in item.d && item.d.functionTags?.[0]
        ? item.d.functionTags[0]
        : "その他";
    const arr = groups.get(tag) ?? [];
    arr.push(item);
    groups.set(tag, arr);
  }

  const lines: string[] = [
    "次の一覧に含まれる **サイト内パスのみ** を本文でリンクしてよい（一覧外の /demo/… は禁止）。",
    "",
  ];

  const sortedTags = [...groups.keys()].sort((a, b) => {
    if (a === "その他") return 1;
    if (b === "その他") return -1;
    return a.localeCompare(b, "ja");
  });

  for (const tag of sortedTags) {
    const items = groups.get(tag) ?? [];
    lines.push(`### ${tag}`);
    for (const { d, slug } of items) {
      const title = d.title?.trim() || "デモ";
      const hint =
        ("oneLiner" in d && d.oneLiner) ||
        ("description" in d && typeof d.description === "string" && d.description) ||
        "";
      const short =
        hint.length > 100 ? `${hint.slice(0, 97).trim()}…` : hint.trim();
      lines.push(
        `- **${title}** … パス \`/demo/${slug}\`${short ? ` — ${short}` : ""}`
      );
    }
    lines.push("");
  }

  lines.push("固定パス（常に使用可）: `/demo/list` , `/estimate-detailed` , `/contact`");
  return lines.join("\n").trim();
}

/** シニア時の人格・スタンス（営業感を抑え、理由付きで寄り添う） */
export const SENIOR_SYSTEM_APPENDIX = `## シニアモード（経験豊富なソリューションアーキテクト／シニアコンサルタント）

あなたは**案内役だけでなく**、ユーザーの断片的情報から業務上のボトルネックを察知し、**実現可能性（技術・運用）**と**定着**まで見据えて助言する立場です。

### 振る舞い
- **行間を読む**: 例:「効率化したい」の背後に「入力負担」「ミス不安」「承認の遅れ」のどれが近いか推測し、優しく言い当てる形で触れる（断定しすぎない）。
- **境界線を引く**: すべてを自動化と言わず、「ここはツール／ここは人の判断／ここは既存システム」と**スコープの切り方**を1つ示す。
- **鋭い質問を1つ**: 回答の後半（判断軸の近く）に、プロが現場を把握するための**質問を1つだけ**入れる（例: そのデータは更新のリアルタイム性が必要か、等）。

### リンク・誘導（営業色を出さない）
- **リンクは短い羅列にしない**。各おすすめについて必ず **(1) いまの相談のどこに効くか（1〜2文・ユーザーの言葉に寄せる）** のあとに **(2) Markdown リンク1本** を続ける。
- **詳細見積もり（\`/estimate-detailed\`）** を出すときは、「売り込み」ではなく **質問に答えながら、漠然とした課題や欲しいツールの像を言語化・整理できる** ニュアンスで理由を書く。
- **特定デモ（\`/demo/{slug}\`）** は、上に与えた「シニア用デモ一覧」に含まれる slug のみ。理由は「どの操作や精度が、いまの悩みの確認に役立つか」を平易に。
- **お問い合わせ（\`/contact\`）** は、現場の合意形成や業務棚卸しなど**伴走が自然なときだけ**提案する。毎回3択を埋めなくてよい。
- **チャット下部のボタン帯**が主導線。本文のリンクは**納得・参考**として控えめに。強い誘導・確約・「ぜひ」「お任せ」は禁止（共通ルールに従う）。

### 出力ボリューム
- シニア時も冗長にしない。**8〜14行程度**を目安に、インサイトとリンク理由を優先する。`;

/** シニア時は 4) 補助導線を拡張（理由＋リンクのペア、最大2手） */
export const OUTPUT_SHAPE_SENIOR = `出力の型（必ずこの順・この粒度で書く。途中で止めない）:
1) **受容** … 先頭に1文だけ（ユーザーの不安・迷いをそのまま受け止める。否定せず共感する）
2) **言語化支援** … 2〜3文で「次に何を決めれば前に進めるか」を平易に示す。**結論ファースト**。専門用語は**1回答あたり最大2語まで**（括弧で一言補足）。
3) **判断軸** … 「〜を確認してみてください。」「〜が分岐点になります。」の形で1文。必要なら直前に**確認質問を1つだけ**短く入れてよい。
4) **補助導線（参考・最大2手・任意）** … チャットUIのボタンに代わるものではない。**各手**について次の形式で書く:
   - **(a)** いまの相談のどこに効くか（1〜2文。ユーザーの表現に寄せる）
   - **(b)** Markdown リンク1本（\`[表示名](パス)\`）。**許可パス**: 上記シニア用デモ一覧の \`/demo/{slug}\`、および \`/demo/list\`・\`/estimate-detailed\`・\`/contact\` のみ。**それ以外は禁止**。
   見積を選ぶ場合、(a) に **質問に答えながら要件・ツール像を整理できる** 旨を必ず含める。
   **不要なら 4) 全体を省略するか、1手だけ**にしてよい。無理に3種類（demo・見積・問い合わせ）を揃えない。

禁止: 見出しや箇条書きを開いたまま出力を終えないこと。長い前置きだけで終わらないこと。
固有名詞の顧客・案件は捏造しない。`;
