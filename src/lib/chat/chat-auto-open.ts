/**
 * チャットのセッション初回自動オープン（sessionStorage）と、
 * チャット内ナビゲーション直後の1回だけ自動オープンを抑止するフラグ。
 *
 * 対象は {@link AUTO_OPEN_PATHS} のみ（例: `/` `/demo/list` `/services`）。
 * `/experience/…` や `/demo/[slug]` ではそもそも自動オープンは走らない。
 * コンシェルジュが開いたまま別ページへ遷移したときにモーダルが残る場合は、
 * 遷移前に `ConciergeChatProvider` の `setOpen(false)` が必要。
 */

export const CHAT_AUTO_OPEN_STORAGE_PREFIX = "rinopro:autoChatOpen:" as const;

export const SUPPRESS_CHAT_AUTO_ONCE_KEY = "rinopro:suppressChatAutoOnce" as const;

/** /services で開発/コンサルを選んだ状態（同一タブセッション） */
export const SERVICES_FLOW_PICK_KEY = "rinopro:services-flow-picked" as const;

export type ServicesFlowPick = "development" | "consulting";

const AUTO_OPEN_PATHS = new Set<string>(["/", "/demo/list", "/services"]);

export function chatAutoOpenStorageKey(pathname: string): string | null {
  if (!AUTO_OPEN_PATHS.has(pathname)) return null;
  return `${CHAT_AUTO_OPEN_STORAGE_PREFIX}${pathname}`;
}

export function shouldAttemptChatAutoOpen(pathname: string): boolean {
  return AUTO_OPEN_PATHS.has(pathname);
}

/** 次に該当ページへ入ったときの自動オープンを1回スキップする（消費型） */
export function suppressNextChatAutoOpen(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SUPPRESS_CHAT_AUTO_ONCE_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** true なら抑止し、キーを削除する */
export function consumeSuppressChatAutoOnce(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(SUPPRESS_CHAT_AUTO_ONCE_KEY) === "1") {
      sessionStorage.removeItem(SUPPRESS_CHAT_AUTO_ONCE_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function readServicesFlowPick(): ServicesFlowPick | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(SERVICES_FLOW_PICK_KEY);
    if (v === "development" || v === "consulting") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeServicesFlowPick(mode: ServicesFlowPick): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SERVICES_FLOW_PICK_KEY, mode);
  } catch {
    /* ignore */
  }
}

/** FAB「このページについて」など、サービスページの中立入口用にレーン記憶を消す */
export function clearServicesFlowPick(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SERVICES_FLOW_PICK_KEY);
  } catch {
    /* ignore */
  }
}
