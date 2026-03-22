"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";
import { DURATION_SMOOTH } from "@/lib/motion/config";
import { cn } from "@/lib/utils";

interface WizardOverlayProps {
  phaseKey: string;
  children: React.ReactNode;
  className?: string;
}

/** フェーズ単位でクロスフェードする体験用オーバーレイ */
export function WizardOverlay({
  phaseKey,
  children,
  className,
}: WizardOverlayProps) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : DURATION_SMOOTH / 1000;

  return (
    <div
      className={cn(
        "relative min-h-[min(560px,78vh)] w-full overflow-hidden rounded-xl",
        className
      )}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseKey}
            role="dialog"
            aria-modal="true"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: dur, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-lg"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
