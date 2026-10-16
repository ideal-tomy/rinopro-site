import { normalizeFreeformText } from "@/lib/freeform/freeform-input";

const MAX_MEMO_LEN = 140;

export function summarizeFreeformMemo(text: string): string {
  const normalized = normalizeFreeformText(text);
  if (!normalized) return "";
  if (normalized.length <= MAX_MEMO_LEN) return normalized;
  return `${normalized.slice(0, MAX_MEMO_LEN - 3).trim()}...`;
}
