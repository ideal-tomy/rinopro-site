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

export function HomeBelowFoldDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
  }, []);

  return ready ? <HomeBelowFold /> : null;
}
