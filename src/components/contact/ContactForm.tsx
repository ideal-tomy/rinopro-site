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

function applyPayloadToForm(
  payload: ChatHandoffPayload,
  setMessage: (s: string) => void,
  setEstimateSnapshot: (s: EstimateSnapshot | null) => void
) {
  if (payload.v === 2 && payload.source === "estimate_detailed") {
    if ("snapshot" in payload && payload.snapshot) {
      setEstimateSnapshot(payload.snapshot);
      setMessage(buildContactMessageDraft(payload));
      return;
    }
    setEstimateSnapshot(null);
    setMessage(buildContactMessageDraft(payload));
    return;
  }
  setEstimateSnapshot(null);
  setMessage(buildContactMessageDraft(payload));
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const handoffApplied = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [triedExperience, setTriedExperience] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [message, setMessage] = useState("");
  const [estimateSnapshot, setEstimateSnapshot] = useState<EstimateSnapshot | null>(null);
  const [attachEstimate, setAttachEstimate] = useState(true);
  const { status, errors, submit } = useContactForm();
  const form = contactCopy.form;

  useEffect(() => {
    if (handoffApplied.current) return;

    const raw = searchParams.get("handoff");
    if (raw === CONTACT_HANDOFF_SESSION_QUERY) {
      const payload = consumeHandoffPayloadFromSession();
      if (!payload) return;
      handoffApplied.current = true;
      applyPayloadToForm(payload, setMessage, setEstimateSnapshot);
      return;
    }

    if (!raw) return;
    const payload = decodeChatHandoff(raw);
    if (!payload) return;
    handoffApplied.current = true;
    applyPayloadToForm(payload, setMessage, setEstimateSnapshot);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedExp = triedExperience.trim();
    const base = message.trim();
    const add = additionalRequest.trim();
    const composed = add ? `${add}\n\n---\n\n${base}` : base;

    const success = await submit({
      name,
      email,
      message: composed,
      ...(trimmedExp ? { triedExperience: trimmedExp } : {}),
      ...(attachEstimate && estimateSnapshot ? { estimateSnapshot } : {}),
    });
    if (success) {
      setName("");
      setEmail("");
      setTriedExperience("");
      setAdditionalRequest("");
      setMessage("");
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

      {estimateSnapshot ? (
        <div className="space-y-3 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p className="text-sm font-medium text-text">{form.estimateSummaryTitle}</p>
          <p className="text-sm text-text-sub">{form.messageHintFromEstimate}</p>
          <div>
            <label
              htmlFor="additionalRequest"
              className="mb-2 block text-sm font-medium text-text"
            >
              {form.additionalRequestLabel}
            </label>
            <Textarea
              id="additionalRequest"
              value={additionalRequest}
              onChange={(e) => setAdditionalRequest(e.target.value)}
              placeholder={form.additionalRequestPlaceholder}
              rows={3}
              className="min-h-[88px] resize-y"
            />
          </div>
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
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-text">
          {form.messageLabel}
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={form.messagePlaceholder}
          rows={estimateSnapshot ? 8 : 5}
          className={cn("min-h-[120px] resize-y", errors.message && "border-red-500")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
      {status === "success" && <p className="text-sm text-accent">{form.success}</p>}
      {status === "error" && errors.message && (
        <p className="text-sm text-red-500" role="alert">
          {errors.message}
        </p>
      )}
      <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
