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
import { prefillEstimateDraftFromConciergePath } from "@/lib/estimate/concierge-path-to-estimate-draft";
import { applyConciergeIndustryBundleToFormDraft } from "@/lib/estimate-domain/default/industry-adapter";
import { ESTIMATE_PHILOSOPHY_PREFILL_INDUSTRY_NOTE } from "@/lib/estimate/estimate-output-philosophy";
import {
  buildAnsweredQuestionIdSet,
  type EstimateQuestionId,
} from "@/lib/estimate-core/question-model";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";
import { visitorJourneySummaryToPriorContext } from "@/lib/journey/visitor-journey";
import { buildEstimateDraftFromVisitorJourney } from "@/lib/journey/visitor-journey-estimate-prefill";
import {
  readVisitorJourneySummary,
  recordVisitorEstimateDraft,
  recordVisitorIndustryBundle,
} from "@/lib/journey/visitor-journey-storage";

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
  hostingContext: "unknown",
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

function buildPriorBlockWithJourney(
  decoded: ConciergeEstimateContextPayload | null,
  journeySummary: VisitorJourneySummary | null
): string {
  const blocks = [
    journeySummary ? visitorJourneySummaryToPriorContext(journeySummary) : "",
    decoded ? [`トラック: ${decoded.track}`, decoded.detailBlock].join("\n\n") : "",
  ].filter(Boolean);
  return blocks.join("\n\n");
}

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
  const [visitorJourneySummary, setVisitorJourneySummary] =
    useState<VisitorJourneySummary | null>(null);
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
    if (decodedCtx?.industryBundle) {
      recordVisitorIndustryBundle(decodedCtx.industryBundle);
    }
    setVisitorJourneySummary(decodedCtx?.visitorJourney ?? readVisitorJourneySummary());
  }, [decodedCtx]);

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
          const journeySummary = decoded.visitorJourney ?? readVisitorJourneySummary();
          setDecodedCtx(decoded);
          setVisitorJourneySummary(journeySummary);
          setPriorBlock(buildPriorBlockWithJourney(decoded, journeySummary));
          const pathPrefill = prefillEstimateDraftFromConciergePath(
            decoded.track,
            decoded.path
          );
          const journeyPrefill = buildEstimateDraftFromVisitorJourney(journeySummary);
          setForm((prev) => {
            let next = { ...prev, ...journeyPrefill.draftPatch };
            if (decoded.industryBundle) {
              next = {
                ...next,
                ...applyConciergeIndustryBundleToFormDraft(decoded.industryBundle),
              };
            }
            next = { ...next, ...pathPrefill.draftPatch };
            return next;
          });
        } else {
          setDecodedCtx(null);
          const journeySummary = readVisitorJourneySummary();
          setVisitorJourneySummary(journeySummary);
          setPriorBlock(
            journeySummary ? visitorJourneySummaryToPriorContext(journeySummary) : ""
          );
        }
      } else {
        setDecodedCtx(null);
        const journeySummary = readVisitorJourneySummary();
        setVisitorJourneySummary(journeySummary);
        setPriorBlock(
          journeySummary ? visitorJourneySummaryToPriorContext(journeySummary) : ""
        );
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
        const journeySummary = decoded.visitorJourney ?? readVisitorJourneySummary();
        setDecodedCtx(decoded);
        setVisitorJourneySummary(journeySummary);
        setPriorBlock(buildPriorBlockWithJourney(decoded, journeySummary));
      }
    } else {
      setDecodedCtx(null);
      const journeySummary = readVisitorJourneySummary();
      setVisitorJourneySummary(journeySummary);
      setPriorBlock(
        journeySummary ? visitorJourneySummaryToPriorContext(journeySummary) : ""
      );
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
      if (flow.visitorJourney) {
        setVisitorJourneySummary(flow.visitorJourney);
      }
      return;
    }
    const journeySummary = readVisitorJourneySummary();
    setVisitorJourneySummary((current) => current ?? journeySummary);
    let f: FormState = {
      ...initialForm,
      ...buildEstimateDraftFromVisitorJourney(journeySummary).draftPatch,
    };
    if (!ctxFromUrl) {
      setForm(f);
      return;
    }
    const decoded = decodeConciergeEstimateContext(ctxFromUrl);
    if (!decoded) {
      setForm(f);
      return;
    }
    const pathPrefill = prefillEstimateDraftFromConciergePath(decoded.track, decoded.path);
    if (decoded.industryBundle) {
      f = { ...f, ...applyConciergeIndustryBundleToFormDraft(decoded.industryBundle) };
    }
    f = { ...f, ...pathPrefill.draftPatch };
    setForm(f);
  }, [resetFlag, ctxFromUrl]);

  const canSubmit = useMemo(() => form.summary.trim().length >= 8, [form.summary]);

  const pathPrefillMeta = useMemo(() => {
    if (!decodedCtx?.path?.length) return null;
    return prefillEstimateDraftFromConciergePath(decodedCtx.track, decodedCtx.path);
  }, [decodedCtx]);

  const prefilledQuestionIds = useMemo(() => {
    const ids: EstimateQuestionId[] = [];
    const journeyPrefill = buildEstimateDraftFromVisitorJourney(visitorJourneySummary);
    if (journeyPrefill.prefilledQuestionIds.length) {
      for (const id of journeyPrefill.prefilledQuestionIds) {
        if (!ids.includes(id)) ids.push(id);
      }
    }
    if (decodedCtx?.industryBundle) ids.push("industry");
    if (pathPrefillMeta?.prefilledQuestionIds.length) {
      for (const id of pathPrefillMeta.prefilledQuestionIds) {
        if (!ids.includes(id)) ids.push(id);
      }
    }
    return ids;
  }, [decodedCtx?.industryBundle, pathPrefillMeta, visitorJourneySummary]);

  const journeyConfirmLines = useMemo(
    () => buildEstimateDraftFromVisitorJourney(visitorJourneySummary).confirmLines,
    [visitorJourneySummary]
  );

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

  const goProcessing = () => {
    if (!canSubmit || isExiting) return;

    const commit = () => {
      exitTimerRef.current = null;
      const answers = buildEstimateDetailedAnswersRecord(form);
      recordVisitorEstimateDraft(form);
      resetEstimateProcessingLock();
      writeEstimateDetailedFlow({
        v: 1,
        ctxQuery,
        priorContext: priorBlock,
        answers,
        ai: null,
        visitorJourney: visitorJourneySummary,
        inquiryPreparation: null,
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
        <div className="space-y-6">
          {visitorJourneySummary || journeyConfirmLines.length > 0 ? (
            <section className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="text-sm font-semibold text-white">
                サイト内で整理できている内容を引き継いでいます
              </p>
              {journeyConfirmLines.length > 0 ? (
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-white/90">
                  {journeyConfirmLines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-accent/80">・</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}
          <EstimateDetailedMobileShell
            key={formInstanceKey}
            form={form}
            setForm={setForm}
            decodedCtx={decodedCtx}
            showPathPrefillNotice={Boolean(pathPrefillMeta?.hadPathMapping)}
            prefersReducedMotion={prefersReducedMotion}
            isExiting={isExiting}
            onSubmit={goProcessing}
            canSubmitGlobal={canSubmit}
            prefilledQuestionIds={prefilledQuestionIds}
            answeredQuestionIds={answeredQuestionIds}
          />
        </div>
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
            {pathPrefillMeta?.hadPathMapping ? (
              <p className="max-w-2xl text-xs leading-relaxed text-text-sub md:text-sm">
                {copy.pathPrefillFromChatNotice}
              </p>
            ) : null}
          </header>

          {visitorJourneySummary || journeyConfirmLines.length > 0 ? (
            <section className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4 md:p-5">
              <p className="text-sm font-semibold text-white">
                サイト内で整理できている内容を引き継いでいます
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                分かっている内容は初期値に反映しています。必要ならこのあと変更できます。
              </p>
              {journeyConfirmLines.length > 0 ? (
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-white/90">
                  {journeyConfirmLines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-accent/80">・</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {visitorJourneySummary ? (
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  {visitorJourneySummary.journeySummary}
                </p>
              ) : null}
            </section>
          ) : null}

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
