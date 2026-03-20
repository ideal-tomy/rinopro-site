import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { DemoDetailContent } from "@/components/demo/DemoDetailContent";
import { fetchDemoItemBySlug, fetchDemoItems } from "@/lib/sanity/fetch";

interface DemoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DemoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = await fetchDemoItemBySlug(slug);
  if (!demo) return { title: "Demo | rinopro" };
  return {
    title: `${demo.title} | rinopro`,
    description: demo.description ?? demo.oneLiner ?? "ツールdemoの詳細",
  };
}

export async function generateStaticParams() {
  const demos = await fetchDemoItems();
  return demos
    .map((d) => {
      const slug = typeof d.slug === "object" ? d.slug?.current : d.slug;
      return slug ? { slug } : null;
    })
    .filter((x): x is { slug: string } => x != null);
}

export default async function DemoDetailPage({ params }: DemoDetailPageProps) {
  const { slug } = await params;
  const demo = await fetchDemoItemBySlug(slug);
  if (!demo) notFound();

  return (
    <PageShell>
      <DemoDetailContent demo={demo} />
    </PageShell>
  );
}
