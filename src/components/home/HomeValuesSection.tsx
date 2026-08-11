import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ReasonEngineDiagram } from "@/components/home/reason/ReasonEngineDiagram";
import { ReasonFlowDiagram } from "@/components/home/reason/ReasonFlowDiagram";
import { ReasonLoopDiagram } from "@/components/home/reason/ReasonLoopDiagram";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { values } = homeLandingCopy;

type ReasonItem = {
  index: string;
  title: string;
  body: string;
  diagram: ReactNode;
  diagramClassName: string;
};

function stripValueNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

const REASONS: ReasonItem[] = [
  {
    index: "01",
    title: stripValueNumber(values.items[0].title),
    body: values.items[0].body,
    diagram: <ReasonFlowDiagram />,
    diagramClassName:
      "rounded-xl bg-[var(--reason-card)] px-5 py-8 sm:px-8",
  },
  {
    index: "02",
    title: stripValueNumber(values.items[1].title),
    body: values.items[1].body,
    diagram: <ReasonEngineDiagram />,
    diagramClassName:
      "rounded-xl border border-[color-mix(in_srgb,var(--reason-primary)_22%,#cbd5e1)] bg-[var(--reason-bg)] px-4 py-8 sm:px-8",
  },
  {
    index: "03",
    title: stripValueNumber(values.items[2].title),
    body: values.items[2].body,
    diagram: <ReasonLoopDiagram />,
    diagramClassName:
      "rounded-xl bg-[var(--reason-card)] px-4 py-6 sm:px-8 sm:py-8",
  },
];

export function HomeValuesSection() {
  return (
    <section
      id="values"
      className="relative scroll-mt-28 overflow-hidden py-[clamp(56px,12vw,96px)] md:py-[clamp(80px,14vw,120px)]"
      style={
        {
          "--reason-primary": "var(--color-accent-primary)",
          "--reason-primary-hover": "var(--color-accent-primary-hover)",
          "--reason-text": "var(--color-text-primary)",
          "--reason-muted": "var(--color-text-secondary)",
          "--reason-bg": "#eaf3fb",
          "--reason-card": "#ffffff",
          backgroundColor: "var(--reason-bg)",
          color: "var(--reason-text)",
        } as CSSProperties
      }
      aria-labelledby="home-values-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color-mix(in_srgb,var(--reason-primary)_18%,transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto w-[min(100%-2rem,1080px)] md:w-[min(100%-3rem,1080px)]">
        <header className="mb-12 text-center md:mb-16">
          <p className="font-mono text-[32px] font-light tabular-nums tracking-[0.2em] text-[var(--reason-primary)]/50 md:text-[36px]">
            {values.sectionIndex}
          </p>
          <p className="mt-2 text-[13px] font-semibold tracking-[0.15em] text-[var(--reason-primary)] md:text-sm">
            {values.sectionKicker}
          </p>
          <h2
            id="home-values-heading"
            className="mt-2 whitespace-pre-line text-[clamp(28px,6.2vw,44px)] font-black leading-[1.35] text-[var(--reason-text)]"
          >
            {values.heading}
          </h2>
        </header>

        <div className="space-y-14 md:space-y-20">
          {REASONS.map((reason, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={reason.index}
                className={`flex flex-col gap-6 md:items-center md:gap-10 lg:gap-14 ${
                  reverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className={`w-full md:w-[52%] ${reason.diagramClassName}`}>
                  {reason.diagram}
                </div>

                <div className="w-full md:w-[48%]">
                  <p className="mb-2 font-mono text-sm font-bold tabular-nums tracking-[0.08em] text-[var(--reason-muted)]">
                    {reason.index}
                  </p>
                  <h3 className="mb-4 text-[clamp(20px,3.2vw,28px)] font-black leading-[1.4] text-[var(--reason-text)]">
                    {reason.title}
                  </h3>
                  <p className="max-w-[34rem] text-[15px] leading-relaxed text-[var(--reason-text)] md:text-base">
                    {reason.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 md:mt-16">
          <Link
            href="#industry"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--reason-primary)] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--reason-primary-hover)]"
          >
            デモを触ってみる
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--reason-primary)_28%,#94a3b8)] bg-white/70 px-6 py-3 text-sm font-bold text-[var(--reason-text)] transition-colors hover:border-[var(--reason-primary)]/50 hover:text-[var(--reason-primary)]"
          >
            相談してみる
          </Link>
        </div>
      </div>
    </section>
  );
}
