import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HOME_ACQUISITION_PATTERNS,
  homeAcquisitionHeroCopy,
} from "@/lib/content/home-acquisition";

export function PatternCaseGrid() {
  return (
    <section
      className="container mx-auto max-w-6xl px-4 pb-12 md:px-6 md:pb-16"
      aria-labelledby="home-pattern-cases-heading"
    >
      <h2
        id="home-pattern-cases-heading"
        className="mb-3 text-center text-xl font-semibold text-accent md:mb-4 md:text-2xl"
      >
        {homeAcquisitionHeroCopy.patternsHeading}
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-text-sub md:mb-10 md:text-[1rem]">
        {homeAcquisitionHeroCopy.patternsIntro}
      </p>
      <ul className="grid list-none gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {HOME_ACQUISITION_PATTERNS.map((p) => (
          <li key={p.id}>
            <article className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-5 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)]">
              <h3 className="text-[1rem] font-semibold text-text">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-sub">
                <span className="font-medium text-text/90">よくある状態</span>
                <br />
                {p.pain}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-sub">
                <span className="font-medium text-text/90">打ち手のイメージ</span>
                <br />
                {p.approach}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-sub">
                {p.outcomeHint}
              </p>
              {p.exampleLine ? (
                <p className="mt-2 text-xs text-text-sub/90">{p.exampleLine}</p>
              ) : null}
              <Button asChild className="mt-5 w-full" variant="outline">
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
