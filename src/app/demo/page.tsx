import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験・ツールdemo | rinopro",
  description:
    "プロトタイプのインタラクティブ体験と、モックdemo一覧への導線をまとめたハブです。",
};

export default async function DemoPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <DemoPageContent demos={demos} />
    </PageShell>
  );
}
