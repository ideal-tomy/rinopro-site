import { useCallback, useEffect, useRef } from "react";
import { SCROLL_REVEAL, afterViewportSettles } from "@/lib/motion/scroll-reveal";

/** Observe each visible step separately, so long mobile flows never reveal below the fold. */
export function useScrollReveal<T extends HTMLElement>(selector?: string) {
  const cleanup = useRef<(() => void) | null>(null);
  const ref = useCallback((element: T | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = selector ? Array.from(element.querySelectorAll<HTMLElement>(selector)) : [element];
    const observer = new IntersectionObserver((entries) => {
      let index = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        const threshold = Math.min(SCROLL_REVEAL.threshold, window.innerHeight * 0.18 / entry.boundingClientRect.height);
        if (entry.intersectionRatio < threshold) continue;
        const stagger = window.innerWidth < 768 ? SCROLL_REVEAL.mobileStagger : SCROLL_REVEAL.stagger;
        target.style.setProperty("--reveal-delay", String(index++ * stagger) + "ms");
        target.dataset.entered = "true";
        observer.unobserve(target);
      }
    }, { threshold: [0, 0.05, 0.1, 0.18, 0.2], rootMargin: SCROLL_REVEAL.rootMargin });
    // Nothing is hidden until the viewport settles; content already on screen then stays visible.
    const start = () => {
      if (selector) element.dataset.revealIndividual = "true";
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        if (media.matches || (rect.top < window.innerHeight - 24 && rect.bottom > 0)) target.dataset.entered = "true";
        target.dataset.revealReady = "true";
        if (target.dataset.entered !== "true") observer.observe(target);
      });
    };
    const revealAll = () => {
      if (!media.matches) return;
      observer.disconnect();
      targets.forEach(target => { target.dataset.entered = "true"; });
    };
    let cancelSettle = () => {};
    if (media.matches) start();
    else cancelSettle = afterViewportSettles(start);
    media.addEventListener("change", revealAll);
    cleanup.current = () => { cancelSettle(); observer.disconnect(); media.removeEventListener("change", revealAll); };
  }, [selector]);
  useEffect(() => () => cleanup.current?.(), []);
  return ref;
}
