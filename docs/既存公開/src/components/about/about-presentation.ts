import { SCROLL_REVEAL } from "@/lib/motion/scroll-reveal";

/** Use the site's one-shot reveal controller; SSR content remains visible. */
export function aboutReveal(delay = 0, onLoad = false) {
  return {
    "data-scroll-reveal": "target",
    "data-scroll-reveal-duration": String(SCROLL_REVEAL.duration),
    "data-scroll-reveal-delay": String(delay / 80 * SCROLL_REVEAL.stagger),
    "data-scroll-reveal-on-load": String(onLoad),
  } as const;
}
