import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { aboutCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "会社紹介 | AXEON",
  description: `${aboutCopy.hero.headline} ${aboutCopy.hero.sub}`,
};

export default function AboutPage() {
  return (
    <PageShell>
      <AboutPageContent />
    </PageShell>
  );
}
