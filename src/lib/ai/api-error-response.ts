export const AI_FAILURE_MESSAGE = "処理に失敗しました。時間をおいて再度お試しください。";

/**
 * AI SDK の例外は requestBodyValues（プロンプト全文）や responseBody を持つため、
 * 例外オブジェクトをそのままログに出さない。
 */
export function logAiRouteError(scope: string, err: unknown): void {
  if (err instanceof Error) {
    const statusCode = (err as { statusCode?: unknown }).statusCode;
    console.error(`[${scope}]`, {
      name: err.name,
      message: err.message,
      ...(typeof statusCode === "number" ? { statusCode } : {}),
    });
    return;
  }
  console.error(`[${scope}]`, { name: "UnknownError" });
}

/** formatConciergeChatErrorMessage が利用上限の案内に切り替える目印（429） */
const AI_QUOTA_STREAM_MESSAGE = "Too Many Requests (429)";

/** streamText の onError 用。既定は例外全体を console.error に出すため差し替える。 */
export function logStreamTextError(scope: string) {
  return ({ error }: { error: unknown }): void => {
    logAiRouteError(scope, error);
  };
}

/**
 * toUIMessageStreamResponse の onError 用。ストリーム途中の失敗は catch を通らないため、
 * ここで内部メッセージを固定文に置き換える（ログは logStreamTextError 側で出す）。
 */
export function aiStreamErrorText() {
  return (err: unknown): string => {
    const raw = err instanceof Error ? err.message.toLowerCase() : "";
    if (raw.includes("quota") || raw.includes("resource exhausted") || raw.includes("429")) {
      return AI_QUOTA_STREAM_MESSAGE;
    }
    return AI_FAILURE_MESSAGE;
  };
}

export function aiFailureResponse(scope: string, err: unknown): Response {
  logAiRouteError(scope, err);
  return new Response(JSON.stringify({ error: AI_FAILURE_MESSAGE }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
