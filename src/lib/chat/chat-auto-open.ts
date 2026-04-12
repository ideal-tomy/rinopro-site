/**
 * チャットのセッション初回自動オープン（sessionStorage）と、
 * チャット内ナビゲーション直後の1回だけ自動オープンを抑止するフラグ。
 *
 * 自動オープンはページごとのポリシーに従う。現状はすべて明示操作優先で、
 * `/experience/…` や `/demo/[slug]` を含めページ到達だけでは自動オープンしない。
 * コンシェルジュ本文内リンクは `concierge-navigate-from-chat` イベント経由でモーダルを閉じる際に {@link suppressNextChatAutoOpen} も実行し、遷移先の初回自動オープンを抑止する。
 * コンシェルジュが開いたまま別ページへ遷移したときにモーダルが残る場合は、
 * 遷移前に `ConciergeChatProvider` の `setOpen(false)` が必要。
 */

export const CHAT_AUTO_OPEN_STORAGE_PREFIX = "axeon:autoChatOpen:" as const;

export const SUPPRESS_CHAT_AUTO_ONCE_KEY = "axeon:suppressChatAutoOnce" as const;

/** /services で開発/コンサルを選んだ状態（同一タブセッション） */
export const SERVICES_FLOW_PICK_KEY = "axeon:services-flow-picked" as const;

export type ServicesFlowPick = "development" | "consulting";

export type ConciergeAutoOpenPolicy = {
  enabled: boolean;
  reason: string;
};

const AUTO_OPEN_POLICIES: Record<string, ConciergeAutoOpenPolicy> = {
  "/": {
    enabled: false,
    reason: "トップは明示的な選択導線を優先する",
  },
  "/demo/list": {
    enabled: false,
    reason: "一覧は自力探索と明示的な相談導線を優先する",
  },
  "/services": {
    enabled: false,
    reason: "サービスカードからの明示的な相談導線を優先する",
  },
};

export function getConciergeAutoOpenPolicy(
  pathname: string
): ConciergeAutoOpenPolicy {
  return (
    AUTO_OPEN_POLICIES[pathname] ?? {
      enabled: false,
      reason: "ページ到達だけでは自動オープンしない",
    }
  );
}

export function chatAutoOpenStorageKey(pathname: string): string | null {
  if (!getConciergeAutoOpenPolicy(pathname).enabled) return null;
  return `${CHAT_AUTO_OPEN_STORAGE_PREFIX}${pathname}`;
}

export function shouldAttemptChatAutoOpen(pathname: string): boolean {
  return getConciergeAutoOpenPolicy(pathname).enabled;
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
