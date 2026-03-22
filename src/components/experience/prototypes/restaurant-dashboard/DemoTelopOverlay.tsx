"use client";

import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "@/lib/motion/variants";
import { DEMO_CROSSFADE_SEC } from "@/lib/experience/restaurant-dashboard/timing";
import { cn } from "@/lib/utils";

interface DemoTelopOverlayProps {
  text: string | null;
  reduceMotion: boolean;
  className?: string;
}

export function DemoTelopOverlay({
  text,
  reduceMotion,
  className,
}: DemoTelopOverlayProps) {
  const duration = reduceMotion ? 0 : DEMO_CROSSFADE_SEC;

  return (
    <AnimatePresence>
      {text ? (
        <motion.div
          key="telop"
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4",
            className
          )}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit={reduceMotion ? undefined : "exit"}
          variants={fadeIn}
          transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />
          <p
            className={cn(
              "relative max-w-lg rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-center text-sm font-medium leading-relaxed text-slate-800 shadow-lg sm:px-6 sm:py-4 sm:text-base"
            )}
          >
            {text}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
