"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type CaseStudyNavItem = {
  id: string;
  label: string;
};

type CaseStudyStickyNavProps = {
  items: readonly CaseStudyNavItem[];
};

export function CaseStudyStickyNav({ items }: CaseStudyStickyNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      className="sticky top-28 py-16 pr-6"
      aria-label="ページ内ナビゲーション"
    >
      <p className="mb-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
        index
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-center gap-3 border-l-2 py-1.5 pl-3 text-[13px] transition-colors md:text-[14px]",
                  isActive
                    ? "border-[var(--color-warm)] font-semibold text-[var(--color-accent-primary)]"
                    : "border-transparent font-medium text-[var(--color-text-tertiary)] hover:border-[var(--color-border-light)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <span className="font-mono text-[10px] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
