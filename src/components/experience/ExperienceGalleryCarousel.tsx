"use client";

import { useEffect, useRef } from "react";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import type { ImplementationShowcaseItem } from "@/lib/content/implementation-showcase";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** ゆっくり目だが、整数 scrollLeft でも確実に動くよう 1px 単位で加算 */
const SCROLL_PX_PER_FRAME = 0.22;

type Props = {
  items: readonly ImplementationShowcaseItem[];
};

export function ExperienceGalleryCarousel({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const loopItems = items.length > 0 ? [...items, ...items] : [];

  useEffect(() => {
    if (reduceMotion || items.length < 2) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    let scrollCarry = 0;

    const tick = () => {
      if (!pausedRef.current) {
        scrollCarry += SCROLL_PX_PER_FRAME;
        if (scrollCarry >= 1) {
          const step = Math.floor(scrollCarry);
          scrollCarry -= step;
          scroller.scrollLeft += step;
          const loopWidth = scroller.scrollWidth / 2;
          if (loopWidth > 0 && scroller.scrollLeft >= loopWidth - 1) {
            scroller.scrollLeft -= loopWidth;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length, reduceMotion]);

  if (items.length === 0) return null;

  return (
    <div
      ref={scrollerRef}
      className="no-scrollbar -mx-4 mt-8 overflow-x-scroll px-4 [-webkit-overflow-scrolling:touch] lg:hidden"
      onPointerDown={(event) => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          pausedRef.current = true;
        }
      }}
      onPointerUp={() => {
        pausedRef.current = false;
      }}
      onPointerCancel={() => {
        pausedRef.current = false;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          pausedRef.current = false;
        }
      }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      aria-roledescription="carousel"
      aria-label="その他の事例デモ一覧"
    >
      <ul className="flex w-max list-none gap-4 pb-1">
        {loopItems.map((item, index) => (
          <li
            key={`${item.slug}-${index}`}
            id={index < items.length ? `demo-${item.slug}` : undefined}
            className="w-[calc((100vw-2.5rem)/1.5)] max-w-[22rem] shrink-0 scroll-mt-28 snap-start"
          >
            <ImplementationShowcaseCard item={item} variant="compact" />
          </li>
        ))}
      </ul>
    </div>
  );
}
