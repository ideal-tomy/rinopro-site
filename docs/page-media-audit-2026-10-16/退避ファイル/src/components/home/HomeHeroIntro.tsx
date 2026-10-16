import { topCopy } from "@/lib/content/site-copy";
import { HomeQuickStartCards } from "@/components/home/HomeQuickStartCards";

export function HomeHeroIntro() {
  return (
    <>
      <section
        className="container mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16 md:px-6 md:py-24"
      >
        <h1 className="max-w-2xl text-center text-2xl font-bold text-accent md:text-3xl">
          {topCopy.tagline}
        </h1>
        <p className="max-w-xl whitespace-pre-line text-center text-sm text-text-sub md:text-[1rem]">
          {topCopy.subline}
        </p>
      </section>

      <HomeQuickStartCards />
    </>
  );
}
