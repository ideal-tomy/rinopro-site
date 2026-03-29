"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef } from "react";
import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  DURATION_PAGE_IN,
  DURATION_PAGE_OUT,
} from "@/lib/motion/config";
import type { DocumentShellChoiceStep } from "@/lib/experience/document-shell-preset-types";
import { cn } from "@/lib/utils";

export interface DocumentShellChoiceWizardProps {
  steps: DocumentShellChoiceStep[];
  selections: Record<string, string>;
  onSelect: (stepId: string, optionId: string) => void;
  stepIndex: number;
  onStepIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  disabled?: boolean;
  className?: string;
}

export function DocumentShellChoiceWizard({
  steps,
  selections,
  onSelect,
  stepIndex,
  onStepIndexChange,
  open,
  onOpenChange,
  onComplete,
  disabled = false,
  className,
}: DocumentShellChoiceWizardProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const durationOut = reduce ? 0 : DURATION_PAGE_OUT / 1000;
  const durationIn = reduce ? 0 : DURATION_PAGE_IN / 1000;

  const n = steps.length;
  const safeIndex = Math.min(Math.max(0, stepIndex), Math.max(0, n - 1));
  const current = n > 0 ? steps[safeIndex] : null;
  const remaining = n > 0 ? n - safeIndex - 1 : 0;
  const selectedId = current ? selections[current.id] : undefined;
  const hasSelection = Boolean(selectedId?.trim());

  const finishWizard = useCallback(() => {
    onComplete();
    onOpenChange(false);
  }, [onComplete, onOpenChange]);

  const goNext = useCallback(() => {
    if (!current) return;
    if (safeIndex >= n - 1) {
      finishWizard();
      return;
    }
    onStepIndexChange(safeIndex + 1);
  }, [current, safeIndex, n, onStepIndexChange, finishWizard]);

  const goPrev = useCallback(() => {
    if (safeIndex <= 0) return;
    onStepIndexChange(safeIndex - 1);
  }, [safeIndex, onStepIndexChange]);

  const handleOptionPick = useCallback(
    (optionId: string) => {
      if (!current || disabled) return;
      onSelect(current.id, optionId);
      if (safeIndex >= n - 1) {
        finishWizard();
      } else {
        onStepIndexChange(safeIndex + 1);
      }
    },
    [
      current,
      disabled,
      onSelect,
      safeIndex,
      n,
      onStepIndexChange,
      finishWizard,
    ]
  );

  const handleSkipOrNext = useCallback(() => {
    if (!current || disabled) return;
    if (!current.optional && !hasSelection) return;
    goNext();
  }, [current, disabled, hasSelection, goNext]);

  const handleComplete = useCallback(() => {
    if (!current || disabled) return;
    if (!current.optional && !hasSelection) return;
    finishWizard();
  }, [current, disabled, hasSelection, finishWizard]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const t = window.setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const first =
        root.querySelector<HTMLElement>(
          "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        ) ?? root;
      first.focus();
    }, reduce ? 0 : Math.min(DURATION_PAGE_IN, 120));
    return () => window.clearTimeout(t);
  }, [open, safeIndex, reduce]);

  if (!open || n === 0 || !current) return null;

  const isLast = safeIndex >= n - 1;
  const showNextOrSkip = Boolean(current.optional && !isLast);
  const completeDisabled = disabled || (!current.optional && !hasSelection);

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col rounded-xl bg-black/50 p-3 backdrop-blur-sm md:p-4",
        className
      )}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-silver/25 bg-[#141820] shadow-xl"
      >
        <div className="shrink-0 border-b border-silver/15 px-3 py-2.5 md:px-4">
          <p className="text-[11px] font-medium tracking-wide text-text-sub md:text-xs">
            {n}問中 {safeIndex + 1}問目
            <span className="mx-1.5 text-text-sub/50">·</span>
            あと{remaining}問
          </p>
          <h3
            id={titleId}
            className="mt-1 text-sm font-semibold leading-snug text-text md:text-[1rem]"
          >
            {current.title}
            {current.optional ? (
              <span className="ml-1.5 text-xs font-normal text-text-sub/90">
                （任意）
              </span>
            ) : null}
          </h3>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 md:px-4 md:py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={
                reduce
                  ? false
                  : { opacity: 0, y: 12, filter: "blur(10px)" }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: durationIn,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    }
              }
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      y: -8,
                      filter: "blur(4px)",
                      transition: {
                        duration: durationOut,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    }
              }
              className="space-y-3"
            >
              <div
                className={cn(
                  "grid gap-2",
                  current.options.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2"
                )}
              >
                {current.options.map((opt, oi) => (
                  <ConciergeChoiceButton
                    key={opt.id}
                    type="button"
                    order={oi + 1}
                    label={opt.label}
                    disabled={disabled}
                    selected={selections[current.id] === opt.id}
                    onClick={() => handleOptionPick(opt.id)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-silver/15 bg-base/30 px-3 py-2.5 md:px-4">
          {safeIndex > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text-sub hover:text-text"
              disabled={disabled}
              onClick={goPrev}
            >
              戻る
            </Button>
          ) : null}
          <div className="ml-auto flex flex-wrap gap-2">
            {isLast ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-silver/35 text-text hover:bg-silver/10 hover:text-text"
                disabled={completeDisabled}
                onClick={handleComplete}
              >
                完了
              </Button>
            ) : showNextOrSkip ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-silver/35 text-text hover:bg-silver/10 hover:text-text"
                disabled={disabled}
                onClick={handleSkipOrNext}
              >
                {hasSelection ? "次へ" : "スキップして次へ"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
