import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchCaseStudies, fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験・ツールdemo | rinopro",
  description:
    "注目のインタラクティブ体験から、モックdemoカタログ・業種マトリクスまで。導入後の操作イメージをこのページからたどれます。",
};

export default async function DemoPage() {
  const [demos, caseStudies] = await Promise.all([
    fetchDemosForDisplay(),
    fetchCaseStudies(),
  ]);

  return (
    <PageShell>
      <DemoPageContent demos={demos} caseStudies={caseStudies} />
    </PageShell>
  );
}
