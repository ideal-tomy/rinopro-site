import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DevelopmentPageContent } from "@/components/services/DevelopmentPageContent";

export const metadata: Metadata = {
  title: "開発の流れ | rinopro",
  description:
    "現状整理から要件化、試作・現場検証を経て本実装まで。段階的な検証でリスクを抑えます。",
};

export default function DevelopmentPage() {
  return (
    <PageShell>
      <DevelopmentPageContent />
    </PageShell>
  );
}
