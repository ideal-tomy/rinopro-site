import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CasesPageContent } from "@/components/cases/CasesPageContent";
import { fetchCaseStudies } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "開発事例紹介 | rinopro",
  description: "業界別の導入実績と、現場での活用シーン。",
};

export default async function CasesPage() {
  const cases = await fetchCaseStudies();

  return (
    <PageShell>
      <CasesPageContent cases={cases} />
    </PageShell>
  );
}
