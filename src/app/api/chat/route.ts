import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { rateLimit } from "@/lib/rate-limit";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  buildConciergeSystem,
  buildDemoCatalogForConciergePrompt,
  maxOutputTokensForConciergeMode,
  parseConciergeMode,
} from "@/lib/ai/concierge-prompts";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const maxDuration = 60;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let messages: UIMessage[];
  let mode = "default" as ReturnType<typeof parseConciergeMode>;
  try {
    const body = (await req.json()) as {
      messages?: unknown;
      mode?: unknown;
    };
    if (!Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid body: messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    messages = body.messages as UIMessage[];
    mode = parseConciergeMode(body.mode);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let system: string;
  if (mode === "default") {
    const demos = await fetchDemosForDisplay();
    const demoCatalog = buildDemoCatalogForConciergePrompt(demos);
    system = buildConciergeSystem(mode, { demoCatalog });
  } else {
    system = buildConciergeSystem(mode);
  }

  try {
    const result = streamText({
      model: defaultGeminiModel,
      system,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: maxOutputTokensForConciergeMode(mode),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    console.error("[api/chat]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
