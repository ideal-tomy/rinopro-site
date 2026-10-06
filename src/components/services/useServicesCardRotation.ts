"use client";
import { useEffect, useRef, useState } from "react";
const labels = ["コンサルティング", "半内製化"];

export function useServicesCardRotation() {
  const stage = useRef<HTMLDivElement>(null);
  const selectSide = useRef<(side: number) => void>(() => {});
  const togglePlayback = useRef<() => void>(() => {});
  const [display, setDisplay] = useState({
    current: 0,
    angle: 0,
    paused: false,
    mobile: true,
    reduced: false,
    status: "",
  });

  useEffect(() => {
    const element = stage.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    let current = 0,
      angle = 0,
      paused = motion.matches,
      visible = false,
      dragging = false,
      hovered = false,
      focused = false,
      busy = false,
      manualUntil = 0,
      x = 0,
      y = 0,
      dx = 0,
      dy = 0,
      suppressUntil = 0;
    let timer: ReturnType<typeof setTimeout> | undefined,
      finish: ReturnType<typeof setTimeout> | undefined;
    const publish = (status = "") =>
      setDisplay({
        current,
        angle,
        paused,
        mobile: mobile.matches,
        reduced: motion.matches,
        status,
      });
    const schedule = () => {
      clearTimeout(timer);
      if (
        mobile.matches &&
        !paused &&
        !motion.matches &&
        visible &&
        !document.hidden &&
        !dragging &&
        !hovered &&
        !focused &&
        !busy &&
        !document.querySelector('[role="dialog"]')
      )
        timer = setTimeout(
          () => rotate(1, false),
          Math.max(6000, manualUntil - Date.now()),
        );
    };
    const rotate = (direction: number, manual: boolean) => {
      if (busy || !mobile.matches) return;
      busy = true;
      current = 1 - current;
      angle += 180 * direction;
      if (manual) manualUntil = Date.now() + 12000;
      clearTimeout(timer);
      publish(manual ? `${labels[current]}を表示` : "");
      clearTimeout(finish);
      finish = setTimeout(
        () => {
          busy = false;
          schedule();
        },
        motion.matches ? 0 : 1000,
      );
    };
    selectSide.current = (side) => {
      manualUntil = Date.now() + 12000;
      if (side !== current) rotate(1, true);
      else schedule();
    };
    togglePlayback.current = () => {
      paused = !paused;
      manualUntil = 0;
      publish();
      schedule();
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || busy || (e.target as Element).closest("button,a"))
        return;
      dragging = true;
      x = e.clientX;
      y = e.clientY;
      dx = dy = 0;
      schedule();
    };
    const move = (e: PointerEvent) => {
      if (dragging) {
        dx = e.clientX - x;
        dy = e.clientY - y;
      }
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        suppressUntil = Date.now() + 400;
        rotate(dx < 0 ? 1 : -1, true);
      } else {
        manualUntil = Date.now() + 12000;
        schedule();
      }
    };
    const cancel = () => {
      dragging = false;
      schedule();
    };
    const click = (e: MouseEvent) => {
      if (Date.now() < suppressUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        hovered = true;
        schedule();
      }
    };
    const leave = () => {
      hovered = false;
      schedule();
    };
    const focusIn = () => {
      focused = true;
      schedule();
    };
    const focusOut = (e: FocusEvent) => {
      focused = element.contains(e.relatedTarget as Node);
      manualUntil = Date.now() + 12000;
      schedule();
    };
    const preference = () => {
      if (motion.matches) paused = true;
      publish();
      schedule();
    };
    const viewport = () => {
      clearTimeout(finish);
      busy = false;
      dragging = false;
      hovered = false;
      publish();
      schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        schedule();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    const menuObserver = new MutationObserver(schedule);
    menuObserver.observe(document.body, { childList: true, subtree: true });
    element.addEventListener("pointerdown", down);
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", cancel);
    element.addEventListener("click", click, true);
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focusin", focusIn);
    element.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", preference);
    mobile.addEventListener("change", viewport);
    publish();
    schedule();
    return () => {
      clearTimeout(timer);
      clearTimeout(finish);
      observer.disconnect();
      menuObserver.disconnect();
      element.removeEventListener("pointerdown", down);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", cancel);
      element.removeEventListener("click", click, true);
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focusin", focusIn);
      element.removeEventListener("focusout", focusOut);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", preference);
      mobile.removeEventListener("change", viewport);
    };
  }, []);

  return { display, selectSide, togglePlayback, stage };
}
