import { useCallback, useEffect, useRef } from "react";

/** One-shot, progressive scroll reveal with a reduced-motion fast path. */
export function useScrollReveal<T extends HTMLElement>() {
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback((element: T | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!element) return;
    element.setAttribute("data-reveal-ready", "true");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.setAttribute("data-entered", "true");
      return;
    }
    const nextObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.setAttribute("data-entered", "true");
      nextObserver.disconnect();
      observer.current = null;
    }, { threshold: 0.12 });
    observer.current = nextObserver;
    nextObserver.observe(element);
  }, []);

  useEffect(() => () => observer.current?.disconnect(), []);
  return ref;
}
