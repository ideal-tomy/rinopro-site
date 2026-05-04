"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HomeBelowFold = dynamic(
  () => import("./HomeBelowFold").then((mod) => mod.HomeBelowFold),
  {
    ssr: false,
    loading: () => null,
  }
);

/** ナビからのジャンプ等で BelowFold を即マウントするためのカスタムイベント名 */
export const HOME_BELOW_FOLD_PREWARM_EVENT = "home:prewarm-belowfold";

export function HomeBelowFoldDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scheduleReady = () => {
      queueMicrotask(() => setReady(true));
    };
    const onPrewarm = () => scheduleReady();
    window.addEventListener(HOME_BELOW_FOLD_PREWARM_EVENT, onPrewarm);
    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      if (["demo", "industry", "faq", "cta"].includes(hashId)) {
        scheduleReady();
      }
    }
    return () => {
      window.removeEventListener(HOME_BELOW_FOLD_PREWARM_EVENT, onPrewarm);
    };
  }, []);

  useEffect(() => {
    if (ready) return;
    const windowWithIdle = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof windowWithIdle.requestIdleCallback === "function") {
      const id = windowWithIdle.requestIdleCallback(() => setReady(true));
      return () => {
        if (typeof windowWithIdle.cancelIdleCallback === "function") {
          windowWithIdle.cancelIdleCallback(id);
        }
      };
    }

    const timer = globalThis.setTimeout(() => setReady(true), 120);
    return () => globalThis.clearTimeout(timer);
  }, [ready]);

  return ready ? <HomeBelowFold /> : null;
}
