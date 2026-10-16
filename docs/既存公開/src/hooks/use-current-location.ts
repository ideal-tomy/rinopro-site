"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sanitizeInternalReturnPath } from "@/lib/navigation/experience-entry";

/** いまの pathname + search（`returnTo` 用・別体験への1ホップ目） */
export function useCurrentLocationString(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useMemo(() => {
    const q = searchParams.toString();
    return pathname + (q ? `?${q}` : "");
  }, [pathname, searchParams]);
}

/**
 * 体験ページ間を辿るとき、URL に `returnTo` があればそれを優先（最初に入った場所を維持）。
 */
export function useEffectiveReturnTargetForExperience(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useMemo(() => {
    const nested = sanitizeInternalReturnPath(searchParams.get("returnTo"));
    if (nested) return nested;
    const p = new URLSearchParams(searchParams);
    p.delete("returnTo");
    const qs = p.toString();
    return pathname + (qs ? `?${qs}` : "");
  }, [pathname, searchParams]);
}
