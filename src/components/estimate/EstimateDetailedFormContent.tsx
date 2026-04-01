"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EstimateDetailedHearingWizard } from "@/components/estimate/EstimateDetailedHearingWizard";
import { EstimateDetailedMobileShell } from "@/components/estimate/EstimateDetailedMobileShell";
import { EstimateDetailedRoughEstimateAccordion } from "@/components/estimate/EstimateDetailedRoughEstimateAccordion";
import { decodeConciergeEstimateContext } from "@/lib/chat/estimate-handoff";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import { resetEstimateProcessingLock } from "@/lib/estimate/estimate-detailed-processing-lock";
import { buildEstimateDetailedAnswersRecord } from "@/lib/estimate/build-estimate-detailed-answers";
import {
  clearEstimateDetailedFlow,
  readEstimateDetailedFlow,
  writeEstimateDetailedFlow,
  type EstimateFormDraft,
} from "@/lib/estimate/estimate-detailed-session";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { clearEstimateDetailedIntroDone } from "@/lib/estimate/estimate-detailed-intro-storage";
import { applyConciergeIndustryBundleToFormDraft } from "@/lib/estimate-domain/default/industry-adapter";
import { ESTIMATE_PHILOSOPHY_PREFILL_INDUSTRY_NOTE } from "@/lib/estimate/estimate-output-philosophy";
import {
  buildAnsweredQuestionIdSet,
  type EstimateQuestionId,
} from "@/lib/estimate-core/question-model";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;
const FADE_OUT_MS = 1000;

type FormState = EstimateFormDraft;

const initialForm: FormState = {
  industry: "unknown",
  summary: "",
  pain: "",
  teamSize: "11-50",
  timeline: "3m",
  integration: "nice",
  usageSurface: "unknown",
  dataSensitivity: "unknown",
  audienceScope: "unknown",
  currentWorkflow: "unknown",
  updateFrequency: "unknown",
  designExpectation: "unknown",
  loginModel: "unknown",
  budgetBand: "unknown",
  budgetFeel: "",
  constraints: "",
};

