import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { inferConciergeIntent } from "@/lib/ai/concierge-intent";
import { rateLimitRequest } from "@/lib/rate-limit";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import {
  aiFailureResponse,
  aiStreamErrorText,
  logStreamTextError,
} from "@/lib/ai/api-error-response";
import { checkUiMessages, readJsonWithLimit } from "@/lib/ai/request-limits";
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
  if (!rateLimitRequest(req, "chat")) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let pathnameForContext = "/";
  const parsedBody = await readJsonWithLimit(req);
  if (!parsedBody.ok) {
    return new Response(JSON.stringify({ error: parsedBody.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const body = (
    typeof parsedBody.value === "object" && parsedBody.value !== null ? parsedBody.value : {}
  ) as {
    messages?: unknown;
    mode?: unknown;
    /** クライアントの現在パス（ページ文脈プロンプト用。改ざんされてもプロンプト補助のみ） */
    pathname?: unknown;
    /** シニア発火補助（改ざんされてもプロンプト補助のみ。サーバ側推論と併用） */
    conciergeSignals?: unknown;
  };
  const checkedMessages = checkUiMessages(body.messages);
  if (!checkedMessages.ok) {
    return new Response(JSON.stringify({ error: checkedMessages.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const messages: UIMessage[] = checkedMessages.value;
  const mode = parseConciergeMode(body.mode);
  if (
    typeof body.pathname === "string" &&
    body.pathname.startsWith("/") &&
    body.pathname.length <= 300
  ) {
    pathnameForContext = body.pathname;
  }
  const conciergeSignals = parseConciergeSignals(body.conciergeSignals);

  const pageContext = parseConciergePageContext(pathnameForContext);
  const intent = inferConciergeIntent({
    messages,
    mode,
    pageContext,
    signaledIntent: conciergeSignals?.entryIntent ?? null,
  });
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
    intent,
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
      onError: logStreamTextError("api/chat stream"),
    });

    return result.toUIMessageStreamResponse({ onError: aiStreamErrorText() });
  } catch (err) {
    return aiFailureResponse("api/chat", err);
  }
}
