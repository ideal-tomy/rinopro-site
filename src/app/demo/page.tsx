import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験ハブ | AXEON",
  description:
    "実装事例とプロトタイプを通じて、AXEONの開発品質をご確認いただけます。",
};

export default async function DemoPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <Suspense fallback={null}>
        <DemoPageContent demos={demos} />
      </Suspense>
    </PageShell>
  );
}
