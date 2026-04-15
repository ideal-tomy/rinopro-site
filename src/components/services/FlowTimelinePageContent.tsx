"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import {
  FLOW_TRACK_ORDER,
  type FlowTrackKey,
  flowDetailPageCopyByTrack,
} from "@/lib/content/site-copy";
import {
  serviceReading,
  serviceShellInset,
} from "@/lib/ui/service-reading-styles";
import { cn } from "@/lib/utils";

const EASE_MIST = [0.22, 1, 0.36, 1] as const;

function mistVariants(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.25 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_MIST },
    },
  };
}

function EmphasisText({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-text">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        return (
          <span key={i} className="text-text/90">
            {seg}
          </span>
        );
      })}
    </>
  );
}

function TimelineNode({
  label,
  reduceMotion,
}: {
  label: string;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-accent/50"
          animate={{
            scale: [1, 1.65],
            opacity: [0.45, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            repeatDelay: 0.35,
          }}
        />
      )}
      <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/85 bg-base-dark/90 text-xs font-semibold tabular-nums text-accent shadow-[0_0_20px_-4px_rgba(0,242,255,0.5)] md:backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

function StepWatermarkDesktop({ n }: { n: string }) {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none text-[min(42vw,12rem)] font-semibold tabular-nums text-text/[0.055] lg:text-[min(34vw,13.5rem)]"
      aria-hidden
    >
      {n}
    </span>
  );
}

const tagClass =
  "inline-block rounded-md border border-silver/30 bg-base-dark/50 px-2.5 py-1.5 text-[0.65rem] leading-tight text-text/85 md:px-3 md:text-xs";

export type FlowTimelinePageContentProps = {
  /** `/services` 埋め込み時: 余白・見出し階層・sticky・クロスリンクを調整 */
  embedded?: boolean;
};

