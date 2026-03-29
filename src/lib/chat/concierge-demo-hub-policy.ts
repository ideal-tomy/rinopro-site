"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * 遅延CTA・recommend-from-text・デモハブ系 KPI の単一ソース。
 * Next の `usePathname` と `popstate` 由来の `location.pathname` を合成する。
 */
export function isDemoHubForConciergePolicy(p: string): boolean {
  if (!p) return false;
  return p.startsWith("/demo") || p.startsWith("/experience");
}

function subscribeToPopstate(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getWindowPathnameSnapshot(): string {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

export function useResolvedConciergePath(): string {
  const nextPathname = usePathname() ?? "";
  const windowPath = useSyncExternalStore(
    subscribeToPopstate,
    getWindowPathnameSnapshot,
    () => ""
  );
  if (typeof window === "undefined") return nextPathname;
  return nextPathname || windowPath;
}
