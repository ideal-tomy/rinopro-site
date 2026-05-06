import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";
import { LegacyOfferingNotice } from "@/components/services/LegacyOfferingNotice";
import { consultingCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "コンサルティング | AXEON",
  description: consultingCopy.purpose,
};

export default function ServicesConsultingPage() {
  return (
    <PageShell>
      <LegacyOfferingNotice href="/services/dx-strategy">
        DX戦略設計の全体像・論点整理は、新しいサービス概要ページにまとめています。
      </LegacyOfferingNotice>
      <ConsultingDetailPageContent />
    </PageShell>
  );
}
