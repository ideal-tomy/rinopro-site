"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { useVisualViewportFrame } from "@/hooks/use-visual-viewport-frame";
import { scrollChildTopIntoScrollContainer } from "@/lib/dom/scroll-child-into-container";
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
  skipIndustryStep?: boolean;
};

export function EstimateDetailedMobileShell({
  form,
  setForm,
  decodedCtx,
  prefersReducedMotion,
  isExiting,
  onSubmit,
  canSubmitGlobal,
  skipIndustryStep = false,
}: Props) {
  const wizardScrollRef = useRef<HTMLDivElement>(null);
  const [portalTarget] = useState<HTMLElement | null>(() =>
    typeof document !== "undefined" ? document.body : null
  );
  const vvFrame = useVisualViewportFrame();
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

  /** iOS: 入力フォーカス後に内側スクロールだけ動いて見出しが上に消えるのを抑える */
  const alignStepOnFieldFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const t = e.target;
      if (
        !(t instanceof HTMLInputElement) &&
        !(t instanceof HTMLTextAreaElement) &&
        !(t instanceof HTMLSelectElement)
      ) {
        return;
      }
      const sc = wizardScrollRef.current;
      if (!sc) return;
      const step = t.closest("[data-estimate-step-root]");
      if (!(step instanceof HTMLElement)) return;
      const run = () => scrollChildTopIntoScrollContainer(sc, step, 12);
      requestAnimationFrame(run);
      window.setTimeout(run, 120);
      window.setTimeout(run, 320);
    },
    []
  );

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

  const shellStyle =
    vvFrame != null
      ? {
          top: vvFrame.top,
          left: vvFrame.left,
          width: vvFrame.width,
          height: vvFrame.height,
        }
      : undefined;

  const shell = (
    <div
      className={cn(
        "fixed z-[100] flex min-h-0 flex-col overflow-hidden bg-[#0a0e17]/95 backdrop-blur-md",
        vvFrame != null ? "inset-auto" : "inset-0 min-h-[100dvh] max-h-[100dvh]",
        "pt-[max(0.75rem,env(safe-area-inset-top))]",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      )}
      style={shellStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimate-mobile-dialog-label"
    >
      <div id="estimate-mobile-dialog-label" className="sr-only">
        {phase === "intro" ? "詳細見積もりの案内" : copy.sectionHearing}
      </div>

      {phase === "intro" ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <Button
            type="button"
            variant="ghost"
            className="absolute right-2 top-1 z-20 text-sm text-text-sub hover:text-white sm:right-3 sm:top-2"
            onClick={handleSkip}
          >
            スキップ
          </Button>
          <div
            className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-2"
            aria-live="polite"
          >
            {/*
              iOS: top-50% + translate や 70vh はレイアウト用ビューポートとずれて下に沈む。
              flex 中央寄せ + dvh の max-height、AnimatePresence は wait で前後スライドの重なりを防ぐ。
              スキップは absolute でレイアウトを消費しない（本文の縦位置が下に押されない）。
            */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={introIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: fadeDuration, ease: easeSpeak }}
                className="w-full max-w-lg overflow-y-auto text-center [max-height:min(75dvh,calc(100dvh-9rem))]"
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
        </div>
      ) : (
        <div
          ref={wizardScrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain scroll-pt-3 px-2"
          onFocusCapture={alignStepOnFieldFocus}
        >
          <EstimateDetailedHearingWizard
            form={form}
            setForm={setForm}
            prefersReducedMotion={prefersReducedMotion}
            isExiting={isExiting}
            onSubmit={onSubmit}
            canSubmitGlobal={canSubmitGlobal}
            layoutVariant="fullscreen"
            hideSectionHeading
            scrollContainerRef={wizardScrollRef}
            skipIndustryStep={skipIndustryStep}
          />
        </div>
      )}

      {phase === "wizard" && decodedCtx ? (
        <EstimateDetailedRoughEstimateFab ctx={decodedCtx} dockToParent />
      ) : null}
    </div>
  );

  if (!portalTarget) {
    return null;
  }

  return createPortal(shell, portalTarget);
}
