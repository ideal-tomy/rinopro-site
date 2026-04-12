import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { EstimateDetailedProcessingContent } from "@/components/estimate/EstimateDetailedProcessingContent";

export const metadata: Metadata = {
  title: "内容を整理しています | 詳細見積もり | Axeon",
  robots: { index: false, follow: false },
};

export default function EstimateDetailedProcessingPage() {
  return (
    <PageShell>
      <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <EstimateDetailedProcessingContent />
      </div>
    </PageShell>
  );
}
