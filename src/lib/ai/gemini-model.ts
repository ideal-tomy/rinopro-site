import { google } from "@ai-sdk/google";

/** デフォルトの Gemini モデル（チャット・ai_live demo で共通）
 * gemini-2.0-flash は新規 API 利用者向けに提供終了のため、2.5 Flash を使用する。
 */
export const defaultGeminiModel = google("gemini-2.5-flash");
