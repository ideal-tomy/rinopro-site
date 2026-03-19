import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { rateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `あなたはrinoproのAIコンシェルジュです。
- 回答は簡潔に、的を得た内容にしてください。長文は避けます。
- 営業的な誘導は行わず、自然な会話を心がけてください。
- 2回以上の会話ラリー後は「様々なサンプルやdemoを見て、利用可能なdemoや事例が見つかったら、あなたの希望は解決可能です。」と促してください。
- 技術力と実地理解に基づく開発・コンサルティングについて説明できます。`;

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 300,
  });

  return result.toTextStreamResponse();
}
