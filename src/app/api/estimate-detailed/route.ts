import { generateObject } from "ai";
import {
  ESTIMATE_DETAILED_SYSTEM_PROMPT,
  buildEstimateDetailedNarrowRetryPrompt,
  buildEstimateDetailedUserPrompt,
} from "@/lib/estimate-domain/default/prompts";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  estimateRangeWidthMan,
  isNarrowRangeEligible,
} from "@/lib/estimate-domain/default/narrow-eligibility";
import {
  applyIndustryRiskToEstimateRange,
  INDUSTRY_RISK_ASSUMPTION_LINE,
  profileFromEstimateAnswers,
} from "@/lib/estimate/estimate-industry-risk-adjustment";
import {
  buildPricingAnswerLines,
  pickBudgetContextLines,
} from "@/lib/estimate/estimate-pricing-input";
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

  const pricingLines = buildPricingAnswerLines(answers);
  if (pricingLines.length === 0) {
    return new Response(JSON.stringify({ error: "answers required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const budgetContextLines = pickBudgetContextLines(answers);
  const narrowBandTarget = isNarrowRangeEligible(answers);
  const userContent = buildEstimateDetailedUserPrompt({
    answerLines: pricingLines,
    priorContext: prior || undefined,
    budgetContextLines: budgetContextLines.length > 0 ? budgetContextLines : undefined,
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

    const riskProfile = profileFromEstimateAnswers(answers);
    if (riskProfile.regulated) {
      const adj = applyIndustryRiskToEstimateRange(
        final.estimateLoMan,
        final.estimateHiMan,
        riskProfile
      );
      final.estimateLoMan = adj.loMan;
      final.estimateHiMan = adj.hiMan;
      const hasIndustryNote = final.assumptions.some((a) =>
        a.includes("士業・医療・福祉など")
      );
      if (!hasIndustryNote) {
        final.assumptions = [INDUSTRY_RISK_ASSUMPTION_LINE, ...final.assumptions].slice(
          0,
          10
        );
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
