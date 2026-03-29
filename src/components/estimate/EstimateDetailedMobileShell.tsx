"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EstimateDetailedHearingWizard } from "@/components/estimate/EstimateDetailedHearingWizard";
import { EstimateDetailedRoughEstimateFab } from "@/components/estimate/EstimateDetailedRoughEstimateFab";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import {
  readEstimateDetailedIntroDone,
  writeEstimateDetailedIntroDone,
} from "@/lib/estimate/estimate-detailed-intro-storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";

const copy = estimateDetailedCopy;

const FADE_SEC = 2;
const HOLD_SEC = 3;
const SLIDE_MS_NORMAL = (FADE_SEC + HOLD_SEC) * 1000;
const SLIDE_MS_REDUCE = 400;

const easeSpeak = [0.22, 1, 0.36, 1] as const;

type Props = {
  form: EstimateFormDraft;
  setForm: Dispatch<SetStateAction<EstimateFormDraft>>;
  decodedCtx: ConciergeEstimateContextPayload | null;
  prefersReducedMotion: boolean;
  isExiting: boolean;
  onSubmit: () => void;
  canSubmitGlobal: boolean;
};

export function EstimateDetailedMobileShell({
  form,
  setForm,
  decodedCtx,
  prefersReducedMotion,
  isExiting,
  onSubmit,
  canSubmitGlobal,
}: Props) {
  const skipIntroOnMount = useRef(readEstimateDetailedIntroDone());
  const [phase, setPhase] = useState<"intro" | "wizard">(() =>
    skipIntroOnMount.current ? "wizard" : "intro"
  );
  const [introIndex, setIntroIndex] = useState(0);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishIntro = useCallback(() => {
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
    writeEstimateDetailedIntroDone();
    setPhase("wizard");
  }, []);

  const handleSkip = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    const slideMs = prefersReducedMotion ? SLIDE_MS_REDUCE : SLIDE_MS_NORMAL;
    introTimerRef.current = setTimeout(() => {
      introTimerRef.current = null;
      setIntroIndex((i) => {
        if (i < 2) return i + 1;
        writeEstimateDetailedIntroDone();
        setPhase("wizard");
        return i;
      });
    }, slideMs);
    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }
    };
  }, [phase, introIndex, prefersReducedMotion]);

  const fadeDuration = prefersReducedMotion ? 0 : FADE_SEC;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-[#0a0e17]/95 backdrop-blur-md",
        "pt-[max(0.75rem,env(safe-area-inset-top))]",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimate-mobile-dialog-label"
    >
      <div id="estimate-mobile-dialog-label" className="sr-only">
        {phase === "intro" ? "詳細見積もりの案内" : copy.sectionHearing}
      </div>

      {phase === "intro" ? (
        <>
          <div className="flex shrink-0 justify-end px-3 pb-2">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-text-sub hover:text-white"
              onClick={handleSkip}
            >
              スキップ
            </Button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4"
            aria-live="polite"
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={introIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: fadeDuration, ease: easeSpeak }}
                className="absolute inset-x-4 top-1/2 max-h-[70vh] -translate-y-1/2 overflow-y-auto text-center"
              >
                {introIndex === 0 ? (
                  <h1 className="text-[22px] font-bold leading-snug text-white">
                    {copy.title}
                  </h1>
                ) : null}
                {introIndex === 1 ? (
                  <p className="text-[15px] leading-relaxed text-white/90">
                    {copy.intro}
                  </p>
                ) : null}
                {introIndex === 2 ? (
                  <div className="space-y-3 text-left">
                    <h2 className="text-center text-lg font-semibold text-accent">
                      {copy.sectionHearing}
                    </h2>
                    <p className="text-center text-sm leading-relaxed text-text-sub">
                      {copy.requirementDefinitionNote}
                      を、あとからAIがたたき台としてまとめます。
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-2">
          <EstimateDetailedHearingWizard
            form={form}
            setForm={setForm}
            prefersReducedMotion={prefersReducedMotion}
            isExiting={isExiting}
            onSubmit={onSubmit}
            canSubmitGlobal={canSubmitGlobal}
            layoutVariant="fullscreen"
            hideSectionHeading
          />
        </div>
      )}

      {phase === "wizard" && decodedCtx ? (
        <EstimateDetailedRoughEstimateFab ctx={decodedCtx} />
      ) : null}
    </div>
  );
}
