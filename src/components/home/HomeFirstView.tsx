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
      {/* スマホは画面高さいっぱい。md+ は hero01/03 の 16:9 */}
      <div className="relative h-[calc(100dvh-4rem)] w-full md:h-auto md:aspect-[16/9]">
        <HomeHeroSlider slides={c.heroSlides} />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-end px-4 pb-14 pt-8 md:items-center md:px-8 md:py-10 lg:px-12">
          <div className="w-full max-w-none rounded-sm bg-black/40 px-5 py-6 shadow-[0_8px_32px_rgb(0_0_0_/_0.18)] backdrop-blur-[2px] md:max-w-xl md:rounded-2xl md:px-9 md:py-9">
            {c.eyebrow ? (
              <p className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-white md:text-[1rem]">
                <span
                  aria-hidden
                  className="h-px w-8 bg-white"
                />
                {c.eyebrow}
              </p>
            ) : null}
            <h1
              id="home-landing-hero-heading"
              className="text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.18] tracking-tight text-white md:leading-[1.15]"
            >
              {c.headlineLine1}
              <br />
              {c.headlineLine2}
            </h1>
            {c.subheadline ? (
              <p className="mt-6 max-w-[36ch] text-[17px] font-medium leading-[1.8] text-white md:mt-8 md:text-[18px]">
                {c.subheadline}
              </p>
            ) : null}
            <p className="mt-6 max-w-[40ch] whitespace-pre-line text-[16px] leading-[1.8] text-white md:mt-8 md:text-[17px]">
              {c.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
