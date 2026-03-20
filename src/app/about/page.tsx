import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { fetchTeamMembers } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "会社紹介 | rinopro",
  description:
    "現場課題を構造化し、実装まで落とす。過剰提案せず、検証を優先するチームです。",
};

export default async function AboutPage() {
  const members = await fetchTeamMembers();

  return (
    <PageShell>
      <AboutPageContent members={members} />
    </PageShell>
  );
}
