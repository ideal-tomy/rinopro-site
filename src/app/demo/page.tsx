import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験ハブ | Axeon",
  description:
    "まずは厳選した体験から触れ、必要に応じて demo 一覧で比較できる体験ハブです。",
};

export default async function DemoPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <DemoPageContent demos={demos} />
    </PageShell>
  );
}
