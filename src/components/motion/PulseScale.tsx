"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_OUT_BACK } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

/**
 * Flutter AnimatedScale(scale: 1.04) + タイマー制御の移植
 * 一定間隔で CTA が scale 1.0 → 1.04 → 1.0 とパルス
 * ホバーまたはスクロールで停止
 */
const PULSE_INTERVAL_MS = 5000;

interface PulseScaleProps {
  children: React.ReactNode;
  className?: string;
}

export function PulseScale({ children, className }: PulseScaleProps) {
  const prefersReducedMotion = useReducedMotion();
  const [pulse, setPulse] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;

    const id = setInterval(() => {
      setPulse((p) => !p);
    }, PULSE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [prefersReducedMotion, paused]);

  const handlePointerEnter = () => setPaused(true);

  useEffect(() => {
    if (paused) return;
    const handler = () => setPaused(true);
    window.addEventListener("scroll", handler, { once: true });
    return () => window.removeEventListener("scroll", handler);
  }, [paused]);

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      animate={{ scale: pulse ? 1.04 : 1 }}
      transition={{ ease: EASE_OUT_BACK, duration: 0.4 }}
      onPointerEnter={handlePointerEnter}
    >
      {children}
    </motion.div>
  );
}
