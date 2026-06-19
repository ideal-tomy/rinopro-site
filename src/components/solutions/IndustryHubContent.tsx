import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import type { IndustryShowcaseItemWithPath } from "@/lib/content/industry-showcase";
import { getImplementationShowcaseBySlug } from "@/lib/content/implementation-showcase";

interface IndustryHubContentProps {
  item: IndustryShowcaseItemWithPath;
}

export function IndustryHubContent({ item }: IndustryHubContentProps) {
  const { hub } = item;
  const relatedCaseStudySlugs = hub.relatedCaseStudySlugs ?? [];

  return (
    <>
      <section className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <div className="relative aspect-video max-h-[min(100vw,22rem)] overflow-hidden rounded-2xl border border-[var(--color-border-light)] md:max-h-[20rem]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
            priority
            unoptimized
          />
        </div>

        <p className="mt-8 text-sm text-accent md:mt-10">{item.tagline}</p>
        <h1 className="mt-2 text-2xl font-bold text-text md:text-3xl">
          {item.label}
        </h1>
        <p className="mt-6 text-[1rem] leading-relaxed text-text-sub">
          {hub.lead}
        </p>
      </section>

      <div className="py-6 md:py-8">
        <PageSectionDivider />
      </div>

      <section
        className="container mx-auto max-w-3xl px-4 md:px-6"
        aria-labelledby="hub-pain-heading"
      >
        <h2
          id="hub-pain-heading"
          className="text-xl font-semibold text-accent md:text-2xl"
        >
          {hub.painSectionTitle}
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-sub md:mt-6 md:text-[1rem]">
          {hub.painBody}
        </p>
      </section>

      <div className="py-6 md:py-8">
        <PageSectionDivider />
      </div>

      <section
        className="container mx-auto max-w-3xl px-4 md:px-6"
        aria-labelledby="hub-approach-heading"
      >
        <h2
          id="hub-approach-heading"
          className="text-xl font-semibold text-accent md:text-2xl"
        >
          {hub.approachSectionTitle}
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-sub md:mt-6 md:text-[1rem]">
          {hub.approachBody}
        </p>
      </section>

      <div className="py-6 md:py-8">
        <PageSectionDivider />
      </div>

      {relatedCaseStudySlugs.length > 0 ? (
        <>
          <section
            className="container mx-auto max-w-6xl px-4 md:px-6"
            aria-labelledby="hub-case-studies-heading"
          >
            <h2
              id="hub-case-studies-heading"
              className="text-xl font-semibold text-accent md:text-2xl"
            >
              関連する実装事例
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-sub md:text-[1rem]">
              画面構成や進め方のイメージとしてご覧ください。外部デモは別タブで開きます。サイト内で動くdemoは体験ページへ進みます。
            </p>
            <ul className="mt-8 grid list-none gap-6 md:grid-cols-2">
              {relatedCaseStudySlugs.map((slug) => {
                const showcase = getImplementationShowcaseBySlug(slug);
                if (!showcase) return null;
                return (
                  <li key={slug} className="min-w-0">
                    <ImplementationShowcaseCard item={showcase} />
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="py-6 md:py-8">
            <PageSectionDivider />
          </div>
        </>
      ) : null}

      <section
        className="container mx-auto max-w-3xl px-4 pb-16 md:px-6 md:pb-24"
        aria-labelledby="hub-demos-heading"
      >
        <h2
          id="hub-demos-heading"
          className="text-xl font-semibold text-accent md:text-2xl"
        >
          関連する体験デモ
        </h2>
        <p className="mt-3 text-sm text-text-sub md:text-[1rem]">
          操作感や成果物イメージの確認にご利用ください（デモにより表示が異なります）。
        </p>
        <ul className="mt-6 space-y-3">
          {hub.relatedDemos.map((demo) => (
            <li key={demo.slug}>
              <Link
                href={`/demo/${demo.slug}`}
                className="flex flex-col rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-3 text-text transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{demo.title}</span>
                <span className="mt-1 text-sm text-accent sm:mt-0">
                  体験ページへ
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg">
            <Link
              href={`/contact?industry=${encodeURIComponent(item.slug)}`}
            >
              この業種で相談する
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/experience">体験ラボを見る</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
