import type { ContactMailContext } from "@/lib/contact/mail-templates";
import { isContactSyntheticEstimateSnapshot } from "@/lib/contact/build-contact-synthetic-snapshot";
import { CONCIERGE_DOMAIN_OPTIONS } from "@/lib/demo/intelligent-concierge";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";

const ANSWER_PAIN = "いま困っていること・変えたいこと";
const ANSWER_NOT_WORKING = "うまくいっていないこと";
const ANSWER_PRODUCT = "何を作りたいですか";
const ANSWER_PII = "扱う情報に個人情報は含まれますか";
const ANSWER_CONSTRAINTS = "気になること・制約";
const ANSWER_BUDGET = "ご予算のイメージ";
const ANSWER_BUDGET_NOTE = "予算の補足";

function answerGet(
  answers: Record<string, string>,
  key: string
): string | null {
  const v = answers[key]?.trim();
  return v && v.length > 0 ? v : null;
}

function resolveIndustryLabel(ctx: ContactMailContext): string | null {
  const domainId = ctx.visitorJourney?.industryBundle?.domainId;
  if (domainId) {
    const found = CONCIERGE_DOMAIN_OPTIONS.find((o) => o.id === domainId);
    if (found) return found.label;
  }
  const fromAnswers = answerGet(ctx.estimateSnapshot?.answers ?? {}, "業種");
  return fromAnswers;
}

function formatRangeForSubject(snap: EstimateSnapshot): string {
  return `${snap.ai.estimateLoMan}-${snap.ai.estimateHiMan}万`;
}

function formatRangeForBody(snap: EstimateSnapshot): string {
  return `${snap.ai.estimateLoMan}〜${snap.ai.estimateHiMan}万（目安・税別）`;
}

function detectPiiContradiction(snap: EstimateSnapshot): string | null {
  const piiAnswer = answerGet(snap.answers, ANSWER_PII);
  const constraints = answerGet(snap.answers, ANSWER_CONSTRAINTS) ?? "";
  const prior = snap.priorContext ?? "";

  if (!piiAnswer) return null;

  const deniesPii =
    /いいえ|含まれない|含まない|なし|ない想定/i.test(piiAnswer);
  if (!deniesPii) return null;

  const mentionsPiiInConstraints =
    /個人情報|PII|プライバシー/i.test(constraints) ||
    /個人情報|PII|プライバシー/i.test(prior);

  if (!mentionsPiiInConstraints) return null;

  return "「個人情報なし」×「セキュリティ（個人情報）」→ 初回で確認";
}

function buildFollowUpLine(snap: EstimateSnapshot): string {
  const items = snap.ai.followUpItems;
  if (items.length === 0) return "（なし）";

  const maxShow = 3;
  const shown = items.slice(0, maxShow).map((item, i) => `${i + 1}.${item.title}`);
  const rest = items.length - maxShow;
  if (rest > 0) {
    shown.push(`ほか${rest}件は添付参照`);
  }
  return shown.join(" ");
}

function buildPainLine(snap: EstimateSnapshot): string {
  const parts: string[] = [];
  const pain = answerGet(snap.answers, ANSWER_PAIN);
  const notWorking = answerGet(snap.answers, ANSWER_NOT_WORKING);
  if (pain) parts.push(pain.slice(0, 40));
  if (notWorking) parts.push(notWorking.slice(0, 40));
  if (snap.ai.scopeIn.length > 0 && parts.length < 3) {
    const hint = snap.ai.scopeIn[0];
    if (hint.includes("連携")) parts.push("既存システム連携");
  }
  return parts.length > 0 ? parts.join(" / ") : snap.ai.plainCustomerSummary.slice(0, 80);
}

function buildBudgetLine(snap: EstimateSnapshot): string {
  const budget = answerGet(snap.answers, ANSWER_BUDGET);
  const note = answerGet(snap.answers, ANSWER_BUDGET_NOTE);
  if (budget && note) return `${budget}／${note}`;
  return budget ?? note ?? "（未記入）";
}

function buildBehaviorLine(ctx: ContactMailContext): string {
  const vj = ctx.visitorJourney ?? ctx.estimateSnapshot?.visitorJourney;
  if (!vj) return "（サイト行動データなし）";

  const parts = [
    vj.interestBias,
    vj.journeyDepth,
    vj.latestEntryIntent ? `直近意図: ${vj.latestEntryIntent}` : null,
  ].filter(Boolean);
  return parts.join(" / ");
}

function buildContactLine(ctx: ContactMailContext): string {
  const parts = [
    ctx.name,
    ctx.company?.trim() || null,
    ctx.email,
    ctx.triedExperience ? `体験: ${ctx.triedExperience}` : null,
  ].filter(Boolean);
  return parts.join(" / ");
}

/** 管理者メール先頭の案件サマリ（プレーンテキスト） */
export function buildAdminTriageSummary(ctx: ContactMailContext): string | null {
  const snap = ctx.estimateSnapshot;
  if (!snap || isContactSyntheticEstimateSnapshot(snap)) {
    if (ctx.inquiryBrief) {
      return [
        "【案件】問い合わせページヒアリング（金額レンジ未算出）",
        `【課題】${ctx.inquiryBrief.problemSummary.slice(0, 100)}`,
        `【連絡先】${buildContactLine(ctx)}`,
      ].join("\n");
    }
    return null;
  }

  const industry = resolveIndustryLabel(ctx);
  const product = answerGet(snap.answers, ANSWER_PRODUCT);
  const industryPart = industry ?? "業種未特定";
  const productPart = product ?? snap.ai.requirementTitle;

  const lines = [
    `【案件】${industryPart} / ${productPart} / ${formatRangeForBody(snap)}`,
    "【温度感】詳細見積完了 → 問い合わせ（整理済み）",
    `【課題】${buildPainLine(snap)}`,
    `【予算】${buildBudgetLine(snap)}`,
    `【初回で聞く】${buildFollowUpLine(snap)}`,
  ];

  const alert = detectPiiContradiction(snap);
  if (alert) {
    lines.push(`【注意】${alert}`);
  }

  lines.push(`【行動】${buildBehaviorLine(ctx)}`);
  lines.push(`【連絡先】${buildContactLine(ctx)}`);

  return lines.join("\n");
}

/** 整理済み問い合わせの件名用タグ */
export function buildAdminContactSubject(ctx: ContactMailContext): string {
  const snap = ctx.estimateSnapshot;
  const hasStructured =
    Boolean(snap && !isContactSyntheticEstimateSnapshot(snap)) || Boolean(ctx.inquiryBrief);

  if (!hasStructured) {
    return `[AXEON] ${ctx.name} 様よりお問い合わせ`;
  }

  const parts = ["[AXEON]", "[整理済み]"];

  if (snap && !isContactSyntheticEstimateSnapshot(snap)) {
    const industry = resolveIndustryLabel(ctx);
    if (industry) {
      const short =
        industry.length > 8 ? industry.slice(0, 8) : industry;
      parts.push(`[${short}]`);
    }
    parts.push(`[${formatRangeForSubject(snap)}]`);
  }

  const company = ctx.company?.trim();
  const namePart = company ? `${ctx.name}（${company}）` : ctx.name;
  parts.push(`${namePart}よりお問い合わせ`);

  return parts.join("");
}
