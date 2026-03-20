import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingPageContent } from "@/components/services/ConsultingPageContent";

export const metadata: Metadata = {
  title: "コンサルティング | rinopro",
  description:
    "業務診断、優先順位設計、PoC設計、定着支援。検証可能な範囲で、過剰提案しない。",
};

export default function ConsultingPage() {
  return (
    <PageShell>
      <ConsultingPageContent />
    </PageShell>
  );
}
