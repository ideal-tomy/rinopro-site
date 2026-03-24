import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { buildAnswersSummaryLines } from "@/lib/estimate/estimate-snapshot";
import { ESTIMATE_PHILOSOPHY_UI_PARAGRAPH } from "@/lib/estimate/estimate-output-philosophy";

export interface ContactMailContext {
  name: string;
  email: string;
  message: string;
  triedExperience?: string;
  estimateSnapshot?: EstimateSnapshot | null;
}

function estimateBlock(snapshot: EstimateSnapshot): string {
  const { ai } = snapshot;
  const range = `約${ai.estimateLoMan}万円〜${ai.estimateHiMan}万円程度（目安）`;
  const answers = buildAnswersSummaryLines(snapshot.answers);
  return [
    "■ 見積もりメモ（自動・目安）",
    `タイトル: ${ai.requirementTitle}`,
    `金額の目安: ${range}`,
    "",
    "【お客様向けのやさしい要約】",
    ai.plainCustomerSummary,
    "",
    "【ヒアリング回答の要約】",
    answers || "（なし）",
    "",
    "【確認してほしいこと】",
    ai.openQuestions.length ? ai.openQuestions.map((q) => `・${q}`).join("\n") : "（なし）",
    "",
    "【内容の整理（Markdown）】",
    snapshot.requirementDocMarkdown,
  ].join("\n");
}

/** 管理者・社内向け：先頭に判断しやすい要約 */
export function buildAdminContactEmail(ctx: ContactMailContext): {
  subject: string;
  textBody: string;
} {
  const hasEstimate = Boolean(ctx.estimateSnapshot);
  const snap = ctx.estimateSnapshot;
  const rangeLine =
    snap != null
      ? `金額の目安: 約${snap.ai.estimateLoMan}万円〜${snap.ai.estimateHiMan}万円（税別・目安）`
      : null;

  const headline = [
    `お名前: ${ctx.name}`,
    `メール: ${ctx.email}`,
    ctx.triedExperience ? `触れた体験: ${ctx.triedExperience}` : null,
    rangeLine,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = hasEstimate
    ? `[rinopro][見積メモ同封] ${ctx.name} 様よりお問い合わせ`
    : `[rinopro] ${ctx.name} 様よりお問い合わせ`;

  const textBody = [
    "▼ ひと目用",
    headline,
    "",
    "▼ 本文（お客様のメッセージ）",
    ctx.message,
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
  const subject = "【rinopro】お問い合わせを受け付けました";
  const lines = [
    `${ctx.name} 様`,
    "",
    "このたびはお問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご返信いたします。",
    "",
    "▼ 送信いただいた内容（抜粋）",
    ctx.message.slice(0, 1200) + (ctx.message.length > 1200 ? "\n…（以下省略）" : ""),
  ];
  if (ctx.estimateSnapshot) {
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
