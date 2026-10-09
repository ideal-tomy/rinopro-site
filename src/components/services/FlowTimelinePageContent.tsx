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
  servicesDevelopmentFaqCopy,
} from "@/lib/content/site-copy";
import {
  serviceReading,
  serviceShellInset,
} from "@/lib/ui/service-reading-styles";
import { ServicesDetailIntroImage } from "@/components/services/ServicesDetailIntroImage";
import { FlowStepMedia } from "@/components/services/FlowStepMedia";
import { servicesDevelopmentEmbeddedCopy } from "@/lib/content/services-embedded-copy";
import { cn } from "@/lib/utils";
import { useServiceTabs } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import enablementStyles from "./enablement-page.module.css";

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

export type FlowTimelinePageContentProps = {
  /** `/services` 埋め込み時: 余白・見出し階層・sticky・クロスリンクを調整 */
  embedded?: boolean;
  /** 半内製化ページ専用の表示調整。他の埋め込みには適用しない。 */
  enablement?: boolean;
  /** 概要ページ内統合時: ページ見出しを非表示 */
  hideHeader?: boolean;
  /** 概要ページ内統合時: トラック固定・タブ/全体図を非表示 */
  offeringEmbed?: { fixedTrack: FlowTrackKey };
};

export function FlowTimelinePageContent({
  embedded = false,
  enablement = false,
  hideHeader = false,
  offeringEmbed,
}: FlowTimelinePageContentProps) {
  const reduce = useReducedMotion();
  const { barRef, revealPanel } = useServiceTabs();
  const v = enablement
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : mistVariants(!!reduce);
  const StepHeading = enablement ? "p" : "h2";
  const mediaSizes = enablement
    ? "(max-width: 767px) calc(100vw - 40px), (max-width: 1375px) calc(50vw - 76px), 616px"
    : undefined;
  const [activeTrack, setActiveTrack] = useState<FlowTrackKey>(
    offeringEmbed?.fixedTrack ?? "common",
  );
  const track = offeringEmbed?.fixedTrack ?? activeTrack;
  const activeCopy = flowDetailPageCopyByTrack[track];
  const { steps } = activeCopy;
  const idSuffix = useId().replace(/:/g, "");
  const flowPanelId = embedded
    ? `flow-track-panel-${idSuffix}`
    : "flow-track-panel";
  const tabId = (key: FlowTrackKey) =>
    embedded ? `flow-tab-${key}-${idSuffix}` : `flow-tab-${key}`;

  return (
    <div
      className={cn(
        "mx-auto max-w-3xl md:px-10 lg:max-w-5xl",
        embedded
          ? cn(
              serviceShellInset.embeddedX,
              !offeringEmbed && serviceShellInset.embeddedY,
            )
          : "px-6 py-24 md:py-32 lg:py-40",
      )}
    >
      {embedded && !hideHeader ? (
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
          <h2 className="mb-0 text-3xl font-semibold tracking-tight text-accent sm:text-4xl md:text-[2.25rem] md:leading-tight">
            開発について
          </h2>
          <p
            className={cn(
              "mx-auto mt-5 max-w-[48ch] text-center",
              serviceReading.body,
            )}
          >
            {servicesDevelopmentEmbeddedCopy.lead}
          </p>
        </motion.header>
      ) : null}

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

      {!offeringEmbed ? (
        <nav
          ref={enablement ? barRef : undefined}
          className={cn(
            enablement && navigation.stickyTabs,
            "border-b border-[var(--color-border-light)] bg-[var(--color-bg-pure)]/95 py-3 md:backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-bg-pure)]/80",
            embedded
              ? "relative z-20 -mx-0 mb-8 md:-mx-2 md:mb-10"
              : "relative -mx-6 mb-10 z-30 md:sticky md:top-16 md:-mx-10 md:mb-12",
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
                const selected = track === key;
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
                        : "border-[var(--color-border-light)] bg-[var(--color-bg-base)] text-text/80 hover:border-action/35 hover:text-text",
                    )}
                    onClick={() => {
                      setActiveTrack(key);
                      if (enablement) revealPanel(flowPanelId);
                    }}
                    onKeyDown={(event) => {
                      if (!enablement) return;
                      const offset =
                        event.key === "ArrowRight"
                          ? 1
                          : event.key === "ArrowLeft"
                            ? -1
                            : 0;
                      if (
                        !offset &&
                        event.key !== "Home" &&
                        event.key !== "End"
                      )
                        return;
                      event.preventDefault();
                      const index =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? FLOW_TRACK_ORDER.length - 1
                            : (FLOW_TRACK_ORDER.indexOf(key) +
                                offset +
                                FLOW_TRACK_ORDER.length) %
                              FLOW_TRACK_ORDER.length;
                      const next = FLOW_TRACK_ORDER[index];
                      setActiveTrack(next);
                      document
                        .getElementById(tabId(next))
                        ?.focus({ preventScroll: true });
                      revealPanel(flowPanelId);
                    }}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      ) : null}

      {!offeringEmbed && !enablement ? (
        <ServicesDetailIntroImage
          highlight="development"
          className={cn("mb-8 md:mb-10", embedded ? "max-w-4xl" : "max-w-2xl")}
        />
      ) : null}

      <div
        id={enablement ? flowPanelId : undefined}
        role={enablement ? "tabpanel" : undefined}
        tabIndex={enablement ? 0 : undefined}
        aria-labelledby={enablement ? tabId(track) : undefined}
      >
        <motion.div
          id={enablement ? undefined : flowPanelId}
          role={enablement ? undefined : "tabpanel"}
          aria-labelledby={enablement ? undefined : tabId(track)}
          className="mx-auto mb-12 max-w-2xl md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={v}
        >
          <p
            className={cn(
              embedded ? "text-left" : "text-center",
              embedded ? serviceReading.body : serviceReading.bodyCenter,
            )}
          >
            <EmphasisText text={activeCopy.intro} />
          </p>
        </motion.div>

        <div
          className={cn(
            "relative mx-auto",
            embedded ? "max-w-4xl md:max-w-5xl" : "max-w-2xl md:max-w-3xl",
          )}
        >
          {!embedded && (
            <div
              className="absolute bottom-0 left-8 top-0 hidden w-px bg-gradient-to-b from-transparent via-[var(--color-accent-primary)]/35 to-transparent md:left-1/2 md:block md:-translate-x-1/2"
              aria-hidden
            />
          )}

          <ol className="relative m-0 list-none p-0">
            {steps.map((step, i) => (
              <motion.li
                key={`${track}-${step.step}`}
                className={cn(
                  "relative",
                  embedded
                    ? "pb-12 last:pb-6 md:pb-20 md:last:pb-10"
                    : "pb-20 last:pb-10 md:pb-32 md:last:pb-16",
                )}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={v}
                transition={{ delay: reduce ? 0 : 0.1 + i * 0.08 }}
              >
                {embedded ? (
                  <>
                    <div className="relative mx-auto w-full md:hidden">
                      <div className="relative z-[1] flex flex-col items-start pt-1 text-left">
                        <StepHeading className="mb-1.5 text-[1.125rem] font-semibold leading-snug text-text">
                          {step.labelJa}
                        </StepHeading>
                        <p
                          className={cn(
                            "mb-8 w-full max-w-prose",
                            serviceReading.body,
                          )}
                        >
                          {step.body}
                        </p>
                        <FlowStepMedia
                          sizes={mediaSizes}
                          track={track}
                          step={step.step}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="relative hidden md:grid md:grid-cols-2 md:items-center md:gap-10 md:px-2">
                      <div
                        className={cn(
                          "relative z-[1] text-left",
                          i % 2 === 1 ? "md:order-2" : "md:order-1",
                        )}
                      >
                        <StepHeading className={cn("mb-2 text-xl font-semibold leading-snug text-text md:text-[52px] md:font-bold md:leading-[1.15]", enablement && enablementStyles.stepTitle)}>
                          <span>{step.labelJa}</span>
                        </StepHeading>
                        <p
                          className={cn(
                            "mb-6 max-w-prose",
                            serviceReading.body,
                            "md:text-[20px]",
                            enablement && enablementStyles.stepBody,
                          )}
                        >
                          {step.body}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "relative z-[1]",
                          i % 2 === 1 ? "md:order-1" : "md:order-2",
                        )}
                      >
                        <FlowStepMedia
                          track={track}
                          step={step.step}
                          sizes={mediaSizes}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* スマホ: 縦積み1カラム（読み幅優先。旧左ガイドは撤去） */}
                    <div className="relative mx-auto w-full md:hidden">
                      <div className="relative z-[1] flex flex-col items-start pt-1 text-left">
                        <h2 className="mb-1.5 max-w-[22rem] text-[1.125rem] font-semibold leading-snug tracking-[0.06em] text-text">
                          {step.labelJa}
                        </h2>
                        <p
                          className={cn(
                            "mb-8 w-full max-w-prose text-left",
                            serviceReading.body,
                          )}
                        >
                          {step.body}
                        </p>
                      </div>
                    </div>

                    {/* PC：見出しと本文を中央に配置 */}
                    <div className="relative hidden md:block md:px-6">
                      <div className="relative z-[1] flex flex-col items-center pb-2 pt-2">
                        <h2 className="mb-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xl font-semibold leading-snug text-text">
                          <span className="tracking-[0.14em]">
                            {step.labelJa}
                          </span>
                        </h2>
                        <p className="mb-10 max-w-2xl text-center text-[1rem] leading-[2.05] text-text/90">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </ol>
        </div>

        {(!enablement || track !== "app") && (
          <>
            <motion.div
              className={cn(
                "mx-auto max-w-2xl text-center",
                embedded ? "mt-16 md:mt-20" : "mt-28 md:mt-36",
              )}
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
                "relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-center md:backdrop-blur-sm md:mt-20 md:px-12 md:py-12",
                embedded ? "px-5 py-9 md:py-12" : "px-8 py-10",
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
          </>
        )}
      </div>
      {!enablement && (
        <>
          <motion.section
            className={cn(
              "relative mx-auto mt-16 max-w-3xl md:mt-20 md:max-w-4xl",
              embedded ? "px-5" : "px-6",
            )}
            aria-labelledby="services-development-faq-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={v}
          >
            <h3
              id="services-development-faq-heading"
              className="text-center text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/85"
            >
              {servicesDevelopmentFaqCopy.kicker}
            </h3>
            <p className="mt-4 text-center text-xl font-semibold leading-snug text-text md:text-2xl">
              {servicesDevelopmentFaqCopy.heading}
            </p>
            <p
              className={cn(
                "mx-auto mt-5 max-w-2xl text-center",
                serviceReading.bodyCenter,
              )}
            >
              {servicesDevelopmentFaqCopy.intro}
            </p>
            <dl className="mt-10 space-y-8 border-t border-[var(--color-border-light)] pt-10 md:mt-12 md:space-y-10 md:pt-12">
              {servicesDevelopmentFaqCopy.items.map((item) => (
                <div key={item.q}>
                  <dt className="text-[1rem] font-semibold leading-snug text-text">
                    {item.q}
                  </dt>
                  <dd
                    className={cn(
                      "mt-3 text-[1rem] leading-[2.05] text-text/90",
                      serviceReading.body,
                    )}
                  >
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
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
            <Link
              href="/contact"
              className="text-[0.75rem] font-medium text-text-sub transition-colors hover:text-accent/90"
            >
              お問い合わせはこちら
            </Link>
          </motion.div>
        </>
      )}
      {!embedded && <ServiceCrossLinks current="insourcing" />}
    </div>
  );
}
