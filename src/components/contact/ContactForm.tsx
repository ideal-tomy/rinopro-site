"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpToLine } from "lucide-react";
import { ContactIntakeHearingBlock } from "@/components/contact/ContactIntakeHearingBlock";
import { useContactForm } from "@/hooks/use-contact-form";
import { contactCopy } from "@/lib/content/site-copy";
import { cn } from "@/lib/utils";
import {
  buildContactMessageDraft,
  consumeHandoffPayloadFromSession,
  decodeChatHandoff,
  CONTACT_HANDOFF_SESSION_QUERY,
} from "@/lib/chat/estimate-handoff";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import type { ChatHandoffPayload } from "@/lib/chat/estimate-handoff";
import {
  INQUIRY_DESIRED_REPLY_LABELS,
  INQUIRY_INTENT_LABELS,
  evaluateInquiryGate,
  type InquiryDesiredReply,
  type InquiryIntent,
} from "@/lib/inquiry/inquiry-brief";
import { fetchInquiryBriefWithRetry } from "@/lib/inquiry/fetch-inquiry-brief";
import {
  buildVisitorJourneyFactEnvelopes,
  type VisitorJourneySummary,
} from "@/lib/journey/visitor-journey";
import { readVisitorJourneySummary } from "@/lib/journey/visitor-journey-storage";
import {
  DEMO_HUB_TYPE_SECTION_SLUGS,
  FEATURED_EXPERIENCE_SLUGS,
  getExperiencePrototypeBySlug,
} from "@/lib/experience/prototype-registry";
import { bootstrapContactIntakeForm, hasRealEstimateAiSnapshot } from "@/lib/contact/contact-intake-context";
import { CONTACT_INTAKE_INITIAL_FORM } from "@/lib/contact/contact-intake-initial-form";
import { buildContactSyntheticEstimateSnapshot } from "@/lib/contact/build-contact-synthetic-snapshot";
import type { EstimateQuestionId } from "@/lib/estimate-core/question-model";

function applyPayloadToForm(
  payload: ChatHandoffPayload,
  setters: {
    setAdditionalNote: (s: string) => void;
    setEstimateSnapshot: (s: EstimateSnapshot | null) => void;
    setVisitorJourney: (s: VisitorJourneySummary | null) => void;
    setInquiryIntent: (s: InquiryIntent) => void;
    setDesiredReply: (s: InquiryDesiredReply) => void;
    setProblemStatement: (s: string) => void;
    setTargetSummary: (s: string) => void;
    setDecisionTimeline: (s: string) => void;
    setConstraintsSummary: (s: string) => void;
  }
) {
  if (payload.v === 2 && payload.source === "estimate_detailed") {
    if ("snapshot" in payload && payload.snapshot) {
      setters.setEstimateSnapshot(payload.snapshot);
      setters.setVisitorJourney(payload.snapshot.visitorJourney ?? null);
      const brief = payload.snapshot.inquiryPreparation?.brief;
      if (brief) {
        setters.setInquiryIntent(brief.inquiryIntent);
        setters.setDesiredReply(brief.desiredReply);
        setters.setProblemStatement(brief.problemSummary);
        setters.setTargetSummary(brief.targetSummary);
        setters.setDecisionTimeline(brief.timelineSummary);
        setters.setConstraintsSummary(brief.constraintsSummary);
        setters.setAdditionalNote("");
        return;
      }
      setters.setInquiryIntent("estimate");
      setters.setDesiredReply("rough_estimate");
      setters.setProblemStatement(payload.snapshot.ai.plainCustomerSummary);
      setters.setTargetSummary("対象業務・利用者は要確認");
      setters.setDecisionTimeline("時期は要確認");
      setters.setConstraintsSummary("大きな制約は要確認");
      setters.setAdditionalNote("");
      return;
    }
    setters.setEstimateSnapshot(null);
    setters.setVisitorJourney(null);
    setters.setAdditionalNote(buildContactMessageDraft(payload));
    return;
  }
  setters.setEstimateSnapshot(null);
  if (payload.v !== 1) {
    setters.setVisitorJourney(null);
    return;
  }
  setters.setVisitorJourney(payload.visitorJourney ?? null);
  setters.setProblemStatement(payload.detailBlock.trim());
  setters.setTargetSummary("対象業務・利用者は要確認");
  setters.setDecisionTimeline("時期は要確認");
  setters.setConstraintsSummary("大きな制約は要確認");
  setters.setAdditionalNote(buildContactMessageDraft(payload));
}

