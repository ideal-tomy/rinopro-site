"use client";

import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";

const copy = estimateDetailedCopy;

const STEP_IDS = [
  "industry",
  "summary",
  "pain",
  "teamSize",
  "timeline",
  "integration",
  "usageSurface",
  "dataSensitivity",
  "audienceScope",
  "currentWorkflow",
  "updateFrequency",
  "designExpectation",
  "loginModel",
  "budgetBand",
  "budgetFeel",
  "constraints",
  "review",
] as const;

type StepId = (typeof STEP_IDS)[number];

const TOTAL_STEPS = STEP_IDS.length;

type FormState = EstimateFormDraft;

export type EstimateDetailedHearingWizardProps = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  prefersReducedMotion: boolean;
  isExiting: boolean;
  onSubmit: () => void;
  canSubmitGlobal: boolean;
};

const easeSpeak = [0.22, 1, 0.36, 1] as const;

export function EstimateDetailedHearingWizard({
  form,
  setForm,
  prefersReducedMotion,
  isExiting,
  onSubmit,
  canSubmitGlobal,
}: EstimateDetailedHearingWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const stepId = STEP_IDS[stepIndex] ?? "industry";
  const isFirst = stepIndex === 0;
  const isReview = stepId === "review";

  const remainingIncludingCurrent = Math.max(0, TOTAL_STEPS - stepIndex);

  const canAdvance = useMemo(() => {
    if (stepId === "summary") {
      return form.summary.trim().length >= 8;
    }
    return true;
  }, [form.summary, stepId]);

  const goNext = useCallback(() => {
    if (!canAdvance || isExiting) return;
    if (isReview) {
      if (canSubmitGlobal) onSubmit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
  }, [canAdvance, canSubmitGlobal, isExiting, isReview, onSubmit]);

  const goBack = useCallback(() => {
    if (isFirst || isExiting) return;
    setStepIndex((i) => Math.max(0, i - 1));
  }, [isExiting, isFirst]);

  const motionProps = prefersReducedMotion
    ? {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: 28, filter: "blur(4px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -20, filter: "blur(3px)" },
        transition: { duration: 0.38, ease: easeSpeak },
      };

  return (
    <section
      id="estimate-hearing"
      className="space-y-5 rounded-xl border border-silver/25 bg-base-dark/50 p-5 md:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-accent">{copy.sectionHearing}</h2>
          <p className="mt-1 text-xs text-text-sub md:text-sm">
            {copy.requirementDefinitionNote}を、あとからAIがたたき台としてまとめます。
          </p>
        </div>
        <div
          className="shrink-0 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-center text-xs font-medium text-accent sm:text-left"
          role="status"
          aria-live="polite"
        >
          {isReview ? (
            <span>最終確認</span>
          ) : (
            <span>
              残り <span className="tabular-nums">{remainingIncludingCurrent}</span> 問
            </span>
          )}
        </div>
      </div>

      <div className="relative isolate min-h-[280px] md:min-h-[300px]">
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/15 via-transparent to-silver/10 opacity-70"
          aria-hidden
        />
        <div className="relative overflow-hidden rounded-2xl border border-silver/20 bg-base-dark/80 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stepId}
              {...motionProps}
              className="p-5 md:p-7"
            >
              {stepId === "industry" ? (
                <StepBlock title={copy.fieldIndustry} hint={copy.fieldIndustryHint}>
                  <select
                    id="ed-industry"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.industry}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, industry: e.target.value }))
                    }
                  >
                    {copy.industryOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "summary" ? (
                <StepBlock title={copy.fieldSummary} hint={copy.fieldSummaryHint}>
                  <Textarea
                    id="ed-summary"
                    rows={4}
                    value={form.summary}
                    maxLength={600}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, summary: e.target.value }))
                    }
                    placeholder="例: 問い合わせメールの返信に毎日2時間かかっているので、楽にしたい"
                    className="min-h-[100px] resize-y text-[16px] md:text-sm"
                  />
                </StepBlock>
              ) : null}

              {stepId === "pain" ? (
                <StepBlock title={copy.fieldPain} hint={copy.fieldPainHint}>
                  <Textarea
                    id="ed-pain"
                    rows={3}
                    value={form.pain}
                    maxLength={400}
                    onChange={(e) => setForm((f) => ({ ...f, pain: e.target.value }))}
                    placeholder="例: 担当者によって返信の質がバラバラになる"
                    className="min-h-[80px] resize-y text-[16px] md:text-sm"
                  />
                </StepBlock>
              ) : null}

              {stepId === "teamSize" ? (
                <StepBlock title={copy.fieldTeam}>
                  <select
                    id="ed-team"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.teamSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, teamSize: e.target.value }))
                    }
                  >
                    {copy.teamOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "timeline" ? (
                <StepBlock title={copy.fieldTimeline}>
                  <select
                    id="ed-time"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.timeline}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, timeline: e.target.value }))
                    }
                  >
                    {copy.timelineOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "integration" ? (
                <StepBlock title={copy.fieldIntegration} hint={copy.fieldIntegrationHint}>
                  <select
                    id="ed-int"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.integration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, integration: e.target.value }))
                    }
                  >
                    {copy.integrationOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "usageSurface" ? (
                <StepBlock title={copy.fieldUsageSurface} hint={copy.fieldUsageSurfaceHint}>
                  <select
                    id="ed-usage"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.usageSurface}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, usageSurface: e.target.value }))
                    }
                  >
                    {copy.usageSurfaceOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "dataSensitivity" ? (
                <StepBlock
                  kicker={copy.sectionCostDrivers}
                  title={copy.fieldDataSensitivity}
                  hint={`${copy.sectionCostDriversSub} ${copy.fieldDataSensitivityHint}`}
                >
                  <select
                    id="ed-data-sens"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.dataSensitivity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dataSensitivity: e.target.value }))
                    }
                  >
                    {copy.dataSensitivityOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "audienceScope" ? (
                <StepBlock title={copy.fieldAudienceScope} hint={copy.fieldAudienceScopeHint}>
                  <select
                    id="ed-audience"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.audienceScope}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, audienceScope: e.target.value }))
                    }
                  >
                    {copy.audienceScopeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "currentWorkflow" ? (
                <StepBlock title={copy.fieldCurrentWorkflow} hint={copy.fieldCurrentWorkflowHint}>
                  <select
                    id="ed-workflow"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.currentWorkflow}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, currentWorkflow: e.target.value }))
                    }
                  >
                    {copy.currentWorkflowOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "updateFrequency" ? (
                <StepBlock title={copy.fieldUpdateFrequency} hint={copy.fieldUpdateFrequencyHint}>
                  <select
                    id="ed-update-freq"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.updateFrequency}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, updateFrequency: e.target.value }))
                    }
                  >
                    {copy.updateFrequencyOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "designExpectation" ? (
                <StepBlock title={copy.fieldDesignExpectation} hint={copy.fieldDesignExpectationHint}>
                  <select
                    id="ed-design"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.designExpectation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, designExpectation: e.target.value }))
                    }
                  >
                    {copy.designExpectationOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "loginModel" ? (
                <StepBlock title={copy.fieldLoginModel} hint={copy.fieldLoginModelHint}>
                  <select
                    id="ed-login"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.loginModel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, loginModel: e.target.value }))
                    }
                  >
                    {copy.loginModelOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "budgetBand" ? (
                <StepBlock title={copy.fieldBudgetBand}>
                  <select
                    id="ed-band"
                    className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                    value={form.budgetBand}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budgetBand: e.target.value }))
                    }
                  >
                    {copy.budgetBandOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              ) : null}

              {stepId === "budgetFeel" ? (
                <StepBlock title={copy.fieldBudgetNote}>
                  <Input
                    id="ed-budget"
                    value={form.budgetFeel}
                    maxLength={120}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budgetFeel: e.target.value }))
                    }
                    placeholder="例: まずは小さく試したい"
                    className="min-h-11 text-[16px] md:text-sm"
                  />
                </StepBlock>
              ) : null}

              {stepId === "constraints" ? (
                <StepBlock title={copy.fieldConstraints} hint={copy.fieldConstraintsHint}>
                  <Textarea
                    id="ed-constraints"
                    rows={3}
                    value={form.constraints}
                    maxLength={600}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, constraints: e.target.value }))
                    }
                    placeholder="例: お客様の個人情報を扱う／スマホから使いたい"
                    className="min-h-[80px] resize-y text-[16px] md:text-sm"
                  />
                </StepBlock>
              ) : null}

              {stepId === "review" ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-white/90">
                    入力内容の要約です。このまま整理を開始できます。
                  </p>
                  <ul className="space-y-2 text-sm text-text-sub">
                    <li>
                      <span className="text-text">やりたいこと:</span>{" "}
                      {form.summary.trim() || "—"}
                    </li>
                    <li>
                      <span className="text-text">業種:</span>{" "}
                      {copy.industryOptions.find((o) => o.value === form.industry)?.label ??
                        form.industry}
                    </li>
                    <li>
                      <span className="text-text">人数:</span>{" "}
                      {copy.teamOptions.find((o) => o.value === form.teamSize)?.label ??
                        form.teamSize}
                      {" · "}
                      <span className="text-text">希望時期:</span>{" "}
                      {copy.timelineOptions.find((o) => o.value === form.timeline)?.label ??
                        form.timeline}
                    </li>
                  </ul>
                  <p className="text-xs text-text-sub">
                    直す場合は「戻る」で該当の質問まで戻れます。
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 border-silver/35 bg-transparent text-text hover:bg-white/5"
            disabled={isFirst || isExiting}
            onClick={goBack}
          >
            戻る
          </Button>
          <Button
            type="button"
            className="min-h-11 min-w-[8rem]"
            disabled={
              isExiting || (!isReview && !canAdvance) || (isReview && !canSubmitGlobal)
            }
            onClick={goNext}
            aria-describedby={
              stepId === "summary" && !canAdvance && !isExiting
                ? "estimate-wizard-summary-hint"
                : isReview && !canSubmitGlobal && !isExiting
                  ? "estimate-wizard-submit-hint"
                  : undefined
            }
          >
            {isReview ? copy.btnGenerate : "次へ"}
          </Button>
        </div>
        <p className="text-xs text-text-sub tabular-nums sm:text-right">
          {stepIndex + 1} / {TOTAL_STEPS}
        </p>
      </div>

      {stepId === "summary" && !canAdvance && !isExiting ? (
        <p id="estimate-wizard-summary-hint" className="text-xs text-text-sub">
          {copy.btnGenerateDisabledHint}
        </p>
      ) : null}
      {isReview && !canSubmitGlobal && !isExiting ? (
        <p id="estimate-wizard-submit-hint" className="text-xs text-text-sub">
          {copy.btnGenerateDisabledHint}
        </p>
      ) : null}
      {isExiting ? (
        <p className="text-xs text-text-sub">次の画面に移動しています…</p>
      ) : null}
    </section>
  );
}

function StepBlock({
  kicker,
  title,
  hint,
  children,
}: {
  kicker?: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {kicker ? (
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/90">
          {kicker}
        </p>
      ) : null}
      <p className="text-sm font-medium text-text">{title}</p>
      {hint ? <p className="text-xs text-text-sub">{hint}</p> : null}
      {children}
    </div>
  );
}
