import {
  INDUSTRY_SHOWCASE_ITEMS,
  industryShowcaseSectionCopy,
} from "@/lib/content/industry-showcase";
import { IndustryShowcaseCard } from "@/components/home/IndustryShowcaseCard";
import { cn } from "@/lib/utils";

type IndustryShowcaseSectionProps = {
  /** 親セクション直下では見出しレベルとサイズを一段階下げる */
  nested?: boolean;
};

export function IndustryShowcaseSection({
  nested = false,
}: IndustryShowcaseSectionProps) {
  const HeadingTag = nested ? "h3" : "h2";

  return (
    <section
      className={cn(
        "container mx-auto max-w-6xl px-4 md:px-6",
        nested ? "pb-10 pt-4 md:pb-14 md:pt-6" : "pb-12 md:pb-16"
      )}
      aria-labelledby="home-industry-showcase-heading"
    >
      <HeadingTag
        id="home-industry-showcase-heading"
        className="mb-4 text-center text-balance text-xl font-semibold leading-snug tracking-tight text-white md:mb-5 md:text-2xl"
      >
        {industryShowcaseSectionCopy.heading}
      </HeadingTag>
      <p className="mx-auto mb-8 max-w-[40ch] text-center text-[17px] leading-[1.8] text-white/[0.85] md:mb-10 md:max-w-2xl md:text-[18px]">
        {industryShowcaseSectionCopy.intro}
      </p>
      <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
