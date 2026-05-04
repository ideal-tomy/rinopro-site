import { IndustryShowcaseSection } from "@/components/home/IndustryShowcaseSection";
import { PatternCaseGrid } from "@/components/home/PatternCaseGrid";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const copy = homeLandingCopy.seoEntries;

export function HomeSeoEntrySection() {
  return (
    <div
      className="border-t border-transparent"
      role="region"
      aria-labelledby="home-seo-entries-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px]">
        <HomeLandingSectionHeading
          id="home-seo-entries-heading"
          index={copy.sectionIndex}
          kicker={copy.sectionKicker}
          title={copy.heading}
          description={copy.intro}
        />
      </div>
      <IndustryShowcaseSection nested />
      <PatternCaseGrid nested />
    </div>
  );
}
