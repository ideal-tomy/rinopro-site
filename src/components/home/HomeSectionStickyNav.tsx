"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HOME_BELOW_FOLD_PREWARM_EVENT } from "@/components/home/HomeBelowFoldDeferred";

type NavItem = {
  id: string;
  label: string;
  /** 念押しCTAは目立つ色で出す */
  isCta?: boolean;
  /** BelowFold（遅延マウント）配下にあるアンカーは即マウントが必要 */
  belowFold?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { id: "empathy", label: "課題" },
  { id: "pillars", label: "強み" },
  { id: "flow", label: "流れ" },
  { id: "demo", label: "実績", belowFold: true },
  { id: "industry", label: "業種別", belowFold: true },
  { id: "faq", label: "FAQ", belowFold: true },
  { id: "cta", label: "相談する", isCta: true, belowFold: true },
] as const;

/**
 * 「全部読まなくていい、必要な所だけ見ればいい」を可視化するためのトップ専用ナビ。
 * Header(`top-0 h-16 z-40`) の直下に sticky で重ねる（z-30）。
 * BelowFold は遅延マウントなので、対象ID へのジャンプ前に prewarm イベントを発火し、
 * 要素出現を rAF で待ってから scrollIntoView する。
 */
export function HomeSectionStickyNav() {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveId(visible.target.id);
    };

    const observer = new IntersectionObserver(handler, {
      rootMargin: "-45% 0px -50% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    let cancelled = false;

    const attach = () => {
      if (cancelled) return;
      let attached = 0;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          observer.observe(el);
          attached++;
        }
      }
      if (attached < NAV_ITEMS.length) {
        window.setTimeout(attach, 200);
      }
    };
    attach();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  /** アクティブなチップが見えるよう、横スクロール内で中央寄せ */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const target = list.querySelector<HTMLElement>(
      `[data-nav-id="${activeId}"]`
    );
    if (!target) return;
    const listRect = list.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const overflow =
      targetRect.left < listRect.left ||
      targetRect.right > listRect.right;
    if (!overflow) return;
    const offset =
      targetRect.left -
      listRect.left -
      (listRect.width - targetRect.width) / 2;
    list.scrollBy({
      left: offset,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeId, prefersReducedMotion]);

  const jumpTo = useCallback(
    (item: NavItem) => {
      if (typeof window === "undefined") return;
      if (item.belowFold) {
        window.dispatchEvent(new Event(HOME_BELOW_FOLD_PREWARM_EVENT));
      }
      const behavior: ScrollBehavior = prefersReducedMotion
        ? "auto"
        : "smooth";

      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(item.id);
        if (el) {
          el.scrollIntoView({ behavior, block: "start" });
          if (history.replaceState) {
            history.replaceState(null, "", `#${item.id}`);
          }
          return;
        }
        if (attempts++ < 40) {
          requestAnimationFrame(tryScroll);
        }
      };
      tryScroll();
    },
    [prefersReducedMotion]
  );

  return (
    <nav
      aria-label="ページ内セクション"
      className="sticky top-16 z-30 w-full border-b border-silver/15 bg-base/85 backdrop-blur supports-[backdrop-filter]:bg-base/65"
    >
      <div className="relative mx-auto max-w-6xl">
        <ul
          ref={listRef}
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto overscroll-x-contain px-3 py-2 [scroll-snap-type:x_proximity] sm:gap-2 md:px-6 md:py-2.5"
          role="list"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            const baseChip =
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] font-medium tracking-tight transition-[color,background-color,border-color] duration-200 [scroll-snap-align:center] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base sm:text-sm";
            const ctaCls = item.isCta
              ? cn(
                  "border-action/60 bg-action/15 text-white hover:bg-action/25",
                  isActive && "border-action bg-action text-white"
                )
              : cn(
                  "border-silver/25 bg-white/[0.02] text-white/80 hover:border-accent/45 hover:text-white",
                  isActive &&
                    "border-accent/60 bg-accent/15 text-white"
                );
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-nav-id={item.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(baseChip, ctaCls)}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpTo(item);
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        {/* 両端フェード（横にスクロールできることのヒント） */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-base/85 to-transparent md:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base/85 to-transparent md:hidden"
        />
      </div>
    </nav>
  );
}
