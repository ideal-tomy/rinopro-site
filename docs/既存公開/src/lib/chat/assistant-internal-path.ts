/**
 * コンシェルジュ本文の内部リンク先として許容するパスか。
 * `AssistantMarkdown` と裸パス linkify で共通利用（逸脱を防ぐ）。
 */
export function isSafeAssistantInternalPath(
  href: string | undefined
): href is string {
  if (!href || typeof href !== "string") return false;
  const t = href.trim();
  if (!t.startsWith("/")) return false;
  if (t.startsWith("//")) return false;
  if (t.includes("://")) return false;
  if (t.includes("..")) return false;
  return true;
}
