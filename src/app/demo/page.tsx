import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "ツールdemo一覧 | rinopro",
  description: "実際に触って、導入後の業務変化を体感してください。",
};

export default async function DemoPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <DemoPageContent demos={demos} />
    </PageShell>
  );
}
