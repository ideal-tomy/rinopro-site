import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { DemoDetailContent } from "@/components/demo/DemoDetailContent";
import { parseReturnToFromSearchParams } from "@/lib/navigation/experience-entry";
import { fetchDemoBySlug, fetchDemosForDisplay } from "@/lib/sanity/fetch";

function getSlug(d: { slug?: string | { current?: string } }): string | undefined {
  return typeof d.slug === "object" ? d.slug?.current : d.slug;
}

interface DemoDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: DemoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = await fetchDemoBySlug(slug);
  if (!demo) return { title: "Demo | Axeon" };
  return {
    title: `${demo.title} | Axeon`,
    description: demo.description ?? demo.oneLiner ?? "ツールdemoの詳細",
  };
}

export async function generateStaticParams() {
  const demos = await fetchDemosForDisplay();
  return demos
    .map((d) => {
      const slug = getSlug(d);
      return slug ? { slug } : null;
    })
    .filter((x): x is { slug: string } => x != null);
}

export default async function DemoDetailPage({
  params,
  searchParams,
}: DemoDetailPageProps) {
  const { slug } = await params;
  const demo = await fetchDemoBySlug(slug);
  if (!demo) notFound();

  const sp = await searchParams;
  const returnHref = parseReturnToFromSearchParams(sp);

  return (
    <PageShell>
      <DemoDetailContent demo={demo} returnHref={returnHref} />
    </PageShell>
  );
}
