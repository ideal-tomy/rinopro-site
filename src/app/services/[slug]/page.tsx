import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ServiceOfferingDetailView } from "@/components/services/ServiceOfferingDetailView";
import { getServiceOffering } from "@/lib/content/service-offerings";

type Props = {
  params: Promise<{ slug: string }>;
};

const LEGACY_OFFERING_REDIRECTS: Record<string, string> = {
  "dx-strategy": "/services/consulting",
  "industry-solutions": "/services/consulting",
  "ai-apps": "/services/insourcing-enablement",
  "data-platform": "/services/insourcing-enablement",
  "continuous-improvement": "/services/insourcing-enablement",
};

export function generateStaticParams() {
  return [{ slug: "insourcing-enablement" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (LEGACY_OFFERING_REDIRECTS[slug]) {
    return { title: "ご支援内容 | AXEON" };
  }
  const offering = getServiceOffering(slug);
  if (!offering) {
    return { title: "ページが見つかりません | AXEON" };
  }
  const path = `/services/${slug}`;
  return {
    title: offering.metaTitle,
    description: offering.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: offering.metaTitle,
      description: offering.metaDescription,
      url: path,
      type: "website",
    },
  };
}

export default async function ServiceOfferingPage({ params }: Props) {
  const { slug } = await params;
  const redirectTo = LEGACY_OFFERING_REDIRECTS[slug];
  if (redirectTo) permanentRedirect(redirectTo);

  const offering = getServiceOffering(slug);
  if (!offering) notFound();

  return (
    <PageShell>
      <ServiceOfferingDetailView offering={offering} />
    </PageShell>
  );
}
