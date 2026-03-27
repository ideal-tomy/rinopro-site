import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { rateLimit } from "@/lib/rate-limit";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  buildConciergeSystem,
  buildDemoCatalogForConciergePrompt,
  maxOutputTokensForConciergeMode,
  parseConciergeMode,
  parseConciergePageContext,
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
  let pathnameForContext = "/";
  try {
    const body = (await req.json()) as {
      messages?: unknown;
      mode?: unknown;
      /** クライアントの現在パス（ページ文脈プロンプト用。改ざんされてもプロンプト補助のみ） */
      pathname?: unknown;
    };
    if (!Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid body: messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    messages = body.messages as UIMessage[];
    mode = parseConciergeMode(body.mode);
    if (typeof body.pathname === "string" && body.pathname.startsWith("/")) {
      pathnameForContext = body.pathname;
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pageContext = parseConciergePageContext(pathnameForContext);

  let system: string;
  if (mode === "default") {
    const demos = await fetchDemosForDisplay();
    const demoCatalog = buildDemoCatalogForConciergePrompt(demos);
    system = buildConciergeSystem(mode, { demoCatalog, pageContext });
  } else {
    system = buildConciergeSystem(mode, { pageContext });
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
