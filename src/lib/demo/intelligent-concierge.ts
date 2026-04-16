/**
 * Intelligent Concierge: 選択回答からデモを決定論的にスコアし、最大3件を返す。
 */

import { getDemoSlugsLinkedToExperienceRegistry } from "@/lib/experience/prototype-registry";
import { getCategoryId } from "@/lib/demo/demo-taxonomy";
import {
  createFactEmission,
  createQuestionChoice,
  createQuestionStep,
  type QuestionStepDefinition,
} from "@/lib/chat/question-definition";
import type {
  AiDemo,
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
  AiDemoWorkStyle,
  DemoItem,
} from "@/lib/sanity/types";

export type ConciergeDomainId =
  | "construction"
  | "legal"
  | "manufacturing"
  | "services"
  | "distribution"
  | "staffing"
  | "food_service"
  | "food_wholesale"
  | "other";

export type ConciergeAnswers = {
  domain: ConciergeDomainId;
  /** 第 2 層（任意） */
  domainDetailId?: string | null;
  /** 自由記述 1 行（任意） */
  domainNote?: string | null;
  audienceRole: AiDemoAudienceRole;
  issue: AiDemoIssueTag;
  automationDepth: AiDemoAutomationDepth;
};

export type ConciergePick = {
  demo: AiDemo | DemoItem;
  reason: string;
};

export type DemoConciergeQuestionId =
  | "domain"
  | "audienceRole"
  | "issue"
  | "automationDepth";

const SCORE_DOMAIN = 4;
const SCORE_ROLE = 3;
const SCORE_ISSUE_EXACT = 3;
const SCORE_ISSUE_INFER = 2;
const SCORE_DEPTH = 2;
const SCORE_TAG_AUX = 1;

/** 同点時は体験レジストリに紐づく slug を優先（辞書順の前に並べる） */
const EXPERIENCE_LINKED_SLUGS = getDemoSlugsLinkedToExperienceRegistry();

const WIDE_SCORE_GAP = 2;
const WIDE_MIN_TIE_GROUP = 6;

/** Step UI: 事業領域（第 1 層） */
export const CONCIERGE_DOMAIN_OPTIONS: ReadonlyArray<{
  id: ConciergeDomainId;
  label: string;
  hint?: string;
}> = [
  { id: "construction", label: "建設・インフラ" },
  { id: "legal", label: "士業・専門サービス" },
  { id: "manufacturing", label: "製造・メーカー" },
  { id: "staffing", label: "人材・派遣・登録支援" },
  { id: "food_service", label: "飲食・外食" },
  { id: "food_wholesale", label: "食品・卸・商社" },
  { id: "services", label: "サービス・小売・医療など" },
  { id: "distribution", label: "流通・物流" },
  { id: "other", label: "特定せずに進む" },
];

/** 第 2 層（任意・折りたたみ）。キー未設定ドメインは詳細なし */
export const CONCIERGE_DOMAIN_DETAIL_OPTIONS: Partial<
  Record<
    ConciergeDomainId,
    readonly { id: string; label: string }[]
  >
> = {
  construction: [
    { id: "civil_infra", label: "土木・インフラ" },
    { id: "building", label: "建築・工務" },
    { id: "equipment", label: "設備・メンテ" },
    { id: "real_estate", label: "不動産・開発" },
  ],
  legal: [
    { id: "attorney", label: "弁護士" },
    { id: "tax_accounting", label: "税理・会計" },
    { id: "labor_social", label: "社労士・労務" },
    { id: "admin_scrivener", label: "行政書士" },
    { id: "other_prof", label: "その他士業" },
  ],
  manufacturing: [
    { id: "mass_assembly", label: "量産・組立" },
    { id: "job_shop", label: "受託・多品種" },
    { id: "process_materials", label: "プロセス・素材・部品" },
    { id: "food_plant", label: "食品工場" },
  ],
  staffing: [
    { id: "dispatch", label: "派遣・就労マッチング" },
    { id: "support", label: "登録支援・紹介事業" },
  ],
  food_service: [
    { id: "store", label: "店舗・キッチンオペ" },
    { id: "hq", label: "本部・多店舗管理" },
  ],
  food_wholesale: [
    { id: "trade", label: "卸・営業・受発注" },
    { id: "fresh", label: "鮮度・在庫・ロス管理" },
  ],
  services: [
    { id: "retail", label: "小売・店舗" },
    { id: "medical", label: "医療・介護" },
    { id: "other_svc", label: "その他サービス" },
  ],
  distribution: [
    { id: "warehouse", label: "倉庫・DC" },
    { id: "three_pl", label: "3PL・物流委託" },
    { id: "last_mile", label: "ラストワン・配送" },
    { id: "import_export", label: "輸出入・通関" },
  ],
};

