"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGETS = [
  "main section", "main article", "main header", "main form", "main fieldset",
  "main h1", "main h2", "main h3", "main p", "main ul", "main li",
  "main figure", "main table", "main dl", "footer",
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

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (revealed.has(element)) continue;
        revealed.add(element);
        if (media.matches) continue;
        const animation = element.animate(
          [{ opacity: 0, translate: "0 14px" }, { opacity: 1, translate: "0 0" }],
          { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
        animations.set(element, animation);
        animation.onfinish = () => animations.delete(element);
      }
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

    function scan() {
      frame = 0;
      for (const element of document.querySelectorAll<HTMLElement>(TARGETS)) {
        if (tracked.has(element) || element.closest('[data-scroll-reveal="off"]')) continue;
        const rect = element.getBoundingClientRect();
        // 長いセクションは中の見出しやカードを対象にし、二重に動かさない。
        if (!rect.width || !rect.height || rect.height > window.innerHeight * 0.9) continue;
        let parent = element.parentElement;
        while (parent && !tracked.has(parent)) parent = parent.parentElement;
        if (parent) continue;
        // 同じ要素の既存アニメーションを上書きしない。
        if (element.style.opacity || element.style.transform) continue;
        tracked.add(element);
        // 初期画面・復元した位置の内容はすぐ読める状態を維持する。
        if (media.matches || rect.top < window.innerHeight - 24) {
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
      let element: HTMLElement | null = event.target instanceof HTMLElement ? event.target : event.target.parentElement;
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
