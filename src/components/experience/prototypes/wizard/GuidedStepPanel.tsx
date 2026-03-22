"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GuidedChoice } from "@/lib/experience/internal-knowledge/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuidedStepPanelProps {
  breadcrumbTrail: string;
  prompt: string;
  choices: GuidedChoice[];
  onChoice: (choice: GuidedChoice) => void;
  onBack: () => void;
  className?: string;
}

export function GuidedStepPanel({
  breadcrumbTrail,
  prompt,
  choices,
  onChoice,
  onBack,
  className,
}: GuidedStepPanelProps) {
  const reduce = useReducedMotion();
  const stagger = reduce ? 0 : 0.2;

  return (
    <div
      className={cn(
        "rounded-2xl border border-silver/25 bg-base-dark/95 p-5 shadow-xl md:p-7",
        className
      )}
    >
      <p className="mb-1 text-xs text-text-sub">{breadcrumbTrail}</p>
      <h2 className="mb-5 text-base font-semibold leading-snug text-text md:text-lg">
        {prompt}
      </h2>
      <div className="flex flex-col gap-2">
        {choices.map((c, i) => (
          <motion.div
            key={`${c.label}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.08 + i * stagger,
              duration: reduce ? 0 : 0.32,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-11 w-full justify-start whitespace-normal py-2.5 text-left text-sm"
              onClick={() => onChoice(c)}
            >
              {c.label}
            </Button>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex justify-start">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          戻る
        </Button>
      </div>
    </div>
  );
}
