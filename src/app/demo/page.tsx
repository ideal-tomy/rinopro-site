import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { DemoPageContent } from "@/components/demo/DemoPageContent";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "体験ハブ | Axeon",
  description:
    "DXの種が見つかる体験ラボ。demo で課題の気づきと解決のヒントをつかみ、一覧で広く比較できます。",
};

export default async function DemoPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <DemoPageContent demos={demos} />
    </PageShell>
  );
}
