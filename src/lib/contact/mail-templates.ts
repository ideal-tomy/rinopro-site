import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { buildAnswersSummaryLines } from "@/lib/estimate/estimate-snapshot";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";
import {
  inquiryDesiredReplyLabel,
  inquiryIntentLabel,
  inquiryReadinessLabel,
  type InquiryBrief,
  type InquiryDesiredReply,
  type InquiryIntent,
} from "@/lib/inquiry/inquiry-brief";
import { ESTIMATE_PHILOSOPHY_UI_PARAGRAPH } from "@/lib/estimate/estimate-output-philosophy";
import { isContactSyntheticEstimateSnapshot } from "@/lib/contact/build-contact-synthetic-snapshot";

export interface ContactMailContext {
  name: string;
  email: string;
  triedExperience?: string;
  inquiryBrief?: InquiryBrief | null;
  inquiryIntent: InquiryIntent;
  desiredReply: InquiryDesiredReply;
  problemStatement: string;
  targetSummary: string;
  decisionTimeline: string;
  constraintsSummary?: string;
  additionalNote?: string;
  visitorJourney?: VisitorJourneySummary | null;
  estimateSnapshot?: EstimateSnapshot | null;
}

function estimateBlock(snapshot: EstimateSnapshot): string {
  const { ai } = snapshot;
  const synthetic = isContactSyntheticEstimateSnapshot(snapshot);
  const range = synthetic
    ? "（問い合わせページのヒアリングのみ。金額レンジは未算出）"
    : `約${ai.estimateLoMan}万円〜${ai.estimateHiMan}万円程度（目安）`;
  const answers = buildAnswersSummaryLines(snapshot.answers);
  return [
    synthetic ? "■ 問い合わせヒアリング（同封データ）" : "■ 見積もりメモ（自動・目安）",
    `タイトル: ${ai.requirementTitle}`,
    `金額の目安: ${range}`,
    "",
    "【概略】",
    ai.plainCustomerSummary,
    "",
    "【ヒアリング回答の要約】",
    answers || "（なし）",
    "",
    "【詳しく確認が必要なこと】",
    ai.followUpItems.length
      ? ai.followUpItems.map((x) => `・${x.title}\n  ${x.description}`).join("\n\n")
      : "（なし）",
    "",
    "【内容の整理（Markdown）】",
    snapshot.requirementDocMarkdown,
  ].join("\n");
}

function structuredOverviewBlockFull(ctx: ContactMailContext): string {
  return [
    "■ 問い合わせの要点",
    `今回いちばん知りたいこと: ${inquiryIntentLabel(ctx.inquiryIntent)}`,
    `今回ほしい返答: ${inquiryDesiredReplyLabel(ctx.desiredReply)}`,
    "",
    "【困っていること・変えたいこと】",
    ctx.problemStatement,
    "",
    "【対象業務・利用者】",
    ctx.targetSummary,
    "",
    "【判断したい時期】",
    ctx.decisionTimeline,
    "",
    "【制約・前提】",
    ctx.constraintsSummary?.trim() || "（大きな制約は未記入）",
  ].join("\n");
}

/** ブリーフがあるときは重複を避け、フォーム欄は短く示す */
function structuredOverviewBlock(ctx: ContactMailContext): string {
  if (ctx.inquiryBrief) {
    return [
      "■ 問い合わせ（フォーム欄・短要約）",
      `今回いちばん知りたいこと: ${inquiryIntentLabel(ctx.inquiryIntent)}`,
      `今回ほしい返答: ${inquiryDesiredReplyLabel(ctx.desiredReply)}`,
      "",
      "詳細な整理内容は、次の「問い合わせブリーフ」を参照してください。",
    ].join("\n");
  }
  return structuredOverviewBlockFull(ctx);
}

function inquiryBriefBlock(brief: InquiryBrief): string {
  return [
    "■ 問い合わせブリーフ（自動整理）",
    `状態: ${inquiryReadinessLabel(brief.readiness)}`,
    `意図: ${brief.inquiryIntentLabel}`,
    `求める返答: ${brief.desiredReplyLabel}`,
    "",
    "【課題の要約】",
    brief.problemSummary,
    "",
    "【今回の返信でまず答えるべきこと】",
    brief.requestedReplySummary,
    "",
    "【今回の相談範囲】",
    brief.scopeSummary,
    "",
    "【制約・前提】",
    brief.constraintsSummary,
    "",
    "【初回返信で触れるべき論点】",
    brief.replyFocus.length > 0
      ? brief.replyFocus.map((item) => `・${item}`).join("\n")
      : "（なし）",
    "",
    "【まだ確認が必要な点】",
    brief.unresolvedPoints.length > 0
      ? brief.unresolvedPoints.map((item) => `・${item}`).join("\n")
      : "（なし）",
  ].join("\n");
}

