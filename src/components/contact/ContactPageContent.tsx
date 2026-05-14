"use client";

import Link from "next/link";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
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

      <ScrollSequenceItem thresholds={[0.18, 0.38]}>
        <ContactForm />
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.24, 0.42]}>
        <aside className="mt-10 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 md:p-6">
          <p className="text-sm leading-relaxed text-text-sub">{contactCopy.depthPromptLine}</p>
          <p className="mt-3 text-sm">
            <Link
              href="/estimate-detailed"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {contactCopy.estimateShortcutCta}
            </Link>
            <span className="mt-2 block text-xs leading-relaxed text-text-sub">
              {contactCopy.estimateShortcutHint}
            </span>
          </p>
        </aside>
      </ScrollSequenceItem>

      <ScrollSequenceItem thresholds={[0.28, 0.48]}>
        <div className="mt-12 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6">
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
