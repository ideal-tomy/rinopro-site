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
import {
  buildSeniorDemoCatalog,
  inferSeniorEngagement,
  parseConciergeSignals,
  type SeniorPageContext,
} from "@/lib/ai/concierge-senior";
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
  let conciergeSignals: ReturnType<typeof parseConciergeSignals>;
  try {
    const body = (await req.json()) as {
      messages?: unknown;
      mode?: unknown;
      /** クライアントの現在パス（ページ文脈プロンプト用。改ざんされてもプロンプト補助のみ） */
      pathname?: unknown;
      /** シニア発火補助（改ざんされてもプロンプト補助のみ。サーバ側推論と併用） */
      conciergeSignals?: unknown;
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
    conciergeSignals = parseConciergeSignals(body.conciergeSignals);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pageContext = parseConciergePageContext(pathnameForContext);
  const senior = inferSeniorEngagement({
    messages,
    mode,
    pageContext: pageContext as SeniorPageContext,
    signals: conciergeSignals,
  });

  const demos = await fetchDemosForDisplay();
  const demoCatalog =
    mode === "default" ? buildDemoCatalogForConciergePrompt(demos) : undefined;
  const seniorDemoCatalog = senior ? buildSeniorDemoCatalog(demos) : undefined;

  const system = buildConciergeSystem(mode, {
    pageContext,
    ...(demoCatalog !== undefined ? { demoCatalog } : {}),
    senior,
    seniorDemoCatalog,
  });

  const maxOutputTokens = senior
    ? Math.max(maxOutputTokensForConciergeMode(mode), 8192)
    : maxOutputTokensForConciergeMode(mode);

  try {
    const result = streamText({
      model: defaultGeminiModel,
      system,
      messages: await convertToModelMessages(messages),
      maxOutputTokens,
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
