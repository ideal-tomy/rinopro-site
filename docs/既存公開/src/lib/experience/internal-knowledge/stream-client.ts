const API_PATH = "/api/experience/knowledge-bot";

export async function streamKnowledgeBotResponse(
  payload: {
    industryId: string;
    pathLabels: string[];
    kbRefIds: string[];
    freeformText?: string;
  },
  onChunk: (accumulated: string) => void,
  options?: { signal?: AbortSignal }
): Promise<string> {
  const res = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: options?.signal,
  });

  if (!res.ok) {
    let msg = `エラー (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* plain text */
      const t = await res.text();
      if (t) msg = t.slice(0, 200);
    }
    throw new Error(msg);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("応答ボディを読み取れませんでした");
  }

  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk(full);
  }
  return full;
}
