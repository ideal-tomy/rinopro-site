import { MessageCircle, AlertTriangle, Wrench, Sparkles } from "lucide-react";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { empathy } = homeLandingCopy;
const icons = [MessageCircle, AlertTriangle, Wrench, Sparkles] as const;

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
      <ul className="mx-auto grid max-w-6xl list-none gap-4 md:grid-cols-4">
        {empathy.cards.map((card, index) => {
          const Icon = icons[index];
          return (
            <li key={`${card.prefix}-${card.emphasis}`}>
              <article className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-7 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] transition-all duration-200 motion-reduce:transition-none md:hover:-translate-y-1 md:hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)] motion-reduce:md:hover:translate-y-0 motion-reduce:md:hover:shadow-none">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="size-5" aria-hidden strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-[13px] leading-snug text-white/70">
                  {card.prefix}
                </p>
                <p className="mt-2 text-[15px] font-semibold leading-[1.7] text-white">
                  {card.emphasis}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mx-auto mt-16 max-w-[40ch] text-center text-[17px] font-semibold leading-[1.8] text-white md:mt-20 md:text-[18px]">
        {empathy.bridge}
      </p>
    </section>
  );
}
