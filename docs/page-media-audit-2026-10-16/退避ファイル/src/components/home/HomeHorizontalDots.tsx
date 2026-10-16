"use client";

import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

type HomeHorizontalDotsProps = {
  /** 横スクロールコンテナへの ref */
  containerRef: RefObject<HTMLElement | null>;
  /** カードの個数 */
  count: number;
  /** ラベル（aria-label のベース） */
  label?: string;
  /**
   * dotの追跡対象を限定するセレクタ（例: `[data-dot-target]`）。
   * 連結アイコンなどコンテナ内の非カード要素を無視するために使う。
   */
  itemSelector?: string;
  className?: string;
};

/**
 * モバイル横スクロールの位置を伝えるドットインジケータ。
 * IntersectionObserver で「コンテナ内の各子要素」のうち中央に最も近いものを active にする。
 * - クリック/タップで該当インデックスへスムーズスクロール
 * - prefers-reduced-motion 時は behavior:auto
 */
export function HomeHorizontalDots({
  containerRef,
  count,
  label = "スライド",
  itemSelector,
  className,
}: HomeHorizontalDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const selectorKey = itemSelector ?? "";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof window === "undefined") return;

    const getItems = (): HTMLElement[] => {
      if (selectorKey) {
        return Array.from(
          container.querySelectorAll<HTMLElement>(selectorKey)
        );
      }
      return Array.from(container.children) as HTMLElement[];
    };

    const update = () => {
      const center = container.scrollLeft + container.clientWidth / 2;
      const items = getItems();
      let bestIndex = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < items.length && i < count; i++) {
        const item = items[i];
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(center - itemCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
      setActiveIndex(bestIndex);
    };

    update();
    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, count, selectorKey]);

  const onClickDot = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const items: HTMLElement[] = selectorKey
      ? Array.from(container.querySelectorAll<HTMLElement>(selectorKey))
      : (Array.from(container.children) as HTMLElement[]);
    const item = items[index];
    if (!item) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    container.scrollTo({
      left:
        item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  if (count <= 1) return null;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "mt-5 flex items-center justify-center gap-2",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            aria-current={isActive ? "true" : undefined}
            aria-label={`${label} ${index + 1} / ${count}`}
            onClick={() => onClickDot(index)}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base",
              isActive ? "w-6 bg-accent" : "w-2 bg-white/30 hover:bg-white/55"
            )}
          />
        );
      })}
    </div>
  );
}
