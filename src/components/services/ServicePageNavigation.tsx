"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERVICE_DETAIL_LINKS } from "@/lib/ui/service-navigation";
import base from "./consulting-page.module.css";
import styles from "./service-navigation.module.css";

export function ServicePageLinks({
  current,
  bottom = false,
}: {
  current: "consulting" | "enablement";
  bottom?: boolean;
}) {
  const index = current === "consulting" ? 0 : 1;
  const sibling = SERVICE_DETAIL_LINKS[1 - index];
  return (
    <nav
      aria-label={
        bottom ? "ご支援内容のページ移動（末尾）" : "ご支援内容のページ移動"
      }
      className={styles.pageLinks}
    >
      <div className={base.container}>
        <div>
          <Link href="/services">← ご支援内容へ戻る</Link>
          {!bottom && (
            <span aria-current="page">{SERVICE_DETAIL_LINKS[index].label}</span>
          )}
        </div>
        <Link href={sibling.href}>
          {sibling.label}を見る <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}

export function ServiceSectionNav({
  items,
  label = "ページ内リンク",
}: {
  items: readonly (readonly [string, string])[];
  label?: string;
}) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(items[0]?.[0]);
  useEffect(() => {
    const element = nav.current;
    if (!element) return;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const threshold = 64 + element.getBoundingClientRect().height + 24;
      let id = items[0]?.[0];
      for (const [key] of items) {
        const target = document.getElementById(key);
        if (target && target.getBoundingClientRect().top <= threshold) id = key;
      }
      setActive(id);
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(() => {
      element
        .closest<HTMLElement>("[data-service-page]")
        ?.style.setProperty(
          "--service-section-nav-height",
          `${element.getBoundingClientRect().height}px`,
        );
      schedule();
    });
    resize.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [items]);
  useEffect(() => {
    const container = nav.current?.firstElementChild;
    const link = nav.current?.querySelector<HTMLElement>(
      '[aria-current="location"]',
    );
    if (!container || !link) return;
    const viewport = container.getBoundingClientRect();
    const target = link.getBoundingClientRect();
    const delta =
      target.left < viewport.left
        ? target.left - viewport.left
        : target.right > viewport.right
          ? target.right - viewport.right
          : 0;
    if (delta) container.scrollBy({ left: delta, behavior: "instant" });
  }, [active]);
  return (
    <nav
      ref={nav}
      className={`${base.anchorBar} ${styles.sectionNav}`}
      aria-label={label}
    >
      <div className={base.container}>
        {items.map(([id, title]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            className={active === id ? base.initialAnchor : undefined}
          >
            {title}
          </a>
        ))}
      </div>
    </nav>
  );
}

/** Keep controls reachable during reading; reveal the newly selected content without moving focus away from the tab. */
export function useServiceTabs() {
  const bar = useRef<HTMLElement | null>(null);
  const pending = useRef<number | null>(null);
  useEffect(() => {
    const element = bar.current;
    if (!element) return;
    const resize = new ResizeObserver(() => {
      const height = element.getBoundingClientRect().height;
      if (height)
        element
          .closest<HTMLElement>("[data-service-page]")
          ?.style.setProperty("--service-tabs-height", `${height}px`);
    });
    resize.observe(element);
    return () => {
      resize.disconnect();
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    };
  }, []);
  const revealPanel = (id: string) => {
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      const panel = document.getElementById(id);
      const control = bar.current;
      if (!panel || !control) return;
      const top = panel.getBoundingClientRect().top;
      if (
        top < control.getBoundingClientRect().bottom ||
        top > window.innerHeight - 80
      ) {
        panel.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }
    });
  };
  return {
    barRef: (node: HTMLElement | null) => {
      bar.current = node;
    },
    revealPanel,
  };
}