const DOMAIN_DETAIL_LABELS: Partial<Record<ConciergeDomainId, Record<string, string>>> =
  Object.fromEntries(
    Object.entries(CONCIERGE_DOMAIN_DETAIL_OPTIONS).map(([dom, opts]) => [
      dom,
      Object.fromEntries((opts ?? []).map((o) => [o.id, o.label])),
    ])
  ) as Partial<Record<ConciergeDomainId, Record<string, string>>>;

/** 表示用ラベル（industryDisplayLine 用） */
export function getConciergeDomainDetailLabel(
  domainId: ConciergeDomainId,
  detailId: string | null | undefined
): string | undefined {
  if (!detailId) return undefined;
  return DOMAIN_DETAIL_LABELS[domainId]?.[detailId];
}

/** Step UI: 役割・視点 */
export const CONCIERGE_ROLE_OPTIONS: ReadonlyArray<{
  id: AiDemoAudienceRole;
  label: string;
}> = [
  { id: "field", label: "現場・外勤寄り" },
  { id: "management", label: "管理職・内勤寄り" },
  { id: "executive", label: "経営・意思決定寄り" },
];

/** Step UI: 課題 */
export const CONCIERGE_ISSUE_OPTIONS: ReadonlyArray<{
  id: AiDemoIssueTag;
  label: string;
}> = [
  { id: "reporting", label: "報告・記録が重い" },
  { id: "search", label: "探す・要約する時間が重い" },
  { id: "customer_response", label: "顧客対応・問い合わせが重い" },
  { id: "document_work", label: "帳票・契約・文書づくりが重い" },
  { id: "coordination", label: "調整・オペ・品質・安全の見通し" },
];

/** Step UI: 自動化の深度 */
export const CONCIERGE_DEPTH_OPTIONS: ReadonlyArray<{
  id: AiDemoAutomationDepth;
  label: string;
}> = [
  { id: "full_auto", label: "できるだけ自動で形にしたい" },
  { id: "semi_auto", label: "下書きまで任せ、人が仕上げたい" },
  { id: "centralized", label: "情報を束ねて見える化・検索したい" },
];

export const DEMO_CONCIERGE_QUESTION_DEFS: Record<
  DemoConciergeQuestionId,
  QuestionStepDefinition
> = {
  domain: createQuestionStep(
    "domain",
    "Step 1",
    "事業領域に近いものを選んでください",
    CONCIERGE_DOMAIN_OPTIONS.map((option) =>
      createQuestionChoice(
        option.id,
        option.label,
        [
          createFactEmission("industryBundle", "direct"),
          createFactEmission("productCategory", "candidate"),
        ],
        { routingKey: option.id }
      )
    )
  ),
  audienceRole: createQuestionStep(
    "audienceRole",
    "Step 2",
    "ご自身の立ち位置に近いものを選んでください",
    CONCIERGE_ROLE_OPTIONS.map((option) =>
      createQuestionChoice(
        option.id,
        option.label,
        [createFactEmission("targetSummary", "candidate")],
        { routingKey: option.id }
      )
    )
  ),
  issue: createQuestionStep(
    "issue",
    "Step 3",
    "いま負荷が大きいと感じる領域はどれですか",
    CONCIERGE_ISSUE_OPTIONS.map((option) =>
      createQuestionChoice(
        option.id,
        option.label,
        [
          createFactEmission("currentPain", "direct"),
          createFactEmission("productCategory", "candidate"),
        ],
        { routingKey: option.id }
      )
    )
  ),
  automationDepth: createQuestionStep(
    "automationDepth",
    "Step 4",
    "望ましい進め方に近いものを選んでください",
    CONCIERGE_DEPTH_OPTIONS.map((option) =>
      createQuestionChoice(
        option.id,
        option.label,
        [
          createFactEmission("desiredReply", "candidate"),
          createFactEmission("productArchetype", "candidate"),
        ],
        { routingKey: option.id }
      )
    )
  ),
};

