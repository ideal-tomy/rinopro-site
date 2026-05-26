import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
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
import {
  buildAdminContactSubject,
  buildAdminTriageSummary,
} from "@/lib/contact/build-admin-triage-summary";
import {
  buildAdminContactAttachments,
  formatAttachmentListForBody,
  type ContactMailAttachment,
} from "@/lib/contact/build-contact-mail-attachments";
import {
  adminUserAddedDisplay,
  customerMessageDisplay,
  splitContactMessage,
} from "@/lib/contact/split-contact-message";

export type { ContactMailAttachment };

/** 問い合わせメール用コンテキスト。シンプル版は name / email / message が主。 */
export interface ContactMailContext {
  name: string;
  email: string;
  company?: string;
  triedExperience?: string;
  message: string;
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

function compactVisitorJourneyBlock(summary: VisitorJourneySummary): string {
  return [
    `要約: ${summary.journeySummary}`,
    `関心: ${summary.interestBias} / 到達: ${summary.journeyDepth}`,
    summary.latestEntryIntent ? `直近意図: ${summary.latestEntryIntent}` : null,
    summary.industryBundle?.domainId
      ? `業種コンテキスト: ${summary.industryBundle.domainId}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function followUpTitlesBlock(snapshot: EstimateSnapshot): string | null {
  if (snapshot.ai.followUpItems.length === 0) return null;
  const lines = snapshot.ai.followUpItems
    .slice(0, 5)
    .map((item) => `・${item.title}`);
  return ["▼ 初回返信メモ（タイトルのみ）", ...lines].join("\n");
}

/** 管理者・社内向け：サマリ + コンパクト本文 + 添付メタ */
export function buildAdminContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
  attachments: ContactMailAttachment[];
} {
  const split = splitContactMessage(ctx.message);
  const attachments = buildAdminContactAttachments(ctx.estimateSnapshot);
  const snap = ctx.estimateSnapshot;
  const hasRealEstimate =
    snap != null && !isContactSyntheticEstimateSnapshot(snap);

  const sections: string[] = [];

  const triage = buildAdminTriageSummary(ctx);
  if (triage) {
    sections.push("▼ 案件サマリ（30秒）", triage, "");
  } else {
    const contactLines = [
      "▼ 連絡先",
      `お名前: ${ctx.name}`,
      ctx.company?.trim() ? `会社名: ${ctx.company.trim()}` : "",
      `メール: ${ctx.email}`,
      ctx.triedExperience ? `体験・デモ: ${ctx.triedExperience}` : "",
      "",
    ].filter((line, i, arr) => line !== "" || i === arr.length - 1);
    sections.push(...contactLines);
  }

  sections.push(
    "▼ お客様の追記（手入力のみ）",
    adminUserAddedDisplay(split)
  );

  if (hasRealEstimate && snap) {
    const followUp = followUpTitlesBlock(snap);
    if (followUp) {
      sections.push("", followUp);
    }
  }

  const journey = ctx.visitorJourney ?? snap?.visitorJourney;
  if (journey) {
    sections.push("", "▼ サイト内ジャーニー（コンパクト）", compactVisitorJourneyBlock(journey));
  }

  const legacyBlock = optionalLegacyFormFieldsBlock(ctx);
  if (legacyBlock) {
    sections.push("", legacyBlock);
  }

  if (ctx.inquiryBrief) {
    sections.push("", inquiryBriefBlock(ctx.inquiryBrief));
  }

  if (ctx.additionalNote?.trim()) {
    sections.push("", "▼ 最後の補足", ctx.additionalNote.trim());
  }

  sections.push(
    "",
    "---",
    "詳細な要件定義・ヒアリング回答・構造化データは添付を参照してください。",
    formatAttachmentListForBody(attachments)
  );

  const textBody = sections.join("\n");

  return {
    subject: buildAdminContactSubject(ctx),
    textBody,
    attachments,
  };
}

/** お客様向け：短い受付確認 */
export function buildCustomerContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
} {
  const split = splitContactMessage(ctx.message);
  const snap = ctx.estimateSnapshot;
  const hasRealEstimate =
    snap != null && !isContactSyntheticEstimateSnapshot(snap);

  const lines: (string | null)[] = [
    `${ctx.name} 様`,
    ctx.company?.trim() ? `会社名: ${ctx.company.trim()}` : null,
    "",
    "このたびはお問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご返信いたします。",
    "",
    "▼ お送りいただいた内容",
    customerMessageDisplay(split),
  ];

  if (ctx.additionalNote?.trim()) {
    lines.push("", "▼ 補足", ctx.additionalNote.trim());
  }

  if (hasRealEstimate && snap) {
    lines.push(
      "",
      "▼ 見積もりの目安（参考）",
      `約 ${snap.ai.estimateLoMan} 万円〜${snap.ai.estimateHiMan} 万円程度`,
      "※ 正式なお見積もりではありません。詳細は返信にてご案内します。",
      "",
      ESTIMATE_PHILOSOPHY_UI_PARAGRAPH
    );
  }

  lines.push("", "※ 本メールに心当たりがない場合は、お手数ですが破棄してください。");

  return {
    subject: "【AXEON】お問い合わせを受け付けました",
    textBody: lines.filter((x) => x !== null).join("\n"),
  };
}
