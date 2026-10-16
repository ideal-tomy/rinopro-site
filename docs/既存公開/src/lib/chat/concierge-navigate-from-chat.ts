/**
 * アシスタント本文内のサイト内リンクをクリックしたときに送出する。
 * `ChatContainer` が購読し、モーダルを閉じて状態をリセットする（× 閉じると同等）。
 */
export const CONCIERGE_NAVIGATE_FROM_CHAT = "concierge-navigate-from-chat" as const;

export function emitConciergeNavigateFromChatLink(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONCIERGE_NAVIGATE_FROM_CHAT));
}
