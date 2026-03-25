import { generateObject } from "ai";
import {
  ESTIMATE_DETAILED_SYSTEM_PROMPT,
  buildEstimateDetailedNarrowRetryPrompt,
  buildEstimateDetailedUserPrompt,
} from "@/lib/ai/estimate-prompts";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  estimateRangeWidthMan,
  isNarrowRangeEligible,
} from "@/lib/estimate/estimate-detailed-narrow-eligibility";
import { estimateDetailedAiOutputSchema } from "@/lib/estimate/estimate-snapshot";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const ResultSchema = estimateDetailedAiOutputSchema;

function sortLoHi(object: { estimateLoMan: number; estimateHiMan: number }) {
  if (object.estimateHiMan < object.estimateLoMan) {
    const t = object.estimateLoMan;
    object.estimateLoMan = object.estimateHiMan;
    object.estimateHiMan = t;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: {
    answers?: Record<string, string>;
    priorContext?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const answers = body.answers ?? {};
  const prior = (body.priorContext ?? "").trim();

  const answerLines = Object.entries(answers)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${String(v).trim()}`);

  if (answerLines.length === 0) {
    return new Response(JSON.stringify({ error: "answers required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const narrowBandTarget = isNarrowRangeEligible(answers);
  const userContent = buildEstimateDetailedUserPrompt({
    answerLines,
    priorContext: prior || undefined,
    narrowBandTarget,
  });

  try {
    const { object } = await generateObject({
      model: defaultGeminiModel,
      schema: ResultSchema,
      system: ESTIMATE_DETAILED_SYSTEM_PROMPT,
      prompt: userContent,
      maxOutputTokens: 4096,
    });

    sortLoHi(object);

    let final = object;
    if (
      narrowBandTarget &&
      estimateRangeWidthMan(final.estimateLoMan, final.estimateHiMan) > 100
    ) {
      try {
        const retryPrompt = buildEstimateDetailedNarrowRetryPrompt(userContent);
        const { object: retryObject } = await generateObject({
          model: defaultGeminiModel,
          schema: ResultSchema,
          system: ESTIMATE_DETAILED_SYSTEM_PROMPT,
          prompt: retryPrompt,
          maxOutputTokens: 4096,
        });
        sortLoHi(retryObject);
        final = retryObject;
      } catch (retryErr) {
        console.warn("[api/estimate-detailed] narrow retry skipped", retryErr);
      }
    }

    return Response.json(final);
  } catch (err) {
    const message = err instanceof Error ? err.message : "generate failed";
    console.error("[api/estimate-detailed]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
