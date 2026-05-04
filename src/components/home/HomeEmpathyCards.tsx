import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { empathy } = homeLandingCopy;

export function HomeEmpathyCards() {
  return (
    <section
      id="empathy"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-empathy-heading"
    >
      <HomeLandingSectionHeading
        id="home-empathy-heading"
        index={empathy.sectionIndex}
        kicker={empathy.sectionKicker}
        title={empathy.heading}
      />
      <ul className="mx-auto grid max-w-5xl list-none gap-6 sm:grid-cols-2">
        {empathy.cards.map((card) => (
          <li key={`${card.prefix}-${card.emphasis}`}>
            <article className="flex h-full min-h-[120px] flex-col gap-4 rounded-2xl border border-silver/20 bg-base-dark/55 p-6 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] md:p-8">
              <span
                className="select-none text-[2rem] leading-none md:text-[2.25rem]"
                aria-hidden
              >
                {card.icon}
              </span>
              <p className="text-[16px] leading-[1.8] text-white/[0.85] md:text-[17px]">
                <span className="text-white/[0.85]">{card.prefix}</span>
                <strong className="font-semibold text-white">{card.emphasis}</strong>
              </p>
            </article>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-16 max-w-[40ch] text-center text-[17px] font-semibold leading-[1.8] text-white md:mt-20 md:text-[18px]">
        {empathy.bridge}
      </p>
    </section>
  );
}
