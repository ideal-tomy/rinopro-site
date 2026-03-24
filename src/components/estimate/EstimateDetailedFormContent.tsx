"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  decodeConciergeEstimateContext,
  summarizeConciergeEstimateContextForDisplay,
} from "@/lib/chat/estimate-handoff";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import { resetEstimateProcessingLock } from "@/lib/estimate/estimate-detailed-processing-lock";
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
  budgetBand: "unknown",
  budgetFeel: "",
  constraints: "",
};

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function buildAnswersRecord(f: EstimateFormDraft): Record<string, string> {
  const answers: Record<string, string> = {
    業種: optionLabel(copy.industryOptions, f.industry),
    "いまいちばんやりたいこと・課題": f.summary.trim(),
    "会社やチームの人数のイメージ": optionLabel(copy.teamOptions, f.teamSize),
    "いつ頃までに、という希望": optionLabel(copy.timelineOptions, f.timeline),
    "今お使いのツールや、他のシステムとのつなぎ": optionLabel(
      copy.integrationOptions,
      f.integration
    ),
    "ご予算のイメージ": optionLabel(copy.budgetBandOptions, f.budgetBand),
  };
  const pain = f.pain.trim();
  if (pain) answers["うまくいっていないこと"] = pain.slice(0, 400);
  const budgetNote = f.budgetFeel.trim();
  if (budgetNote) answers["予算の補足"] = budgetNote.slice(0, 120);
  const c = f.constraints.trim();
  if (c) answers["気になること・制約"] = c.slice(0, 600);
  return answers;
}

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
      const answers = buildAnswersRecord(form);
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
        <p className="max-w-2xl text-sm leading-relaxed text-text-sub md:text-base">
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

      <section
        key={formInstanceKey}
        id="estimate-hearing"
        className="space-y-6 rounded-xl border border-silver/25 bg-base-dark/50 p-5 md:p-8"
      >
        <div>
          <h2 className="text-lg font-semibold text-accent">{copy.sectionHearing}</h2>
          <p className="mt-1 text-xs text-text-sub md:text-sm">
            {copy.requirementDefinitionNote}を、あとからAIがたたき台としてまとめます。
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-industry">
            {copy.fieldIndustry}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldIndustryHint}</p>
          <select
            id="ed-industry"
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
            value={form.industry}
            onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
          >
            {copy.industryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-summary">
            {copy.fieldSummary}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldSummaryHint}</p>
          <Textarea
            id="ed-summary"
            rows={4}
            value={form.summary}
            maxLength={600}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            placeholder="例: 問い合わせメールの返信に毎日2時間かかっているので、楽にしたい"
            className="min-h-[100px] resize-y text-base md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-pain">
            {copy.fieldPain}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldPainHint}</p>
          <Textarea
            id="ed-pain"
            rows={3}
            value={form.pain}
            maxLength={400}
            onChange={(e) => setForm((f) => ({ ...f, pain: e.target.value }))}
            placeholder="例: 担当者によって返信の質がバラバラになる"
            className="min-h-[80px] resize-y text-base md:text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text" htmlFor="ed-team">
              {copy.fieldTeam}
            </label>
            <select
              id="ed-team"
              className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
              value={form.teamSize}
              onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))}
            >
              {copy.teamOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text" htmlFor="ed-time">
              {copy.fieldTimeline}
            </label>
            <select
              id="ed-time"
              className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
              value={form.timeline}
              onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
            >
              {copy.timelineOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-int">
            {copy.fieldIntegration}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldIntegrationHint}</p>
          <select
            id="ed-int"
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
            value={form.integration}
            onChange={(e) => setForm((f) => ({ ...f, integration: e.target.value }))}
          >
            {copy.integrationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-usage">
            {copy.fieldUsageSurface}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldUsageSurfaceHint}</p>
          <select
            id="ed-usage"
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
            value={form.usageSurface}
            onChange={(e) => setForm((f) => ({ ...f, usageSurface: e.target.value }))}
          >
            {copy.usageSurfaceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-band">
            {copy.fieldBudgetBand}
          </label>
          <select
            id="ed-band"
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-base text-text md:text-sm"
            value={form.budgetBand}
            onChange={(e) => setForm((f) => ({ ...f, budgetBand: e.target.value }))}
          >
            {copy.budgetBandOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-budget">
            {copy.fieldBudgetNote}
          </label>
          <Input
            id="ed-budget"
            value={form.budgetFeel}
            maxLength={120}
            onChange={(e) => setForm((f) => ({ ...f, budgetFeel: e.target.value }))}
            placeholder="例: まずは小さく試したい"
            className="min-h-11 text-base md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-constraints">
            {copy.fieldConstraints}
          </label>
          <p className="text-xs text-text-sub">{copy.fieldConstraintsHint}</p>
          <Textarea
            id="ed-constraints"
            rows={3}
            value={form.constraints}
            maxLength={600}
            onChange={(e) => setForm((f) => ({ ...f, constraints: e.target.value }))}
            placeholder="例: お客様の個人情報を扱う／スマホから使いたい"
            className="min-h-[80px] resize-y text-base md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            className="min-h-11 w-full sm:w-auto"
            disabled={!canSubmit || isExiting}
            onClick={goProcessing}
            aria-describedby={
              !canSubmit && !isExiting ? "estimate-submit-hint" : undefined
            }
          >
            {copy.btnGenerate}
          </Button>
          {!canSubmit && !isExiting ? (
            <p id="estimate-submit-hint" className="text-xs text-text-sub">
              {copy.btnGenerateDisabledHint}
            </p>
          ) : null}
          {isExiting ? (
            <p className="text-xs text-text-sub">次の画面に移動しています…</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
