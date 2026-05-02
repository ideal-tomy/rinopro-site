import { ChevronDown, ChevronRight } from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { flow } = homeLandingCopy;

export function HomeServiceFlowRow() {
  const steps = flow.steps;

  return (
    <section
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-flow-heading"
    >
      <HomeLandingSectionHeading
        id="home-flow-heading"
        index={flow.sectionIndex}
        kicker={flow.sectionKicker}
        title={flow.heading}
        description={flow.intro}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0 lg:overflow-x-auto">
        {steps.flatMap((step, index) => {
          const card = (
            <article
              key={`step-${step.title}`}
              className="flex min-h-full flex-1 flex-col rounded-2xl border border-silver/20 bg-base-dark/40 p-6 ring-1 ring-warm/10 ring-inset md:p-8 lg:min-w-0"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/15 text-sm font-bold tabular-nums text-accent md:size-12 md:text-[15px]">
                {index + 1}
              </span>
              <h3 className="mt-5 text-balance text-xl font-bold leading-snug text-white md:mt-6 md:text-[1.35rem] md:leading-snug lg:text-xl">
                {step.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                <span className="text-[14px] font-bold text-white md:text-[15px]">コンサル視点</span>
                <span className="mt-2 block font-normal">{step.consultRole}</span>
              </p>
              <p className="mt-4 text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                <span className="text-[14px] font-bold text-white md:text-[15px]">AI・開発視点</span>
                <span className="mt-2 block font-normal">{step.techRole}</span>
              </p>
            </article>
          );

          if (index === steps.length - 1) {
            return [card];
          }

          const connector = (
            <div
              key={`arrow-${index}`}
              className="flex shrink-0 items-center justify-center py-1 lg:w-11 lg:py-0 lg:px-1"
              aria-hidden
            >
              <ChevronDown className="size-7 text-accent/45 lg:hidden" strokeWidth={2} />
              <ChevronRight className="hidden size-7 text-accent/45 lg:block" strokeWidth={2} />
            </div>
          );

          return [card, connector];
        })}
      </div>
    </section>
  );
}
