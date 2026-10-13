"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SCROLL_REVEAL, afterViewportSettles } from "@/lib/motion/scroll-reveal";

/** 見出しの塊とカード1枚を、画面の外にいるあいだ隠しておき、届いたら1回だけ出す。 */
export function ScrollRevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    let frame = 0;
    let settled = false;
    let cancelSettle = () => {};

    function show(element: HTMLElement, animate: boolean) {
      if (element.dataset.scrollRevealed === "true") return;
      if (animate && !media.matches) {
        const mobile = window.innerWidth < 768;
        const duration = mobile ? SCROLL_REVEAL.mobileDuration : SCROLL_REVEAL.duration;
        const easing = mobile ? SCROLL_REVEAL.mobileEasing : SCROLL_REVEAL.easing;
        const delay = (Number(element.dataset.scrollRevealDelay) || 0) * (mobile ? SCROLL_REVEAL.mobileStagger / SCROLL_REVEAL.stagger : 1);
        element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
        window.requestAnimationFrame(() => {
          element.dataset.scrollRevealed = "true";
        });
        return;
      }
      element.dataset.scrollRevealed = "true";
    }

    function inView(element: HTMLElement) {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight - 24 && rect.bottom > 0;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const threshold = Number(element.dataset.scrollRevealThreshold) || Math.min(SCROLL_REVEAL.threshold, window.innerHeight * 0.18 / entry.boundingClientRect.height);
          if (entry.intersectionRatio < threshold) continue;
          observer.unobserve(element);
          show(element, true);
        }
      },
      { rootMargin: SCROLL_REVEAL.rootMargin, threshold: [0, 0.05, 0.1, 0.18, 0.2, 0.35] },
    );

    function excluded(element: HTMLElement) {
      return Boolean(element.closest('[data-scroll-reveal="off"], [data-reveal-ready="true"]'));
    }

    function scan() {
      frame = 0;
      const main = document.querySelector("main");
      if (!main) return;
      const cards = new Set<HTMLElement>();
      for (const element of main.querySelectorAll<HTMLElement>("article, li")) {
        if (excluded(element)) continue;
        if (element.tagName === "ARTICLE" || element.querySelector("h2, h3, h4, details")) cards.add(element);
      }
      for (const card of [...cards]) {
        for (const other of cards) {
          if (other !== card && other.contains(card)) cards.delete(card);
        }
      }

      const units: HTMLElement[] = [];
      const chosen = new Set<HTMLElement>();
      function add(element: HTMLElement | null) {
        if (!element || chosen.has(element) || tracked.has(element) || excluded(element)) return;
        if (element.dataset.scrollRevealed === "true") return;
        if (element.closest("main") !== main && element.tagName !== "FOOTER") return;
        for (const unit of chosen) {
          if (unit.contains(element) || element.contains(unit)) return;
        }
        for (const unit of tracked) {
          if (unit.contains(element) || element.contains(unit)) return;
        }
        chosen.add(element);
        units.push(element);
      }

      for (const card of cards) add(card);
      for (const heading of main.querySelectorAll<HTMLElement>("h1, h2")) {
        if (excluded(heading) || [...cards].some((card) => card.contains(heading))) continue;
        let cluster: HTMLElement = heading;
        let parent = heading.parentElement;
        while (parent && parent !== main && ![...cards].some((card) => parent!.contains(card))) {
          cluster = parent;
          parent = parent.parentElement;
        }
        add(cluster);
      }
      for (const target of main.querySelectorAll<HTMLElement>('[data-scroll-reveal="target"]')) {
        if ([...chosen].some((unit) => unit === target || unit.contains(target))) continue;
        add(target);
      }
      add(document.querySelector<HTMLElement>("footer"));

      for (const element of units) {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        tracked.add(element);
        if (media.matches || inView(element)) show(element, false);
        element.dataset.scrollRevealUnit = "true";
        if (element.dataset.scrollRevealed !== "true") observer.observe(element);
      }
      for (const element of tracked) {
        if (element.isConnected) continue;
        observer.unobserve(element);
        tracked.delete(element);
      }
    }

    function scheduleScan() {
      if (settled && !frame) frame = window.requestAnimationFrame(scan);
    }

    function startWhenSettled() {
      cancelSettle();
      if (media.matches) {
        settled = true;
        scheduleScan();
        return;
      }
      cancelSettle = afterViewportSettles(() => {
        settled = true;
        scheduleScan();
      });
    }

    function revealAll() {
      if (!media.matches) return;
      observer.disconnect();
      tracked.forEach((element) => show(element, false));
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
      show(element, false);
    }

    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });
    media.addEventListener("change", revealAll);
    window.addEventListener("resize", startWhenSettled);
    document.addEventListener("focusin", onFocus);
    startWhenSettled();

    return () => {
      cancelSettle();
      mutations.disconnect();
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      tracked.clear();
      media.removeEventListener("change", revealAll);
      window.removeEventListener("resize", startWhenSettled);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
