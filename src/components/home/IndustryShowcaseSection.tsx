import {
  INDUSTRY_SHOWCASE_ITEMS,
  industryShowcaseSectionCopy,
} from "@/lib/content/industry-showcase";
import { IndustryShowcaseCard } from "@/components/home/IndustryShowcaseCard";

export function IndustryShowcaseSection() {
  return (
    <section
      className="container mx-auto max-w-6xl px-4 pb-12 md:px-6 md:pb-16"
      aria-labelledby="home-industry-showcase-heading"
    >
      <h2
        id="home-industry-showcase-heading"
        className="mb-3 text-center text-xl font-semibold text-accent md:mb-4 md:text-2xl"
      >
        {industryShowcaseSectionCopy.heading}
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-text-sub md:mb-10 md:text-[1rem]">
        {industryShowcaseSectionCopy.intro}
      </p>
      <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {INDUSTRY_SHOWCASE_ITEMS.map((item, index) => (
          <li key={item.slug}>
            <IndustryShowcaseCard
              item={item}
              priorityImage={index === 0}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
