import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";
import { consultingCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "コンサルティング | AXEON",
  description: consultingCopy.purpose,
};

export default function ServicesConsultingPage() {
  return (
    <PageShell>
      <ConsultingDetailPageContent />
    </PageShell>
  );
}
