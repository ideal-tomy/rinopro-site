import type { UIMessage } from "ai";

/**
 * 公開 AI API の受付上限。画面から送る通常の量より広く取り、
 * 超えたものはモデルを呼ぶ前に 400 で返す。
 */
export const AI_REQUEST_LIMITS = {
  maxBodyChars: 512 * 1024,
  messages: {
    maxCount: 60,
    maxParts: 40,
    /** 入力欄に上限がないため、貼り付けを想定して広めにする */
    maxUserTextChars: 8_000,
    /** アシスタントの長い返答を含む会話全体 */
    maxTotalTextChars: 120_000,
  },
  estimate: {
    maxAnswerKeys: 40,
    maxAnswerKeyChars: 200,
    maxAnswerValueChars: 1_000,
    /** estimateSnapshotSchema の priorContext 上限と揃える */
    maxPriorContextChars: 8_000,
  },
  knowledgeBot: {
    maxIndustryIdChars: 80,
    maxPathLabels: 20,
    maxPathLabelChars: 200,
    maxKbRefIds: 200,
    maxKbRefIdChars: 120,
    maxFreeformTextChars: 2_000,
  },
} as const;

export type LimitCheck<T> = { ok: true; value: T } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 本文を読み切る前に Content-Length で、読んだ後に実際の長さで判定する */
export async function readJsonWithLimit(req: Request): Promise<LimitCheck<unknown>> {
  const declared = Number(req.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > AI_REQUEST_LIMITS.maxBodyChars * 4) {
    return { ok: false, error: "Request too large" };
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
  if (text.length > AI_REQUEST_LIMITS.maxBodyChars) {
    return { ok: false, error: "Request too large" };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

/**
 * useChat から届く会話を検査する。role は user / assistant だけを受け付ける
 * （system を通すとクライアントがシステム指示を差し込める）。
 */
export function checkUiMessages(raw: unknown): LimitCheck<UIMessage[]> {
  const limits = AI_REQUEST_LIMITS.messages;
  if (!Array.isArray(raw)) {
    return { ok: false, error: "Invalid body: messages required" };
  }
  if (raw.length > limits.maxCount) {
    return { ok: false, error: "Too many messages" };
  }

  let totalChars = 0;
  for (const msg of raw) {
    if (!isRecord(msg) || (msg.role !== "user" && msg.role !== "assistant")) {
      return { ok: false, error: "Invalid message" };
    }
    if (!Array.isArray(msg.parts) || msg.parts.length > limits.maxParts) {
      return { ok: false, error: "Invalid message parts" };
    }
    let messageChars = 0;
    for (const part of msg.parts) {
      if (!isRecord(part) || typeof part.type !== "string") {
        return { ok: false, error: "Invalid message parts" };
      }
      if (typeof part.text === "string") {
        messageChars += part.text.length;
      }
    }
    if (msg.role === "user" && messageChars > limits.maxUserTextChars) {
      return { ok: false, error: "Message too long" };
    }
    totalChars += messageChars;
    if (totalChars > limits.maxTotalTextChars) {
      return { ok: false, error: "Conversation too long" };
    }
  }

  return { ok: true, value: raw as UIMessage[] };
}

export function checkEstimateRequest(
  raw: unknown
): LimitCheck<{ answers: Record<string, string>; priorContext: string }> {
  const limits = AI_REQUEST_LIMITS.estimate;
  if (!isRecord(raw)) {
    return { ok: false, error: "Invalid body" };
  }

  const answersRaw = raw.answers ?? {};
  if (!isRecord(answersRaw)) {
    return { ok: false, error: "Invalid answers" };
  }
  const entries = Object.entries(answersRaw);
  if (entries.length > limits.maxAnswerKeys) {
    return { ok: false, error: "Too many answers" };
  }
  const answers: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (
      key.length > limits.maxAnswerKeyChars ||
      typeof value !== "string" ||
      value.length > limits.maxAnswerValueChars
    ) {
      return { ok: false, error: "Invalid answers" };
    }
    answers[key] = value;
  }

  const priorRaw = raw.priorContext ?? "";
  if (typeof priorRaw !== "string" || priorRaw.length > limits.maxPriorContextChars) {
    return { ok: false, error: "Invalid priorContext" };
  }

  return { ok: true, value: { answers, priorContext: priorRaw } };
}

function checkStringArray(
  raw: unknown,
  maxItems: number,
  maxChars: number
): string[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > maxItems) return null;
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string" || item.length > maxChars) return null;
    out.push(item);
  }
  return out;
}

export function checkKnowledgeBotRequest(raw: unknown): LimitCheck<{
  industryId: string;
  pathLabels: string[];
  kbRefIds: string[];
  freeformText?: string;
}> {
  const limits = AI_REQUEST_LIMITS.knowledgeBot;
  if (!isRecord(raw)) {
    return { ok: false, error: "Invalid body" };
  }

  const industryId = typeof raw.industryId === "string" ? raw.industryId.trim() : "";
  if (!industryId) {
    return { ok: false, error: "Missing industryId" };
  }
  if (industryId.length > limits.maxIndustryIdChars) {
    return { ok: false, error: "Invalid industryId" };
  }

  const pathLabels = checkStringArray(
    raw.pathLabels,
    limits.maxPathLabels,
    limits.maxPathLabelChars
  );
  const kbRefIds = checkStringArray(raw.kbRefIds, limits.maxKbRefIds, limits.maxKbRefIdChars);
  if (!pathLabels || !kbRefIds) {
    return { ok: false, error: "Invalid request" };
  }

  const freeformRaw = raw.freeformText;
  if (
    freeformRaw !== undefined &&
    (typeof freeformRaw !== "string" || freeformRaw.length > limits.maxFreeformTextChars)
  ) {
    return { ok: false, error: "Invalid freeformText" };
  }

  return {
    ok: true,
    value: {
      industryId,
      pathLabels,
      kbRefIds,
      ...(typeof freeformRaw === "string" ? { freeformText: freeformRaw } : {}),
    },
  };
}
