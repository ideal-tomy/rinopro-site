import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";

export const metadata: Metadata = {
  title: "ご支援内容",
  description:
    "コンサルと半内製化。課題の整理から実装・社内への移管まで、必要な範囲を同じチームで進めます。",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesPageContent />
    </PageShell>
  );
}
