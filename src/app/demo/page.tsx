import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { DemoCard } from "@/components/demo/DemoCard";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchDemoItems } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "ツールdemo一覧 | rinopro",
  description: "実際に触って、導入後の業務変化を体感してください。",
};

export default async function DemoPage() {
  const demos = await fetchDemoItems();

  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          実際に触って、導入後の業務変化を体感してください。
        </h1>
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demos.length > 0 ? (
            demos.map((demo) => <DemoCard key={demo._id} demo={demo} />)
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <SkeletonShimmer key={i} className="h-48 rounded-xl" />
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
