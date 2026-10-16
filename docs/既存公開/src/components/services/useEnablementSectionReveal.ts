"use client";

import { useCallback, useEffect, useRef } from "react";

/** Visible by default, including SSR and failed/unsupported JavaScript. */
export function useEnablementSectionReveal() {
  const cleanup = useRef<(() => void) | null>(null);
  const ref = useCallback((element: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!element || element.dataset.sectionEntered === "true") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rect = element.getBoundingClientRect();
    if (media.matches || !window.IntersectionObserver || !element.animate ||
        (rect.top < window.innerHeight && rect.bottom > 0)) {
      element.dataset.sectionEntered = "true";
      return;
    }
    let animation: Animation | null = null;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      element.dataset.sectionEntered = "true";
      if (!media.matches) {
        animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 600, easing: "ease-out", fill: "none",
        });
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    const reduce = () => {
      if (!media.matches) return;
      observer.disconnect();
      animation?.cancel();
      element.dataset.sectionEntered = "true";
    };
    observer.observe(element);
    media.addEventListener("change", reduce);
    cleanup.current = () => {
      observer.disconnect();
      animation?.cancel();
      media.removeEventListener("change", reduce);
    };
  }, []);
  useEffect(() => () => cleanup.current?.(), []);
  return ref;
}
