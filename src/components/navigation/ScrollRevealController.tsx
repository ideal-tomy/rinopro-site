"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SCROLL_REVEAL } from "@/lib/motion/scroll-reveal";

const TARGETS = [
  "main section",
  "main article",
  "main header",
  "main form",
  "main fieldset",
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main ul",
  "main li",
  "main figure",
  "main table",
  "main dl",
  "footer",
  '[data-scroll-reveal="target"]',
].join(",");

/** 全ページの本文を初回進入時に表示。SSRの内容は隠さず、DOMの構造も変えない。 */
export function ScrollRevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    const revealed = new WeakSet<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const threshold = Number(element.dataset.scrollRevealThreshold) || Math.min(SCROLL_REVEAL.threshold, window.innerHeight * 0.18 / entry.boundingClientRect.height);
          if (entry.intersectionRatio < threshold) continue;
          observer.unobserve(element);
          if (revealed.has(element)) continue;
          revealed.add(element);
          if (media.matches) continue;
          const offset =
            element.dataset.scrollRevealAxis === "x" ? "18px 0" : "0 18px";
          const animation = element.animate(
            [
              { opacity: 0, translate: offset },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: window.innerWidth < 768 ? SCROLL_REVEAL.mobileDuration : Math.max(SCROLL_REVEAL.duration, Number(element.dataset.scrollRevealDuration) || 0),
              delay: (Number(element.dataset.scrollRevealDelay) || 0) * (window.innerWidth < 768 ? SCROLL_REVEAL.mobileStagger / SCROLL_REVEAL.stagger : 1),
              fill: "backwards",
              easing: window.innerWidth < 768 ? SCROLL_REVEAL.mobileEasing : SCROLL_REVEAL.easing,
            },
          );
          animations.set(element, animation);
          animation.onfinish = () => animations.delete(element);
        }
      },
      { rootMargin: SCROLL_REVEAL.rootMargin, threshold: [0, 0.05, 0.1, 0.18, 0.2, 0.35] },
    );

    function scan() {
      frame = 0;
      for (const element of document.querySelectorAll<HTMLElement>(TARGETS)) {
        if (
          tracked.has(element) ||
          element.closest('[data-scroll-reveal="off"], [data-reveal-ready="true"]') ||
          element.querySelector('[data-reveal-ready="true"]')
        )
          continue;
        const explicit = element.dataset.scrollReveal === "target";
        if (
          !explicit &&
          element.closest(
            '[data-scroll-reveal="group"], [data-scroll-reveal="target"]',
          )
        )
          continue;
        const rect = element.getBoundingClientRect();
        // 長いセクションは中の見出しやカードを対象にし、二重に動かさない。
        if (
          !rect.width ||
          !rect.height ||
          (!explicit && rect.height > window.innerHeight * 0.9)
        )
          continue;
        let parent = element.parentElement;
        while (parent && !tracked.has(parent)) parent = parent.parentElement;
        if (parent) continue;
        // 同じ要素の既存アニメーションを上書きしない。
        if (element.style.opacity || element.style.transform) continue;
        tracked.add(element);
        // 初期画面は通常どおり表示し、明示された要素だけ入場演出を行う。
        if (
          media.matches ||
          (element.dataset.scrollRevealOnLoad !== "true" &&
            rect.top < window.innerHeight - 24)
        ) {
          revealed.add(element);
        } else {
          observer.observe(element);
        }
      }
      for (const element of tracked) {
        if (element.isConnected) continue;
        observer.unobserve(element);
        animations.get(element)?.cancel();
        animations.delete(element);
        tracked.delete(element);
      }
    }

    function scheduleScan() {
      if (!frame) frame = window.requestAnimationFrame(scan);
    }

    function cancelMotion() {
      if (!media.matches) return;
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      observer.disconnect();
      tracked.forEach((element) => revealed.add(element));
    }

    function onFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      let element: HTMLElement | null =
        event.target instanceof HTMLElement
          ? event.target
          : event.target.parentElement;
      while (element && !tracked.has(element)) element = element.parentElement;
      if (!element) return;
      observer.unobserve(element);
      animations.get(element)?.cancel();
      animations.delete(element);
      revealed.add(element);
    }

    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });
    media.addEventListener("change", cancelMotion);
    window.addEventListener("resize", scheduleScan);
    document.addEventListener("focusin", onFocus);
    scheduleScan();

    return () => {
      mutations.disconnect();
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      tracked.clear();
      media.removeEventListener("change", cancelMotion);
      window.removeEventListener("resize", scheduleScan);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
