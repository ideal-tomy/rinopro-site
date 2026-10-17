"use client";

import Link from "next/link";
import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { AxPhrases } from "@/components/ui/ax/AxPhrases";
import { ContactForm } from "./ContactForm";
import { contactCopy } from "@/lib/content/site-copy";

export function ContactPageContent() {
  return (
    <div className="ax-page" data-ax-theme="corporate">
      <ScrollSequence className="ax-container-reading ax-section-standard mx-auto">
        <ScrollSequenceItem thresholds={[0.08, 0.18]}>
          <h1 className="ax-role-page-title mb-4 text-[var(--ax-brand-primary)]">
            {contactCopy.title}
          </h1>
          <p className="ax-role-body mb-8 text-[var(--ax-text-supporting)]">
            <AxPhrases phrases={contactCopy.purpose.split(/(?<=。)/)} />
          </p>
        </ScrollSequenceItem>

        <ScrollSequenceItem thresholds={[0.18, 0.38]}>
          <ContactForm />
        </ScrollSequenceItem>

        <ScrollSequenceItem thresholds={[0.24, 0.42]}>
          <aside className="mt-10 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 md:p-6">
            <p className="text-[15px] leading-[1.7] text-text-sub">
              <AxPhrases phrases={contactCopy.depthPromptLine.split(/(?<=、)/)} />
            </p>
            <p className="mt-3 text-[15px]">
              <Link
                href="/estimate-detailed"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                {contactCopy.estimateShortcutCta}
              </Link>
              <span className="ax-role-supporting mt-2 block">
                <AxPhrases
                  phrases={contactCopy.estimateShortcutHint.split(/(?<=[、。])/)}
                />
              </span>
            </p>
          </aside>
        </ScrollSequenceItem>

        <ScrollSequenceItem thresholds={[0.28, 0.48]}>
          <div className="mt-12 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6">
            <h2 className="mb-4 font-semibold text-accent">
              {contactCopy.assurance.title}
            </h2>
            <ul className="space-y-2 text-[15px] leading-[1.7] text-text-sub">
              {contactCopy.assurance.items.map((item) => (
                <li key={item.join("")} className="flex gap-2">
                  <span className="text-accent/70">・</span>
                  <span>
                    <AxPhrases phrases={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollSequenceItem>
      </ScrollSequence>
    </div>
  );
}
