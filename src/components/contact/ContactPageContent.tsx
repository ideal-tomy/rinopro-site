"use client";

import Link from "next/link";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { Button } from "@/components/ui/button";
import { ContactFlowSteps } from "./ContactFlowSteps";
import { ContactForm } from "./ContactForm";
import { contactCopy } from "@/lib/content/site-copy";

export function ContactPageContent() {
  return (
    <ScrollSequence className="container mx-auto max-w-3xl px-4 py-24 md:px-6">
      <ScrollSequenceItem thresholds={[0.08, 0.18]}>
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          {contactCopy.title}
        </h1>
        <p className="mb-8 text-[16px] leading-relaxed text-text-sub">
          {contactCopy.purpose}
        </p>
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.12, 0.22]}>
        <div className="mb-8">
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link href="/estimate-detailed">{contactCopy.estimateShortcutCta}</Link>
          </Button>
          <p className="mt-3 text-sm leading-relaxed text-text-sub">
            {contactCopy.estimateShortcutHint}
          </p>
        </div>
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.18, 0.32]}>
        <ContactFlowSteps />
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.22, 0.38]}>
        <ContactForm />
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.28, 0.48]}>
        <div className="mt-12 rounded-xl border border-silver/20 bg-base-dark/50 p-6">
          <h2 className="mb-4 font-semibold text-accent">
            {contactCopy.assurance.title}
          </h2>
          <ul className="space-y-2 text-sm text-text-sub">
            {contactCopy.assurance.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent/70">・</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScrollSequenceItem>
    </ScrollSequence>
  );
}
