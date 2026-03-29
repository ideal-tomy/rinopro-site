"use client";

import { useLayoutEffect, useState } from "react";

export type VisualViewportFrame = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/**
 * iOS Safari 等: キーボード表示で layout と visual のビューポートがずれる。
 * fixed オーバーレイを visualViewport に合わせると、上が画面外に消える現象を抑えやすい。
 */
function readVisualViewportFrame(): VisualViewportFrame | null {
  if (typeof window === "undefined") return null;
  const vv = window.visualViewport;
  if (!vv) return null;
  return {
    top: vv.offsetTop,
    left: vv.offsetLeft,
    width: vv.width,
    height: vv.height,
  };
}

export function useVisualViewportFrame(): VisualViewportFrame | null {
  const [frame, setFrame] = useState<VisualViewportFrame | null>(readVisualViewportFrame);

  useLayoutEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const sync = () => {
      setFrame(readVisualViewportFrame());
    };

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, []);

  return frame;
}
