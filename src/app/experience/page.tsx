import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ExperiencePageContent } from "@/components/experience/ExperiencePageContent";
import { fetchCaseStudies } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験 | rinopro",
  description:
    "アプリやダッシュボードに近い画面で、使うイメージを掴めます。ツールdemoとあわせて技術の感触を確認してください。",
};

export default async function ExperiencePage() {
  const items = await fetchCaseStudies();

  return (
    <PageShell>
      <ExperiencePageContent items={items} />
    </PageShell>
  );
}
