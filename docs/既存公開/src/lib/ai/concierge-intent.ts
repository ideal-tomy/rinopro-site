import type { UIMessage } from "ai";
import { getUIMessageText } from "@/lib/chat/uimessage-text";

export type ConciergeIntent =
  | "learn"
  | "compare"
  | "consult"
  | "estimate";

const ESTIMATE_KEYWORDS = [
  "見積",
  "費用",
  "金額",
  "予算",
  "料金",
  "相場",
  "期間",
  "納期",
  "いつまで",
  "いくら",
] as const;

const COMPARE_KEYWORDS = [
  "比較",
  "違い",
  "どっち",
  "向いて",
  "相見積",
  "候補",
  "くらべ",
  "選ぶ",
] as const;

const CONSULT_KEYWORDS = [
  "相談",
  "悩",
  "困",
  "整理",
  "迷",
  "どう進",
  "決まってない",
  "曖昧",
  "まず",
] as const;

const LEARN_KEYWORDS = [
  "知りたい",
  "何ができる",
  "できること",
  "仕組み",
  "内容",
  "技術",
  "スタック",
  "とは",
] as const;

function includesAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function inferConciergeIntent(params: {
  messages: UIMessage[];
  mode: "default" | "development" | "consulting";
  pageContext: "top" | "demo" | "services" | "other";
  signaledIntent?: ConciergeIntent | null;
}): ConciergeIntent {
  const { messages, mode, pageContext, signaledIntent } = params;
  if (signaledIntent) return signaledIntent;

  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const text = lastUser ? getUIMessageText(lastUser).trim() : "";

  if (text) {
    if (includesAny(text, ESTIMATE_KEYWORDS)) return "estimate";
    if (includesAny(text, COMPARE_KEYWORDS)) return "compare";
    if (includesAny(text, CONSULT_KEYWORDS)) return "consult";
    if (includesAny(text, LEARN_KEYWORDS)) return "learn";
  }

  if (mode === "development" || mode === "consulting") return "consult";
  if (pageContext === "demo") return "compare";
  return "learn";
}