type ExperienceOption = {
  value: string;
  label: string;
};

const OTHER_EXPERIENCE_VALUE = "__other";
const NONE_EXPERIENCE_VALUE = "__none";

function buildExperienceOptions(): ExperienceOption[] {
  const seen = new Set<string>();
  const orderedSlugs = [
    ...FEATURED_EXPERIENCE_SLUGS,
    ...DEMO_HUB_TYPE_SECTION_SLUGS,
  ];

  const base = orderedSlugs.flatMap((slug) => {
    const meta = getExperiencePrototypeBySlug(slug);
    if (!meta || seen.has(meta.title)) return [];
    seen.add(meta.title);
    return [{ value: meta.title, label: meta.title }];
  });

  return [
    ...base,
    { value: OTHER_EXPERIENCE_VALUE, label: "その他" },
    { value: NONE_EXPERIENCE_VALUE, label: "特に体験していない" },
  ];
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const handoffApplied = useRef(false);
  const visitorSummaryApplied = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [closestExperience, setClosestExperience] = useState("");
  const [closestExperienceOther, setClosestExperienceOther] = useState("");
  const [inquiryIntent, setInquiryIntent] = useState<InquiryIntent>("estimate");
  const [desiredReply, setDesiredReply] =
    useState<InquiryDesiredReply>("rough_estimate");
  const [problemStatement, setProblemStatement] = useState("");
  const [targetSummary, setTargetSummary] = useState("");
  const [decisionTimeline, setDecisionTimeline] = useState("");
  const [constraintsSummary, setConstraintsSummary] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [visitorJourney, setVisitorJourney] =
    useState<VisitorJourneySummary | null>(null);
  const [estimateSnapshot, setEstimateSnapshot] =
    useState<EstimateSnapshot | null>(null);
  const [attachEstimate, setAttachEstimate] = useState(true);
  const [intakeForm, setIntakeForm] = useState(CONTACT_INTAKE_INITIAL_FORM);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<
    ReadonlySet<EstimateQuestionId>
  >(new Set());
  const [intakeError, setIntakeError] = useState("");
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [hasCompletedContactIntake, setHasCompletedContactIntake] = useState(false);

  const { status, errors, submit, submitError } = useContactForm();
  const form = contactCopy.form;

  const effectiveBrief = estimateSnapshot?.inquiryPreparation?.brief ?? null;
  const experienceOptions = useMemo(() => buildExperienceOptions(), []);
  const resolvedTriedExperience = useMemo(() => {
    if (closestExperience === OTHER_EXPERIENCE_VALUE) {
      return closestExperienceOther.trim();
    }
    if (closestExperience === NONE_EXPERIENCE_VALUE) {
      return "特に体験していない";
    }
    return closestExperience;
  }, [closestExperience, closestExperienceOther]);

  useEffect(() => {
    if (!effectiveBrief) return;
    const frame = requestAnimationFrame(() => {
      setProblemStatement(effectiveBrief.problemSummary);
      setTargetSummary(effectiveBrief.targetSummary);
      setDecisionTimeline(effectiveBrief.timelineSummary);
      setConstraintsSummary(effectiveBrief.constraintsSummary);
      setInquiryIntent(effectiveBrief.inquiryIntent);
      setDesiredReply(effectiveBrief.desiredReply);
    });
    return () => cancelAnimationFrame(frame);
  }, [effectiveBrief]);

  useEffect(() => {
    if (handoffApplied.current) return;

    const raw = searchParams.get("handoff");
    if (raw === CONTACT_HANDOFF_SESSION_QUERY) {
      const payload = consumeHandoffPayloadFromSession();
      if (!payload) return;
      handoffApplied.current = true;
      const frame = requestAnimationFrame(() => {
        applyPayloadToForm(payload, {
          setAdditionalNote,
          setEstimateSnapshot,
          setVisitorJourney,
          setInquiryIntent,
          setDesiredReply,
          setProblemStatement,
          setTargetSummary,
          setDecisionTimeline,
          setConstraintsSummary,
        });
      });
      return () => cancelAnimationFrame(frame);
    }

    if (!raw) return;
    const payload = decodeChatHandoff(raw);
    if (!payload) return;
    handoffApplied.current = true;
    const frame = requestAnimationFrame(() => {
      applyPayloadToForm(payload, {
        setAdditionalNote,
        setEstimateSnapshot,
        setVisitorJourney,
        setInquiryIntent,
        setDesiredReply,
        setProblemStatement,
        setTargetSummary,
        setDecisionTimeline,
        setConstraintsSummary,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [searchParams]);

  useEffect(() => {
    const boot = bootstrapContactIntakeForm({
      estimateSnapshot,
      visitorJourney,
    });
    setIntakeForm(boot.formDraft);
    setAnsweredQuestionIds(boot.lockedQuestionIds);
  }, [estimateSnapshot, visitorJourney]);

  const hasRealEstimateContext = hasRealEstimateAiSnapshot(estimateSnapshot);
  const hasPreparedContext = hasRealEstimateContext || hasCompletedContactIntake;

  const inquiryGate = evaluateInquiryGate({
    brief: effectiveBrief,
    problemSummary: problemStatement,
    targetSummary,
    timelineSummary: decisionTimeline,
    followUpQuestions: estimateSnapshot?.inquiryPreparation?.followUpQuestions,
    followUpAnswers: estimateSnapshot?.inquiryPreparation?.followUpAnswers,
    hasViewedEstimateOrEquivalent: hasRealEstimateContext || hasCompletedContactIntake,
    hasReviewedGeneratedBrief: effectiveBrief != null,
  });
  const canSendPreparedInquiry = hasPreparedContext && inquiryGate.status === "sendable";

  useEffect(() => {
    if (handoffApplied.current) return;
    if (visitorSummaryApplied.current) return;
    const summary = readVisitorJourneySummary();
    if (!summary) return;
    const factEnvelopes = buildVisitorJourneyFactEnvelopes(summary);
    const getFactValue = (key: string) =>
      factEnvelopes.find((envelope) => envelope.key === key)?.value;
    visitorSummaryApplied.current = true;
    const frame = requestAnimationFrame(() => {
      setVisitorJourney(summary);
      if (summary.latestEntryIntent === "consult") {
        setInquiryIntent("consulting");
        setDesiredReply("consulting_plan");
      } else if (summary.latestEntryIntent === "estimate") {
        setInquiryIntent("estimate");
        setDesiredReply("rough_estimate");
      }
      if (!problemStatement.trim()) {
        setProblemStatement(
          getFactValue("problemSummary") ??
            summary.lastFreeformNormalizedText ??
            summary.lastFreeformSummary ??
            "何を相談したいか整理中"
        );
      }
      if (!targetSummary.trim()) {
        setTargetSummary(
          getFactValue("targetSummary") ??
            (summary.industryBundle
              ? [summary.industryBundle.domainId, summary.industryBundle.domainDetailId ?? ""]
                  .filter(Boolean)
                  .join(" / ")
              : "対象業務・利用者は要確認")
        );
      }
      if (!decisionTimeline.trim()) {
        setDecisionTimeline(
          getFactValue("timeline") ?? summary.estimateSignals?.timeline ?? "時期は要確認"
        );
      }
      if (!constraintsSummary.trim()) {
        const constraintHints = [
          getFactValue("integration")
            ? `連携候補: ${getFactValue("integration")}`
            : "",
          getFactValue("usageSurface")
            ? `使い方候補: ${getFactValue("usageSurface")}`
            : "",
          getFactValue("dataSensitivity")
            ? `情報種別候補: ${getFactValue("dataSensitivity")}`
            : "",
        ].filter(Boolean);
        setConstraintsSummary(
          constraintHints.length > 0
            ? constraintHints.join(" / ")
            : "大きな制約は要確認"
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [constraintsSummary, decisionTimeline, problemStatement, targetSummary]);

  const handleCompleteContactIntake = async () => {
    setIntakeLoading(true);
    setIntakeError("");
    try {
      const syntheticSnapshot = buildContactSyntheticEstimateSnapshot({
        form: intakeForm,
        visitorJourney,
      });
      const result = await fetchInquiryBriefWithRetry({
        snapshot: syntheticSnapshot,
        preparation: {
          inquiryIntent,
          desiredReply,
          followUpAnswers: {},
        },
      });
      const nextSnapshot: EstimateSnapshot = {
        ...syntheticSnapshot,
        inquiryPreparation: {
          inquiryIntent,
          desiredReply,
          followUpQuestions: result.followUpQuestions,
          followUpAnswers: {},
          brief: result.brief,
        },
      };
      setEstimateSnapshot(nextSnapshot);
      setProblemStatement(result.brief.problemSummary);
      setTargetSummary(result.brief.targetSummary);
      setDecisionTimeline(result.brief.timelineSummary);
      setConstraintsSummary(result.brief.constraintsSummary);
      setInquiryIntent(result.brief.inquiryIntent);
      setDesiredReply(result.brief.desiredReply);
      setHasCompletedContactIntake(true);
    } catch (error) {
      setIntakeError(
        error instanceof Error
          ? error.message
          : "問い合わせ前整理に失敗しました。時間を置いて再度お試しください。"
      );
    } finally {
      setIntakeLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendPreparedInquiry) return;

    const trimmedConstraints = constraintsSummary.trim();
    const trimmedNote = additionalNote.trim();
    const brief = estimateSnapshot?.inquiryPreparation?.brief ?? undefined;

    const success = await submit({
      name,
      email,
      triedExperience: resolvedTriedExperience,
      visitorJourney: visitorJourney ?? undefined,
      inquiryBrief: brief,
      inquiryIntent,
      desiredReply,
      problemStatement,
      targetSummary,
      decisionTimeline,
      ...(trimmedConstraints ? { constraintsSummary: trimmedConstraints } : {}),
      ...(trimmedNote ? { additionalNote: trimmedNote } : {}),
      ...(attachEstimate && estimateSnapshot ? { estimateSnapshot } : {}),
    });
    if (success) {
      setName("");
      setEmail("");
      setClosestExperience("");
      setClosestExperienceOther("");
      setInquiryIntent("estimate");
      setDesiredReply("rough_estimate");
      setProblemStatement("");
      setTargetSummary("");
      setDecisionTimeline("");
      setConstraintsSummary("");
      setAdditionalNote("");
      setVisitorJourney(null);
      setEstimateSnapshot(null);
      setAttachEstimate(true);
      setHasCompletedContactIntake(false);
      setIntakeForm(CONTACT_INTAKE_INITIAL_FORM);
      setAnsweredQuestionIds(new Set());
      setIntakeError("");
    }
  };

  if (!hasPreparedContext) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-accent/20 bg-base-dark/40 p-5 md:p-6">
          <div className="flex gap-3">
            <span
              className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent"
              aria-hidden
            >
              <ArrowUpToLine className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-white">{form.directGuideTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {form.directGuideBody}
              </p>
            </div>
          </div>
        </div>
        <ContactIntakeHearingBlock
          form={intakeForm}
          setForm={setIntakeForm}
          answeredQuestionIds={answeredQuestionIds}
          onComplete={handleCompleteContactIntake}
        />
        {intakeLoading ? <p className="text-sm text-white/75">整理しています…</p> : null}
        {intakeError ? (
          <p className="text-sm text-red-400" role="alert">
            {intakeError}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {effectiveBrief ? (
        <div className="space-y-3 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p className="text-sm font-medium text-text">{form.inquirySummaryTitle}</p>
          <p className="text-sm leading-relaxed text-text-sub">
            {form.inquirySummaryHint}
          </p>
          <dl className="grid gap-3 text-sm text-text md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.intentLabel}
              </dt>
              <dd className="mt-1">{effectiveBrief.inquiryIntentLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.desiredReplyLabel}
              </dt>
              <dd className="mt-1">{effectiveBrief.desiredReplyLabel}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directProblemLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{effectiveBrief.problemSummary}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTargetLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{effectiveBrief.targetSummary}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTimelineLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{effectiveBrief.timelineSummary}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directConstraintsLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {effectiveBrief.constraintsSummary}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p className="text-sm font-medium text-text">{form.inquirySummaryTitle}</p>
          <p className="text-sm leading-relaxed text-text-sub">
            {form.inquirySummaryHint}
          </p>
          <dl className="grid gap-3 text-sm text-text md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.intentLabel}
              </dt>
              <dd className="mt-1">{INQUIRY_INTENT_LABELS[inquiryIntent]}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.desiredReplyLabel}
              </dt>
              <dd className="mt-1">
                {INQUIRY_DESIRED_REPLY_LABELS[desiredReply]}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directProblemLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{problemStatement}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTargetLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{targetSummary}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTimelineLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{decisionTimeline}</dd>
            </div>
            {constraintsSummary.trim() ? (
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-text-sub">
                  {form.directConstraintsLabel}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap">{constraintsSummary}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      )}

      {estimateSnapshot ? (
        <div className="space-y-3 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p className="text-sm font-medium text-text">{form.estimateSummaryTitle}</p>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-text">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 accent-accent"
              checked={attachEstimate}
              onChange={(e) => setAttachEstimate(e.target.checked)}
            />
            <span>
              <span className="font-medium">{form.attachEstimateLabel}</span>
              <span className="mt-1 block text-text-sub">{form.attachEstimateHint}</span>
            </span>
          </label>
          <details className="rounded-lg border border-silver/20 bg-base-dark/40 p-3 text-sm">
            <summary className="cursor-pointer font-medium text-text">
              {form.overviewRevealLabel}
            </summary>
            <p className="mt-2 whitespace-pre-wrap text-text-sub">
              {estimateSnapshot.ai.plainCustomerSummary}
            </p>
            <p className="mt-2 text-text">
              金額の目安: 約{estimateSnapshot.ai.estimateLoMan}万円〜
              {estimateSnapshot.ai.estimateHiMan}万円程度
            </p>
          </details>
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-text">
          {form.nameLabel}
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={form.namePlaceholder}
          className={cn("min-h-11", errors.name && "border-red-500")}
          autoComplete="name"
        />
        {errors.name ? <p className="mt-1 text-sm text-red-500">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-text">
          {form.emailLabel}
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={form.emailPlaceholder}
          className={cn("min-h-11", errors.email && "border-red-500")}
          autoComplete="email"
        />
        {errors.email ? <p className="mt-1 text-sm text-red-500">{errors.email}</p> : null}
      </div>

      <div>
        <label
          htmlFor="closestExperience"
          className="mb-2 block text-sm font-medium text-text"
        >
          {form.triedExperienceLabel}
        </label>
        <select
          id="closestExperience"
          value={closestExperience}
          onChange={(e) => setClosestExperience(e.target.value)}
          className={cn(
            "flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm",
            errors.triedExperience && "border-red-500"
          )}
        >
          <option value="">{form.triedExperiencePlaceholder}</option>
          {experienceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {closestExperience === OTHER_EXPERIENCE_VALUE ? (
          <Input
            value={closestExperienceOther}
            onChange={(e) => setClosestExperienceOther(e.target.value)}
            placeholder={form.triedExperienceOtherPlaceholder}
            className="mt-3 min-h-11"
            maxLength={200}
            autoComplete="off"
          />
        ) : null}
        {errors.triedExperience ? (
          <p className="mt-1 text-sm text-red-500">{errors.triedExperience}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="additionalNote"
          className="mb-2 block text-sm font-medium text-text"
        >
          {form.additionalNoteLabel}
        </label>
        <Textarea
          id="additionalNote"
          value={additionalNote}
          onChange={(e) => setAdditionalNote(e.target.value)}
          placeholder={form.additionalRequestPlaceholder}
          rows={4}
          className={cn(
            "min-h-[110px] resize-y",
            errors.additionalNote && "border-red-500"
          )}
        />
        <p className="mt-2 text-sm text-text-sub">{form.additionalNoteHint}</p>
        {errors.additionalNote ? (
          <p className="mt-1 text-sm text-red-500">{errors.additionalNote}</p>
        ) : null}
      </div>

      {status === "success" ? <p className="text-sm text-accent">{form.success}</p> : null}
      {status === "error" && submitError ? (
        <p className="text-sm text-red-500" role="alert">
          {submitError}
        </p>
      ) : null}
      {inquiryGate.status !== "sendable" ? (
        <p className="text-sm text-amber-200" role="status">
          問い合わせ送信前の確認が未完了です。見積の確認内容と要点を見直してください。
        </p>
      ) : null}

      <Button
        type="submit"
        className="min-h-11 w-full sm:w-auto"
        disabled={status === "submitting" || !canSendPreparedInquiry}
      >
        {status === "submitting" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
