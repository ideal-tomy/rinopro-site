"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import { consultingDetailPageCopy } from "@/lib/content/site-copy";
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
      transition: { duration: 0.82, ease: EASE_MIST },
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

export type ConsultingDetailPageContentProps = {
  /** `/services` 埋め込み時: 余白・見出し階層・クロスリンクを調整 */
  embedded?: boolean;
};

export function ConsultingDetailPageContent({
  embedded = false,
}: ConsultingDetailPageContentProps) {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);
  const { sections } = consultingDetailPageCopy;

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl md:px-10",
        embedded
          ? cn(serviceShellInset.embeddedX, serviceShellInset.embeddedY)
          : "px-6 py-24 md:py-32 lg:py-40"
      )}
    >
      <motion.header
        className={cn(
          "mx-auto max-w-3xl text-center",
          embedded ? "mb-10 md:mb-12" : "mb-12 md:mb-20"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={v}
      >
        <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
          Consulting
        </p>
        {embedded ? (
          <h2 className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {consultingDetailPageCopy.title}
          </h2>
        ) : (
          <h1 className="text-4xl font-semibold tracking-tight text-accent md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {consultingDetailPageCopy.title}
          </h1>
        )}
      </motion.header>

      <div
        className={cn(
          "mx-auto flex max-w-4xl flex-col",
          embedded ? "gap-14 md:gap-24 lg:gap-28" : "gap-20 md:gap-28 lg:gap-32"
        )}
      >
        {sections.map((section, i) => (
          <motion.article
            key={section.kicker}
            className={cn(
              "relative overflow-hidden rounded-2xl text-text md:backdrop-blur-sm transition-[background-color,border-color] duration-500 md:px-12 md:py-14",
              embedded
                ? "border-0 bg-transparent px-5 py-8 shadow-none md:px-8"
                : "border border-silver/15 bg-base-dark/40 px-8 py-12 shadow-none"
            )}
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
              <h2
                className={cn(
                  "font-semibold leading-snug tracking-[0.18em] text-text md:text-2xl md:tracking-[0.22em]",
                  embedded ? "mb-6 text-lg md:mb-8" : "mb-8 text-xl"
                )}
              >
                {section.heading}
              </h2>
              <p className={cn("text-left", serviceReading.body)}>
                {section.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.footer
        className={cn(
          "mx-auto flex max-w-2xl flex-col items-center gap-10 text-center",
          embedded ? "mt-16 md:mt-24" : "mt-24 md:mt-32"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={v}
        transition={{ delay: reduce ? 0 : 0.06 }}
      >
        <p className={cn(serviceReading.bodyCenter)}>
          {consultingDetailPageCopy.reassurance}
        </p>
        <Button asChild size="lg">
          <Link href="/contact">{consultingDetailPageCopy.cta}</Link>
        </Button>
      </motion.footer>

      {!embedded && <ServiceCrossLinks current="consulting" />}
    </div>
  );
}
