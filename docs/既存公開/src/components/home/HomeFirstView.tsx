import { HOME_FIRST_VIEW_STYLES } from "./home-presentation";
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

        <div className={HOME_FIRST_VIEW_STYLES.overlay}>
          <div className={HOME_FIRST_VIEW_STYLES.panel}>
            {c.eyebrow ? (
              <p className={HOME_FIRST_VIEW_STYLES.eyebrow}>
                <span
                  aria-hidden
                  className="h-px w-8 bg-white"
                />
                {c.eyebrow}
              </p>
            ) : null}
            <h1
              id="home-landing-hero-heading"
              className={HOME_FIRST_VIEW_STYLES.heading}
            >
              {c.headlineLine1}
              <br />
              {c.headlineLine2}
            </h1>
            {c.subheadline ? (
              <p className={HOME_FIRST_VIEW_STYLES.lead}>
                {c.subheadline}
              </p>
            ) : null}
            <p className={HOME_FIRST_VIEW_STYLES.body}>
              {c.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
