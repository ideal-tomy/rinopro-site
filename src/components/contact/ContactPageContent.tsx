"use client";

import {
  ScrollSequence,
  ScrollSequenceItem,
} from "@/components/motion/ScrollSequence";
import { ContactForm } from "./ContactForm";
import { contactCopy } from "@/lib/content/site-copy";

export function ContactPageContent() {
  return (
    <ScrollSequence className="container mx-auto max-w-2xl px-4 py-24 md:px-6">
      <ScrollSequenceItem thresholds={[0.1, 0.2]}>
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          {contactCopy.title}
        </h1>
      </ScrollSequenceItem>
      <ScrollSequenceItem thresholds={[0.2, 0.5]}>
        <p className="mb-12 text-text-sub">{contactCopy.purpose}</p>
      </ScrollSequenceItem>
      <ScrollSequenceItem thresholds={[0.5, 0.7]}>
        <ContactForm />
      </ScrollSequenceItem>
      <ScrollSequenceItem thresholds={[0.7, 0.9]}>
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
