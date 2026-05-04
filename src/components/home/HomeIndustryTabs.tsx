"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { IndustryShowcaseCard } from "@/components/home/IndustryShowcaseCard";
import {
  FEATURED_INDUSTRY_SLUGS,
  INDUSTRY_SHOWCASE_ITEMS,
  FEATURED_INDUSTRY_ITEMS,
} from "@/lib/content/industry-showcase";
import { cn } from "@/lib/utils";

/**
 * 「業種から探す」をWAI-ARIA Tabs パターンで圧縮表示する。
 * - 全タブパネルを DOM に保持し、非選択は `hidden` で隠す（Googleは hidden 内も index する）
 * - モバイルではタブ列を横スクロール、PCはボタン群で横並び
 * - 矢印キー / Home / End で操作可能
 */
export function HomeIndustryTabs() {
  const items = FEATURED_INDUSTRY_ITEMS;
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((next: number) => {
    const target = tabRefs.current[next];
    if (target) target.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const last = items.length - 1;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault();
          const next = activeIndex >= last ? 0 : activeIndex + 1;
          setActiveIndex(next);
          focusTab(next);
          break;
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault();
          const prev = activeIndex <= 0 ? last : activeIndex - 1;
          setActiveIndex(prev);
          focusTab(prev);
          break;
        }
        case "Home": {
          e.preventDefault();
          setActiveIndex(0);
          focusTab(0);
          break;
        }
        case "End": {
          e.preventDefault();
          setActiveIndex(last);
          focusTab(last);
          break;
        }
      }
    },
    [activeIndex, focusTab, items.length]
  );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div
        role="tablist"
        aria-label="業種から探す"
        className="no-scrollbar -mx-4 mb-7 flex items-center gap-2 overflow-x-auto px-4 [scroll-snap-type:x_proximity] md:mx-0 md:mb-9 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.slug}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.slug}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.slug}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-[14px] font-medium tracking-tight transition-[color,background-color,border-color] duration-200 [scroll-snap-align:center] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base md:text-[15px]",
                isActive
                  ? "border-accent/60 bg-accent/15 text-white"
                  : "border-silver/25 bg-white/[0.02] text-white/80 hover:border-accent/45 hover:text-white"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={item.slug}
            id={`${baseId}-panel-${item.slug}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${item.slug}`}
            hidden={!isActive}
            className="focus:outline-none"
          >
            <div className="mx-auto max-w-3xl">
              <IndustryShowcaseCard
                item={item}
                priorityImage={index === 0}
              />
            </div>
          </div>
        );
      })}

      {(() => {
        const featuredSet = new Set<string>(FEATURED_INDUSTRY_SLUGS);
        const others = INDUSTRY_SHOWCASE_ITEMS.filter(
          (i) => !featuredSet.has(i.slug)
        );
        if (others.length === 0) return null;
        return (
          <div className="mt-10 text-center md:mt-12">
            <p className="text-[14px] text-white/70 md:text-[15px]">
              他の業種について
            </p>
            <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[14px] md:text-[15px]">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.hubPath}
                    className="text-accent underline-offset-4 transition hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
    </div>
  );
}
