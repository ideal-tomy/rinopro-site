"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { readAndConsumeScrollRestore } from "@/lib/navigation/scroll-restore";

/**
 * クライアント遷移で `returnTo` 先に戻ったとき、離脱時に保存したスクロールを復元する。
 */
export function ScrollRestoreOnRoute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  useEffect(() => {
    const y = readAndConsumeScrollRestore(location);
    if (y == null) return;

    const t = window.setTimeout(() => {
      window.scrollTo(0, y);
    }, 0);
    return () => clearTimeout(t);
  }, [location]);

  return null;
}
