"use client";

import { ChevronDown } from "lucide-react";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { EstimateDetailedRoughEstimateBody } from "@/components/estimate/EstimateDetailedRoughEstimateBody";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;

type Props = {
  ctx: ConciergeEstimateContextPayload;
  className?: string;
};

export function EstimateDetailedRoughEstimateAccordion({ ctx, className }: Props) {
  return (
    <details
      className={cn(
        "group rounded-xl border border-accent/35 bg-accent/5 outline-none transition-[box-shadow] open:shadow-[0_0_0_1px_rgba(0,212,255,0.12)]",
        className
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3.5 md:px-5 md:py-4",
          "text-left [&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="text-[16px] font-semibold text-white md:text-[18px]">
          {copy.roughEstimateTitle}
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-accent/80 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        />
      </summary>
      <div className="border-t border-accent/25 px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4">
        <EstimateDetailedRoughEstimateBody ctx={ctx} />
      </div>
    </details>
  );
}
