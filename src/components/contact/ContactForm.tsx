"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { useContactHandoff } from "@/hooks/use-contact-handoff";
import { contactCopy } from "@/lib/content/site-copy";
import { getImplementationShowcaseContactFormOptions } from "@/lib/content/implementation-showcase";
import { cn } from "@/lib/utils";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { getHomeAcquisitionPatternById } from "@/lib/content/home-acquisition";
import { getIndustryShowcaseBySlug } from "@/lib/content/industry-showcase";

type ExperienceOption = {
  value: string;
  label: string;
};

const OTHER_EXPERIENCE_VALUE = "__other";
const NONE_EXPERIENCE_VALUE = "__none";

function buildExperienceOptions(): ExperienceOption[] {
  return [
    ...getImplementationShowcaseContactFormOptions(),
    { value: OTHER_EXPERIENCE_VALUE, label: "その他" },
    { value: NONE_EXPERIENCE_VALUE, label: "特に体験していない" },
  ];
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const patternQueryApplied = useRef(false);
  const industryQueryApplied = useRef(false);
  const handoffMessageApplied = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [closestExperience, setClosestExperience] = useState("");
  const [closestExperienceOther, setClosestExperienceOther] = useState("");
  const [carriedSnapshot, setCarriedSnapshot] = useState<EstimateSnapshot | null>(
    null
  );

  const {
    resolved: handoffResolved,
    failureDismissed,
    dismissEstimateFailure,
    clearHandoffAfterSubmit,
    estimateSubmitBlocked,
  } = useContactHandoff();

  const { status, errors, submit, submitError } = useContactForm();
  const form = contactCopy.form;

  const experienceOptions = useMemo(() => buildExperienceOptions(), []);
  const resolvedTriedExperience = useMemo(() => {
    if (closestExperience === OTHER_EXPERIENCE_VALUE) {
      return closestExperienceOther.trim();
    }
    if (closestExperience === NONE_EXPERIENCE_VALUE) {
      return "特に体験していない";
    }
    return closestExperience.trim();
  }, [closestExperience, closestExperienceOther]);

  useEffect(() => {
    if (handoffResolved.status === "loading") return;
    if (handoffMessageApplied.current) return;

    if (handoffResolved.status === "estimate_ok") {
      handoffMessageApplied.current = true;
      setCarriedSnapshot(handoffResolved.snapshot);
      const draft = handoffResolved.messageDraft;
      const frame = requestAnimationFrame(() => {
        setMessage((prev) => (prev.trim() ? `${draft}\n\n${prev.trim()}` : draft));
      });
      return () => cancelAnimationFrame(frame);
    }

    if (handoffResolved.status === "concierge_ok") {
      handoffMessageApplied.current = true;
      setCarriedSnapshot(null);
      const draft = handoffResolved.messageDraft;
      const frame = requestAnimationFrame(() => {
        setMessage((prev) => (prev.trim() ? `${draft}\n\n${prev.trim()}` : draft));
      });
      return () => cancelAnimationFrame(frame);
    }

    if (handoffResolved.status === "estimate_failed") {
      handoffMessageApplied.current = true;
      setCarriedSnapshot(null);
    }
  }, [handoffResolved]);

  useEffect(() => {
    if (searchParams.get("handoff") || searchParams.get("prefill")) return;

    const lines: string[] = [];

    if (!patternQueryApplied.current) {
      const pattern = getHomeAcquisitionPatternById(searchParams.get("pattern"));
      if (pattern) {
        patternQueryApplied.current = true;
        lines.push(
          `【トップの参考パターン】${pattern.title}（ID: ${pattern.id}）について相談したいです。`
        );
      }
    }

    if (!industryQueryApplied.current) {
      const industry = getIndustryShowcaseBySlug(searchParams.get("industry") ?? "");
      if (industry) {
        industryQueryApplied.current = true;
        lines.push(
          `【業種ページ】${industry.label}（${industry.slug}）について相談したいです。`
        );
      }
    }

    if (lines.length === 0) return;

    const frame = requestAnimationFrame(() => {
      const block = lines.join("\n\n");
      setMessage((prev) => (prev.trim() ? `${prev.trim()}\n\n${block}` : block));
    });
    return () => cancelAnimationFrame(frame);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: trimmedMessage,
      ...(company.trim() ? { company: company.trim() } : {}),
      ...(resolvedTriedExperience
        ? { triedExperience: resolvedTriedExperience }
        : {}),
      ...(carriedSnapshot ? { estimateSnapshot: carriedSnapshot } : {}),
    };
    const success = await submit(payload);
    if (success) {
      clearHandoffAfterSubmit();
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      setClosestExperience("");
      setClosestExperienceOther("");
      setCarriedSnapshot(null);
      handoffMessageApplied.current = false;
    }
  };

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length >= 8 &&
    status !== "submitting" &&
    !estimateSubmitBlocked;

  const showHandoffLoading = handoffResolved.status === "loading";
  const showEstimateOk = handoffResolved.status === "estimate_ok";
  const showConciergeOk = handoffResolved.status === "concierge_ok";
  const showEstimateFailed =
    handoffResolved.status === "estimate_failed" && !failureDismissed;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-text">
          {form.nameLabel}
        </label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={form.namePlaceholder}
          className={cn("min-h-11", errors.name && "border-red-500")}
          autoComplete="name"
        />
        {errors.name ? <p className="mt-1 text-sm text-red-500">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-text">
          {form.emailLabel}
        </label>
        <Input
          id="contact-email"
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
        <label htmlFor="contact-company" className="mb-2 block text-sm font-medium text-text">
          {form.companyLabel}
        </label>
        <Input
          id="contact-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={form.companyPlaceholder}
          className={cn("min-h-11", errors.company && "border-red-500")}
          autoComplete="organization"
          maxLength={200}
        />
        {errors.company ? <p className="mt-1 text-sm text-red-500">{errors.company}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-text">
          {form.messageLabel}
        </label>

        {showHandoffLoading ? (
          <div
            className="mb-3 rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-3 py-3 text-sm text-text-sub"
            role="status"
            aria-live="polite"
          >
            {form.handoffLoading}
          </div>
        ) : null}

        {showEstimateOk ? (
          <div
            className="mb-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-3 text-sm leading-relaxed text-text"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-accent">{form.handoffEstimateOkTitle}</p>
            {carriedSnapshot?.ai ? (
              <p className="mt-1 text-[13px] text-text-sub">
                金額の目安：約 {carriedSnapshot.ai.estimateLoMan} 万円 〜{" "}
                {carriedSnapshot.ai.estimateHiMan} 万円
                <span className="ml-1">{form.handoffEstimateOkRangeSuffix}</span>
              </p>
            ) : null}
            {handoffResolved.status === "estimate_ok" &&
            handoffResolved.source === "flow_recovery" ? (
              <p className="mt-1 text-[13px] text-text-sub">
                {form.handoffEstimateRecoveredHint}
              </p>
            ) : null}
            <p className="mt-1 text-[13px] text-text-sub">{form.handoffEstimateOkHint}</p>
          </div>
        ) : null}

        {showConciergeOk ? (
          <div
            className="mb-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-3 text-sm leading-relaxed text-text"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-accent">{form.handoffConciergeOkTitle}</p>
            <p className="mt-1 text-[13px] text-text-sub">{form.handoffConciergeOkHint}</p>
          </div>
        ) : null}

        {showEstimateFailed ? (
          <div
            id="contact-handoff-failed"
            className="mb-3 rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-4 text-sm leading-relaxed text-text"
            role="alert"
          >
            <p className="font-semibold text-text">{form.handoffFailedTitle}</p>
            <p className="mt-2 text-[15px] text-text-sub">{form.handoffFailedBody}</p>
            <p className="mt-2 text-[13px] text-text-sub">{form.handoffFailedStorageHint}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="button" className="min-h-11 w-full sm:w-auto" asChild>
                <Link href="/estimate-detailed/amount">{form.handoffBackToAmountCta}</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
                asChild
              >
                <Link href="/estimate-detailed">{form.handoffRestartEstimateCta}</Link>
              </Button>
            </div>
            <button
              type="button"
              className="mt-3 text-[13px] font-medium text-accent underline-offset-4 hover:underline"
              onClick={dismissEstimateFailure}
            >
              {form.handoffSendWithoutEstimateCta}
            </button>
          </div>
        ) : null}

        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={form.messagePlaceholder}
          rows={8}
          maxLength={6000}
          className={cn(
            "min-h-[180px] resize-y text-[16px] md:text-sm",
            errors.message && "border-red-500"
          )}
          aria-describedby={
            estimateSubmitBlocked ? "contact-handoff-failed contact-submit-blocked" : undefined
          }
        />
        <p className="mt-2 text-sm text-text-sub">{form.messageHint}</p>
        {estimateSubmitBlocked ? (
          <p id="contact-submit-blocked" className="mt-2 text-sm text-red-600" role="status">
            {form.handoffSubmitBlockedHint}
          </p>
        ) : null}
        {errors.message ? <p className="mt-1 text-sm text-red-500">{errors.message}</p> : null}
      </div>

      <div>
        <label
          htmlFor="contact-experience"
          className="mb-2 block text-sm font-medium text-text"
        >
          {form.triedExperienceLabel}
          <span className="ml-1 text-xs font-normal text-text-sub">（任意）</span>
        </label>
        <select
          id="contact-experience"
          value={closestExperience}
          onChange={(e) => setClosestExperience(e.target.value)}
          className={cn(
            "flex min-h-11 w-full rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-3 py-2 text-[16px] text-text md:text-sm",
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

      {status === "success" ? <p className="text-sm text-accent">{form.success}</p> : null}
      {status === "error" && submitError ? (
        <p className="text-sm text-red-500" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={!canSubmit}>
        {status === "submitting" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