const SERVICES_INDUSTRY_TAGS = new Set([
  "サービス",
  "飲食",
  "医療",
  "介護",
  "EC",
  "小売",
  "不動産",
  "人材",
  "保険",
]);

const ONSITE_KEYWORDS =
  /現場|外勤|店舗|配送|ドライバー|施工|巡回|工事|倉庫|工場|プラント|農場|飲食店/;

const DESK_KEYWORDS = /事務|内勤|デスク|バックオフィス|本社|管理職|課長|部長/;

function demoSlug(demo: AiDemo | DemoItem): string {
  const s = typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
  return (s ?? demo._id).toString();
}

function industryTagSet(demo: AiDemo | DemoItem): Set<string> {
  return new Set(demo.industryTags ?? []);
}

function domainScore(demo: AiDemo | DemoItem, domain: ConciergeDomainId): number {
  const tags = industryTagSet(demo);
  const ai = demo as AiDemo;
  const blob = `${demo.title} ${demo.description ?? ""} ${demo.oneLiner ?? ""}`;
  switch (domain) {
    case "construction":
      if (ai.industry === "construction" || tags.has("建設")) return SCORE_DOMAIN;
      return 0;
    case "legal":
      if (ai.industry === "legal" || tags.has("士業")) return SCORE_DOMAIN;
      return 0;
    case "manufacturing":
      if (ai.industry === "manufacturing" || tags.has("製造")) return SCORE_DOMAIN;
      return 0;
    case "staffing":
      if (tags.has("人材") || /派遣|登録支援|外国人材/.test(blob)) return SCORE_DOMAIN;
      return 0;
    case "food_service":
      if (tags.has("飲食") || /外食|レストラン|仕込み|店舗/.test(blob)) return SCORE_DOMAIN;
      return 0;
    case "food_wholesale":
      if (
        tags.has("物流") ||
        tags.has("卸") ||
        /商社|食品卸|鮮度|倉庫/.test(blob)
      ) {
        return SCORE_DOMAIN;
      }
      return 0;
    case "services": {
      for (const t of tags) {
        if (SERVICES_INDUSTRY_TAGS.has(t)) return SCORE_DOMAIN;
      }
      return 0;
    }
    case "distribution":
      if (tags.has("物流")) return SCORE_DOMAIN;
      return 0;
    case "other":
      return 0;
    default:
      return 0;
  }
}

function inferIssuesFromFunctionTags(functionTags: string[] | undefined): Set<AiDemoIssueTag> {
  const out = new Set<AiDemoIssueTag>();
  if (!functionTags?.length) return out;
  for (const tag of functionTags) {
    const cat = getCategoryId([tag]);
    switch (cat) {
      case "report":
      case "inspection":
        out.add("reporting");
        break;
      case "search":
        out.add("search");
        break;
      case "inquiry":
        out.add("customer_response");
        break;
      case "document":
      case "legal":
        out.add("document_work");
        break;
      case "safety":
      case "quality":
      case "logistics":
      case "sales":
        out.add("coordination");
        break;
      case "hr":
        out.add("coordination");
        break;
      default:
        break;
    }
  }
  return out;
}

function demoIssueSet(demo: AiDemo | DemoItem): Set<AiDemoIssueTag> {
  const ai = demo as AiDemo;
  const fromField = ai.issueTags ?? [];
  const s = new Set<AiDemoIssueTag>();
  for (const t of fromField) s.add(t);
  if (s.size === 0) {
    const inferred = inferIssuesFromFunctionTags(demo.functionTags);
    inferred.forEach((x) => s.add(x));
  }
  return s;
}

