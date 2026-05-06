import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { values } = homeLandingCopy;

export function HomeValuesSection() {
  return (
    <section
      id="values"
      className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-28"
      aria-labelledby="home-values-heading"
    >
      <HomeLandingSectionHeading
        id="home-values-heading"
        index={values.sectionIndex}
        kicker={values.sectionKicker}
        title={values.heading}
      />
      <ul className="grid list-none gap-5 md:grid-cols-2">
        {values.items.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6"
          >
            <h3 className="text-[20px] font-semibold leading-snug text-[var(--color-text-primary)]">
              {item.title}
            </h3>
            <p className="mt-3 text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
