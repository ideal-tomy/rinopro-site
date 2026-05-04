import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FEATURED_HOME_ACQUISITION_PATTERNS,
  homeAcquisitionHeroCopy,
} from "@/lib/content/home-acquisition";
import { cn } from "@/lib/utils";

type PatternCaseGridProps = {
  nested?: boolean;
};

/**
 * 「業務の型から考える」のアコーディオン版。
 * - 4件のフィーチャー業務を `<details><summary>` で並べ、デフォルト全閉
 * - summary に「タイトル + pain の冒頭」を常時表示し、閉じていても関連性を判断できる
 * - JS不要のネイティブ実装で、SEO（DOM テキスト常時露出）と互換性を担保
 */
export function PatternCaseGrid({ nested = false }: PatternCaseGridProps) {
  const HeadingTag = nested ? "h3" : "h2";

  return (
    <section
      className={cn(
        "container mx-auto max-w-3xl px-4 md:px-6",
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
      <ul className="mx-auto max-w-3xl list-none space-y-4">
        {FEATURED_HOME_ACQUISITION_PATTERNS.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-silver/20 bg-base-dark/40 ring-1 ring-warm/10 ring-inset"
          >
            <details className="group p-1">
              <summary
                className="cursor-pointer list-none rounded-xl px-5 py-6 marker:content-none [&::-webkit-details-marker]:hidden md:px-6 md:py-6"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="block flex-1">
                    <span className="block text-[17px] font-semibold leading-snug text-white text-balance md:text-[18px]">
                      {p.title}
                    </span>
                    <span className="mt-3 block text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                      {p.pain}
                    </span>
                  </span>
                  <span
                    className="mt-1 shrink-0 text-accent transition group-open:rotate-180"
                    aria-hidden
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <div className="border-t border-silver/15 px-5 py-6 md:px-6">
                <p className="text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                  <span className="font-semibold text-white">打ち手のイメージ</span>
                  <span className="mt-2 block font-normal">{p.approach}</span>
                </p>
                <p className="mt-5 text-[15px] leading-[1.8] text-white/[0.85] md:text-[16px]">
                  {p.outcomeHint}
                </p>
                {p.exampleLine ? (
                  <p className="mt-4 text-[13px] leading-[1.7] text-white/75">
                    {p.exampleLine}
                  </p>
                ) : null}
                <Button asChild className="mt-7 w-full md:mt-9" variant="outline">
                  <Link href={`/contact?pattern=${encodeURIComponent(p.id)}`}>
                    このパターンで相談する
                  </Link>
                </Button>
              </div>
            </details>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center md:mt-12">
        <Button asChild variant="ghost" className="text-accent">
          <Link href="/services">業務改善のサービス詳細を見る →</Link>
        </Button>
      </div>
    </section>
  );
}
