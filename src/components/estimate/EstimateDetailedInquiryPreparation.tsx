"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import {
  fetchInquiryBriefWithRetry,
} from "@/lib/inquiry/fetch-inquiry-brief";
import {
  INQUIRY_DESIRED_REPLY_LABELS,
  INQUIRY_INTENT_LABELS,
  inquiryReadinessLabel,
  type EstimateInquiryPreparation,
  type InquiryDesiredReply,
  type InquiryIntent,
} from "@/lib/inquiry/inquiry-brief";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;

type Props = {
  snapshot: EstimateSnapshot;
  initialPreparation?: EstimateInquiryPreparation | null;
  onPreparationChange: (next: EstimateInquiryPreparation) => void;
};

const DEFAULT_INTENT: InquiryIntent = "estimate";
const DEFAULT_REPLY: InquiryDesiredReply = "rough_estimate";

function inferInitialInquirySelection(
  snapshot: EstimateSnapshot,
  initialPreparation?: EstimateInquiryPreparation | null
): { inquiryIntent: InquiryIntent; desiredReply: InquiryDesiredReply } {
  if (initialPreparation) {
    return {
      inquiryIntent: initialPreparation.inquiryIntent,
      desiredReply: initialPreparation.desiredReply,
    };
  }
  if (snapshot.visitorJourney?.latestEntryIntent === "consult") {
    return {
      inquiryIntent: "consulting",
      desiredReply: "consulting_plan",
    };
  }
  return {
    inquiryIntent: DEFAULT_INTENT,
    desiredReply: DEFAULT_REPLY,
  };
}

