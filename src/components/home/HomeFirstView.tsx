import { HomeHeroSlider } from "@/components/home/HomeHeroSlider";
import { homeLandingCopy } from "@/lib/content/home-landing";

const c = homeLandingCopy.firstView;

export function HomeFirstView() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      aria-labelledby="home-landing-hero-heading"
    >
      {/* hero01=640x360 / hero03=639x360 → 16:9。高さ上限を付けると横長になり左右余白が出る */}
      <div className="relative aspect-[16/9] w-full">
        <HomeHeroSlider slides={c.heroSlides} />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 py-10 md:px-8 lg:px-12">
          <div className="max-w-xl rounded-2xl bg-[var(--color-bg-pure)]/32 px-6 py-7 shadow-[0_8px_32px_rgb(0_0_0_/_0.06)] backdrop-blur-[2px] md:px-9 md:py-9">
            {c.eyebrow ? (
              <p className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-[var(--color-accent-primary)] md:text-[1rem]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
