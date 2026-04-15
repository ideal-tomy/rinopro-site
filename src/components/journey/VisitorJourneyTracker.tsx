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
    const idleCapableWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleCapableWindow.requestIdleCallback === "function") {
      const handle = idleCapableWindow.requestIdleCallback(() => {
        recordVisitorPageVisit(pathname);
      });
      return () => {
        if (typeof idleCapableWindow.cancelIdleCallback === "function") {
          idleCapableWindow.cancelIdleCallback(handle);
        }
      };
    }

    const timer = globalThis.setTimeout(() => {
      recordVisitorPageVisit(pathname);
    }, 32);
    return () => globalThis.clearTimeout(timer);
  }, [pathname]);

  return null;
}