export function EstimateDetailedInquiryPreparation({
  snapshot,
  initialPreparation,
  onPreparationChange,
}: Props) {
  const initialSelection = inferInitialInquirySelection(snapshot, initialPreparation);
  const [inquiryIntent, setInquiryIntent] = useState<InquiryIntent>(
    initialSelection.inquiryIntent
  );
  const [desiredReply, setDesiredReply] = useState<InquiryDesiredReply>(
    initialSelection.desiredReply
  );
  const [questions, setQuestions] = useState(
    initialPreparation?.followUpQuestions ?? []
  );
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialPreparation?.followUpAnswers ?? {}
  );
  const [brief, setBrief] = useState(initialPreparation?.brief ?? null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const missingRequiredCount = useMemo(
    () =>
      questions.filter((question) => {
        if (!question.required) return false;
        return !(answers[question.id]?.trim().length);
      }).length,
    [answers, questions]
  );

  const hasAnsweredFollowUps = Object.values(answers).some(
    (value) => value.trim().length > 0
  );

  const handlePreparation = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await fetchInquiryBriefWithRetry({
        snapshot,
        preparation: {
          inquiryIntent,
          desiredReply,
          followUpAnswers: answers,
        },
      });
      const next = {
        inquiryIntent,
        desiredReply,
        followUpQuestions: result.followUpQuestions,
        followUpAnswers: answers,
        brief: result.brief,
      } satisfies EstimateInquiryPreparation;
      setQuestions(result.followUpQuestions);
      setBrief(result.brief);
      onPreparationChange(next);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : copy.inquiryPrepError
      );
    }
  };

  const resetForSelectionChange = (
    nextIntent: InquiryIntent,
    nextReply: InquiryDesiredReply
  ) => {
    setInquiryIntent(nextIntent);
    setDesiredReply(nextReply);
    setQuestions([]);
    setAnswers({});
    setBrief(null);
    setErrorMessage("");
    setStatus("idle");
  };

  return (
    <section className="space-y-5 rounded-xl border border-silver/20 bg-base-dark/40 p-5 md:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">
          {copy.inquiryPrepTitle}
        </h2>
        <p className="text-sm leading-relaxed text-white/80">
          {copy.inquiryPrepIntro}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white">
          <span className="font-medium">{copy.inquiryPrepIntentLabel}</span>
          <select
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
            value={inquiryIntent}
            onChange={(e) =>
              resetForSelectionChange(
                e.target.value as InquiryIntent,
                desiredReply
              )
            }
          >
            {Object.entries(INQUIRY_INTENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-white">
          <span className="font-medium">{copy.inquiryPrepDesiredReplyLabel}</span>
          <select
            className="flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm"
            value={desiredReply}
            onChange={(e) =>
              resetForSelectionChange(
                inquiryIntent,
                e.target.value as InquiryDesiredReply
              )
            }
          >
            {Object.entries(INQUIRY_DESIRED_REPLY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-white/70">
          {questions.length > 0 && missingRequiredCount > 0
            ? copy.inquiryPrepFollowUpHint
            : copy.inquiryPrepPrimaryHint}
        </p>
        <Button
          type="button"
          className="min-h-11 sm:w-auto"
          disabled={status === "loading" || (questions.length > 0 && missingRequiredCount > 0)}
          onClick={handlePreparation}
        >
          {status === "loading"
            ? copy.inquiryPrepLoading
            : questions.length > 0 && hasAnsweredFollowUps
              ? copy.inquiryPrepRefreshCta
              : copy.inquiryPrepGenerateCta}
        </Button>
      </div>

      {questions.length > 0 ? (
        <div className="space-y-4 rounded-xl border border-accent/20 bg-accent/[0.05] p-4">
          <p className="text-sm font-medium text-white">
            {copy.inquiryPrepFollowUpTitle}
          </p>
          {questions.map((question) => (
            <label key={question.id} className="block space-y-2 text-sm text-white">
              <span className="font-medium">
                {question.question}
                {question.required ? ` ${copy.inquiryPrepRequiredMark}` : ""}
              </span>
              {question.helpText ? (
                <span className="block text-xs leading-relaxed text-white/65">
                  {question.helpText}
                </span>
              ) : null}
              <Textarea
                rows={3}
                value={answers[question.id] ?? ""}
                placeholder={question.placeholder ?? copy.inquiryPrepAnswerPlaceholder}
                onChange={(e) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: e.target.value,
                  }))
                }
                className="min-h-[88px] resize-y text-[16px] md:text-sm"
              />
            </label>
          ))}
          {missingRequiredCount > 0 ? (
            <p className="text-xs text-accent/90">
              {copy.inquiryPrepMissingHint.replace(
                "{count}",
                String(missingRequiredCount)
              )}
            </p>
          ) : null}
        </div>
      ) : null}

      {brief ? (
        <div className="space-y-4 rounded-xl border border-silver/20 bg-base-dark/60 p-4 md:p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-white">
              {copy.inquiryPrepBriefTitle}
            </p>
            <span
              className={cn(
                "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium",
                brief.readiness === "ready"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : brief.readiness === "ready_with_gaps"
                    ? "border-amber-300/40 bg-amber-200/10 text-amber-200"
                    : "border-silver/30 bg-white/5 text-white/75"
              )}
            >
              {inquiryReadinessLabel(brief.readiness)}
            </span>
          </div>

          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepIntentLabel}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.inquiryIntentLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepDesiredReplyLabel}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.desiredReplyLabel}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepProblemTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.problemSummary}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepReplySummaryTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.requestedReplySummary}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepTargetTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.targetSummary}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepTimelineTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.timelineSummary}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepScopeTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.scopeSummary}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepConstraintsTitle}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {brief.constraintsSummary}
              </dd>
            </div>
            {brief.journeySummary ? (
              <div className="md:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-white/55">
                  サイト内で引き継いだ文脈
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-white/90">
                  {brief.journeySummary}
                </dd>
              </div>
            ) : null}
          </dl>

          {brief.replyFocus.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepReplyFocusTitle}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-white/90">
                {brief.replyFocus.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent/80">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {brief.unresolvedPoints.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/55">
                {copy.inquiryPrepUnresolvedTitle}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-white/90">
                {brief.unresolvedPoints.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent/80">・</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {status === "error" && errorMessage ? (
        <p className="text-sm text-red-400">{errorMessage}</p>
      ) : null}
    </section>
  );
}
