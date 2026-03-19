import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { CaseCard } from "@/components/cases/CaseCard";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchCaseStudies } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "開発事例紹介 | rinopro",
  description: "業界別の導入実績と、現場での活用シーン。",
};

export default async function CasesPage() {
  const cases = await fetchCaseStudies();

  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          業界別の導入実績と、現場での活用シーン。
        </h1>
        <div className="mb-12 flex flex-col gap-6">
          {cases.length > 0 ? (
            cases.map((c) => <CaseCard key={c._id} caseStudy={c} />)
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <SkeletonShimmer key={i} className="h-24 rounded-xl" />
              ))}
            </>
          )}
        </div>
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </section>
    </PageShell>
  );
}
