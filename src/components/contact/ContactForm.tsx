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
  decodeChatHandoff,
} from "@/lib/chat/estimate-handoff";

export function ContactForm() {
  const searchParams = useSearchParams();
  const handoffApplied = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [triedExperience, setTriedExperience] = useState("");
  const [message, setMessage] = useState("");
  const { status, errors, submit } = useContactForm();
  const form = contactCopy.form;

  useEffect(() => {
    if (handoffApplied.current) return;
    const raw = searchParams.get("handoff");
    if (!raw) return;
    const payload = decodeChatHandoff(raw);
    if (!payload) return;
    handoffApplied.current = true;
    setMessage((prev) => {
      const draft = buildContactMessageDraft(payload);
      const t = prev.trim();
      return t ? `${t}\n\n${draft}` : draft;
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = triedExperience.trim();
    const success = await submit({
      name,
      email,
      message,
      ...(trimmed ? { triedExperience: trimmed } : {}),
    });
    if (success) {
      setName("");
      setEmail("");
      setTriedExperience("");
      setMessage("");
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
          className={cn(errors.name && "border-red-500")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
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
          className={cn(errors.email && "border-red-500")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
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
          className={cn(errors.triedExperience && "border-red-500")}
          maxLength={200}
          autoComplete="off"
        />
        {errors.triedExperience && (
          <p className="mt-1 text-sm text-red-500">{errors.triedExperience}</p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-text">
          {form.messageLabel}
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={form.messagePlaceholder}
          rows={5}
          className={cn(errors.message && "border-red-500")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
      {status === "success" && (
        <p className="text-sm text-accent">{form.success}</p>
      )}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