export function FlowTimelinePageContent({
  embedded = false,
}: FlowTimelinePageContentProps) {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);
  const [activeTrack, setActiveTrack] = useState<FlowTrackKey>("common");
  const activeCopy = flowDetailPageCopyByTrack[activeTrack];
  const { steps } = activeCopy;
  const idSuffix = useId().replace(/:/g, "");
  const flowPanelId = embedded ? `flow-track-panel-${idSuffix}` : "flow-track-panel";
  const tabId = (key: FlowTrackKey) =>
    embedded ? `flow-tab-${key}-${idSuffix}` : `flow-tab-${key}`;

  return (
    <div
      className={cn(
        "mx-auto max-w-3xl md:px-10 lg:max-w-5xl",
        embedded
          ? cn(serviceShellInset.embeddedX, serviceShellInset.embeddedY)
          : "px-6 py-24 md:py-32 lg:py-40"
      )}
    >
      {embedded && (
        <motion.header
          className="mx-auto mb-8 max-w-3xl text-center md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={v}
        >
          <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
            Development
          </p>
          <h2 className="mb-0 text-3xl font-semibold tracking-tight text-accent sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            開発について
          </h2>
        </motion.header>
      )}

      {!embedded && (
        <motion.header
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={v}
        >
          <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
            {activeCopy.lifecycleLabel}
          </p>
          <p className="mb-6 text-xs tracking-[0.25em] text-text/75">
            {activeCopy.lifecycleSub}
          </p>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight text-accent md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {activeCopy.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text/85 md:text-xl">
            {activeCopy.purpose}
          </p>
        </motion.header>
      )}

      {/* 単体ページ: ヘッダー直下に sticky。埋め込み時は二重 sticky を避け通常フロー */}
      <nav
        className={cn(
          "border-b border-silver/15 bg-base-dark/90 py-3 md:backdrop-blur-md supports-[backdrop-filter]:bg-base-dark/75",
          embedded
            ? "relative z-20 -mx-0 mb-8 md:-mx-2 md:mb-10"
            : "relative -mx-6 mb-10 z-30 md:sticky md:top-16 md:-mx-10 md:mb-12"
        )}
        aria-label="開発の進め方の種類"
      >
        <div className="mx-auto max-w-2xl px-0">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto pb-0.5 md:flex-wrap md:justify-center md:gap-2.5 md:overflow-visible"
            role="tablist"
            aria-orientation="horizontal"
          >
            {FLOW_TRACK_ORDER.map((key) => {
              const selected = activeTrack === key;
              const { tabLabel } = flowDetailPageCopyByTrack[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={tabId(key)}
                  aria-selected={selected}
                  aria-controls={flowPanelId}
                  tabIndex={selected ? 0 : -1}
                  className={cn(
                    "shrink-0 snap-start rounded-full border px-3.5 py-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-colors md:px-4 md:text-xs",
                    selected
                      ? "border-action/70 bg-action/15 text-action shadow-[0_0_16px_-4px_rgba(0,103,192,0.35)]"
                      : "border-silver/25 bg-base-dark/40 text-text/80 hover:border-action/35 hover:text-text"
                  )}
                  onClick={() => setActiveTrack(key)}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <motion.div
        id={flowPanelId}
        role="tabpanel"
        aria-labelledby={tabId(activeTrack)}
        className="mx-auto mb-12 max-w-2xl md:mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
      >
        <p className={cn("text-center", serviceReading.bodyCenter)}>
          <EmphasisText text={activeCopy.intro} />
        </p>
      </motion.div>

      <div className="relative mx-auto max-w-2xl md:max-w-3xl">
        <div
          className="absolute bottom-0 left-8 top-0 hidden w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent md:left-1/2 md:block md:-translate-x-1/2"
          aria-hidden
        />

        <ol className="relative m-0 list-none p-0">
          {steps.map((step, i) => (
            <motion.li
              key={`${activeTrack}-${step.step}`}
              className="relative pb-20 last:pb-10 md:pb-32 md:last:pb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={v}
              transition={{ delay: reduce ? 0 : 0.1 + i * 0.08 }}
            >
              {/* スマホ: 縦積み1カラム（読み幅優先。旧左ガイドは撤去） */}
              <div className="relative mx-auto w-full md:hidden">
                <span
                  className="pointer-events-none absolute left-1/2 top-[4%] -translate-x-1/2 select-none text-[4.25rem] font-semibold tabular-nums leading-none text-text/[0.045]"
                  aria-hidden
                >
                  {step.step}
                </span>
                <div className="relative z-[1] flex flex-col items-start pt-1 text-left">
                  <TimelineNode label={step.step} reduceMotion={!!reduce} />
                  <p className="mb-1.5 mt-5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent/75">
                    Step {step.step}
                  </p>
                  <h2 className="mb-1.5 max-w-[22rem] text-[1.125rem] font-semibold leading-snug tracking-[0.06em] text-text">
                    {step.labelJa}
                  </h2>
                  <p className="mb-6 w-full max-w-[22rem] text-[0.8125rem] font-medium tracking-[0.18em] text-accent/95">
                    {step.labelEn}
                  </p>
                  <p
                    className={cn(
                      "mb-8 w-full max-w-prose text-left",
                      serviceReading.body
                    )}
                  >
                    {step.body}
                  </p>
                  <div className="w-full max-w-prose text-left">
                    <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-text/55">
                      成果物
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {step.deliverables.map((tag) => (
                        <li key={tag} className="list-none">
                          <span className={tagClass}>{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* PC：ノード・見出し・本文・タグをすべて中央揃え */}
              <div className="relative hidden md:block md:px-6">
                <StepWatermarkDesktop n={step.step} />
                <div className="relative z-[1] flex flex-col items-center pb-2 pt-2">
                  <div className="mb-8 flex justify-center">
                    <TimelineNode label={step.step} reduceMotion={!!reduce} />
                  </div>
                  <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent/80">
                    Step {step.step}
                  </p>
                  <h2 className="mb-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xl font-semibold leading-snug text-text">
                    <span className="tracking-[0.14em]">{step.labelJa}</span>
                    <span className="text-text/40">·</span>
                    <span className="text-lg font-medium tracking-[0.24em] text-accent">
                      {step.labelEn}
                    </span>
                  </h2>
                  <p className="mb-10 max-w-2xl text-center text-[1rem] leading-[2.05] text-text/90">
                    {step.body}
                  </p>
                  <div className="w-full max-w-2xl">
                    <p className="mb-4 text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-text/55">
                      成果物
                    </p>
                    <ul className="flex flex-wrap justify-center gap-2">
                      {step.deliverables.map((tag) => (
                        <li key={tag} className="list-none">
                          <span className={tagClass}>{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        className="mx-auto mt-28 max-w-2xl text-center md:mt-36"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
      >
        <p className={cn("text-center", serviceReading.bodyCenter)}>
          {activeCopy.reassurance}
        </p>
      </motion.div>

      <motion.section
        className={cn(
          "relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-silver/20 bg-base-dark/35 text-center md:backdrop-blur-sm md:mt-20 md:px-12 md:py-12",
          embedded ? "px-5 py-9 md:py-12" : "px-8 py-10"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={v}
      >
        <h3 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/85">
          {activeCopy.architectureTitle}
        </h3>
        <p className={cn("mt-5 text-left", serviceReading.body)}>
          <EmphasisText text={activeCopy.architectureBody} />
        </p>
      </motion.section>

      <motion.div
        className="mx-auto mt-14 flex flex-col items-center gap-4 md:mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={v}
      >
        <Button asChild size="lg">
          <Link href={activeCopy.ctaHref}>{activeCopy.cta}</Link>
        </Button>
        <Link href="/contact" className="text-[0.75rem] font-medium text-text-sub transition-colors hover:text-accent/90">
          お問い合わせはこちら
        </Link>
      </motion.div>

      {!embedded && <ServiceCrossLinks current="flow" />}
    </div>
  );
}
