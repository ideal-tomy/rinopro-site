import { buildAnswersSummaryLines, type EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import {
  inquiryDesiredReplyLabel,
  inquiryIntentLabel,
  type InquiryPreparationRequest,
} from "@/lib/inquiry/inquiry-brief";

export const INQUIRY_BRIEF_SYSTEM_PROMPT = `あなたは Axeon の「問い合わせ前整理」アシスタントです。

役割:
- すでに作られている見積もり・要件定義のたたき台を読み、問い合わせ送信前に不足点だけを補う。
- 問い合わせを受ける側が、初回返信で高粒度の返答をしやすい状態まで整える。
- 長いヒアリングを増やすのではなく、重要な不足だけを最大6問までに絞る。

出力ルール:
- followUpQuestions は 0〜6件。各 question は 1文で短く、helpText も平易にする。
- readiness は次の基準で決める:
  - ready: 目的・対象業務/利用者・時期が明確で、概算または同等の前提確認ができている
  - ready_with_gaps: あと数問の補足で上記が満たせる
  - not_ready: 情報収集目的に寄っており、送信前の整理が不足している
- followUpQuestions がある場合でも、brief は必ず出す。
- brief.problemSummary は「何に困っていて、何を変えたいか」を短くまとめる。
- brief.requestedReplySummary は「今回の返信で何を答えるべきか」を明確に書く。
- brief.targetSummary には対象部署・利用者・業務が分かる範囲で入れる。
- brief.timelineSummary には判断時期や急ぎ度を短く入れる。情報がなければ「時期は要確認」と明記する。
- brief.constraintsSummary には制約・既存システム・個人情報・運用条件などを入れる。なければ「大きな制約は要確認」とする。
- brief.scopeSummary には今回の相談で想定している対象範囲を短くまとめる。
- brief.unresolvedPoints は未確定の重要点のみ。
- brief.replyFocus は初回返信でまず触れるべき論点を 2〜5 個。
- visitor journey がある場合は、brief.journeySummary / interestBias / journeyDepth / visitorJourney に反映する。
- 固有の企業名や事実を捏造しない。
- 営業トーンは禁止。`;

function formatFollowUpItems(snapshot: EstimateSnapshot): string {
  if (snapshot.ai.followUpItems.length === 0) return "（なし）";
  return snapshot.ai.followUpItems
    .map((item) => `- ${item.title}: ${item.description}`)
    .join("\n");
}

function formatOpenQuestions(snapshot: EstimateSnapshot): string {
  if (snapshot.ai.openQuestions.length === 0) return "（なし）";
  return snapshot.ai.openQuestions.map((item) => `- ${item}`).join("\n");
}

function formatFollowUpAnswers(followUpAnswers: Record<string, string>): string {
  const entries = Object.entries(followUpAnswers).filter(([, value]) => value.trim().length > 0);
  if (entries.length === 0) return "（まだ回答なし）";
  return entries.map(([key, value]) => `- ${key}: ${value.trim()}`).join("\n");
}

function formatVisitorJourney(snapshot: EstimateSnapshot): string {
  const summary = snapshot.visitorJourney;
  if (!summary) return "（なし）";
  return [
    `- 要約: ${summary.journeySummary}`,
    `- 関心傾向: ${summary.interestBias}`,
    `- 到達状況: ${summary.journeyDepth}`,
    summary.latestEntryIntent ? `- 直近意図: ${summary.latestEntryIntent}` : "",
    summary.viewedDemoSlugs.length > 0
      ? `- 見た demo: ${summary.viewedDemoSlugs.join(", ")}`
      : "",
    summary.lastFreeformSummary
      ? `- 自由記述メモ: ${summary.lastFreeformSummary}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildInquiryBriefUserPrompt(args: {
  snapshot: EstimateSnapshot;
  preparation: InquiryPreparationRequest;
}): string {
  const { snapshot, preparation } = args;
  const brief = snapshot.inquiryPreparation?.brief;

  return `【今回の問い合わせ意図】
${inquiryIntentLabel(preparation.inquiryIntent)}

【今回ほしい返答】
${inquiryDesiredReplyLabel(preparation.desiredReply)}

【見積もり・要件整理の概略】
${snapshot.ai.plainCustomerSummary}

【サイト内ジャーニーの要約】
${formatVisitorJourney(snapshot)}

【ヒアリング回答の要約】
${buildAnswersSummaryLines(snapshot.answers)}

【未確定の点】
${formatOpenQuestions(snapshot)}

【詳しく確認が必要なこと】
${formatFollowUpItems(snapshot)}

【これまでの追加質問への回答】
${formatFollowUpAnswers(preparation.followUpAnswers)}

【前回の inquiry brief（あれば更新してよい）】
${brief ? JSON.stringify(brief, null, 2) : "（なし）"}

この情報をもとに、問い合わせ送信前の followUpQuestions と brief を返してください。`;
}
