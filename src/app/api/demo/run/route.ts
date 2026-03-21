import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import { rateLimit } from "@/lib/rate-limit";
import {
  getMockTonePhrasing,
  getWritingToneSystemInstruction,
  normalizeWritingTone,
} from "@/lib/demo/writing-tone-presets";
import { fetchAiDemoBySlug } from "@/lib/sanity/fetch";
import type { AiDemoWritingTone } from "@/lib/sanity/types";

export const maxDuration = 30;

function getLatestUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    if (msg.role !== "user") continue;
    const parts = msg.parts ?? [];
    const text = parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ")
      .trim();
    if (text) return text;
  }
  return "";
}

function pickConcernLabel(input: string): string {
  if (/(高い|予算|価格|費用|コスト)/.test(input)) return "費用面";
  if (/(遅れ|遅延|納期|期限)/.test(input)) return "スケジュール面";
  if (/(不安|心配|気になる|懸念|リスク)/.test(input)) return "リスク面";
  if (/(品質|不良|クレーム|故障|事故)/.test(input)) return "品質・安全面";
  return "要点整理";
}

function toBulletCandidates(text: string): string[] {
  return text
    .split("\n")
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/g, "")
        .replace(/^[-*]\s*/g, "")
        .replace(/^\d+\.\s*/g, "")
        .trim()
    )
    .filter((line) => line.length > 0);
}

function buildNaturalMockReply(args: {
  title: string;
  userText: string;
  primary: string;
  secondary: string;
  tone: AiDemoWritingTone;
}): string {
  const { title, userText, primary, secondary, tone } = args;
  const concern = pickConcernLabel(userText);
  const primaryLines = toBulletCandidates(primary).slice(0, 4);
  const secondaryLines = toBulletCandidates(secondary).slice(0, 4);
  const summaryLines =
    primaryLines.length > 0
      ? primaryLines
      : ["入力内容の前提を整理し、優先アクションを抽出します。"];
  const actionLines =
    secondaryLines.length > 0
      ? secondaryLines
      : ["次回連絡用の文面と、社内共有メモの2点を用意します。"];

  const userPreview = userText.length > 80 ? `${userText.slice(0, 80)}...` : userText;

  const phrasing = getMockTonePhrasing(tone);

  return [
    phrasing.thanks,
    phrasing.received(userPreview, concern),
    "",
    phrasing.bodyIntro(title),
    "",
    phrasing.summaryHeading,
    ...summaryLines.map((line) => `- ${line}`),
    "",
    phrasing.actionHeading,
    ...actionLines.map((line) => `- ${line}`),
    "",
    ...phrasing.closing,
  ].join("\n");
}

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
  const writingTone = normalizeWritingTone(aiDemo.writingTone);

  if (runMode === "mock_preview") {
    const primary = aiDemo.mockOutputPrimary ?? "";
    const secondary = aiDemo.mockOutputSecondary ?? "";
    if (!primary && !secondary) {
      return new Response("Mock output not configured", { status: 400 });
    }
    const latestUserText = getLatestUserText(messages);
    const naturalMock = buildNaturalMockReply({
      title: aiDemo.title,
      userText: latestUserText || "（入力なし）",
      primary,
      secondary,
      tone: writingTone,
    });
    return createMockStreamResponse(naturalMock, "");
  }

  if (!aiDemo.systemPrompt) {
    return new Response("Demo not configured for AI mode", { status: 400 });
  }

  const systemParts: string[] = [aiDemo.systemPrompt];
  systemParts.push(`\n${getWritingToneSystemInstruction(writingTone)}`);
  if (aiDemo.outputStructure?.trim()) {
    systemParts.push(`\n出力形式:\n${aiDemo.outputStructure}`);
  }

  const system = systemParts.join("\n");

  try {
    const result = streamText({
      model: defaultGeminiModel,
      system,
      messages: await convertToModelMessages(messages),
      // 見出し・複数ブロックの成果物は 500 では不足しがち
      maxOutputTokens: 4096,
    });

    // ai_live は useChat + DefaultChatTransport（SSE UI ストリーム）と整合させる
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Demo AI failed";
    console.error("[api/demo/run]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
