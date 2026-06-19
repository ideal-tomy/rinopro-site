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

function parseBulletLines(body: string): string[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("・"))
    .map((line) => line.replace(/^・/, "").trim());
}

function parseFaqLines(body: string): Array<{ q: string; a: string }> {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items: Array<{ q: string; a: string }> = [];
  for (let i = 0; i < lines.length; i += 1) {
    const qLine = lines[i];
    const aLine = lines[i + 1];
    if (!qLine?.startsWith("Q.") || !aLine?.startsWith("A.")) continue;
    items.push({
      q: qLine.replace(/^Q\.\s*/, "").trim(),
      a: aLine.replace(/^A\.\s*/, "").trim(),
    });
    i += 1;
  }
  return items;
}

function renderSectionBody(kicker: string, body: string) {
  const isBulletVisual =
    kicker.startsWith("セクション1") || kicker.startsWith("セクション6");
  const isFaq = kicker.startsWith("セクション8");

  if (isBulletVisual) {
    const bulletLines = parseBulletLines(body);
    const noteLine = body
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("※"));

    return (
      <div className="mx-auto max-w-3xl">
        <ul className="grid list-none gap-3 md:grid-cols-2 md:gap-4">
          {bulletLines.map((line) => (
            <li
              key={line}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-3 text-left text-[15px] leading-[1.75] text-[var(--color-text-secondary)] md:px-5 md:py-4 md:text-[16px]"
            >
              <span className="inline-flex items-start gap-2">
                <span
                  className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
                  aria-hidden
                />
                <span>{line}</span>
              </span>
            </li>
          ))}
        </ul>
        {noteLine ? (
          <p className="mt-4 text-left text-[14px] leading-[1.8] text-[var(--color-text-tertiary)] md:text-[15px]">
            {noteLine}
          </p>
        ) : null}
      </div>
    );
  }

  if (isFaq) {
    const qaItems = parseFaqLines(body);
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        {qaItems.map((item) => (
          <article
            key={item.q}
            className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 text-left md:px-6 md:py-5"
          >
            <p className="text-[16px] font-semibold leading-[1.65] text-[var(--color-text-primary)]">
              Q. {item.q}
            </p>
            <p className="mt-2 text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
              A. {item.a}
            </p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <p className={cn("whitespace-pre-line text-left", serviceReading.body)}>
      {body}
    </p>
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
          <div key={section.kicker} className="space-y-8 md:space-y-10">
            <motion.article
              className={cn(
                "relative overflow-hidden rounded-2xl text-text md:backdrop-blur-sm transition-[background-color,border-color] duration-500 md:px-12 md:py-14",
                embedded
                  ? "border-0 bg-transparent px-5 py-8 shadow-none md:px-8"
                  : "border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-8 py-12 shadow-none"
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
                    "font-semibold leading-snug tracking-tight text-text md:text-2xl",
                    embedded ? "mb-6 text-lg md:mb-8" : "mb-8 text-xl"
                  )}
                >
                  {section.heading}
                </h2>
                {renderSectionBody(section.kicker, section.body)}
              </div>
            </motion.article>
            {!embedded && i === 3 ? (
              <motion.aside
                className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-6 py-7 text-center md:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={v}
              >
                <p className="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
                  ここまで読んで「自社に当てはめて整理したい」と感じたら、状況を短く共有ください。
                </p>
                <Button asChild className="mt-5" size="sm">
                  <Link href="/contact">{consultingDetailPageCopy.cta}</Link>
                </Button>
              </motion.aside>
            ) : null}
          </div>
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
