import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { values } = homeLandingCopy;

function stripValueNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

export function HomeValuesSection() {
  return (
    <section
      id="values"
      className="container mx-auto max-w-6xl scroll-mt-28 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-values-heading"
    >
      <HomeLandingSectionHeading
        id="home-values-heading"
        index={values.sectionIndex}
        kicker={values.sectionKicker}
        title={values.heading}
      />
      <ul className="mx-auto mt-10 grid max-w-3xl list-none gap-5 md:mt-12 md:gap-6">
        {values.items.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent-primary)]/35 hover:shadow-[0_8px_24px_rgb(15_23_42_/_0.06)] md:p-8"
          >
            <h3 className="text-[22px] font-bold leading-snug text-text underline decoration-[var(--color-accent-primary)] decoration-2 underline-offset-[6px] md:text-[24px]">
              {stripValueNumber(item.title)}
            </h3>
            <p className="mt-3 text-[17px] font-semibold leading-[1.8] text-text md:mt-4 md:text-[18px] md:leading-[1.85]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
