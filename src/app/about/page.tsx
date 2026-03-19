import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { TeamMember } from "@/components/about/TeamMember";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchTeamMembers } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "会社紹介 | rinopro",
  description: "代表の戦略的知見と、パートナーの技術的資産。",
};

export default async function AboutPage() {
  const members = await fetchTeamMembers();

  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          代表の戦略的知見と、パートナーの技術的資産。
        </h1>
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {members.length > 0 ? (
            members.map((member) => (
              <TeamMember key={member._id} member={member} />
            ))
          ) : (
            <>
              {[1, 2].map((i) => (
                <SkeletonShimmer key={i} className="h-48 rounded-xl" />
              ))}
            </>
          )}
        </div>
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </section>
    </PageShell>
  );
}
