"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import { flowDetailPageCopy } from "@/lib/content/site-copy";

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
      transition: { duration: 1.1, ease: EASE_MIST },
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
      <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/85 bg-base-dark/90 text-xs font-semibold tabular-nums text-accent shadow-[0_0_20px_-4px_rgba(0,242,255,0.5)] backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

function StepWatermarkMobile({ n }: { n: string }) {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 select-none text-[6rem] font-semibold tabular-nums leading-none text-text/[0.05]"
      aria-hidden
    >
      {n}
    </span>
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

export function FlowTimelinePageContent() {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);
  const { steps } = flowDetailPageCopy;

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32 lg:max-w-5xl lg:py-40">
      <motion.header
        className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={v}
      >
        <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
          {flowDetailPageCopy.lifecycleLabel}
        </p>
        <p className="mb-6 text-xs tracking-[0.25em] text-text/75">
          {flowDetailPageCopy.lifecycleSub}
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-accent md:text-5xl lg:text-[3.25rem] lg:leading-tight">
          {flowDetailPageCopy.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text/85 md:text-xl">
          {flowDetailPageCopy.purpose}
        </p>
      </motion.header>

      <motion.p
        className="mx-auto mb-20 max-w-2xl text-center text-sm leading-[2] text-text/85 md:mb-24 md:text-[1rem] md:leading-[2.05]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
      >
        {flowDetailPageCopy.intro}
      </motion.p>

      <div className="relative mx-auto max-w-2xl md:max-w-3xl">
        <div
          className="absolute bottom-0 left-8 top-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        />

        <ol className="relative m-0 list-none p-0">
          {steps.map((step, i) => (
            <motion.li
              key={step.step}
              className="relative pb-24 last:pb-12 md:pb-32 md:last:pb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={v}
              transition={{ delay: reduce ? 0 : 0.1 + i * 0.08 }}
            >
              {/* スマホ：左ガイド＋右本文（現状維持） */}
              <div className="relative pl-24 md:hidden">
                <div className="absolute left-8 top-0 z-[1] -translate-x-1/2">
                  <TimelineNode label={step.step} reduceMotion={!!reduce} />
                </div>
                <div className="relative min-w-0 pt-1">
                  <StepWatermarkMobile n={step.step} />
                  <div className="relative z-[1]">
                    <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent/75">
                      Step {step.step}
                    </p>
                    <h2 className="mb-6 text-lg font-semibold leading-snug text-text">
                      <span className="tracking-[0.12em]">{step.labelJa}</span>
                      <span className="mx-2 text-text/40">·</span>
                      <span className="text-[1rem] font-medium tracking-[0.22em] text-accent/95">
                        {step.labelEn}
                      </span>
                    </h2>
                    <p className="mb-8 text-sm leading-[2.05] text-text/90">
                      {step.body}
                    </p>
                    <div>
                      <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-text/55">
                        Deliverables
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
                  <p className="mb-10 max-w-2xl text-center text-[0.9375rem] leading-[2.1] text-text/90">
                    {step.body}
                  </p>
                  <div className="w-full max-w-2xl">
                    <p className="mb-4 text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-text/55">
                      Deliverables
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
        <p className="text-sm leading-[2] text-text/85 md:text-[1rem] md:leading-[2.05]">
          {flowDetailPageCopy.reassurance}
        </p>
      </motion.div>

      <motion.section
        className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-silver/20 bg-base-dark/35 px-8 py-10 text-center backdrop-blur-sm md:mt-20 md:px-12 md:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={v}
      >
        <h3 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/85">
          {flowDetailPageCopy.architectureTitle}
        </h3>
        <p className="mt-5 text-left text-sm leading-[2.05] text-text/90 md:text-[0.9375rem] md:leading-[2.1]">
          <EmphasisText text={flowDetailPageCopy.architectureBody} />
        </p>
      </motion.section>

      <motion.div
        className="mx-auto mt-14 flex justify-center md:mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={v}
      >
        <Button
          asChild
          size="lg"
          className="rounded-full px-10 shadow-[0_0_24px_-4px_rgba(0,242,255,0.45)]"
        >
          <Link href="/contact">{flowDetailPageCopy.cta}</Link>
        </Button>
      </motion.div>

      <ServiceCrossLinks current="flow" />
    </div>
  );
}
