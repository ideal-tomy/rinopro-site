import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";
import { consultingDetailPageCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "コンサルティング | Axeon",
  description: consultingDetailPageCopy.purpose,
};

export default function ConsultingDetailPage() {
  return (
    <PageShell>
      <ConsultingDetailPageContent />
    </PageShell>
  );
}