function issueScore(
  demo: AiDemo | DemoItem,
  selected: AiDemoIssueTag
): { score: number; exact: boolean } {
  const explicit = (demo as AiDemo).issueTags ?? [];
  if (explicit.includes(selected)) {
    return { score: SCORE_ISSUE_EXACT, exact: true };
  }
  const inferred = inferIssuesFromFunctionTags(demo.functionTags);
  if (inferred.has(selected)) {
    return { score: SCORE_ISSUE_INFER, exact: false };
  }
  return { score: 0, exact: false };
}

function roleScore(demo: AiDemo | DemoItem, role: AiDemoAudienceRole): number {
  const ar = (demo as AiDemo).audienceRole;
  if (!ar) return 0;
  return ar === role ? SCORE_ROLE : 0;
}

function depthScore(
  demo: AiDemo | DemoItem,
  depth: AiDemoAutomationDepth
): number {
  const d = (demo as AiDemo).automationDepth;
  if (!d) return 0;
  return d === depth ? SCORE_DEPTH : 0;
}

/** inputType から深度の弱い補助（メタ未整備デモ向け） */
function depthHintFromInputType(demo: AiDemo | DemoItem): AiDemoAutomationDepth | undefined {
  const ai = demo as AiDemo;
  const it = ai.inputType;
  if (!it) return undefined;
  if (it === "audio_text" || it === "image_text") return "semi_auto";
  return undefined;
}

function depthAuxScore(
  demo: AiDemo | DemoItem,
  depth: AiDemoAutomationDepth
): number {
  if ((demo as AiDemo).automationDepth) return 0;
  const hint = depthHintFromInputType(demo);
  if (hint && hint === depth) return 1;
  return 0;
}

function auxTagScore(demo: AiDemo | DemoItem, answers: ConciergeAnswers): number {
  let n = 0;
  const tags = new Set([...(demo.functionTags ?? []), ...(demo.industryTags ?? [])]);
  if (answers.issue === "reporting" && (tags.has("報告書生成") || tags.has("議事録生成")))
    n += SCORE_TAG_AUX;
  if (answers.issue === "search" && (tags.has("検索") || tags.has("要約"))) n += SCORE_TAG_AUX;
  if (answers.issue === "customer_response" && tags.has("返信生成")) n += SCORE_TAG_AUX;
  return n;
}

function resolveWorkStyle(demo: AiDemo | DemoItem): AiDemoWorkStyle {
  const ws = (demo as AiDemo).workStyle;
  if (ws && ws !== "either") return ws;
  const blob = `${demo.title} ${demo.description ?? ""} ${demo.oneLiner ?? ""}`;
  if (ONSITE_KEYWORDS.test(blob)) return "onsite";
  if (DESK_KEYWORDS.test(blob)) return "desk";
  return "either";
}

export type ScoredDemo = {
  demo: AiDemo | DemoItem;
  score: number;
  slug: string;
  workStyle: AiDemoWorkStyle;
  reasonParts: string[];
};

function scoreDemo(demo: AiDemo | DemoItem, answers: ConciergeAnswers): ScoredDemo {
  const slug = demoSlug(demo);
  const parts: string[] = [];

  let score = 0;
  const ds = domainScore(demo, answers.domain);
  if (ds > 0) {
    score += ds;
    parts.push("事業領域");
  }

  const rs = roleScore(demo, answers.audienceRole);
  if (rs > 0) {
    score += rs;
    parts.push("役割");
  }

  const is = issueScore(demo, answers.issue);
  if (is.score > 0) {
    score += is.score;
    parts.push(is.exact ? "課題（明示）" : "課題（用途から推定）");
  }

  const dep = depthScore(demo, answers.automationDepth);
  if (dep > 0) {
    score += dep;
    parts.push("自動化の深さ");
  } else {
    const aux = depthAuxScore(demo, answers.automationDepth);
    if (aux > 0) {
      score += aux;
      parts.push("入力形式との相性");
    }
  }

  const ax = auxTagScore(demo, answers);
  if (ax > 0) {
    score += ax;
    parts.push("用途タグ");
  }

  return {
    demo,
    score,
    slug,
    workStyle: resolveWorkStyle(demo),
    reasonParts: parts,
  };
}

