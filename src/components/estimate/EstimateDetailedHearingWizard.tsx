"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { buildEstimateDetailedAnswersRecord } from "@/lib/estimate/build-estimate-detailed-answers";
import { getOrderedAnswerPairs } from "@/lib/estimate/estimate-detailed-answer-order";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import { ESTIMATE_DETAILED_HEARING_EXAMPLES } from "@/components/estimate/estimate-detailed-hearing-examples";
import {
  questionIdFromAnswerLabel,
  type EstimateQuestionId,
} from "@/lib/estimate-core/question-model";
import { shouldShowEstimateWizardStepForForm } from "@/lib/estimate/estimate-wizard-step-visibility";
import { shouldAskEstimateQuestion } from "@/lib/estimate-core/question-model";
import {
  ESTIMATE_WIZARD_STEP_DEFINITIONS,
  type EstimateWizardStepId,
} from "@/lib/estimate-core/wizard-steps";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;

type StepId = EstimateWizardStepId;

type FormState = EstimateFormDraft;

export type EstimateDetailedHearingWizardProps = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  prefersReducedMotion: boolean;
  isExiting: boolean;
  onSubmit: () => void;
  canSubmitGlobal: boolean;
  /** モバイル全画面シェル用のコンパクトレイアウト */
  layoutVariant?: "default" | "fullscreen";
  /** オープニングで見出しを出したため、セクション見出し行を隠す（バッジのみ等） */
  hideSectionHeading?: boolean;
  /** モバイル全画面時、ステップ変更で先頭へスクロールする親（overflow-y-auto） */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** handoff 済み/回答済みで再質問しない質問ID */
  prefilledQuestionIds?: Iterable<EstimateQuestionId>;
  answeredQuestionIds?: Iterable<EstimateQuestionId>;
};

const easeSpeak = [0.22, 1, 0.36, 1] as const;

function isSelectOnlyStep(id: StepId, visibleSteps: readonly { id: StepId; selectOnly?: boolean }[]): boolean {
  return Boolean(visibleSteps.find((s) => s.id === id)?.selectOnly);
}