function visitorJourneyBlock(summary: VisitorJourneySummary): string {
  return [
    "■ サイト内ジャーニー要約",
    `要約: ${summary.journeySummary}`,
    `関心傾向: ${summary.interestBias}`,
    `到達状況: ${summary.journeyDepth}`,
    summary.latestEntryIntent ? `直近意図: ${summary.latestEntryIntent}` : null,
    summary.viewedDemoSlugs.length > 0
      ? `見た demo: ${summary.viewedDemoSlugs.join(", ")}`
      : null,
    summary.lastFreeformSummary
      ? `自由記述メモ: ${summary.lastFreeformSummary}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** 管理者・社内向け：先頭に判断しやすい要約 */
export function buildAdminContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
} {
  const hasEstimate = Boolean(ctx.estimateSnapshot);
  const snap = ctx.estimateSnapshot;
  const rangeLine =
    snap != null && !isContactSyntheticEstimateSnapshot(snap)
      ? `金額の目安: 約${snap.ai.estimateLoMan}万円〜${snap.ai.estimateHiMan}万円（税別・目安）`
      : null;

  const headline = [
    `お名前: ${ctx.name}`,
    `メール: ${ctx.email}`,
    ctx.triedExperience ? `最も近かった体験・デモ: ${ctx.triedExperience}` : null,
    rangeLine,
  ]
    .filter(Boolean)
    .join("\n");

  const subject =
    hasEstimate || ctx.inquiryBrief
      ? `[Axeon][整理済み相談] ${ctx.name} 様よりお問い合わせ`
      : `[Axeon] ${ctx.name} 様よりお問い合わせ`;

  const textBody = [
    "▼ ひと目用",
    headline,
    "",
    structuredOverviewBlock(ctx),
    "",
    ctx.visitorJourney ? visitorJourneyBlock(ctx.visitorJourney) : null,
    "",
    ctx.inquiryBrief ? inquiryBriefBlock(ctx.inquiryBrief) : null,
    "",
    ctx.additionalNote?.trim()
      ? ["▼ 最後の補足", ctx.additionalNote.trim()].join("\n")
      : null,
    "",
    hasEstimate && snap ? estimateBlock(snap) : null,
    "",
    "▼ 構造化データ（JSON・ログ用）",
    hasEstimate && snap ? JSON.stringify(snap, null, 2) : "（見積スナップショットなし）",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, textBody };
}

/** お客様向け：受付確認と安心感 */
export function buildCustomerContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
} {
  const subject = "【Axeon】お問い合わせを受け付けました";
  const lines = [
    `${ctx.name} 様`,
    "",
    "このたびはお問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご返信いたします。",
    "",
    "▼ 送信内容の要点",
    `今回いちばん知りたいこと: ${inquiryIntentLabel(ctx.inquiryIntent)}`,
    `今回ほしい返答: ${inquiryDesiredReplyLabel(ctx.desiredReply)}`,
    "",
    "困っていること・変えたいこと:",
    ctx.problemStatement,
    "",
    "対象業務・利用者:",
    ctx.targetSummary,
    "",
    "判断したい時期:",
    ctx.decisionTimeline,
  ];
  if (ctx.additionalNote?.trim()) {
    lines.push("", "補足:", ctx.additionalNote.trim());
  }
  if (ctx.visitorJourney) {
    lines.push("", "▼ サイト内で引き継いだ内容", ctx.visitorJourney.journeySummary);
  }
  if (ctx.estimateSnapshot && !isContactSyntheticEstimateSnapshot(ctx.estimateSnapshot)) {
    const { ai } = ctx.estimateSnapshot;
    lines.push(
      "",
      "▼ 見積もりの目安（参考）",
      `金額の目安: 約${ai.estimateLoMan}万円〜${ai.estimateHiMan}万円程度`,
      "※ 正式なお見積もりではありません。詳細は返信にてご案内します。",
      "",
      ESTIMATE_PHILOSOPHY_UI_PARAGRAPH
    );
  }
  lines.push("", "※ 本メールに心当たりがない場合は、お手数ですが破棄してください。");
  return { subject, textBody: lines.join("\n") };
}
