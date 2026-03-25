"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { EstimateRequirementDocMarkdown } from "@/components/estimate/EstimateRequirementDocMarkdown";
import { estimateDetailedCopy } from "@/lib/content/site-copy";
import { getOrderedAnswerPairs } from "@/lib/estimate/estimate-detailed-answer-order";
import type { EstimateDetailedAiOutput } from "@/lib/estimate/estimate-snapshot";
import { cn } from "@/lib/utils";

const copy = estimateDetailedCopy;

function ResultAccordion({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <details
      className={cn(
        "group rounded-xl border border-silver/20 bg-base-dark/50 [&_summary::-webkit-details-marker]:hidden",
        className
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-[16px] font-semibold text-white">
        <span>{title}</span>
        <ChevronDown
          className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-silver/15 px-4 pb-4 pt-3">{children}</div>
    </details>
  );
}

function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul
      className={cn(
        "list-inside list-disc space-y-1.5 pl-0.5 text-[15px] leading-relaxed text-white/90 md:text-[16px]",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={`${i}-${item.slice(0, 40)}`}>{item}</li>
      ))}
    </ul>
  );
}

export function EstimateDetailedResultBody({
  result,
  answers,
}: {
  result: EstimateDetailedAiOutput;
  answers: Record<string, string>;
}) {
  const qaPairs = getOrderedAnswerPairs(answers);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-accent/35 bg-accent/[0.08] p-5 md:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-white md:text-[16px]">{copy.overviewTitle}</p>
        <p className="mt-3 whitespace-pre-wrap text-[16px] font-medium leading-relaxed text-white/95 md:text-lg">
          {result.plainCustomerSummary}
        </p>
      </div>

      <ResultAccordion title={copy.requirementDefinitionAccordionTitle}>
        <EstimateRequirementDocMarkdown source={result.requirementDefinitionDocument} />
      </ResultAccordion>

      <ResultAccordion title={copy.selectedAnswersAccordionTitle}>
        {qaPairs.length === 0 ? (
          <p className="text-[15px] text-white/70">（回答がありません）</p>
        ) : (
          <dl className="space-y-4">
            {qaPairs.map(({ question, answer }) => (
              <div key={question}>
                <dt className="text-[15px] font-semibold text-white md:text-[16px]">{question}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-white/85 md:text-[16px]">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </ResultAccordion>

      <ResultAccordion title={copy.assumptionsTitle}>
        <BulletList items={result.assumptions} className="!text-white/85" />
      </ResultAccordion>

      {result.followUpItems.length > 0 ? (
        <ResultAccordion title={copy.followUpMergedTitle}>
          <div className="space-y-5">
            {result.followUpItems.map((item, i) => (
              <div key={`${item.title}-${i}`} className="border-b border-silver/10 pb-4 last:border-b-0 last:pb-0">
                <p className="text-[16px] font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/85 md:text-[16px]">{item.description}</p>
              </div>
            ))}
          </div>
        </ResultAccordion>
      ) : null}
    </div>
  );
}
