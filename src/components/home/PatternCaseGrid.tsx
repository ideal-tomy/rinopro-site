import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HOME_ACQUISITION_PATTERNS,
  homeAcquisitionHeroCopy,
} from "@/lib/content/home-acquisition";
import { cn } from "@/lib/utils";

type PatternCaseGridProps = {
  nested?: boolean;
};

export function PatternCaseGrid({ nested = false }: PatternCaseGridProps) {
  const HeadingTag = nested ? "h3" : "h2";

  return (
    <section
      className={cn(
        "container mx-auto max-w-6xl px-4 md:px-6",
        nested ? "pb-12 pt-4 md:pb-16 md:pt-6" : "pb-12 md:pb-16"
      )}
      aria-labelledby="home-pattern-cases-heading"
    >
      <HeadingTag
        id="home-pattern-cases-heading"
        className="mb-4 text-center text-balance text-xl font-semibold leading-snug tracking-tight text-white md:mb-5 md:text-2xl"
      >
        {homeAcquisitionHeroCopy.patternsHeading}
      </HeadingTag>
      <p className="mx-auto mb-8 max-w-[40ch] text-center text-[17px] leading-[1.8] text-white/[0.85] md:mb-10 md:max-w-2xl md:text-[18px]">
        {homeAcquisitionHeroCopy.patternsIntro}
      </p>
      <ul className="grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
        {HOME_ACQUISITION_PATTERNS.map((p) => (
          <li key={p.id}>
            <article className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-7 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)] md:p-8">
              <h3 className="text-balance text-xl font-semibold leading-snug text-white md:text-[1.35rem]">
                {p.title}
              </h3>
              <p className="mt-5 text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                <span className="font-semibold text-white">よくある状態</span>
                <span className="mt-2 block font-normal">{p.pain}</span>
              </p>
              <p className="mt-5 text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                <span className="font-semibold text-white">打ち手のイメージ</span>
                <span className="mt-2 block font-normal">{p.approach}</span>
              </p>
              <p className="mt-5 text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                {p.outcomeHint}
              </p>
              {p.exampleLine ? (
                <p className="mt-4 text-[13px] leading-[1.7] text-white/65">{p.exampleLine}</p>
              ) : null}
              <Button asChild className="mt-8 w-full md:mt-10" variant="outline">
                <Link href={`/contact?pattern=${encodeURIComponent(p.id)}`}>
                  このパターンで相談する
                </Link>
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
