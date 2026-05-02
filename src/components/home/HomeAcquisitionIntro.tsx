import { homeAcquisitionHeroCopy } from "@/lib/content/home-acquisition";
import { HomeQuickStartCards } from "@/components/home/HomeQuickStartCards";
import { IndustryShowcaseSection } from "@/components/home/IndustryShowcaseSection";
import { PatternCaseGrid } from "@/components/home/PatternCaseGrid";

export function HomeAcquisitionIntro() {
  return (
    <>
      <section
        className="container mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 md:gap-8 md:px-6 md:py-24"
        aria-labelledby="home-acquisition-hero-heading"
      >
        <h1
          id="home-acquisition-hero-heading"
          className="max-w-2xl text-center text-2xl font-bold text-accent md:text-3xl"
        >
          {homeAcquisitionHeroCopy.tagline}
        </h1>
        <p className="max-w-xl whitespace-pre-line text-center text-sm text-text-sub md:text-[1rem]">
          {homeAcquisitionHeroCopy.subline}
        </p>
      </section>

      <section
        className="container mx-auto max-w-3xl px-4 pb-12 md:px-6 md:pb-16"
        aria-labelledby="home-acquisition-empathy-heading"
      >
        <h2
          id="home-acquisition-empathy-heading"
          className="mb-4 text-center text-xl font-semibold text-accent md:mb-6 md:text-2xl"
        >
          {homeAcquisitionHeroCopy.empathyHeading}
        </h2>
        <p className="whitespace-pre-line text-center text-sm leading-relaxed text-text-sub md:text-[1rem]">
          {homeAcquisitionHeroCopy.empathyLead}
        </p>
        <p className="mt-6 text-center text-sm leading-relaxed text-text-sub md:mt-8 md:text-[1rem]">
          {homeAcquisitionHeroCopy.empathyClosing}
        </p>
      </section>

      <IndustryShowcaseSection />

      <PatternCaseGrid />

      <HomeQuickStartCards />
    </>
  );
}
