"use client";

import { useEffect, useState, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Options = {
  /** true のとき常に 1（reduced-motion など） */
  disabled?: boolean;
};

/**
 * 要素の中心がビューポート下寄り → 中央付近へ来るにつれ 0→1。
 * トップ SP デモの Before/After オーバーレイ用。
 */
export function useScrollLinkedOpacity(
  ref: RefObject<HTMLElement | null>,
  options: Options = {}
) {
  const { disabled = false } = options;
  const [opacity, setOpacity] = useState(disabled ? 1 : 0);

  useEffect(() => {
    if (disabled) {
      setOpacity(1);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let raf = 0;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerY = rect.top + rect.height * 0.5;
      const start = vh * 0.82;
      const end = vh * 0.46;
      const range = start - end;
      const t = range <= 0 ? 1 : clamp((start - centerY) / range, 0, 1);
      setOpacity(t);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [disabled, ref]);

  return opacity;
}
