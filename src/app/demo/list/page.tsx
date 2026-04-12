import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";
import { DemoListContent } from "@/components/demo/DemoListContent";
import { DemoListConciergeUrlSync } from "@/components/demo/DemoListConciergeUrlSync";

export const metadata: Metadata = {
  title: "demo一覧・比較 | Axeon",
  description:
    "業種や用途を横断して demo を比較できる一覧ページです。迷う場合はコンシェルジュで絞り込めます。",
};

export default async function DemoListPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-accent md:text-3xl">
            demo一覧・比較
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            ここでは業種や用途を横断して比べられます。まずはカテゴリから見て、迷う場合だけコンシェルジュで絞り込んでください。
          </p>
          <Link
            href="/demo"
            className="mt-5 inline-block text-sm text-text-sub transition-colors hover:text-accent"
          >
            ← 体験ハブに戻る
          </Link>
        </header>

        <div className="py-10 md:py-14">
          <PageSectionDivider variant="inset" />
        </div>

        <Suspense fallback={null}>
          <DemoListConciergeUrlSync />
        </Suspense>
        <DemoListContent demos={demos} />
      </div>
    </PageShell>
  );
}
