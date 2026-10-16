import { HOME_VALUES_STYLES } from "./home-presentation";
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
      className={HOME_VALUES_STYLES.section}
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

      <div className={HOME_VALUES_STYLES.container}>
        <header className="mb-12 text-center md:mb-16">
          <h2
            id="home-values-heading"
            className={HOME_VALUES_STYLES.heading}
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
                    className={HOME_VALUES_STYLES.itemHeading}
                    style={{ color: TEXT }}
                  >
                    {reason.title}
                  </h3>
                  <p
                    className={HOME_VALUES_STYLES.body}
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
            className={HOME_VALUES_STYLES.primaryCta}
          >
            デモを触ってみる
          </Link>
          <Link
            href="/contact"
            className={HOME_VALUES_STYLES.secondaryCta}
            style={{ color: TEXT }}
          >
            相談してみる
          </Link>
        </div>
      </div>
    </section>
  );
}