function buildReason(parts: string[]): string {
  if (parts.length === 0) return "代表デモとして提示しています";
  return `${parts.join("・")}の条件に近いデモです`;
}

function sortScored(a: ScoredDemo, b: ScoredDemo): number {
  if (b.score !== a.score) return b.score - a.score;
  const aExp = EXPERIENCE_LINKED_SLUGS.has(a.slug) ? 1 : 0;
  const bExp = EXPERIENCE_LINKED_SLUGS.has(b.slug) ? 1 : 0;
  if (bExp !== aExp) return bExp - aExp;
  return a.slug.localeCompare(b.slug, "en");
}

function isWidePool(sorted: ScoredDemo[]): boolean {
  if (sorted.length === 0) return false;
  const top = sorted[0].score;
  const group = sorted.filter((s) => s.score >= top - WIDE_SCORE_GAP);
  return group.length >= WIDE_MIN_TIE_GROUP;
}

function pickBalancedDeskOnsite(sorted: ScoredDemo[], max: number): ScoredDemo[] {
  const picked: ScoredDemo[] = [];
  const used = new Set<string>();

  const nextOnsite = () =>
    sorted.find((s) => !used.has(s.slug) && s.workStyle === "onsite");
  const nextEitherUnused = () =>
    sorted.find((s) => !used.has(s.slug) && s.workStyle === "either");
  const nextDesk = () =>
    sorted.find((s) => !used.has(s.slug) && s.workStyle === "desk");

  const a = nextOnsite() ?? nextEitherUnused();
  if (a) {
    picked.push(a);
    used.add(a.slug);
  }
  const b =
    nextDesk() ??
    sorted.find((s) => !used.has(s.slug) && s.workStyle === "either") ??
    sorted.find((s) => !used.has(s.slug));
  if (b && picked.length < max) {
    picked.push(b);
    used.add(b.slug);
  }
  for (const s of sorted) {
    if (picked.length >= max) break;
    if (!used.has(s.slug)) {
      picked.push(s);
      used.add(s.slug);
    }
  }
  return picked.slice(0, max);
}

/**
 * 不足分を埋める。まずスコア1以上、それでも足りなければスコア0（並びは sortScored 済み＝体験紐づき優先）。
 * 無理に3件にそろえない（辞書順だけの穴埋めはしない）。
 */
function padRecommendedFromScored(
  scored: ScoredDemo[],
  chosen: ScoredDemo[],
  max: number
): ScoredDemo[] {
  const exclude = new Set(chosen.map((c) => c.slug));
  const out = [...chosen];

  const pushNext = (predicate: (s: ScoredDemo) => boolean) => {
    for (const s of scored) {
      if (out.length >= max) break;
      if (exclude.has(s.slug) || !predicate(s)) continue;
      exclude.add(s.slug);
      out.push(s);
    }
  };

  pushNext((s) => s.score >= 1);
  if (out.length < max) pushNext((s) => s.score === 0);

  return out.slice(0, max);
}

/**
 * 回答に基づき最大3件を返す。関連が薄いデモを辞書順だけで埋めない。
 */
export function pickRecommendedDemos(
  demos: (AiDemo | DemoItem)[],
  answers: ConciergeAnswers
): ConciergePick[] {
  const max = 3;
  if (demos.length === 0) return [];

  const scored = demos.map((d) => scoreDemo(d, answers)).sort(sortScored);
  const wide = isWidePool(scored);

  let chosen: ScoredDemo[] = [];
  if (wide) {
    chosen = pickBalancedDeskOnsite(scored, max);
  } else {
    chosen = scored.slice(0, max);
  }

  chosen = padRecommendedFromScored(scored, chosen, max);

  return chosen.map((c) => ({
    demo: c.demo,
    reason: buildReason(c.reasonParts),
  }));
}
