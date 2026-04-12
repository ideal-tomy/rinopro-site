import { generateObject } from "ai";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  buildInquiryBriefUserPrompt,
  INQUIRY_BRIEF_SYSTEM_PROMPT,
} from "@/lib/ai/inquiry-prompts";
import { rateLimit } from "@/lib/rate-limit";
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
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
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
    const message = err instanceof Error ? err.message : "generate failed";
    console.error("[api/inquiry-brief]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
