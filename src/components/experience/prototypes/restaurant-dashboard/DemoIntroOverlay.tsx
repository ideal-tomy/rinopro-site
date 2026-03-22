"use client";

import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, fadeInUp } from "@/lib/motion/variants";
import { DEMO_CROSSFADE_SEC } from "@/lib/experience/restaurant-dashboard/timing";
import { cn } from "@/lib/utils";

const INTRO_TITLE =
  "一連の機能説明demoによる機能説明をご覧ください";

interface DemoIntroOverlayProps {
  phase: "title" | "play";
  reduceMotion: boolean;
  onPlay: () => void;
  className?: string;
}

export function DemoIntroOverlay({
  phase,
  reduceMotion,
  onPlay,
  className,
}: DemoIntroOverlayProps) {
  const cross = reduceMotion ? 0 : DEMO_CROSSFADE_SEC;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 p-4",
        "pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurant-demo-intro-title"
    >
      <AnimatePresence mode="wait">
        {phase === "title" ? (
          <motion.div
            key="intro-title"
            id="restaurant-demo-intro-title"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0 : 1.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="max-w-md px-4 text-center"
          >
            <p className="text-lg font-semibold leading-relaxed !text-white drop-shadow-sm sm:text-xl">
              {INTRO_TITLE}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="intro-play"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: cross, ease: [0.4, 0, 0.2, 1] }}
            className="flex w-full max-w-sm flex-col items-center gap-4 px-4"
          >
            <p className="text-center text-sm !text-white/95">
              タップすると自動で進みます（一時停止・次へも利用できます）
            </p>
            <button
              type="button"
              onClick={onPlay}
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.99]"
            >
              再生
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
