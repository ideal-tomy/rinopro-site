"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  PageSectionWithScroll,
  StaggerGrid,
} from "@/components/layout/PageSectionWithScroll";
import { servicesCopy } from "@/lib/content/site-copy";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { writeServicesFlowPick } from "@/lib/chat/chat-auto-open";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

export function ServicesPageContent() {
  const { openConcierge } = useConciergeChat();

  return (
    <PageSectionWithScroll
      title={servicesCopy.title}
      cta={{ href: "/contact", label: servicesCopy.cta }}
    >
      <p className="mb-8 max-w-2xl text-text-sub">
        {servicesCopy.purpose}
      </p>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-text-sub/85">
        読みながら確認したい場合は詳細ページへ、迷いがある場合は各カードの「チャットで相談する」から入れます。
      </p>
      <StaggerGrid cols="2">
        <Card className="flex flex-col overflow-hidden border-silver/20 p-0 transition-colors hover:border-accent/50">
          <button
            type="button"
            className="flex flex-1 flex-col px-6 py-6 text-left"
            onClick={() => {
              writeServicesFlowPick("development");
              recordVisitorEntryIntent("consult");
              openConcierge("development", "services-card-development", {
                entryIntent: "consult",
              });
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
          <div className="border-t border-silver/20 px-6 py-3">
            <Link
              href={servicesCopy.development.href}
              className="text-sm text-text-sub underline-offset-4 hover:text-accent hover:underline"
            >
              開発の流れの詳細を見る
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden border-silver/20 p-0 transition-colors hover:border-accent/50">
          <button
            type="button"
            className="flex flex-1 flex-col px-6 py-6 text-left"
            onClick={() => {
              writeServicesFlowPick("consulting");
              recordVisitorEntryIntent("consult");
              openConcierge("consulting", "services-card-consulting", {
                entryIntent: "consult",
              });
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
          <div className="border-t border-silver/20 px-6 py-3">
            <Link
              href={servicesCopy.consulting.href}
              className="text-sm text-text-sub underline-offset-4 hover:text-accent hover:underline"
            >
              コンサル内容の詳細を見る
            </Link>
          </div>
        </Card>
      </StaggerGrid>
    </PageSectionWithScroll>
  );
}
