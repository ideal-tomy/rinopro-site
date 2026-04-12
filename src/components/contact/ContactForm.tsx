"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  type InquiryDesiredReply,
  type InquiryIntent,
} from "@/lib/inquiry/inquiry-brief";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";
import { readVisitorJourneySummary } from "@/lib/journey/visitor-journey-storage";

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

export function ContactForm() {
  const searchParams = useSearchParams();
  const handoffApplied = useRef(false);
  const visitorSummaryApplied = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [triedExperience, setTriedExperience] = useState("");
  const [inquiryIntent, setInquiryIntent] = useState<InquiryIntent>("estimate");
  const [desiredReply, setDesiredReply] =
    useState<InquiryDesiredReply>("rough_estimate");
  const [problemStatement, setProblemStatement] = useState("");
  const [targetSummary, setTargetSummary] = useState("");
  const [decisionTimeline, setDecisionTimeline] = useState("");
  const [constraintsSummary, setConstraintsSummary] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [visitorJourney, setVisitorJourney] = useState<VisitorJourneySummary | null>(null);
  const [estimateSnapshot, setEstimateSnapshot] = useState<EstimateSnapshot | null>(null);
  const [attachEstimate, setAttachEstimate] = useState(true);
  const { status, errors, submit, submitError } = useContactForm();
  const form = contactCopy.form;
  const inquiryBrief = estimateSnapshot?.inquiryPreparation?.brief ?? null;

  useEffect(() => {
    if (handoffApplied.current) return;

    const raw = searchParams.get("handoff");
    if (raw === CONTACT_HANDOFF_SESSION_QUERY) {
      const payload = consumeHandoffPayloadFromSession();
      if (!payload) return;
      handoffApplied.current = true;
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
      return;
    }

    if (!raw) return;
    const payload = decodeChatHandoff(raw);
    if (!payload) return;
    handoffApplied.current = true;
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
  }, [searchParams]);

  useEffect(() => {
    if (handoffApplied.current) return;
    if (visitorSummaryApplied.current) return;
    const summary = readVisitorJourneySummary();
    if (!summary) return;
    visitorSummaryApplied.current = true;
    setVisitorJourney(summary);
    if (summary.latestEntryIntent === "consult") {
      setInquiryIntent("consulting");
      setDesiredReply("consulting_plan");
    } else if (summary.latestEntryIntent === "estimate") {
      setInquiryIntent("estimate");
      setDesiredReply("rough_estimate");
    }
    if (!problemStatement.trim()) {
      setProblemStatement(summary.lastFreeformSummary ?? "何を相談したいか整理中");
    }
    if (!targetSummary.trim()) {
      setTargetSummary(
        summary.industryBundle
          ? [summary.industryBundle.domainId, summary.industryBundle.domainDetailId ?? ""]
              .filter(Boolean)
              .join(" / ")
          : "対象業務・利用者は要確認"
      );
    }
    if (!decisionTimeline.trim()) {
      setDecisionTimeline(summary.estimateSignals?.timeline ?? "時期は要確認");
    }
    if (!constraintsSummary.trim()) {
      setConstraintsSummary("大きな制約は要確認");
    }
  }, [constraintsSummary, decisionTimeline, problemStatement, targetSummary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedExp = triedExperience.trim();
    const trimmedConstraints = constraintsSummary.trim();
    const trimmedNote = additionalNote.trim();

    const success = await submit({
      name,
      email,
      visitorJourney: visitorJourney ?? undefined,
      inquiryBrief: inquiryBrief ?? undefined,
      inquiryIntent,
      desiredReply,
      problemStatement,
      targetSummary,
      decisionTimeline,
      ...(trimmedConstraints ? { constraintsSummary: trimmedConstraints } : {}),
      ...(trimmedNote ? { additionalNote: trimmedNote } : {}),
      ...(trimmedExp ? { triedExperience: trimmedExp } : {}),
      ...(attachEstimate && estimateSnapshot ? { estimateSnapshot } : {}),
    });
    if (success) {
      setName("");
      setEmail("");
      setTriedExperience("");
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label
          htmlFor="triedExperience"
          className="mb-2 block text-sm font-medium text-text"
        >
          {form.triedExperienceLabel}
        </label>
        <Input
          id="triedExperience"
          value={triedExperience}
          onChange={(e) => setTriedExperience(e.target.value)}
          placeholder={form.triedExperiencePlaceholder}
          className={cn("min-h-11", errors.triedExperience && "border-red-500")}
          maxLength={200}
          autoComplete="off"
        />
        {errors.triedExperience && (
          <p className="mt-1 text-sm text-red-500">{errors.triedExperience}</p>
        )}
      </div>

      {inquiryBrief ? (
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
              <dd className="mt-1">{inquiryBrief.inquiryIntentLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.desiredReplyLabel}
              </dt>
              <dd className="mt-1">{inquiryBrief.desiredReplyLabel}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directProblemLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{inquiryBrief.problemSummary}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTargetLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{inquiryBrief.targetSummary}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directTimelineLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{inquiryBrief.timelineSummary}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                {form.directConstraintsLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {inquiryBrief.constraintsSummary}
              </dd>
            </div>
            {inquiryBrief.journeySummary ? (
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-text-sub">
                  サイト内で引き継いだ文脈
                </dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {inquiryBrief.journeySummary}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-silver/20 bg-base-dark/30 p-4">
          <p className="text-sm font-medium text-text">{form.directGuideTitle}</p>
          <p className="text-sm leading-relaxed text-text-sub">{form.directGuideBody}</p>

          <div>
            <label
              htmlFor="inquiryIntent"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.intentLabel}
            </label>
            <select
              id="inquiryIntent"
              value={inquiryIntent}
              onChange={(e) => setInquiryIntent(e.target.value as InquiryIntent)}
              className={cn(
                "flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm",
                errors.inquiryIntent && "border-red-500"
              )}
            >
              {Object.entries(INQUIRY_INTENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="desiredReply"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.desiredReplyLabel}
            </label>
            <select
              id="desiredReply"
              value={desiredReply}
              onChange={(e) =>
                setDesiredReply(e.target.value as InquiryDesiredReply)
              }
              className={cn(
                "flex min-h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 py-2 text-[16px] text-text md:text-sm",
                errors.desiredReply && "border-red-500"
              )}
            >
              {Object.entries(INQUIRY_DESIRED_REPLY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="problemStatement"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.directProblemLabel}
            </label>
            <Textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder={form.directProblemPlaceholder}
              rows={4}
              className={cn(
                "min-h-[100px] resize-y",
                errors.problemStatement && "border-red-500"
              )}
            />
            {errors.problemStatement ? (
              <p className="mt-1 text-sm text-red-500">{errors.problemStatement}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="targetSummary"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.directTargetLabel}
            </label>
            <Textarea
              id="targetSummary"
              value={targetSummary}
              onChange={(e) => setTargetSummary(e.target.value)}
              placeholder={form.directTargetPlaceholder}
              rows={3}
              className={cn(
                "min-h-[88px] resize-y",
                errors.targetSummary && "border-red-500"
              )}
            />
            {errors.targetSummary ? (
              <p className="mt-1 text-sm text-red-500">{errors.targetSummary}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="decisionTimeline"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.directTimelineLabel}
            </label>
            <Input
              id="decisionTimeline"
              value={decisionTimeline}
              onChange={(e) => setDecisionTimeline(e.target.value)}
              placeholder={form.directTimelinePlaceholder}
              className={cn(
                "min-h-11",
                errors.decisionTimeline && "border-red-500"
              )}
            />
            {errors.decisionTimeline ? (
              <p className="mt-1 text-sm text-red-500">{errors.decisionTimeline}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="constraintsSummary"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.directConstraintsLabel}
            </label>
            <Textarea
              id="constraintsSummary"
              value={constraintsSummary}
              onChange={(e) => setConstraintsSummary(e.target.value)}
              placeholder={form.directConstraintsPlaceholder}
              rows={3}
              className={cn(
                "min-h-[88px] resize-y",
                errors.constraintsSummary && "border-red-500"
              )}
            />
            {errors.constraintsSummary ? (
              <p className="mt-1 text-sm text-red-500">{errors.constraintsSummary}</p>
            ) : null}
          </div>
        </div>
      )}

      {visitorJourney ? (
        <div className="space-y-3 rounded-xl border border-silver/20 bg-base-dark/30 p-4">
          <p className="text-sm font-medium text-text">
            サイト内で整理できている内容
          </p>
          <p className="text-sm leading-relaxed text-text-sub">
            この内容も合わせて送信されます。ずれていれば上の入力欄をそのまま修正してください。
          </p>
          <dl className="grid gap-3 text-sm text-text md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                関心傾向
              </dt>
              <dd className="mt-1">{visitorJourney.interestBias}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                到達状況
              </dt>
              <dd className="mt-1">{visitorJourney.journeyDepth}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-text-sub">
                要約
              </dt>
              <dd className="mt-1 whitespace-pre-wrap">{visitorJourney.journeySummary}</dd>
            </div>
          </dl>
        </div>
      ) : null}

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
      {status === "success" && <p className="text-sm text-accent">{form.success}</p>}
      {status === "error" && submitError && (
        <p className="text-sm text-red-500" role="alert">
          {submitError}
        </p>
      )}
      <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
