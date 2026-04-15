"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordVisitorPageVisit } from "@/lib/journey/visitor-journey-storage";

export function VisitorJourneyTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    // 初回描画の競合を避けるため、記録処理はアイドル時に遅延させる。
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(() => {
        recordVisitorPageVisit(pathname);
      });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = window.setTimeout(() => {
      recordVisitorPageVisit(pathname);
    }, 32);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
