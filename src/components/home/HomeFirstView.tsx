import Image from "next/image";
import Link from "next/link";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import { cn } from "@/lib/utils";

const c = homeLandingCopy.firstView;

export function HomeFirstView() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      aria-labelledby="home-landing-hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgb(var(--color-accent-primary-rgb,37_99_235)_/_0.12),transparent_42%),linear-gradient(to_bottom,var(--color-bg)_0%,var(--color-bg-pure)_100%)]"
      />

      <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:gap-12 md:px-6 md:py-[clamp(4rem,10vh,7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="relative z-10 max-w-xl">
          {c.eyebrow ? (
            <p className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-[var(--color-accent-primary)] md:text-base">
              <span
                aria-hidden
                className="h-px w-8 bg-[var(--color-accent-primary)]"
              />
              {c.eyebrow}
            </p>
          ) : null}
          <h1
            id="home-landing-hero-heading"
            className="text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.18] tracking-tight text-[var(--color-text-primary)] md:leading-[1.15]"
          >
            {c.headlineLine1}
            <br />
            {c.headlineLine2}
          </h1>
          {c.subheadline ? (
            <p className="mt-6 max-w-[36ch] text-[17px] font-medium leading-[1.8] text-[var(--color-text-secondary)] md:mt-8 md:text-[18px]">
              {c.subheadline}
            </p>
          ) : null}
          <p className="mt-6 max-w-[40ch] whitespace-pre-line text-[16px] leading-[1.8] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
            {c.body}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-12">
            <Link
              href={c.primaryCta.href}
              className={cn(
                homeLandingCtaButtonClass,
                "inline-flex items-center justify-center bg-[var(--color-accent-primary)] text-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
              )}
            >
              {c.primaryCta.label}
            </Link>
            <Link
              href={c.servicesHref}
              className={cn(
                homeLandingCtaButtonClass,
                "inline-flex items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-text-primary)] motion-safe:transition-[transform,border-color] motion-safe:duration-300 motion-safe:hover:scale-[1.02] hover:border-[var(--color-accent-primary)]/50"
              )}
            >
              {c.servicesCta}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[640px] lg:ml-auto">
          <div className="relative aspect-square w-full">
            <Image
              src={c.heroImage.src}
              alt={c.heroImage.alt}
              fill
              priority
              sizes="(max-width: 1023px) 94vw, 50vw"
              className="select-none object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
