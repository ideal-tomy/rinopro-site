import { NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/contact/send-contact-emails";
import { contactSchema } from "@/lib/validation/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

function normalizeContactBody(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const o = raw as Record<string, unknown>;
  const fromMessage =
    typeof o.message === "string" && o.message.trim().length > 0 ? o.message.trim() : "";
  const fromProblem =
    typeof o.problemStatement === "string" && o.problemStatement.trim().length > 0
      ? o.problemStatement.trim()
      : "";
  return {
    ...o,
    message: fromMessage || fromProblem,
  };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const result = contactSchema.safeParse(normalizeContactBody(body));

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      company,
      triedExperience,
      visitorJourney,
      estimateSnapshot,
      inquiryBrief,
      inquiryIntent,
      desiredReply,
      message,
      targetSummary,
      decisionTimeline,
      constraintsSummary,
      additionalNote,
    } = result.data;

    const messageBody = message.trim();

    const mailBase = {
      name,
      email,
      company,
      triedExperience,
      message: messageBody,
      visitorJourney: visitorJourney ?? estimateSnapshot?.visitorJourney ?? null,
      inquiryBrief: inquiryBrief ?? null,
      estimateSnapshot: estimateSnapshot ?? null,
      ...(inquiryIntent ? { inquiryIntent } : {}),
      ...(desiredReply ? { desiredReply } : {}),
      ...(targetSummary?.trim() ? { targetSummary: targetSummary.trim() } : {}),
      ...(decisionTimeline?.trim() ? { decisionTimeline: decisionTimeline.trim() } : {}),
      ...(constraintsSummary?.trim() ? { constraintsSummary: constraintsSummary.trim() } : {}),
      ...(additionalNote?.trim() ? { additionalNote: additionalNote.trim() } : {}),
    };

    console.info("[Contact] inbound", {
      name,
      email,
      company: company?.trim() ?? null,
      inquiryIntent: inquiryIntent ?? null,
      desiredReply: desiredReply ?? null,
      messageLength: messageBody.length,
      triedExperience: triedExperience ?? null,
      hasVisitorJourney: Boolean(visitorJourney ?? estimateSnapshot?.visitorJourney),
      hasEstimateSnapshot: Boolean(estimateSnapshot),
      hasInquiryBrief: Boolean(inquiryBrief),
    });

    const sendResult = await sendContactEmails(mailBase);
    if (!sendResult.ok) {
      const status = sendResult.code === "mail_not_configured" ? 503 : 502;
      return NextResponse.json(
        { error: sendResult.code, message: sendResult.message },
        { status }
      );
    }

    return NextResponse.json({ success: true, mode: sendResult.mode });
  } catch (error) {
    console.error("[Contact] unexpected error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
