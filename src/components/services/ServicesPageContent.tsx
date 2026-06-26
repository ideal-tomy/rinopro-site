"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageSectionWithScroll } from "@/components/layout/PageSectionWithScroll";
import { servicesCopy } from "@/lib/content/site-copy";
import { FlowTimelinePageContent } from "@/components/services/FlowTimelinePageContent";
import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";
import { ServiceValueBand } from "@/components/services/ServiceValueBand";
import { cn } from "@/lib/utils";

type ServiceDetailTab = "development" | "consulting";

const DETAIL_PANEL_ID = "services-detail-panel";

export function ServicesPageContent() {
  const [activeDetail, setActiveDetail] =
    useState<ServiceDetailTab>("development");

  return (
    <PageSectionWithScroll
      title={servicesCopy.title}
      headingClassName="text-center"
    >
      <p className="mx-auto mb-10 max-w-2xl text-center text-[16px] leading-[1.8] text-text-sub md:mb-12 md:text-[17px]">
        {servicesCopy.purpose}
      </p>

      <div className="mx-auto w-full max-w-4xl scroll-mt-24 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 sm:p-6 md:p-6">
        <nav
          role="tablist"
          aria-label="サービス詳細の切り替え"
          className="mb-5 flex flex-wrap gap-2 md:mb-6 md:justify-center"
        >
          <button
            type="button"
            id="services-tab-consulting"
            role="tab"
            aria-selected={activeDetail === "consulting"}
            aria-controls={DETAIL_PANEL_ID}
            tabIndex={activeDetail === "consulting" ? 0 : -1}
            className={cn(
              "clickable-element min-h-10 flex-1 rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-[color,background-color,border-color,transform,opacity] sm:flex-none md:text-[0.8125rem]",
              activeDetail === "consulting"
                ? "border-action/70 bg-action/15 text-action shadow-[0_0_16px_-4px_rgba(0,103,192,0.35)]"
                : "border-[var(--color-border-light)] bg-[var(--color-bg-base)] text-text/80 hover:border-action/35 hover:text-text"
            )}
            onClick={() => setActiveDetail("consulting")}
          >
            コンサルティング
          </button>
          <button
            type="button"
            id="services-tab-development"
            role="tab"
            aria-selected={activeDetail === "development"}
            aria-controls={DETAIL_PANEL_ID}
            tabIndex={activeDetail === "development" ? 0 : -1}
            className={cn(
              "clickable-element min-h-10 flex-1 rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-[color,background-color,border-color,transform,opacity] sm:flex-none md:text-[0.8125rem]",
              activeDetail === "development"
                ? "border-action/70 bg-action/15 text-action shadow-[0_0_16px_-4px_rgba(0,103,192,0.35)]"
                : "border-[var(--color-border-light)] bg-[var(--color-bg-base)] text-text/80 hover:border-action/35 hover:text-text"
            )}
            onClick={() => setActiveDetail("development")}
          >
            開発の流れ
          </button>
        </nav>

        <ServiceValueBand className="mb-6 md:mb-8" />

        <div
          id={DETAIL_PANEL_ID}
          role="tabpanel"
          aria-labelledby={
            activeDetail === "development"
              ? "services-tab-development"
              : "services-tab-consulting"
          }
          className="overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-base)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeDetail === "development" ? (
              <motion.div
                key="development"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FlowTimelinePageContent embedded />
              </motion.div>
            ) : (
              <motion.div
                key="consulting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ConsultingDetailPageContent embedded />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageSectionWithScroll>
  );
}
