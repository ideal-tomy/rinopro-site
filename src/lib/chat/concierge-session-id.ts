/**
 * AI コンシェルジュの useChat `id`（会話スコープ）を決定する単一ソース。
 * 変更時は docs/concierge-chat-scopes.md を更新すること。
 */

import type {
  ConciergeEntrySource,
  ConciergeMode,
} from "@/components/chat/concierge-chat-context";

export type ConciergeChatSurface = "pick" | "page" | "global";

/** pathname から sessionId 用スラッグ（先頭スラッシュ除去、/ を - に） */
export function conciergePathSlug(pathname: string): string {
  return pathname.slice(1).replace(/\//g, "-") || "root";
}

export function buildConciergeChatSessionId(args: {
  pathname: string;
  /** API の mode 用。sessionId には使わない（pathname でスコープする） */
  mode: ConciergeMode;
  surface: ConciergeChatSurface;
  entrySource: ConciergeEntrySource;
}): string {
  const { pathname, surface, entrySource } = args;
  const slug = conciergePathSlug(pathname);

  if (surface === "pick") {
    return `concierge-pick-${slug}`;
  }
  if (surface === "global") {
    if (pathname.startsWith("/demo") || pathname.startsWith("/experience")) {
      return "concierge-global-demo-hub";
    }
    return "concierge-home";
  }
  if (pathname === "/services") {
    if (entrySource === "services-card-development") {
      return "concierge-services-card-development";
    }
    if (entrySource === "services-card-consulting") {
      return "concierge-services-card-consulting";
    }
    return "concierge-services-hub";
  }
  if (pathname.startsWith("/demo")) {
    return `concierge-demo-${pathname.replace(/\//g, "_")}`;
  }
  return `concierge-path-${slug}`;
}

/** 初回マウント時のフォールバック（`/` + pick と整合） */
export const CONCIERGE_CHAT_SESSION_INITIAL = "concierge-pick-root";
