import {
  estimateDetailedAiOutputSchema,
  type EstimateDetailedAiOutput,
} from "@/lib/estimate/estimate-snapshot";

const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function errorMessageFromBody(raw: unknown): string {
  if (
    typeof raw === "object" &&
    raw &&
    "error" in raw &&
    typeof (raw as { error?: unknown }).error === "string"
  ) {
    return (raw as { error: string }).error;
  }
  return "failed";
}

export type FetchEstimateDetailedWithRetryOptions = {
  answers: Record<string, string>;
  priorContext?: string;
  /** `attempt` は 1 始まり（2 回目以降の試行の直前） */
  onRetry?: (info: { attempt: number; reason: string }) => void;
};

/**
 * 詳細見積 API の一時失敗（5xx・ネットワーク・JSON 破損・スキーマ不一致）に対し、
 * 指数バックオフで再試行する。
 */
export async function fetchEstimateDetailedWithRetry(
  opts: FetchEstimateDetailedWithRetryOptions
): Promise<EstimateDetailedAiOutput> {
  const body = JSON.stringify({
    answers: opts.answers,
    priorContext: opts.priorContext,
  });

  let lastMessage = "failed";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await sleep(700 * 2 ** (attempt - 1));
      opts.onRetry?.({ attempt, reason: lastMessage });
    }

    let res: Response;
    try {
      res = await fetch("/api/estimate-detailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    } catch (e) {
      lastMessage = e instanceof Error ? e.message : "network error";
      if (attempt < MAX_ATTEMPTS - 1) continue;
      throw e instanceof Error ? e : new Error(lastMessage);
    }

    let raw: unknown;
    try {
      raw = await res.json();
    } catch {
      raw = null;
    }

    if (!res.ok) {
      lastMessage = errorMessageFromBody(raw);
      if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_ATTEMPTS - 1) {
        continue;
      }
      throw new Error(lastMessage);
    }

    const parsed = estimateDetailedAiOutputSchema.safeParse(raw);
    if (!parsed.success) {
      lastMessage = "invalid response";
      if (attempt < MAX_ATTEMPTS - 1) continue;
      throw new Error(lastMessage);
    }

    return parsed.data;
  }

  throw new Error(lastMessage);
}
