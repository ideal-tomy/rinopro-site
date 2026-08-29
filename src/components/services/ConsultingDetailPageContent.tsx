"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceCrossLinks } from "@/components/layout/CrossServiceNav";
import { ServiceConsultingBlocks } from "@/components/services/ServiceConsultingBlocks";
import { ServicesDetailIntroImage } from "@/components/services/ServicesDetailIntroImage";
import { consultingDetailPageCopy } from "@/lib/content/site-copy";
import { INDUSTRY_SHOWCASE_ITEMS } from "@/lib/content/industry-showcase";
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
  /** 概要ページ内統合時: ページ見出しを非表示 */
  hideHeader?: boolean;
  /** 概要ページ内統合時: 全体図・重複ブロック・footer CTA を非表示 */
  offeringEmbed?: boolean;
};

export function ConsultingDetailPageContent({
  embedded = false,
  hideHeader = false,
  offeringEmbed = false,
}: ConsultingDetailPageContentProps) {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl md:px-10",
        embedded
          ? cn(
              serviceShellInset.embeddedX,
              !offeringEmbed && serviceShellInset.embeddedY
            )
          : "px-6 py-24 md:py-32 lg:py-40"
      )}
    >
      {!hideHeader ? (
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
      ) : null}

      {!offeringEmbed ? (
      <ServicesDetailIntroImage
        highlight="consulting"
        className={cn(
          "mb-8 md:mb-10",
          embedded ? "max-w-4xl" : "max-w-2xl"
        )}
      />
      ) : null}

      <ServiceConsultingBlocks variant={offeringEmbed ? "offering" : "full"} />

      {!offeringEmbed ? (
        <motion.section
          id="industry"
          className="mt-14 md:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={v}
        >
          <header className="mb-6 text-center md:mb-8">
            <p className="mb-2 text-[13px] font-medium tracking-[0.12em] text-accent md:text-[14px]">
              業種
            </p>
            <h2 className="text-balance text-xl font-semibold leading-snug text-text md:text-2xl">
              業界特有の前提から設計する
            </h2>
            <p className={cn("mx-auto mt-4 max-w-2xl", serviceReading.bodyCenter)}>
              同じ「チャットボット」でも、医療・建設・士業では守るべき境界が違います。現場の制約を先に固定したうえで、各業界ページから事例とデモへ進めます。
            </p>
          </header>
          <ul className="grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {INDUSTRY_SHOWCASE_ITEMS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.hubPath}
                  className="group interactive-card flex h-full flex-col rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 transition-colors hover:border-[var(--color-accent-primary)] md:p-6"
                >
                  <span className="text-[15px] font-semibold text-[var(--color-accent-primary)] md:text-[16px]">
                    {item.label}
                  </span>
                  <span className="mt-2 text-[15px] leading-[1.75] text-text-sub md:text-[16px]">
                    {item.tagline}
                  </span>
                  <span className="mt-4 text-[14px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 group-hover:underline">
                    業界ページへ
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      ) : null}

      {!offeringEmbed ? (
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
      ) : null}

      {!embedded && <ServiceCrossLinks current="consulting" />}
    </div>
  );
}
