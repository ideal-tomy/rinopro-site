import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeConsultCtaButton } from "@/components/home/HomeConsultCtaButton";
import {
  topCopy,
  homeQuickStartCopy,
} from "@/lib/content/site-copy";

export function HomeHeroIntro() {
  return (
    <>
      <section
        className="container mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16 md:px-6 md:py-24"
      >
        <h1 className="max-w-2xl text-center text-2xl font-bold text-accent md:text-3xl">
          {topCopy.tagline}
        </h1>
        <p className="max-w-xl text-center text-sm text-text-sub md:text-[1rem]">
          {topCopy.subline}
        </p>
      </section>

      <section
        className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20"
        aria-label="相談・体験・料金の入口"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5">
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.consult.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.consult.body}
            </p>
            <HomeConsultCtaButton label={homeQuickStartCopy.consult.ctaLabel} />
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5">
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.experience.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.experience.body}
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href={homeQuickStartCopy.experience.ctaHref}>
                {homeQuickStartCopy.experience.ctaLabel}
              </Link>
            </Button>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/60 p-5">
            <h3 className="text-[1rem] font-semibold text-text">
              {homeQuickStartCopy.estimate.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-sub">
              {homeQuickStartCopy.estimate.body}
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href={homeQuickStartCopy.estimate.ctaHref}>
                {homeQuickStartCopy.estimate.ctaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
