import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { rateLimit } from "@/lib/rate-limit";
import { fetchAiDemoBySlug } from "@/lib/sanity/fetch";

export const maxDuration = 30;

/** モック出力をストリーミング風に返す（AI呼び出しなし） */
function createMockStreamResponse(
  primary: string,
  secondary: string
): Response {
  const fullText = [primary, secondary].filter(Boolean).join("\n\n");
  const encoder = new TextEncoder();
  const chunkSize = 12;
  const delayMs = 20;

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < fullText.length; i += chunkSize) {
        controller.enqueue(encoder.encode(fullText.slice(i, i + chunkSize)));
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: { messages?: UIMessage[]; slug?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { messages, slug } = body;
  if (!slug || typeof slug !== "string") {
    return new Response("Missing slug", { status: 400 });
  }
  if (!Array.isArray(messages)) {
    return new Response("Missing messages", { status: 400 });
  }

  const aiDemo = await fetchAiDemoBySlug(slug);
  if (!aiDemo) {
    return new Response("Demo not found", { status: 404 });
  }

  const runMode = aiDemo.runMode ?? "mock_preview";

  if (runMode === "mock_preview") {
    const primary = aiDemo.mockOutputPrimary ?? "";
    const secondary = aiDemo.mockOutputSecondary ?? "";
    if (!primary && !secondary) {
      return new Response("Mock output not configured", { status: 400 });
    }
    return createMockStreamResponse(primary, secondary);
  }

  if (!aiDemo.systemPrompt) {
    return new Response("Demo not configured for AI mode", { status: 400 });
  }

  const systemParts: string[] = [aiDemo.systemPrompt];
  if (aiDemo.outputStructure?.trim()) {
    systemParts.push(`\n出力形式:\n${aiDemo.outputStructure}`);
  }

  const system = systemParts.join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}
