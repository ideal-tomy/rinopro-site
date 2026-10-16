import { streamText } from "ai";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import { rateLimit } from "@/lib/rate-limit";
import { getInternalKnowledgeDataset } from "@/lib/experience/internal-knowledge/datasets";
import {
  buildKnowledgeBotSystemPrompt,
  buildKnowledgeBotUserMessage,
  getKbChunksForRequest,
} from "@/lib/experience/internal-knowledge/resolver";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: {
    industryId?: string;
    pathLabels?: unknown;
    kbRefIds?: unknown;
    freeformText?: string;
  };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const industryId =
    typeof body.industryId === "string" ? body.industryId.trim() : "";
  if (!industryId) {
    return new Response("Missing industryId", { status: 400 });
  }

  const pathLabels = Array.isArray(body.pathLabels)
    ? body.pathLabels.filter((x): x is string => typeof x === "string")
    : [];

  const kbRefIds = Array.isArray(body.kbRefIds)
    ? body.kbRefIds.filter((x): x is string => typeof x === "string")
    : [];

  const freeformText =
    typeof body.freeformText === "string" ? body.freeformText : undefined;

  const dataset = getInternalKnowledgeDataset(industryId);
  if (!dataset) {
    return new Response("Unknown industry", { status: 404 });
  }

  const kbChunks = getKbChunksForRequest(dataset, kbRefIds);
  if (kbChunks.length === 0) {
    return new Response("No knowledge for this request", { status: 400 });
  }

  const system = buildKnowledgeBotSystemPrompt({
    dataset,
    kbChunks,
    pathLabels,
    freeformText,
  });
  const userMessage = buildKnowledgeBotUserMessage();

  try {
    const result = streamText({
      model: defaultGeminiModel,
      system,
      messages: [{ role: "user", content: userMessage }],
      maxOutputTokens: 2048,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Knowledge bot failed";
    console.error("[api/experience/knowledge-bot]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
