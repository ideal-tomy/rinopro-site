"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewAutoPlayOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewAutoPlay(options: UseInViewAutoPlayOptions = {}) {
  const { threshold = 0.45, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isInView };
}
