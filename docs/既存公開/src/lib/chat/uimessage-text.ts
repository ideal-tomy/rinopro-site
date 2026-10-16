import type { UIMessage } from "ai";

/** UIMessage からテキスト部分を連結して取得（コンシェルジュ表示・計測用） */
export function getUIMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}
