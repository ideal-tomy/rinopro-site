import { generateObject } from "ai";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import { aiFailureResponse } from "@/lib/ai/api-error-response";
import {
  buildInquiryBriefUserPrompt,
  INQUIRY_BRIEF_SYSTEM_PROMPT,
} from "@/lib/ai/inquiry-prompts";
import { rateLimitRequest } from "@/lib/rate-limit";
import { estimateSnapshotSchema } from "@/lib/estimate/estimate-snapshot";
import {
  inquiryPreparationApiResponseSchema,
  inquiryPreparationRequestSchema,
} from "@/lib/inquiry/inquiry-brief";

export const maxDuration = 60;

const requestSchema = inquiryPreparationRequestSchema.extend({
  snapshot: estimateSnapshotSchema,
});

export async function POST(req: Request) {
  if (!rateLimitRequest(req, "inquiry-brief")) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { object } = await generateObject({
      model: defaultGeminiModel,
      schema: inquiryPreparationApiResponseSchema,
      system: INQUIRY_BRIEF_SYSTEM_PROMPT,
      prompt: buildInquiryBriefUserPrompt({
        snapshot: parsed.data.snapshot,
        preparation: parsed.data,
      }),
      maxOutputTokens: 3072,
    });

    return Response.json(object);
  } catch (err) {
    return aiFailureResponse("api/inquiry-brief", err);
  }
}
