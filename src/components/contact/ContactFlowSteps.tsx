"use client";

import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { contactCopy } from "@/lib/content/site-copy";
import { cn } from "@/lib/utils";

/**
 * 問い合わせページ用：相談の流れ（PC は横並び＋矢印、スマホは snap 横スクロール）。
 */
export function ContactFlowSteps() {
  const { flow } = contactCopy;
  const steps = flow.steps;

  return (
    <section aria-labelledby="contact-flow-heading" className="mb-10">
      <h2
        id="contact-flow-heading"
        className="mb-1 text-lg font-semibold text-accent md:text-xl"
      >
        {flow.sectionTitle}
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-white/70 md:hidden">
        {flow.mobileSwipeHint}
      </p>

      <div className="hidden md:flex md:flex-row md:items-stretch md:gap-1 md:pb-1">
        {steps.map((step, i) => (
          <Fragment key={step.title}>
            {i > 0 ? (
              <div
                className="flex shrink-0 items-center self-center px-1 text-accent/55"
                aria-hidden
              >
                <ChevronRight className="size-5" strokeWidth={2} />
              </div>
            ) : null}
            <div className="min-w-0 flex-1 rounded-xl border border-silver/20 bg-base-dark/40 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-accent/80">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-[16px] font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{step.body}</p>
            </div>
          </Fragment>
        ))}
      </div>

      <div
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2",
          "no-scrollbar md:hidden"
        )}
      >
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="w-[min(85vw,20rem)] shrink-0 snap-start rounded-xl border border-silver/20 bg-base-dark/40 p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-accent/80">
              Step {i + 1}
            </p>
            <h3 className="mt-1 text-[16px] font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{step.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/75">{flow.footnote}</p>
    </section>
  );
}
