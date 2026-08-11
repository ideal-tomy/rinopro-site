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

/** 背景 #eaf3fb 上で必ず読めるよう、トークン依存を避けてスレート系を固定 */
const TEXT = "#0f172a";
const MUTED = "#475569";

const REASONS: ReasonItem[] = [
  {
    index: "01",
    title: stripValueNumber(values.items[0].title),
    body: values.items[0].body,
    diagram: <ReasonFlowDiagram />,
    diagramClassName: "rounded-xl bg-white px-5 py-8 sm:px-8",
  },
  {
    index: "02",
    title: stripValueNumber(values.items[1].title),
    body: values.items[1].body,
    diagram: <ReasonEngineDiagram />,
    diagramClassName:
      "rounded-xl border border-slate-200 bg-[#eaf3fb] px-4 py-8 sm:px-8",
  },
  {
    index: "03",
    title: stripValueNumber(values.items[2].title),
    body: values.items[2].body,
    diagram: <ReasonLoopDiagram />,
    diagramClassName: "rounded-xl bg-white px-4 py-6 sm:px-8 sm:py-8",
  },
];

export function HomeValuesSection() {
  return (
    <section
      id="values"
      className="relative scroll-mt-28 overflow-hidden bg-[#eaf3fb] py-[clamp(56px,12vw,96px)] md:py-[clamp(80px,14vw,120px)]"
      style={
        {
          "--reason-primary": "#26418e",
          "--reason-primary-hover": "#1c356f",
          "--reason-text": TEXT,
          "--reason-muted": MUTED,
          color: TEXT,
        } as CSSProperties
      }
      aria-labelledby="home-values-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color-mix(in_srgb,#26418e_18%,transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto w-[min(100%-2rem,1080px)] md:w-[min(100%-3rem,1080px)]">
        <header className="mb-12 text-center md:mb-16">
          <p className="font-mono text-[32px] font-light tabular-nums tracking-[0.2em] text-[#26418e]/50 md:text-[36px]">
            {values.sectionIndex}
          </p>
          <p className="mt-2 text-[13px] font-semibold tracking-[0.15em] text-[#26418e] md:text-sm">
            {values.sectionKicker}
          </p>
          <h2
            id="home-values-heading"
            className="mt-2 whitespace-pre-line text-[clamp(28px,6.2vw,44px)] font-black leading-[1.35]"
            style={{ color: TEXT }}
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
                  <p
                    className="mb-2 font-mono text-sm font-bold tabular-nums tracking-[0.08em]"
                    style={{ color: MUTED }}
                  >
                    {reason.index}
                  </p>
                  <h3
                    className="mb-4 text-[clamp(20px,3.2vw,28px)] font-black leading-[1.4]"
                    style={{ color: TEXT }}
                  >
                    {reason.title}
                  </h3>
                  <p
                    className="max-w-[34rem] text-[15px] leading-relaxed md:text-[16px]"
                    style={{ color: TEXT }}
                  >
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
            className="inline-flex items-center gap-2 rounded-xl bg-[#26418e] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1c356f]"
          >
            デモを触ってみる
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-bold transition-colors hover:border-[#26418e]/50 hover:text-[#26418e]"
            style={{ color: TEXT }}
          >
            相談してみる
          </Link>
        </div>
      </div>
    </section>
  );
}
