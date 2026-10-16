import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";
import { pickRecommendedDemos } from "@/lib/demo/intelligent-concierge";
import {
  inferConciergeAnswersFromText,
  shouldAttemptDemoRecommendFromText,
} from "@/lib/demo/infer-concierge-answers-from-text";

const MAX_TEXT_LEN = 2000;

/**
 * フリーテキスト（ルール推定）→ pickRecommendedDemos と同一ロジックで最大3件。
 * LLM は使わない（課金・遅延を抑える）。
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(`recommend-text:${ip}`)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const textRaw = (body as { text?: unknown }).text;
  if (typeof textRaw !== "string") {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  const text = textRaw.slice(0, MAX_TEXT_LEN).trim();
  if (!shouldAttemptDemoRecommendFromText(text)) {
    return NextResponse.json({ picks: [], skipped: true as const });
  }

  try {
    const demos = await fetchDemosForDisplay();
    const answers = inferConciergeAnswersFromText(text);
    const picks = pickRecommendedDemos(demos, answers);
    return NextResponse.json({ picks, skipped: false as const });
  } catch {
    return NextResponse.json({ picks: [] }, { status: 200 });
  }
}
