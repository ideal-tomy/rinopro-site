"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EstimateDetailedHearingWizard } from "@/components/estimate/EstimateDetailedHearingWizard";
import {
  decodeConciergeEstimateContext,
  summarizeConciergeEstimateContextForDisplay,
} from "@/lib/chat/estimate-handoff";
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

function RoughEstimateCard({ ctx }: { ctx: ConciergeEstimateContextPayload }) {
  const s = summarizeConciergeEstimateContextForDisplay(ctx);
  return (
    <section className="rounded-xl border border-accent/35 bg-accent/5 p-5 md:p-6">
      <h2 className="text-lg font-semibold text-accent">{copy.roughEstimateTitle}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-sub">{copy.roughEstimateSubtitle}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-text">{copy.roughTrackLabel}</dt>
          <dd className="mt-1 text-text-sub">{s.trackLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-text">{copy.roughStepsHeading}</dt>
          <dd className="mt-2 space-y-2">
            {s.steps.map((row) => (
              <div
                key={`${row.title}-${row.answerLine}`}
                className="rounded-lg border border-silver/20 bg-base-dark/40 px-3 py-2"
              >
                <p className="text-xs text-text-sub">{row.title}</p>
                <p className="mt-0.5 text-text">{row.answerLine}</p>
              </div>
            ))}
          </dd>
        </div>
        {s.freeNotes ? (
          <div>
            <dt className="font-medium text-text">{copy.roughNotesHeading}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-text-sub">{s.freeNotes}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export function EstimateDetailedFormContent() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [decodedCtx, setDecodedCtx] = useState<ConciergeEstimateContextPayload | null>(null);
  const [priorBlock, setPriorBlock] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [isExiting, setIsExiting] = useState(false);
  const [formInstanceKey, setFormInstanceKey] = useState(0);
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
      setForm(initialForm);
      setFormInstanceKey((k) => k + 1);
      setIsExiting(false);

      if (ctxFromUrl) {
        const decoded = decodeConciergeEstimateContext(ctxFromUrl);
        if (decoded) {
          setDecodedCtx(decoded);
          setPriorBlock([`トラック: ${decoded.track}`, decoded.detailBlock].join("\n\n"));
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
    if (flow?.formDraft) {
      setForm({ ...initialForm, ...flow.formDraft });
    }
  }, [resetFlag]);

  const canSubmit = useMemo(() => form.summary.trim().length >= 8, [form.summary]);

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
        "space-y-10 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
        isExiting && "pointer-events-none opacity-0"
      )}
    >
      <header className="space-y-3">
        <p className="text-sm font-medium text-accent">{copy.kicker}</p>
        <h1 className="text-2xl font-bold text-text md:text-3xl">{copy.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/85 md:text-[16px]">
          {copy.intro}
        </p>
      </header>

      <section
        className="rounded-xl border border-accent/40 bg-base-dark/30 p-4 md:p-5"
        aria-label={copy.disclaimerTitle}
      >
        <h2 className="text-sm font-semibold text-accent">{copy.disclaimerTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-sub">{copy.disclaimerBody}</p>
      </section>

      {decodedCtx ? (
        <RoughEstimateCard ctx={decodedCtx} />
      ) : (
        <section className="rounded-xl border border-dashed border-silver/30 bg-base-dark/20 p-5 text-center text-sm text-text-sub">
          {copy.roughEstimateEmpty}
        </section>
      )}

      <EstimateDetailedHearingWizard
        key={formInstanceKey}
        form={form}
        setForm={setForm}
        prefersReducedMotion={prefersReducedMotion}
        isExiting={isExiting}
        onSubmit={goProcessing}
        canSubmitGlobal={canSubmit}
      />
    </div>
  );
}
