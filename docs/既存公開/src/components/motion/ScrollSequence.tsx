"use client";

import { createContext, useContext, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Flutter _opacityFor(start, end) のスクロール連動版
 * useScroll + useTransform で Interval 閾値をスクロール量にマッピング
 */

interface ScrollSequenceProps {
  children: React.ReactNode;
  className?: string;
  /** スクロール範囲: [0] = progress 0 の位置, [1] = progress 1 の位置 */
  offset?: [string, string];
  /** モバイルでは1要素ごとの追従アニメを抑える */
  compactOnMobile?: boolean;
}

export function ScrollSequence({
  children,
  className,
  offset = ["start 0.85", "start 0.3"],
  compactOnMobile = true,
}: ScrollSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = useReducedMotion();
  const compact = prefersReducedMotion || (compactOnMobile && isMobile);
  const { scrollYProgress } = useScroll({
    target: ref,
    // @ts-expect-error framer-motion offset type is strict
    offset,
  });

  return (
    <motion.div ref={ref} className={cn(className)}>
      <ScrollSequenceContext.Provider value={{ scrollYProgress, compact }}>
        {children}
      </ScrollSequenceContext.Provider>
    </motion.div>
  );
}

const ScrollSequenceContext = createContext<{
  scrollYProgress: MotionValue<number>;
  compact: boolean;
} | null>(null);

interface ScrollSequenceItemProps {
  children: React.ReactNode;
  /** Flutter 閾値 [start, end] 0-1。この区間で opacity 0→1, y 20→0 */
  thresholds: [number, number];
  className?: string;
  /** scale も適用（CTA用・easeOutBack風） */
  withScale?: boolean;
}

export function ScrollSequenceItem({
  children,
  thresholds,
  className,
  withScale = false,
}: ScrollSequenceItemProps) {
  const ctx = useContext(ScrollSequenceContext);
  if (!ctx) {
    return <div className={cn(className)}>{children}</div>;
  }

  const { scrollYProgress, compact } = ctx;
  if (compact) {
    return <div className={cn(className)}>{children}</div>;
  }

  const [start, end] = thresholds;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);
  const scale = withScale
    ? useTransform(scrollYProgress, [start, end], [0.94, 1])
    : undefined;

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={cn("pointer-events-none", className)}
    >
      <div className="pointer-events-auto">{children}</div>
    </motion.div>
  );
}
