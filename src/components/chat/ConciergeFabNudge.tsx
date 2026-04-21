"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  conciergeFabNudgeByPageId,
  conciergeFabNudgeShared,
  getConciergeFabNudgePageId,
  type ConciergeFabNudgePageId,
} from "@/lib/content/site-copy";
import { emitConciergeKpi } from "@/lib/chat/concierge-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PageStateV1 = {
  dismissed?: boolean;
};

type FileV1 = {
  v: 1;
  pages: Partial<Record<ConciergeFabNudgePageId, PageStateV1>>;
};

const { storageKey, rotationIntervalMs } = conciergeFabNudgeShared;
const closeLabel = conciergeFabNudgeShared.controls.close;

function readFile(): FileV1 {
  if (typeof window === "undefined") return { v: 1, pages: {} };
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { v: 1, pages: {} };
    const parsed = JSON.parse(raw) as FileV1;
    if (parsed && parsed.v === 1 && parsed.pages) {
      return { ...parsed, v: 1, pages: parsed.pages };
    }
  } catch {
    /* ignore */
  }
  return { v: 1, pages: {} };
}

function readPageState(pageId: ConciergeFabNudgePageId): PageStateV1 {
  return readFile().pages[pageId] ?? {};
}

function writePageDismissed(pageId: ConciergeFabNudgePageId): void {
  if (typeof window === "undefined") return;
  try {
    const f = readFile();
    const merged: FileV1 = {
      ...f,
      v: 1,
      pages: {
        ...f.pages,
        [pageId]: { dismissed: true },
      },
    };
    window.localStorage.setItem(storageKey, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
}

/**
 * 右下「AIに相談」FABの直上。メイン3文のローテ＋閉じるのみ。
 *
 * 開発時: URL に `?fabNudgeReset=1` を付けると `localStorage` の当該キーを消し、
 * 全ページの「閉じた」状態をリセットして再表示を確認できる（本番では無効）。
 */
export function ConciergeFabNudge() {
  const pathname = usePathname() ?? "/";
  const pageId = getConciergeFabNudgePageId(pathname);
  const copy = conciergeFabNudgeByPageId[pageId];
  const lines = copy.lines;

  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const visibleEmitted = useRef<Set<string>>(new Set());

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setLineIndex(0);

    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("fabNudgeReset") === "1") {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* ignore */
        }
        url.searchParams.delete("fabNudgeReset");
        const next = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState(null, "", next);
        visibleEmitted.current.clear();
        setDismissed(false);
        return;
      }
    }

    const s = readPageState(pageId);
    setDismissed(!!s.dismissed);
  }, [hydrated, pageId, pathname]);

  useEffect(() => {
    if (!hydrated || dismissed) return;
    const key = `${pageId}::${pathname}`;
    if (visibleEmitted.current.has(key)) return;
    visibleEmitted.current.add(key);
    emitConciergeKpi({
      name: "fab_nudge_visible",
      pathname,
      nudgePageId: pageId,
    });
  }, [hydrated, dismissed, pageId, pathname]);

  const rotationActive = !dismissed && !reduceMotion;

  useEffect(() => {
    if (!rotationActive) return;
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % lines.length);
    }, rotationIntervalMs);
    return () => window.clearInterval(id);
  }, [rotationActive, pageId, lines.length]);

  const onDismiss = useCallback(() => {
    setDismissed(true);
    writePageDismissed(pageId);
    emitConciergeKpi({ name: "fab_nudge_dismiss", pathname, nudgePageId: pageId });
  }, [pageId, pathname]);

  if (!hydrated || dismissed) {
    return null;
  }

  return (
    <div
      className="pointer-events-auto mb-2 flex w-[min(20rem,calc(100vw-2rem))] max-w-sm flex-col items-stretch gap-1.5"
      role="region"
      aria-label={copy.regionAriaLabel}
    >
      {/* 閉じるは本文エリアと分離（本文の縦位置に影響させない） */}
      <div className="flex w-full shrink-0 justify-end">
        <Button
          type="button"
          variant="text"
          size="sm"
          className="h-7 min-h-0 px-2 text-[0.7rem] text-text-sub hover:text-text"
          onClick={onDismiss}
          aria-label={closeLabel}
        >
          {closeLabel}
        </Button>
      </div>

      <div
        className={cn(
          "flex min-h-[5.75rem] w-full items-center rounded-xl px-3 py-4 sm:min-h-[6rem] sm:px-4",
          "border-2 border-accent/45",
          "bg-[linear-gradient(155deg,#162a42_0%,#101d2f_55%,#0c1524_100%)]",
          "shadow-[0_6px_28px_rgba(0,0,0,0.55),0_0_0_1px_color-mix(in_srgb,var(--color-accent)_12%,transparent),0_0_28px_-6px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]",
          "backdrop-blur-sm"
        )}
        role="status"
        aria-live={rotationActive ? "polite" : "off"}
        aria-atomic="true"
      >
        <p
          className={cn(
            "w-full text-left text-sm leading-relaxed text-text sm:text-[0.9375rem]",
            "line-clamp-4 sm:line-clamp-none",
            rotationActive && "motion-safe:transition-opacity motion-safe:duration-200"
          )}
          key={reduceMotion ? `${pageId}-static` : `${pageId}-${lineIndex}`}
        >
          {reduceMotion ? lines[0] : lines[lineIndex]}
        </p>
      </div>
    </div>
  );
}
