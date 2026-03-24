import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { EstimateDetailedAmountContent } from "@/components/estimate/EstimateDetailedAmountContent";

export const metadata: Metadata = {
  title: "金額の目安 | 詳細見積もり | rinopro",
  robots: { index: false, follow: false },
};

export default function EstimateDetailedAmountPage() {
  return (
    <PageShell>
      <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <EstimateDetailedAmountContent />
      </div>
    </PageShell>
  );
}
