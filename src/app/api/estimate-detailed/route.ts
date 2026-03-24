import { generateObject } from "ai";
import { z } from "zod";
import { defaultGeminiModel } from "@/lib/ai/gemini-model";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const ResultSchema = z.object({
  requirementTitle: z.string(),
  requirementSections: z.array(
    z.object({
      heading: z.string(),
      bullets: z.array(z.string()),
    })
  ),
  assumptions: z.array(z.string()),
  risks: z.array(z.string()),
  estimateLoMan: z.number().int().min(0),
  estimateHiMan: z.number().int().min(0),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: {
    answers?: Record<string, string>;
    priorContext?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const answers = body.answers ?? {};
  const prior = (body.priorContext ?? "").trim();

  const answerLines = Object.entries(answers)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${String(v).trim()}`);

  if (answerLines.length === 0) {
    return new Response(JSON.stringify({ error: "answers required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userContent = [
    prior && `【コンシェルジュまでの文脈】\n${prior}`,
    `【詳細ヒアリング回答】\n${answerLines.join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const system = `あなたは rinopro の開発・コンサル見積もり前ヒアリングを整理するアシスタントです。
ルール:
- 日本語で出力する。
- 確定契約や確定金額の保証はしない。「目安」「初期検討用」と明示する。
- 顧客名・実在企業名は捏造しない。
- estimateLoMan / estimateHiMan は万円単位の整数。ヒアリング内容から現実的な幅をつけたレンジにする（極端に狭くしない）。
- requirementSections は最大5セクション、各 bullets は最大5項目。
- 技術スタックは一般論でよい（Next.js / Supabase / LLM 等の言及可）。`;

  try {
    const { object } = await generateObject({
      model: defaultGeminiModel,
      schema: ResultSchema,
      system,
      prompt: userContent,
      maxOutputTokens: 4096,
    });

    if (object.estimateHiMan < object.estimateLoMan) {
      const t = object.estimateLoMan;
      object.estimateLoMan = object.estimateHiMan;
      object.estimateHiMan = t;
    }

    return Response.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "generate failed";
    console.error("[api/estimate-detailed]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
