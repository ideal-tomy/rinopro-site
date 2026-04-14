"use client";

import { useEffect, useLayoutEffect, useRef, type MutableRefObject } from "react";
import {
  chatAutoOpenStorageKey,
  consumeSuppressChatAutoOnce,
  getConciergeAutoOpenPolicy,
  readServicesFlowPick,
  shouldAttemptChatAutoOpen,
  suppressNextChatAutoOpen,
} from "@/lib/chat/chat-auto-open";
import type { ConciergeMode } from "@/components/chat/concierge-chat-context";
import {
  isDemoHubForConciergePolicy,
  isDemoExperienceWizardPath,
} from "@/lib/chat/concierge-demo-hub-policy";
import { CONCIERGE_NAVIGATE_FROM_CHAT } from "@/lib/chat/concierge-navigate-from-chat";
import { prefetchDemoCatalog } from "@/lib/demo/demo-catalog-client";
import type { ConciergeChatSurface } from "@/lib/chat/concierge-session-id";

type SetBool = (v: boolean) => void;
type SetSurface = (v: ConciergeChatSurface) => void;

/** sessionStorage の pick と servicesIntroComplete を同期 */
export function useConciergeServicesIntroSync(
  pathname: string,
  mode: ConciergeMode,
  open: boolean,
  entrySource: string,
  setServicesIntroComplete: SetBool
) {
  useLayoutEffect(() => {
    if (pathname === "/services") {
      setServicesIntroComplete(readServicesFlowPick() !== null);
    } else if (
      (pathname === "/flow" && mode === "development") ||
      (pathname === "/consulting" && mode === "consulting")
    ) {
      setServicesIntroComplete(true);
    } else {
      setServicesIntroComplete(false);
    }
  }, [pathname, mode, open, entrySource, setServicesIntroComplete]);
}

/** `/demo`・`/demo/list` の「条件から相談する」と同じコンシェルジュ起動シーケンス */
export function useDemoListPageOpenSequence(
  pathname: string,
  demoListPageOpenSeq: number,
  setEntrySource: (v: "fab") => void,
  setConciergeSurface: SetSurface,
  setOpen: SetBool
) {
  const lastHandled = useRef(0);
  useEffect(() => {
    const host = pathname === "/demo/list" || pathname === "/demo";
    if (!host) return;
    if (demoListPageOpenSeq === 0) return;
    if (demoListPageOpenSeq === lastHandled.current) return;
    lastHandled.current = demoListPageOpenSeq;
    setEntrySource("fab");
    setConciergeSurface("page");
    setOpen(true);
  }, [
    demoListPageOpenSeq,
    pathname,
    setEntrySource,
    setOpen,
    setConciergeSurface,
  ]);
}

/** `/demo/list` 自動オープン直後に `/demo` へ来たときモーダルを閉じる */
export function useCloseConciergeWhenDemoAfterAutoList(
  pathname: string,
  entrySource: string,
  setOpen: SetBool
) {
  useEffect(() => {
    if (pathname !== "/demo") return;
    if (entrySource !== "auto") return;
    setOpen(false);
  }, [pathname, entrySource, setOpen]);
}

/** pathname に応じて mode を同期 */
export function useConciergePathnameModeSync(
  pathname: string,
  setMode: (m: ConciergeMode) => void
) {
  useEffect(() => {
    if (pathname === "/flow" || pathname === "/services/development") {
      setMode("development");
    } else if (
      pathname === "/consulting" ||
      pathname === "/services/consulting"
    ) {
      setMode("consulting");
    } else if (pathname === "/services") {
      const picked = readServicesFlowPick();
      if (picked) setMode(picked);
      else setMode("default");
    } else {
      setMode("default");
    }
  }, [pathname, setMode]);
}

/** 初回訪問時の自動オープン */
export function useConciergeChatAutoOpen(
  pathname: string,
  setOpen: SetBool,
  setEntrySource: (v: "auto" | "fab") => void,
  setConciergeSurface: SetSurface,
  openRef: MutableRefObject<boolean>
) {
  useEffect(() => {
    const policy = getConciergeAutoOpenPolicy(pathname);
    if (!policy.enabled) return;
    if (!shouldAttemptChatAutoOpen(pathname)) return;
    const key = chatAutoOpenStorageKey(pathname);
    if (!key) return;
    if (consumeSuppressChatAutoOnce()) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(key) === "1") return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      if (openRef.current) return;
      if (pathname === "/demo/list" || pathname === "/services") {
        setEntrySource("auto");
        setConciergeSurface("page");
      }
      setOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname, setOpen, setEntrySource, setConciergeSurface, openRef]);
}

/** サイト内リンクでコンシェルジュを閉じる */
export function useConciergeNavigateFromChatListener(
  setOpen: SetBool,
  resetConciergeModalChrome: () => void
) {
  useEffect(() => {
    const onNavigateFromChat = () => {
      suppressNextChatAutoOpen();
      setOpen(false);
      resetConciergeModalChrome();
    };
    window.addEventListener(CONCIERGE_NAVIGATE_FROM_CHAT, onNavigateFromChat);
    return () =>
      window.removeEventListener(CONCIERGE_NAVIGATE_FROM_CHAT, onNavigateFromChat);
  }, [setOpen, resetConciergeModalChrome]);
}

/** demo ハブ以外へ出たらおすすめピック状態をクリア */
export function useClearDemoRecommendStateOnPath(
  resolvedPath: string,
  setDemoFreeformPicks: (v: null) => void,
  setDemoRecommendFromTextInFlight: SetBool
) {
  useEffect(() => {
    if (!isDemoHubForConciergePolicy(resolvedPath)) {
      setDemoFreeformPicks(null);
      setDemoRecommendFromTextInFlight(false);
    }
  }, [resolvedPath, setDemoFreeformPicks, setDemoRecommendFromTextInFlight]);
}

/** デモ関連ページでカタログを先読み */
export function usePrefetchDemoCatalogWhenChatOpen(open: boolean, pathname: string) {
  useEffect(() => {
    if (!open) return;
    if (!isDemoExperienceWizardPath(pathname)) return;
    prefetchDemoCatalog();
  }, [open, pathname]);
}

/** サービスカード直接経路の surface / entrySource / startDone */
export function useServiceCardDirectSync(
  open: boolean,
  isServiceCardDirect: boolean,
  pathname: string,
  setConciergeSurface: SetSurface,
  setEntrySource: (v: "fab") => void,
  setServiceCardStartDone: SetBool
) {
  useEffect(() => {
    if (open && isServiceCardDirect) {
      setConciergeSurface("page");
    }
  }, [open, isServiceCardDirect, setConciergeSurface]);

  useEffect(() => {
    if (pathname !== "/services" && isServiceCardDirect) {
      setEntrySource("fab");
    }
  }, [pathname, isServiceCardDirect, setEntrySource]);

  useEffect(() => {
    if (pathname !== "/services") {
      setServiceCardStartDone(false);
    }
  }, [pathname, setServiceCardStartDone]);
}
