import type { MetadataRoute } from "next";
import { fetchDemoItems } from "@/lib/sanity/fetch";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rinopro.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const demos = await fetchDemoItems();
  const demoEntries: MetadataRoute.Sitemap = demos.flatMap((d) => {
    const slug = typeof d.slug === "object" ? d.slug?.current : d.slug;
    if (!slug) return [];
    return [{ url: `${BASE_URL}/demo/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }];
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/demo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...demoEntries,
    { url: `${BASE_URL}/cases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/flow`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/consulting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];
}
