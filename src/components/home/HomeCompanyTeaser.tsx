import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { company } = homeLandingCopy;

export function HomeCompanyTeaser() {
  return (
    <section
      className="container mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-company-teaser-heading"
    >
      <HomeLandingSectionHeading
        id="home-company-teaser-heading"
        index={company.sectionIndex}
        kicker={company.sectionKicker}
        title={company.heading}
      />
      <div className="rounded-2xl border border-silver/20 bg-base-dark/55 p-6 ring-1 ring-warm/15 ring-inset md:p-8">
        <p className="text-[17px] font-medium leading-[1.8] text-white/[0.85] md:text-[18px]">
          {company.lead}
        </p>
        <p className="mt-5 text-[16px] leading-[1.8] text-white/[0.85] md:mt-6 md:text-[17px]">
          {company.body}
        </p>
        <Button asChild className="mt-8 md:mt-10" variant="outline" size="lg">
          <Link href={company.linkHref}>{company.linkLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
