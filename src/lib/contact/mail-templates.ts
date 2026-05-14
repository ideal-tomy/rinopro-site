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

/** 問い合わせメール用コンテキスト。シンプル版は name / email / message が主。旧項目は任意で併記。 */
export interface ContactMailContext {
  name: string;
  email: string;
  company?: string;
  triedExperience?: string;
  /** シンプル版の主本文（旧 problemStatement を流し込んでも可） */
  message: string;
  /** 旧フォーム・詳細見積経由で来た場合のみ併記 */
  inquiryIntent?: InquiryIntent;
  desiredReply?: InquiryDesiredReply;
  targetSummary?: string;
  decisionTimeline?: string;
  constraintsSummary?: string;
  additionalNote?: string;
  inquiryBrief?: InquiryBrief | null;
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

/** 旧フォーム由来の追加フィールド（来ていればのみ） */
function optionalLegacyFormFieldsBlock(ctx: ContactMailContext): string | null {
  const lines: string[] = [];
  if (ctx.inquiryIntent) {
    lines.push(`今回いちばん知りたいこと: ${inquiryIntentLabel(ctx.inquiryIntent)}`);
  }
  if (ctx.desiredReply) {
    lines.push(`今回ほしい返答: ${inquiryDesiredReplyLabel(ctx.desiredReply)}`);
  }
  if (ctx.targetSummary?.trim()) {
    lines.push("", "【対象業務・利用者】", ctx.targetSummary.trim());
  }
  if (ctx.decisionTimeline?.trim()) {
    lines.push("", "【判断したい時期】", ctx.decisionTimeline.trim());
  }
  if (ctx.constraintsSummary?.trim()) {
    lines.push("", "【制約・前提】", ctx.constraintsSummary.trim());
  }
  if (lines.length === 0) return null;
  return ["■ 追加情報（フォーム・旧項目）", "", ...lines].join("\n");
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
    ctx.company?.trim() ? `会社名: ${ctx.company.trim()}` : null,
    `メール: ${ctx.email}`,
    ctx.triedExperience ? `最も近かった体験・デモ: ${ctx.triedExperience}` : null,
    rangeLine,
  ]
    .filter(Boolean)
    .join("\n");

  const subject =
    hasEstimate || ctx.inquiryBrief
      ? `[AXEON][整理済み相談] ${ctx.name} 様よりお問い合わせ`
      : `[AXEON] ${ctx.name} 様よりお問い合わせ`;

  const sections: string[] = [
    "▼ ひと目用",
    headline,
    "",
    "▼ ご相談内容",
    ctx.message.trim(),
  ];

  const legacyBlock = optionalLegacyFormFieldsBlock(ctx);
  if (legacyBlock) {
    sections.push("", legacyBlock);
  }

  if (ctx.visitorJourney) {
    sections.push("", visitorJourneyBlock(ctx.visitorJourney));
  }

  if (ctx.inquiryBrief) {
    sections.push("", inquiryBriefBlock(ctx.inquiryBrief));
  }

  if (ctx.additionalNote?.trim()) {
    sections.push("", "▼ 最後の補足", ctx.additionalNote.trim());
  }

  if (hasEstimate && snap) {
    sections.push("", estimateBlock(snap));
  }

  sections.push(
    "",
    "▼ 構造化データ（JSON・ログ用）",
    hasEstimate && snap ? JSON.stringify(snap, null, 2) : "（見積スナップショットなし）"
  );

  return { subject, textBody: sections.join("\n") };
}

/** お客様向け：受付確認と安心感 */
export function buildCustomerContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
} {
  const subject = "【AXEON】お問い合わせを受け付けました";
  const lines: (string | null)[] = [
    `${ctx.name} 様`,
    ctx.company?.trim() ? `会社名: ${ctx.company.trim()}` : null,
    "",
    "このたびはお問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご返信いたします。",
    "",
    "▼ 送信内容",
    ctx.message.trim(),
  ];

  if (ctx.additionalNote?.trim()) {
    lines.push("", "▼ 補足", ctx.additionalNote.trim());
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

  return { subject, textBody: lines.filter((x) => x !== null).join("\n") };
}
