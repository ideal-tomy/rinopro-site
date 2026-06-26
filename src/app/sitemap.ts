import type { MetadataRoute } from "next";
import { ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS } from "@/lib/content/experience-gallery";
import { getAllIndustryShowcaseSlugs } from "@/lib/content/industry-showcase";
import { getAllServiceOfferingSlugs } from "@/lib/content/service-offerings";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://AXEON.example.com";

function demoSlugForSitemap(d: { slug?: string | { current?: string } }): string | undefined {
  return typeof d.slug === "object" ? d.slug?.current : d.slug;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const demos = await fetchDemosForDisplay();
  const demoEntries: MetadataRoute.Sitemap = demos.flatMap((d) => {
    const slug = demoSlugForSitemap(d);
    if (!slug) return [];
    return [{ url: `${BASE_URL}/demo/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }];
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/experience`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    ...demoEntries,
    ...ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/experience/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...getAllServiceOfferingSlugs().map((slug) => ({
      url: `${BASE_URL}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...getAllIndustryShowcaseSlugs().map((slug) => ({
      url: `${BASE_URL}/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
  ];
}
