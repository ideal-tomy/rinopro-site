/**
 * Deepgram client configuration - docs/技術要件.md
 * Real-time voice recognition via WebSocket.
 * Requires DEEPGRAM_API_KEY in environment.
 *
 * @see https://developers.deepgram.com/
 */
export const DEEPGRAM_WS_URL = "wss://api.deepgram.com/v1/listen";

export function getDeepgramWsUrl(language = "ja"): string {
  const apiKey = process.env.DEEPGRAM_API_KEY ?? process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is not set");
  }
  return `${DEEPGRAM_WS_URL}?language=${language}&encoding=linear16&sample_rate=16000`;
}
