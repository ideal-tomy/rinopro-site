"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface IndustryPickerItem {
  id: string;
  label: string;
  icon: string;
}

interface IndustryPickerProps {
  items: IndustryPickerItem[];
  onSelect: (id: string) => void;
  className?: string;
}

export function IndustryPicker({
  items,
  onSelect,
  className,
}: IndustryPickerProps) {
  const reduce = useReducedMotion();
  const stagger = reduce ? 0 : 0.2;

  return (
    <div
      className={cn(
        "rounded-2xl border border-silver/25 bg-base-dark/95 p-5 shadow-xl md:p-7",
        className
      )}
    >
      <p className="mb-1 text-center text-xs font-medium uppercase tracking-wide text-text-sub">
        Step 1
      </p>
      <h2 className="mb-6 text-center text-lg font-semibold text-accent md:text-xl">
        業種を選んでください
      </h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.12 + i * stagger,
              duration: reduce ? 0 : 0.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-silver/30 bg-silver/5 px-2 py-3 text-center transition hover:border-action/50 hover:bg-action/10 md:py-4"
            onClick={() => onSelect(item.id)}
          >
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <span className="text-xs font-medium leading-tight text-text md:text-sm">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
