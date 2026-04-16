"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  PageSectionWithScroll,
  StaggerGrid,
} from "@/components/layout/PageSectionWithScroll";
import { servicesCopy } from "@/lib/content/site-copy";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { writeServicesFlowPick } from "@/lib/chat/chat-auto-open";
import { getConciergeEntryPreset } from "@/lib/chat/concierge-entry-policy";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";
import { FlowTimelinePageContent } from "@/components/services/FlowTimelinePageContent";
import { cn } from "@/lib/utils";

const ConsultingDetailPageContent = dynamic(
  () =>
    import("@/components/services/ConsultingDetailPageContent").then(
      (mod) => mod.ConsultingDetailPageContent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="px-4 py-10 text-center text-sm text-text-sub">
        内容を読み込み中...
      </div>
    ),
  }
);

type ServiceDetailTab = "development" | "consulting";

const DETAIL_PANEL_ID = "services-detail-panel";

export function ServicesPageContent() {
  const { openConcierge } = useConciergeChat();
  const [activeDetail, setActiveDetail] =
    useState<ServiceDetailTab>("development");
  const developmentEntry = getConciergeEntryPreset("servicesDevelopmentCard");
  const consultingEntry = getConciergeEntryPreset("servicesConsultingCard");

  return (
    <PageSectionWithScroll
      title={servicesCopy.title}
      headingClassName="text-center"
    >
      <div className="mx-auto mb-10 flex max-w-xl flex-col items-center text-center md:mb-12">
        <p className="text-[0.9375rem] leading-relaxed text-text-sub md:text-[1rem]">
          AIコンシェルジュへの相談は、『チャットで相談する』から。
        </p>
      </div>
      <StaggerGrid
        cols="2"
        itemClassNameByIndex={{ 2: "sm:col-span-2" }}
        className="mx-auto w-full max-w-4xl"
      >
        <Card className="flex flex-col overflow-hidden border-silver/20 p-0 transition-colors hover:border-accent/50">
          <button
            type="button"
            className="flex flex-1 flex-col items-center px-6 py-6 text-center"
            onClick={() => {
              writeServicesFlowPick("development");
              recordVisitorEntryIntent("consult");
              openConcierge(
                developmentEntry.mode,
                developmentEntry.entrySource,
                developmentEntry.signals
              );
            }}
          >
            <h2 className="mb-2 font-semibold text-text">
              {servicesCopy.development.title}
            </h2>
            <p className="text-sm text-text-sub">
              {servicesCopy.development.desc}
            </p>
            <span className="mt-4 text-sm font-medium text-accent">
              チャットで相談する
            </span>
          </button>
        </Card>

        <Card className="flex flex-col overflow-hidden border-silver/20 p-0 transition-colors hover:border-accent/50">
          <button
            type="button"
            className="flex flex-1 flex-col items-center px-6 py-6 text-center"
            onClick={() => {
              writeServicesFlowPick("consulting");
              recordVisitorEntryIntent("consult");
              openConcierge(
                consultingEntry.mode,
                consultingEntry.entrySource,
                consultingEntry.signals
              );
            }}
          >
            <h2 className="mb-2 font-semibold text-text">
              {servicesCopy.consulting.title}
            </h2>
            <p className="text-sm text-text-sub">
              {servicesCopy.consulting.desc}
            </p>
            <span className="mt-4 text-sm font-medium text-accent">
              チャットで相談する
            </span>
          </button>
        </Card>

        <div className="scroll-mt-24 rounded-2xl bg-base-dark/25 p-5 sm:p-6 md:p-6">
            <nav
              role="tablist"
              aria-label="サービス詳細の切り替え"
              className="mb-5 flex flex-wrap gap-2 md:mb-6 md:justify-center"
            >
              <button
                type="button"
                id="services-tab-development"
                role="tab"
                aria-selected={activeDetail === "development"}
                aria-controls={DETAIL_PANEL_ID}
                tabIndex={activeDetail === "development" ? 0 : -1}
                className={cn(
                  "min-h-10 flex-1 rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-colors sm:flex-none md:text-[0.8125rem]",
                  activeDetail === "development"
                    ? "border-action/70 bg-action/15 text-action shadow-[0_0_16px_-4px_rgba(0,103,192,0.35)]"
                    : "border-silver/25 bg-base-dark/40 text-text/80 hover:border-action/35 hover:text-text"
                )}
                onClick={() => setActiveDetail("development")}
              >
                開発の流れ
              </button>
              <button
                type="button"
                id="services-tab-consulting"
                role="tab"
                aria-selected={activeDetail === "consulting"}
                aria-controls={DETAIL_PANEL_ID}
                tabIndex={activeDetail === "consulting" ? 0 : -1}
                className={cn(
                  "min-h-10 flex-1 rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-colors sm:flex-none md:text-[0.8125rem]",
                  activeDetail === "consulting"
                    ? "border-action/70 bg-action/15 text-action shadow-[0_0_16px_-4px_rgba(0,103,192,0.35)]"
                    : "border-silver/25 bg-base-dark/40 text-text/80 hover:border-action/35 hover:text-text"
                )}
                onClick={() => setActiveDetail("consulting")}
              >
                コンサルティング
              </button>
            </nav>

            <div
              id={DETAIL_PANEL_ID}
              role="tabpanel"
              aria-labelledby={
                activeDetail === "development"
                  ? "services-tab-development"
                  : "services-tab-consulting"
              }
              className="overflow-hidden rounded-xl bg-base-dark/20"
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
      </StaggerGrid>
    </PageSectionWithScroll>
  );
}