export function EstimateDetailedHearingWizard({
  form,
  setForm,
  prefersReducedMotion,
  isExiting,
  onSubmit,
  canSubmitGlobal,
  layoutVariant = "default",
  hideSectionHeading = false,
  scrollContainerRef,
  prefilledQuestionIds,
  answeredQuestionIds,
}: EstimateDetailedHearingWizardProps) {
  const visibleSteps = useMemo(
    () =>
      ESTIMATE_WIZARD_STEP_DEFINITIONS.filter((step) => {
        if (!step.questionId) return true;
        if (
          !shouldAskEstimateQuestion({
            questionId: step.questionId,
            prefilledQuestionIds,
            answeredQuestionIds,
          })
        ) {
          return false;
        }
        return shouldShowEstimateWizardStepForForm({
          questionId: step.questionId,
          form,
        });
      }),
    [prefilledQuestionIds, answeredQuestionIds, form]
  );
  const totalSteps = visibleSteps.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [editingQuestionId, setEditingQuestionId] =
    useState<EstimateQuestionId | null>(null);
  const isFs = layoutVariant === "fullscreen";

  const reviewAnswerPairs = useMemo(() => {
    const rec = buildEstimateDetailedAnswersRecord(form);
    return getOrderedAnswerPairs(rec).map(({ question, answer }) => ({
      question,
      answer,
      questionId: questionIdFromAnswerLabel(question),
    }));
  }, [form]);

  useLayoutEffect(() => {
    if (!isFs || !scrollContainerRef?.current) return;
    scrollContainerRef.current.scrollTop = 0;
  }, [isFs, stepIndex, scrollContainerRef]);

  const stepId = visibleSteps[stepIndex]?.id ?? "review";
  const reviewIndex = Math.max(
    0,
    visibleSteps.findIndex((step) => step.id === "review")
  );
  const currentQuestionId = visibleSteps[stepIndex]?.questionId ?? null;
  const minStepIndex = 0;
  const isFirst = stepIndex <= 0;
  const isReview = stepId === "review";
  const isEditingQuestion =
    editingQuestionId !== null && !isReview && currentQuestionId === editingQuestionId;

  const remainingIncludingCurrent = Math.max(0, totalSteps - stepIndex);

  const canAdvance = useMemo(() => {
    if (stepId === "productArchetype") {
      return Boolean(form.productArchetype.trim());
    }
    if (stepId === "problemSummary") {
      return Boolean(form.problemSummary.trim());
    }
    return true;
  }, [form.problemSummary, form.productArchetype, stepId]);

  const goNext = useCallback(() => {
    if (!canAdvance || isExiting) return;
    if (isReview) {
      if (canSubmitGlobal) onSubmit();
      return;
    }
    if (isEditingQuestion) {
      setStepIndex(reviewIndex);
      setEditingQuestionId(null);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [
    canAdvance,
    canSubmitGlobal,
    isEditingQuestion,
    isExiting,
    isReview,
    onSubmit,
    reviewIndex,
    totalSteps,
  ]);

  const goBack = useCallback(() => {
    if (isExiting) return;
    if (isEditingQuestion) {
      setStepIndex(reviewIndex);
      setEditingQuestionId(null);
      return;
    }
    if (isFirst) return;
    setStepIndex((i) => Math.max(minStepIndex, i - 1));
  }, [isEditingQuestion, isExiting, isFirst, minStepIndex, reviewIndex]);

  const handleSelectPick = useCallback(
    (patch: Partial<FormState>) => {
      if (isExiting) return;
      flushSync(() => {
        setForm((f) => ({ ...f, ...patch }));
      });
      if (editingQuestionId && currentQuestionId === editingQuestionId) {
        setStepIndex(reviewIndex);
        setEditingQuestionId(null);
        return;
      }
      if (isFs) {
        setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
      }
    },
    [
      currentQuestionId,
      editingQuestionId,
      isExiting,
      isFs,
      reviewIndex,
      setForm,
      totalSteps,
    ]
  );

  const jumpToQuestion = useCallback(
    (questionId: EstimateQuestionId) => {
      if (isExiting) return;
      const targetIndex = visibleSteps.findIndex(
        (step) => step.questionId === questionId
      );
      if (targetIndex < 0) return;
      setEditingQuestionId(questionId);
      setStepIndex(targetIndex);
    },
    [isExiting, visibleSteps]
  );

  const showFsPrimaryButton =
    isFs && (isReview || !isSelectOnlyStep(stepId, visibleSteps));

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
      className={cn(
        "space-y-5 rounded-xl border border-silver/25 bg-base-dark/50 p-5 md:p-8",
        isFs && "space-y-3 border-0 bg-transparent p-0 pb-24"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
          hideSectionHeading && "flex-row items-center justify-end"
        )}
      >
        {hideSectionHeading ? null : (
          <div>
            <h2 className="text-lg font-semibold text-accent">{copy.sectionHearing}</h2>
            <p className="mt-1 text-xs text-text-sub md:text-sm">
              {copy.requirementDefinitionNote}を、あとからAIがたたき台としてまとめます。
            </p>
          </div>
        )}
        <div
          className={cn(
            "shrink-0 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-center text-xs font-medium text-accent sm:text-left",
            hideSectionHeading && "w-full text-center sm:w-auto sm:text-left"
          )}
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

      <div
        className={cn(
          "relative isolate",
          isFs ? "min-h-[220px]" : "min-h-[360px] md:min-h-[400px]"
        )}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/15 via-transparent to-silver/10 opacity-70"
          aria-hidden
        />
        <div className="relative overflow-hidden rounded-2xl border border-silver/20 bg-base-dark/80 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stepId}
              {...motionProps}
              {...(isFs ? { "data-estimate-step-root": "" } : {})}
              className={cn(
                "flex flex-col",
                isFs
                  ? "min-h-[180px] p-4"
                  : "min-h-[300px] p-5 md:min-h-[340px] md:p-7"
              )}
            >
              <div className="shrink-0">
              {stepId === "industry" ? (
                <StepBlock
                  title={copy.fieldIndustry}
                  hint={copy.fieldIndustryHint}
                  whyMatters={copy.fieldIndustryWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.industryOptions}
                      value={form.industry}
                      onPick={(v) => handleSelectPick({ industry: v })}
                      idPrefix="ed-industry"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "productArchetype" ? (
                <StepBlock
                  title={copy.fieldProductArchetype}
                  hint={copy.fieldProductArchetypeHint}
                  whyMatters={copy.fieldProductArchetypeWhyMatters}
                >
                  <Textarea
                    id="ed-product-archetype"
                    rows={4}
                    value={form.productArchetype}
                    maxLength={600}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, productArchetype: e.target.value }))
                    }
                    placeholder="例: 問い合わせの一次対応をまとめる社内Webツールを作りたい"
                    className={cn(
                      "min-h-[100px] resize-y text-[16px] md:text-sm",
                      isFs && "scroll-mt-6"
                    )}
                  />
                </StepBlock>
              ) : null}

              {stepId === "problemSummary" ? (
                <StepBlock
                  title={copy.fieldProblemSummary}
                  hint={copy.fieldProblemSummaryHint}
                  whyMatters={copy.fieldProblemSummaryWhyMatters}
                >
                  <Textarea
                    id="ed-problem-summary"
                    rows={4}
                    value={form.problemSummary}
                    maxLength={600}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, problemSummary: e.target.value }))
                    }
                    placeholder="例: 問い合わせ返信に毎日2時間かかり、担当者ごとに内容もぶれている"
                    className={cn(
                      "min-h-[100px] resize-y text-[16px] md:text-sm",
                      isFs && "scroll-mt-6"
                    )}
                  />
                </StepBlock>
              ) : null}

              {stepId === "pain" ? (
                <StepBlock
                  title={copy.fieldPain}
                  hint={copy.fieldPainHint}
                  whyMatters={copy.fieldPainWhyMatters}
                >
                  <Textarea
                    id="ed-pain"
                    rows={3}
                    value={form.pain}
                    maxLength={400}
                    onChange={(e) => setForm((f) => ({ ...f, pain: e.target.value }))}
                    placeholder="例: 担当者によって返信の質がバラバラになる"
                    className={cn(
                      "min-h-[80px] resize-y text-[16px] md:text-sm",
                      isFs && "scroll-mt-6"
                    )}
                  />
                </StepBlock>
              ) : null}

              {stepId === "teamSize" ? (
                <StepBlock title={copy.fieldTeam} whyMatters={copy.fieldTeamWhyMatters}>
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.teamOptions}
                      value={form.teamSize}
                      onPick={(v) => handleSelectPick({ teamSize: v })}
                      idPrefix="ed-team"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "timeline" ? (
                <StepBlock title={copy.fieldTimeline} whyMatters={copy.fieldTimelineWhyMatters}>
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.timelineOptions}
                      value={form.timeline}
                      onPick={(v) => handleSelectPick({ timeline: v })}
                      idPrefix="ed-time"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "integration" ? (
                <StepBlock
                  title={copy.fieldIntegration}
                  hint={copy.fieldIntegrationHint}
                  whyMatters={copy.fieldIntegrationWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.integrationOptions}
                      value={form.integration}
                      onPick={(v) => handleSelectPick({ integration: v })}
                      idPrefix="ed-int"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "hostingContext" ? (
                <StepBlock
                  kicker={copy.sectionCostDrivers}
                  title={copy.fieldHostingContext}
                  hint={`${copy.sectionCostDriversSub} ${copy.fieldHostingContextHint}`}
                  whyMatters={copy.fieldHostingContextWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.hostingContextOptions}
                      value={form.hostingContext}
                      onPick={(v) => handleSelectPick({ hostingContext: v })}
                      idPrefix="ed-hosting"
                    />
                  ) : (
                    <select
                      id="ed-hosting"
                      className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
                      value={form.hostingContext}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, hostingContext: e.target.value }))
                      }
                    >
                      {copy.hostingContextOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </StepBlock>
              ) : null}

              {stepId === "usageSurface" ? (
                <StepBlock
                  title={copy.fieldUsageSurface}
                  hint={copy.fieldUsageSurfaceHint}
                  whyMatters={copy.fieldUsageSurfaceWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.usageSurfaceOptions}
                      value={form.usageSurface}
                      onPick={(v) => handleSelectPick({ usageSurface: v })}
                      idPrefix="ed-usage"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "dataSensitivity" ? (
                <StepBlock
                  kicker={copy.sectionCostDrivers}
                  title={copy.fieldDataSensitivity}
                  hint={`${copy.sectionCostDriversSub} ${copy.fieldDataSensitivityHint}`}
                  whyMatters={copy.fieldDataSensitivityWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.dataSensitivityOptions}
                      value={form.dataSensitivity}
                      onPick={(v) => handleSelectPick({ dataSensitivity: v })}
                      idPrefix="ed-data-sens"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "audienceScope" ? (
                <StepBlock
                  title={copy.fieldAudienceScope}
                  hint={copy.fieldAudienceScopeHint}
                  whyMatters={copy.fieldAudienceScopeWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.audienceScopeOptions}
                      value={form.audienceScope}
                      onPick={(v) => handleSelectPick({ audienceScope: v })}
                      idPrefix="ed-audience"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "currentWorkflow" ? (
                <StepBlock title={copy.fieldCurrentWorkflow} hint={copy.fieldCurrentWorkflowHint}>
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.currentWorkflowOptions}
                      value={form.currentWorkflow}
                      onPick={(v) => handleSelectPick({ currentWorkflow: v })}
                      idPrefix="ed-workflow"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "updateFrequency" ? (
                <StepBlock
                  title={copy.fieldUpdateFrequency}
                  hint={copy.fieldUpdateFrequencyHint}
                  whyMatters={copy.fieldUpdateFrequencyWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.updateFrequencyOptions}
                      value={form.updateFrequency}
                      onPick={(v) => handleSelectPick({ updateFrequency: v })}
                      idPrefix="ed-update-freq"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "designExpectation" ? (
                <StepBlock
                  title={copy.fieldDesignExpectation}
                  hint={copy.fieldDesignExpectationHint}
                  whyMatters={copy.fieldDesignExpectationWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.designExpectationOptions}
                      value={form.designExpectation}
                      onPick={(v) => handleSelectPick({ designExpectation: v })}
                      idPrefix="ed-design"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "loginModel" ? (
                <StepBlock
                  title={copy.fieldLoginModel}
                  hint={copy.fieldLoginModelHint}
                  whyMatters={copy.fieldLoginModelWhyMatters}
                >
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.loginModelOptions}
                      value={form.loginModel}
                      onPick={(v) => handleSelectPick({ loginModel: v })}
                      idPrefix="ed-login"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "budgetBand" ? (
                <StepBlock title={copy.fieldBudgetBand} whyMatters={copy.fieldBudgetBandWhyMatters}>
                  {isFs ? (
                    <SelectOptionButtons
                      options={copy.budgetBandOptions}
                      value={form.budgetBand}
                      onPick={(v) => handleSelectPick({ budgetBand: v })}
                      idPrefix="ed-band"
                    />
                  ) : (
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
                  )}
                </StepBlock>
              ) : null}

              {stepId === "budgetFeel" ? (
                <StepBlock title={copy.fieldBudgetNote} whyMatters={copy.fieldBudgetNoteWhyMatters}>
                  <Input
                    id="ed-budget"
                    value={form.budgetFeel}
                    maxLength={120}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budgetFeel: e.target.value }))
                    }
                    placeholder="例: まずは小さく試したい"
                    className={cn(
                      "min-h-11 text-[16px] md:text-sm",
                      isFs && "scroll-mt-6"
                    )}
                  />
                </StepBlock>
              ) : null}

              {stepId === "constraints" ? (
                <StepBlock
                  title={copy.fieldConstraints}
                  hint={copy.fieldConstraintsHint}
                  whyMatters={copy.fieldConstraintsWhyMatters}
                >
                  <Textarea
                    id="ed-constraints"
                    rows={3}
                    value={form.constraints}
                    maxLength={600}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, constraints: e.target.value }))
                    }
                    placeholder="例: お客様の個人情報を扱う／スマホから使いたい"
                    className={cn(
                      "min-h-[80px] resize-y text-[16px] md:text-sm",
                      isFs && "scroll-mt-6"
                    )}
                  />
                </StepBlock>
              ) : null}

              {stepId === "review" ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-white/90">
                    入力内容の要約です。このまま整理を開始できます。
                  </p>
                  {reviewAnswerPairs.length === 0 ? (
                    <p className="text-sm text-text-sub">（回答がありません）</p>
                  ) : (
                    <dl className="max-h-[min(50vh,22rem)] space-y-3 overflow-y-auto text-sm text-text-sub md:max-h-[min(55vh,28rem)]">
                      {reviewAnswerPairs.map(({ question, answer, questionId }) => (
                        <div key={question} className="border-b border-silver/10 pb-3 last:border-b-0">
                          <dt className="text-[15px] font-semibold text-text">{question}</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
                            {answer}
                          </dd>
                          {questionId ? (
                            <Button
                              type="button"
                              size="sm"
                              className="mt-3 h-8 bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-400"
                              onClick={() => jumpToQuestion(questionId)}
                            >
                              修正
                            </Button>
                          ) : null}
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="text-xs text-text-sub">
                    必要な項目だけ「修正」から戻し、反映後はこの一覧に戻れます。
                  </p>
                </div>
              ) : null}
              </div>
              <HearingAnswerExamples stepId={stepId} compact={isFs} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {isFs ? (
        <div className="flex flex-col gap-2">
          {showFsPrimaryButton ? (
            <Button
              type="button"
              className="min-h-11 w-full"
              disabled={
                isExiting || (!isReview && !canAdvance) || (isReview && !canSubmitGlobal)
              }
              onClick={goNext}
              aria-describedby={
                (stepId === "productArchetype" || stepId === "problemSummary") &&
                  !canAdvance &&
                  !isExiting
                  ? "estimate-wizard-required-hint"
                  : isReview && !canSubmitGlobal && !isExiting
                    ? "estimate-wizard-submit-hint"
                    : undefined
              }
            >
              {isReview
                ? copy.btnGenerate
                : isEditingQuestion
                  ? "修正を反映して戻る"
                  : "次へ"}
            </Button>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-text-sub tabular-nums">
              {stepIndex + 1} / {totalSteps}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 min-h-8 shrink-0 px-2 text-xs text-text-sub hover:text-white"
              disabled={(!isEditingQuestion && isFirst) || isExiting}
              onClick={goBack}
            >
              {isEditingQuestion ? "一覧に戻る" : "戻る"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11 border-silver/35 bg-transparent text-text hover:bg-white/5"
              disabled={(!isEditingQuestion && isFirst) || isExiting}
              onClick={goBack}
            >
              {isEditingQuestion ? "一覧に戻る" : "戻る"}
            </Button>
            <Button
              type="button"
              className="min-h-11 min-w-[8rem]"
              disabled={
                isExiting || (!isReview && !canAdvance) || (isReview && !canSubmitGlobal)
              }
              onClick={goNext}
              aria-describedby={
                (stepId === "productArchetype" || stepId === "problemSummary") &&
                  !canAdvance &&
                  !isExiting
                  ? "estimate-wizard-required-hint"
                  : isReview && !canSubmitGlobal && !isExiting
                    ? "estimate-wizard-submit-hint"
                    : undefined
              }
            >
              {isReview
                ? copy.btnGenerate
                : isEditingQuestion
                  ? "修正を反映して戻る"
                  : "次へ"}
            </Button>
          </div>
          <p className="text-xs text-text-sub tabular-nums sm:text-right">
            {stepIndex + 1} / {totalSteps}
          </p>
        </div>
      )}

      {(stepId === "productArchetype" || stepId === "problemSummary") &&
      !canAdvance &&
      !isExiting ? (
        <p id="estimate-wizard-required-hint" className="text-xs text-text-sub">
          {copy.requiredStepHint}
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

function SelectOptionButtons({
  options,
  value,
  onPick,
  idPrefix,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onPick: (v: string) => void;
  idPrefix: string;
}) {
  return (
    <div
      className="grid max-h-[min(40vh,320px)] grid-cols-2 gap-2 overflow-y-auto overscroll-contain"
      role="listbox"
      aria-label="選択肢"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="option"
          aria-selected={value === o.value}
          id={`${idPrefix}-opt-${o.value}`}
          onClick={() => onPick(o.value)}
          className={cn(
            "flex min-h-[2.75rem] items-center rounded-lg border px-2 py-1.5 text-left text-[12px] leading-snug text-white/95 transition-colors",
            value === o.value
              ? "border-action bg-action/20 ring-1 ring-action/30"
              : "border-silver/30 bg-base-dark hover:border-action/45 hover:bg-base-dark/90"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function HearingAnswerExamples({
  stepId,
  compact,
}: {
  stepId: StepId;
  compact?: boolean;
}) {
  const lines = ESTIMATE_DETAILED_HEARING_EXAMPLES[stepId];
  if (!lines.length) return null;
  return (
    <aside
      className={cn(
        "mt-6 flex flex-1 flex-col justify-end rounded-lg border border-silver/15 bg-white/[0.04] p-4",
        compact ? "min-h-[64px] py-3" : "min-h-[108px] md:min-h-[128px]"
      )}
      aria-label="解答例・ヒント"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/85">
        解答例・ヒント
      </p>
      <ul
        className={cn(
          "mt-2.5 list-disc space-y-2 pl-4 leading-relaxed text-text-sub marker:text-accent/50",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </aside>
  );
}

function StepBlock({
  kicker,
  title,
  hint,
  whyMatters,
  children,
}: {
  kicker?: string;
  title: string;
  hint?: string;
  /** 見積のどこに効くか（低リテラシー向けの一行） */
  whyMatters?: string;
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
      {whyMatters ? (
        <p className="text-[11px] leading-relaxed text-accent/90">{whyMatters}</p>
      ) : null}
      {hint ? <p className="text-xs text-text-sub">{hint}</p> : null}
      {children}
    </div>
  );
}
