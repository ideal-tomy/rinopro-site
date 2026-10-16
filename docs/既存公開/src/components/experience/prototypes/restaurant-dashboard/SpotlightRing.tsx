"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightRingProps {
  active: boolean;
  reduceMotion: boolean;
  label?: string;
  className?: string;
  children: ReactNode;
}

/** 注目枠＋周囲をわずかに暗く（clip なしのリング＋外側シャドウ） */
export function SpotlightRing({
  active,
  reduceMotion,
  label,
  className,
  children,
}: SpotlightRingProps) {
  return (
    <div className={cn("relative rounded-xl", className)}>
      {active ? (
        <>
          <span
            className="pointer-events-none absolute -inset-1 z-10 rounded-xl border-2 border-emerald-500 bg-emerald-500/5 shadow-[0_0_0_9999px_rgba(15,23,42,0.12)]"
            aria-hidden
          />
          {!reduceMotion ? (
            <span
              className="pointer-events-none absolute -inset-1 z-10 animate-pulse rounded-xl border-2 border-emerald-400/70"
              aria-hidden
            />
          ) : null}
          {label ? (
            <span className="pointer-events-none absolute -top-2 left-2 z-20 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow">
              {label}
            </span>
          ) : null}
        </>
      ) : null}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
