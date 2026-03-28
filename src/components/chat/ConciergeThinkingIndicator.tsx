"use client";

import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 送信後〜ストリームの本文が出るまでの待ち時間用。
 * 視覚は最小、スクリーンリーダー用に状態を伝える。
 */
export function ConciergeThinkingIndicator({ className }: { className?: string }) {
  const reduce = useFramerReducedMotion();

  return (
    <div
      className={cn("flex w-full justify-start", className)}
      role="status"
      aria-live="polite"
      aria-label="回答を準備しています"
    >
      <div
        className={cn(
          "flex max-w-[85%] items-center gap-3 rounded-lg border border-silver/20 bg-base-dark/90 px-4 py-3",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
        )}
      >
        <span className="sr-only">回答を準備しています</span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-accent/70"
              animate={
                reduce
                  ? { opacity: 0.45 }
                  : {
                      opacity: [0.35, 1, 0.35],
                      scale: [0.92, 1, 0.92],
                    }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 1.15,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: [0.45, 0, 0.55, 1],
                    }
              }
            />
          ))}
        </div>
        <div className="h-px min-w-[4rem] flex-1 overflow-hidden rounded-full bg-silver/15 sm:min-w-[6rem]">
          {!reduce && (
            <motion.div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-accent/45 to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
