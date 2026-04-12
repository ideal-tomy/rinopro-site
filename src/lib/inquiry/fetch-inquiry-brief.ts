import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import {
  inquiryPreparationApiResponseSchema,
  type InquiryPreparationApiResponse,
  type InquiryPreparationRequest,
} from "@/lib/inquiry/inquiry-brief";

const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export async function fetchInquiryBriefWithRetry(args: {
  snapshot: EstimateSnapshot;
  preparation: InquiryPreparationRequest;
  onRetry?: (info: { attempt: number; reason: string }) => void;
}): Promise<InquiryPreparationApiResponse> {
  const body = JSON.stringify({
    snapshot: args.snapshot,
    ...args.preparation,
  });

  let lastMessage = "failed";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await sleep(700 * 2 ** (attempt - 1));
      args.onRetry?.({ attempt, reason: lastMessage });
    }

    let res: Response;
    try {
      res = await fetch("/api/inquiry-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    } catch (error) {
      lastMessage = error instanceof Error ? error.message : "network error";
      if (attempt < MAX_ATTEMPTS - 1) continue;
      throw error instanceof Error ? error : new Error(lastMessage);
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

    const parsed = inquiryPreparationApiResponseSchema.safeParse(raw);
    if (!parsed.success) {
      lastMessage = "invalid response";
      if (attempt < MAX_ATTEMPTS - 1) continue;
      throw new Error(lastMessage);
    }

    return parsed.data;
  }

  throw new Error(lastMessage);
}
