"use client";

import { useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { HomeHorizontalDots } from "@/components/home/HomeHorizontalDots";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { flow } = homeLandingCopy;

export function HomeServiceFlowRow() {
  const steps = flow.steps;
  const railRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      id="flow"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-flow-heading"
    >
      <HomeLandingSectionHeading
        id="home-flow-heading"
        index={flow.sectionIndex}
        kicker={flow.sectionKicker}
        title={flow.heading}
        description={flow.intro}
      />

      {/* PC: 4カラム横並び。モバイル: scroll-snap 横スクロールでスワイプ。 */}
      <div
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-2 [scroll-padding-inline:1rem] md:mx-0 md:snap-none md:gap-0 md:overflow-visible md:px-0 md:pb-0 lg:flex-row lg:items-stretch"
      >
        {steps.flatMap((step, index) => {
          const card = (
            <article
              key={`step-${step.title}`}
              data-dot-target
              className="flex min-w-[82%] shrink-0 snap-center flex-col rounded-2xl border border-silver/20 bg-base-dark/40 p-6 ring-1 ring-warm/10 ring-inset md:min-w-0 md:flex-1 md:shrink md:snap-none md:p-8"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/15 text-sm font-bold tabular-nums text-accent md:size-12 md:text-[15px]">
                {index + 1}
              </span>
              <h3 className="mt-5 text-balance text-xl font-bold leading-snug text-white md:mt-6 md:text-[1.35rem] md:leading-snug lg:text-xl">
                {step.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                <span className="text-[14px] font-bold text-white md:text-[15px]">
                  コンサル視点
                </span>
                <span className="mt-2 block font-normal">{step.consultRole}</span>
              </p>
              <p className="mt-4 text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                <span className="text-[14px] font-bold text-white md:text-[15px]">
                  AI・開発視点
                </span>
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
              className="hidden shrink-0 items-center justify-center md:flex md:w-9 md:py-0 md:px-1 lg:w-11"
              aria-hidden
            >
              <ChevronDown
                className="size-7 text-accent/45 lg:hidden"
                strokeWidth={2}
              />
              <ChevronRight
                className="hidden size-7 text-accent/45 lg:block"
                strokeWidth={2}
              />
            </div>
          );

          return [card, connector];
        })}
      </div>

      <div className="md:hidden">
        <HomeHorizontalDots
          containerRef={railRef}
          count={steps.length}
          itemSelector="[data-dot-target]"
          label="サービスの流れ"
        />
      </div>
    </section>
  );
}
