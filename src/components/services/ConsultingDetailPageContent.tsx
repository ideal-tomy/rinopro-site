"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import { ServiceConsultingBlocks } from "@/components/services/ServiceConsultingBlocks";
import { ServicesDetailIntroImage } from "@/components/services/ServicesDetailIntroImage";
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
      visible: { opacity: 1, transition: { duration: 0.25 } },
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

export type ConsultingDetailPageContentProps = {
  /** `/services` 埋め込み時: 余白・見出し階層・クロスリンクを調整 */
  embedded?: boolean;
};

export function ConsultingDetailPageContent({
  embedded = false,
}: ConsultingDetailPageContentProps) {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);

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
          embedded ? "mb-8 md:mb-10" : "mb-12 md:mb-16"
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
          <h2 className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl md:text-[2.25rem] md:leading-tight">
            {consultingDetailPageCopy.title}
          </h2>
        ) : (
          <h1 className="text-4xl font-semibold tracking-tight text-accent md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {consultingDetailPageCopy.title}
          </h1>
        )}
      </motion.header>

      <ServicesDetailIntroImage
        highlight="consulting"
        className={cn(
          "mb-8 md:mb-10",
          embedded ? "max-w-4xl" : "max-w-2xl"
        )}
      />

      <ServiceConsultingBlocks />

      <motion.footer
        className={cn(
          "mx-auto flex max-w-2xl flex-col items-center gap-8 text-center",
          embedded ? "mt-12 md:mt-16" : "mt-20 md:mt-28"
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
