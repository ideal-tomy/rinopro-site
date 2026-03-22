import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { FlowTimelinePageContent } from "@/components/services/FlowTimelinePageContent";
import { flowDetailPageCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "開発の流れ | rinopro",
  description: flowDetailPageCopy.purpose,
};

export default function FlowDetailPage() {
  return (
    <PageShell>
      <FlowTimelinePageContent />
    </PageShell>
  );
}