export function EstimateDetailedFormContent() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  /** ハイドレーション直後の幅誤判定でデスクトップが一瞬出るのを防ぐ */
  const [viewportNarrow, setViewportNarrow] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setViewportNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const [decodedCtx, setDecodedCtx] = useState<ConciergeEstimateContextPayload | null>(null);
  const [priorBlock, setPriorBlock] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [isExiting, setIsExiting] = useState(false);
  const [formInstanceKey, setFormInstanceKey] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<
    Set<EstimateQuestionId>
  >(new Set());
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** reset=1 の処理を、router 参照の再実行で何度も走らせない */
  const resetStripHandledRef = useRef(false);
  const formHydratedRef = useRef(false);

  const resetFlag = searchParams.get("reset");
  const ctxFromUrl = searchParams.get("ctx");
  const ctxQuery = ctxFromUrl;

  useEffect(() => {
    resetEstimateProcessingLock();
  }, []);

  useEffect(() => {
    setIsExiting(false);
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsExiting(false);
        if (exitTimerRef.current) {
          clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (resetFlag === "1") {
      if (resetStripHandledRef.current) {
        return;
      }
      resetStripHandledRef.current = true;

      resetEstimateProcessingLock();
      clearEstimateDetailedFlow();
      clearEstimateDetailedIntroDone();
      setForm(initialForm);
      setFormInstanceKey((k) => k + 1);
      setIsExiting(false);

      if (ctxFromUrl) {
        const decoded = decodeConciergeEstimateContext(ctxFromUrl);
        if (decoded) {
          setDecodedCtx(decoded);
          setPriorBlock([`トラック: ${decoded.track}`, decoded.detailBlock].join("\n\n"));
          if (decoded.industryBundle) {
            setForm((prev) => ({
              ...prev,
              ...applyConciergeIndustryBundleToFormDraft(decoded.industryBundle!),
            }));
          }
        } else {
          setDecodedCtx(null);
          setPriorBlock("");
        }
      } else {
        setDecodedCtx(null);
        setPriorBlock("");
      }

      const next = new URLSearchParams();
      if (ctxFromUrl) next.set("ctx", ctxFromUrl);
      const qs = next.toString();
      routerRef.current.replace(qs ? `/estimate-detailed?${qs}` : "/estimate-detailed");
      return;
    }

    resetStripHandledRef.current = false;

    if (ctxFromUrl) {
      const decoded = decodeConciergeEstimateContext(ctxFromUrl);
      if (decoded) {
        setDecodedCtx(decoded);
        setPriorBlock([`トラック: ${decoded.track}`, decoded.detailBlock].join("\n\n"));
      }
    } else {
      setDecodedCtx(null);
      setPriorBlock("");
    }
    // router は Next の再レンダーで参照が変わり得るため依存に含めない（reset 連打でフォームが消える不具合の原因になる）
  }, [resetFlag, ctxFromUrl]);

  useEffect(() => {
    if (formHydratedRef.current) return;
    if (resetFlag === "1") return;
    formHydratedRef.current = true;
    const flow = readEstimateDetailedFlow();
    // セッションに下書きがあれば優先（続きから）。なければ ctx の industryBundle のみマージ。
    if (flow?.formDraft) {
      setForm({ ...initialForm, ...flow.formDraft });
      if (flow.answers) {
        setAnsweredQuestionIds(buildAnsweredQuestionIdSet(flow.answers));
      }
      return;
    }
    if (!ctxFromUrl) return;
    const decoded = decodeConciergeEstimateContext(ctxFromUrl);
    if (decoded?.industryBundle) {
      setForm({
        ...initialForm,
        ...applyConciergeIndustryBundleToFormDraft(decoded.industryBundle),
      });
    }
  }, [resetFlag, ctxFromUrl]);

  const canSubmit = useMemo(() => form.summary.trim().length >= 8, [form.summary]);

  if (viewportNarrow === null) {
    return (
      <div
        className="min-h-[50dvh] w-full md:min-h-[50vh]"
        aria-busy="true"
      >
        <span className="sr-only">読み込み中</span>
      </div>
    );
  }

  const isNarrow = viewportNarrow;

  const prefilledQuestionIds = useMemo(
    () => (decodedCtx?.industryBundle ? (["industry"] as const) : []),
    [decodedCtx?.industryBundle]
  );

  const goProcessing = () => {
    if (!canSubmit || isExiting) return;

    const commit = () => {
      exitTimerRef.current = null;
      const answers = buildEstimateDetailedAnswersRecord(form);
      resetEstimateProcessingLock();
      writeEstimateDetailedFlow({
        v: 1,
        ctxQuery,
        priorContext: priorBlock,
        answers,
        ai: null,
        formDraft: form,
      });
      routerRef.current.push("/estimate-detailed/processing");
    };

    if (prefersReducedMotion) {
      commit();
      return;
    }

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        commit();
      });
    } else {
      setIsExiting(true);
      exitTimerRef.current = setTimeout(() => {
        commit();
      }, FADE_OUT_MS);
    }
  };

  return (
    <div
      className={cn(
        "transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
        isNarrow ? "min-h-0" : "space-y-10",
        isExiting && "pointer-events-none opacity-0"
      )}
    >
      {isNarrow ? (
        <EstimateDetailedMobileShell
          key={formInstanceKey}
          form={form}
          setForm={setForm}
          decodedCtx={decodedCtx}
          prefersReducedMotion={prefersReducedMotion}
          isExiting={isExiting}
          onSubmit={goProcessing}
          canSubmitGlobal={canSubmit}
          prefilledQuestionIds={prefilledQuestionIds}
          answeredQuestionIds={answeredQuestionIds}
        />
      ) : (
        <>
          <header className="space-y-3">
            <p className="text-sm font-medium text-accent">{copy.kicker}</p>
            <h1 className="text-2xl font-bold text-text md:text-3xl">{copy.title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/85 md:text-[16px]">
              {copy.intro}
            </p>
            {decodedCtx?.industryBundle ? (
              <p className="max-w-2xl text-xs leading-relaxed text-text-sub md:text-sm">
                {ESTIMATE_PHILOSOPHY_PREFILL_INDUSTRY_NOTE}
              </p>
            ) : null}
          </header>

          <section
            className="rounded-xl border border-accent/40 bg-base-dark/30 p-4 md:p-5"
            aria-label={copy.disclaimerTitle}
          >
            <h2 className="text-sm font-semibold text-accent">{copy.disclaimerTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-sub">{copy.disclaimerBody}</p>
          </section>

          <EstimateDetailedHearingWizard
            key={formInstanceKey}
            form={form}
            setForm={setForm}
            prefersReducedMotion={prefersReducedMotion}
            isExiting={isExiting}
            onSubmit={goProcessing}
            canSubmitGlobal={canSubmit}
            prefilledQuestionIds={prefilledQuestionIds}
            answeredQuestionIds={answeredQuestionIds}
          />

          {decodedCtx ? (
            <section
              className="space-y-5 rounded-xl border border-silver/25 bg-base-dark/50 p-5 md:p-8"
              aria-label={copy.roughEstimateTitle}
            >
              <EstimateDetailedRoughEstimateAccordion ctx={decodedCtx} />
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
