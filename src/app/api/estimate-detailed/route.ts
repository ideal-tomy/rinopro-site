import { generateObject } from "ai";
import {
  ESTIMATE_DETAILED_SYSTEM_PROMPT,
  buildEstimateDetailedNarrowRetryPrompt,
  buildEstimateDetailedUserPrompt,
} from "@/lib/estimate-domain/default/prompts";
import { defaultGeminiModel, estimateFallbackGeminiModel } from "@/lib/ai/gemini-model";
import { aiFailureResponse, logAiRouteError } from "@/lib/ai/api-error-response";
import { checkEstimateRequest, readJsonWithLimit } from "@/lib/ai/request-limits";
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
import { applyCredibleMinimumRangeToEstimate } from "@/lib/estimate/estimate-credible-range";
import { estimateDetailedAiOutputSchema } from "@/lib/estimate/estimate-snapshot";
import { rateLimitRequest } from "@/lib/rate-limit";

export const maxDuration = 60;

const ResultSchema = estimateDetailedAiOutputSchema;
const PRIMARY_MAX_OUTPUT_TOKENS = 2048;
const NARROW_RETRY_MAX_OUTPUT_TOKENS = 1536;
const NARROW_RETRY_MAX_FIRST_CALL_MS = 10_000;

type EstimateGenerationResult = {
  object: Awaited<ReturnType<typeof generateObject<typeof ResultSchema>>>["object"];
  usedFallbackModel: boolean;
};

async function generateEstimateObjectWithFallback(
  prompt: string
): Promise<EstimateGenerationResult> {
  try {
    const { object } = await generateObject({
      model: defaultGeminiModel,
      schema: ResultSchema,
      system: ESTIMATE_DETAILED_SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: PRIMARY_MAX_OUTPUT_TOKENS,
    });
    return { object, usedFallbackModel: false };
  } catch (primaryErr) {
    logAiRouteError("api/estimate-detailed primary model failed, trying fallback", primaryErr);
    const { object } = await generateObject({
      model: estimateFallbackGeminiModel,
      schema: ResultSchema,
      system: ESTIMATE_DETAILED_SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: PRIMARY_MAX_OUTPUT_TOKENS,
    });
    return { object, usedFallbackModel: true };
  }
}

function sortLoHi(object: { estimateLoMan: number; estimateHiMan: number }) {
  if (object.estimateHiMan < object.estimateLoMan) {
    const t = object.estimateLoMan;
    object.estimateLoMan = object.estimateHiMan;
    object.estimateHiMan = t;
  }
}

export async function POST(req: Request) {
  if (!rateLimitRequest(req, "estimate-detailed")) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const parsedBody = await readJsonWithLimit(req);
  const checked = parsedBody.ok ? checkEstimateRequest(parsedBody.value) : parsedBody;
  if (!checked.ok) {
    return new Response(JSON.stringify({ error: checked.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { answers } = checked.value;
  const prior = checked.value.priorContext.trim();

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
    const generatedAt = Date.now();
    const { object, usedFallbackModel } = await generateEstimateObjectWithFallback(userContent);

    sortLoHi(object);

    let final = object;
    const firstCallElapsedMs = Date.now() - generatedAt;
    if (
      narrowBandTarget &&
      estimateRangeWidthMan(final.estimateLoMan, final.estimateHiMan) > 100 &&
      !usedFallbackModel &&
      firstCallElapsedMs <= NARROW_RETRY_MAX_FIRST_CALL_MS
    ) {
      try {
        const retryPrompt = buildEstimateDetailedNarrowRetryPrompt(userContent);
        const { object: retryObject } = await generateObject({
          model: defaultGeminiModel,
          schema: ResultSchema,
          system: ESTIMATE_DETAILED_SYSTEM_PROMPT,
          prompt: retryPrompt,
          maxOutputTokens: NARROW_RETRY_MAX_OUTPUT_TOKENS,
        });
        sortLoHi(retryObject);
        final = retryObject;
      } catch (retryErr) {
        logAiRouteError("api/estimate-detailed narrow retry skipped", retryErr);
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

    const credible = applyCredibleMinimumRangeToEstimate(final, answers);
    final = credible.output;

    return Response.json(final);
  } catch (err) {
    return aiFailureResponse("api/estimate-detailed", err);
  }
}
