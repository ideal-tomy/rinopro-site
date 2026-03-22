"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import { consultingDetailPageCopy } from "@/lib/content/site-copy";

const EASE_MIST = [0.22, 1, 0.36, 1] as const;

function mistVariants(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.25 },
      },
    };
  }
  return {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.05, ease: EASE_MIST },
    },
  };
}

function SectionWatermark({ n }: { n: string }) {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-semibold tabular-nums tracking-tight text-text/[0.055] max-[480px]:text-[5.5rem] max-[480px]:leading-none sm:text-[7rem] md:left-[58%] md:top-1/2 md:text-[min(22vw,11rem)] lg:text-[min(18vw,12.5rem)]"
      aria-hidden
    >
      {n}
    </span>
  );
}

export function ConsultingDetailPageContent() {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);
  const { sections } = consultingDetailPageCopy;

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32 lg:py-40">
      <motion.header
        className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={v}
      >
        <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
          Consulting
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-accent md:text-5xl lg:text-[3.25rem] lg:leading-tight">
          {consultingDetailPageCopy.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text/90 md:text-xl">
          {consultingDetailPageCopy.purpose}
        </p>
      </motion.header>

      <motion.p
        className="mx-auto mb-20 max-w-xl text-center text-sm leading-relaxed text-text md:mb-24 md:text-[1rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
        transition={{ delay: reduce ? 0 : 0.06 }}
      >
        {consultingDetailPageCopy.intro}
      </motion.p>

      <div className="mx-auto flex max-w-4xl flex-col gap-20 md:gap-28 lg:gap-32">
        {sections.map((section, i) => (
          <motion.article
            key={section.kicker}
            className="relative overflow-hidden rounded-2xl border border-accent/30 bg-base-dark/45 px-8 py-12 text-text shadow-[0_0_0_1px_rgba(0,242,255,0.08),0_0_48px_-16px_rgba(0,242,255,0.22),inset_0_1px_0_0_rgba(0,242,255,0.06)] backdrop-blur-sm transition-[border-color,box-shadow] duration-500 md:px-12 md:py-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={v}
            transition={{ delay: reduce ? 0 : 0.08 + i * 0.06 }}
          >
            <SectionWatermark n={String(i + 1).padStart(2, "0")} />
            <div className="relative z-[1] mx-auto max-w-2xl text-center md:max-w-none">
              <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent/90 md:text-[0.7rem]">
                {section.kicker}
              </p>
              <h2 className="mb-8 text-xl font-semibold leading-snug tracking-[0.18em] text-text md:text-2xl md:tracking-[0.22em]">
                {section.heading}
              </h2>
              <p className="text-left text-sm leading-[2.05] text-text md:text-[1rem] md:leading-[2.1]">
                {section.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.footer
        className="mx-auto mt-24 flex max-w-2xl flex-col items-center gap-10 text-center md:mt-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
        transition={{ delay: reduce ? 0 : 0.06 }}
      >
        <p className="text-sm leading-[1.95] text-text md:text-[1rem] md:leading-[2]">
          {consultingDetailPageCopy.reassurance}
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full px-10 shadow-[0_0_24px_-4px_rgba(0,242,255,0.45)]"
        >
          <Link href="/contact">{consultingDetailPageCopy.cta}</Link>
        </Button>
      </motion.footer>

      <ServiceCrossLinks current="consulting" />
    </div>
  );
}
