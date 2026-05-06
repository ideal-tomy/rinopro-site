"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HomeConsultCtaButton } from "@/components/home/HomeConsultCtaButton";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";

const { closing } = homeLandingCopy;

const motionHover =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-reduce:transition-none";

export function HomeClosingCta() {
  return (
    <section
      id="cta"
      className="container mx-auto max-w-3xl px-4 py-[120px] md:px-6 md:pb-32 md:pt-[120px] scroll-mt-32"
      aria-labelledby="home-closing-cta-heading"
    >
      <p className="text-center text-[13px] font-semibold tracking-[0.12em] text-[var(--color-accent-primary)]">
        {closing.sectionKicker}
      </p>
      <div className="mt-4 rounded-3xl border border-[var(--color-accent-primary)]/25 bg-[var(--color-accent-primary)] px-6 py-12 text-center md:px-12 md:py-16">
        <h2
          id="home-closing-cta-heading"
          className="text-balance text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-snug tracking-tight text-white md:text-[clamp(1.75rem,3vw,2.5rem)]"
        >
          {closing.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-[40ch] text-[17px] leading-[1.8] text-white/[0.85] md:mt-8 md:text-[18px]">
          {closing.body}
        </p>
        <div className="mx-auto mt-10 flex max-w-md justify-center md:mt-12">
          <HomeConsultCtaButton
            label={closing.primaryCta}
            size="lg"
            className={cn(
              "mt-0 w-full border-white/35 bg-white text-[var(--color-accent-primary)]",
              homeLandingCtaButtonClass,
              motionHover
            )}
          />
        </div>
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] text-white/70 md:mt-12 md:text-[16px]"
          aria-label="関連ページ"
        >
          {closing.auxiliaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline-offset-4 transition hover:text-white/[0.88] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
