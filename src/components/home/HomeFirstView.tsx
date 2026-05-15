import { HeroAxisVisual } from "@/components/illustrations/hero-axis-visual";
import { HomeFirstViewActions } from "@/components/home/HomeFirstViewActions";
import { homeLandingCopy } from "@/lib/content/home-landing";

const c = homeLandingCopy.firstView;

export function HomeFirstView() {
  return (
    <section
      id="hero"
      className="container relative isolate mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-12 md:px-6 md:pb-[5rem] md:pt-16"
      aria-labelledby="home-landing-hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-6 bottom-6 select-none md:-right-4 md:bottom-10 md:opacity-90"
        aria-hidden
      >
        <HeroAxisVisual />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center">
        <h1
          id="home-landing-hero-heading"
          className="max-w-[36ch] text-center text-[clamp(2rem,6.5vw,3.75rem)] font-bold leading-[1.22] tracking-tight text-[var(--color-text-primary)] text-balance md:leading-[1.2] lg:text-[clamp(2.75rem,5vw,4rem)]"
        >
          {c.headlineLine1}
          <br />
          {c.headlineLine2}
        </h1>
        {c.subheadline ? (
          <p className="mx-auto mt-8 max-w-[40ch] text-center text-[17px] font-medium leading-[1.8] text-[var(--color-text-secondary)] md:mt-10 md:text-[18px]">
            {c.subheadline}
          </p>
        ) : null}
        <p className="mx-auto mt-6 max-w-[40ch] whitespace-pre-line text-center text-[16px] leading-[1.8] text-[var(--color-text-secondary)] md:mt-8 md:text-[17px]">
          {c.body}
        </p>
        <div className="mt-20 w-full max-w-lg md:mt-[5rem] md:max-w-none">
          <HomeFirstViewActions
            cards={c.serviceOfferCards}
            servicesLabel={c.servicesCta}
            servicesHref={c.servicesHref}
          />
        </div>
      </div>
    </section>
  );
}
