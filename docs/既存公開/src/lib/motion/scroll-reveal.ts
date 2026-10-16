export const SCROLL_REVEAL = {
  duration: 760,
  largeDuration: 820,
  mobileDuration: 980,
  stagger: 140,
  mobileStagger: 120,
  offset: 18,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  mobileEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  rootMargin: "0px 0px -10% 0px",
  threshold: 0.2,
  settleQuietMs: 150,
  settleMaxMs: 500,
} as const;

/** iOS Safari changes the viewport height while the address bar moves; wait until it stops. */
export function afterViewportSettles(callback: () => void): () => void {
  const viewport = window.visualViewport;
  let quiet = 0;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    cancel();
    callback();
  };
  const restart = () => {
    window.clearTimeout(quiet);
    quiet = window.setTimeout(finish, SCROLL_REVEAL.settleQuietMs);
  };
  const limit = window.setTimeout(finish, SCROLL_REVEAL.settleMaxMs);
  function cancel() {
    window.clearTimeout(quiet);
    window.clearTimeout(limit);
    viewport?.removeEventListener("resize", restart);
    window.removeEventListener("resize", restart);
  }
  viewport?.addEventListener("resize", restart);
  window.addEventListener("resize", restart);
  restart();
  return () => {
    done = true;
    cancel();
  };
}
