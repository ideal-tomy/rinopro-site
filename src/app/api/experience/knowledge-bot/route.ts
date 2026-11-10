import { streamText } from "ai";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import { aiFailureResponse, logStreamTextError } from "@/lib/ai/api-error-response";
import { checkKnowledgeBotRequest, readJsonWithLimit } from "@/lib/ai/request-limits";
import { rateLimitRequest } from "@/lib/rate-limit";
import { getInternalKnowledgeDataset } from "@/lib/experience/internal-knowledge/datasets";
import {
  buildKnowledgeBotSystemPrompt,
  buildKnowledgeBotUserMessage,
  getKbChunksForRequest,
} from "@/lib/experience/internal-knowledge/resolver";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!rateLimitRequest(req, "knowledge-bot")) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const parsedBody = await readJsonWithLimit(req);
  const checked = parsedBody.ok ? checkKnowledgeBotRequest(parsedBody.value) : parsedBody;
  if (!checked.ok) {
    return new Response(checked.error, { status: 400 });
  }

  const { industryId, pathLabels, kbRefIds, freeformText } = checked.value;

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
      onError: logStreamTextError("api/experience/knowledge-bot stream"),
    });

    return result.toTextStreamResponse();
  } catch (err) {
    return aiFailureResponse("api/experience/knowledge-bot", err);
  }
}
