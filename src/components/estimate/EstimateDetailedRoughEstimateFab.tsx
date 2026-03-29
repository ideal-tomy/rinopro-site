"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MessageSquareText } from "lucide-react";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { EstimateDetailedRoughEstimateBody } from "@/components/estimate/EstimateDetailedRoughEstimateBody";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;

type Props = {
  ctx: ConciergeEstimateContextPayload;
  className?: string;
};

export function EstimateDetailedRoughEstimateFab({ ctx, className }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      close();
    };
    window.addEventListener("pointerdown", onPointer, true);
    return () => window.removeEventListener("pointerdown", onPointer, true);
  }, [open, close]);

  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-4 pb-[max(1rem,env(safe-area-inset-bottom))]", className)}>
      <div className="pointer-events-auto relative flex max-w-full flex-col items-end gap-2">
        {open ? (
          <div
            ref={panelRef}
            id={labelId}
            role="region"
            aria-label={copy.roughEstimateTitle}
            className="max-h-[min(70vh,520px)] w-[min(calc(100vw-2rem),380px)] overflow-y-auto rounded-xl border border-accent/35 bg-base-dark/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            <p className="text-[16px] font-semibold text-white">{copy.roughEstimateTitle}</p>
            <EstimateDetailedRoughEstimateBody ctx={ctx} className="mt-3" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 w-full border-silver/35 text-text"
              onClick={close}
            >
              閉じる
            </Button>
          </div>
        ) : null}
        <Button
          ref={btnRef}
          type="button"
          size="icon"
          aria-expanded={open}
          aria-controls={open ? labelId : undefined}
          aria-label={open ? `${copy.roughEstimateTitle}を閉じる` : `${copy.roughEstimateTitle}を表示`}
          className="h-14 w-14 min-h-14 min-w-14 shrink-0 rounded-full border border-accent/40 bg-accent/15 text-accent shadow-lg hover:bg-accent/25 [&_svg]:size-6"
          onClick={toggle}
        >
          <MessageSquareText aria-hidden />
        </Button>
      </div>
    </div>
  );
}
