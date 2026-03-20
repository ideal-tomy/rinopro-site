import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";

export const metadata: Metadata = {
  title: "サービス | rinopro",
  description:
    "開発とコンサルティング。プロセスを透明にし、判断の根拠を共有。段階的な検証で進めます。",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesPageContent />
    </PageShell>
  );
}
