import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ImplementationShowcaseCard } from "@/components/home/ImplementationShowcaseCard";
import { IMPLEMENTATION_SHOWCASE_ITEMS } from "@/lib/content/implementation-showcase";

export const metadata: Metadata = {
  title: "実装事例一覧 | AXEON",
  description:
    "業界別の実装事例です。動くプロダクトで実装の幅と完成度をご確認ください。",
};

export default function CaseStudiesPage() {
  const items = IMPLEMENTATION_SHOWCASE_ITEMS;

  return (
    <PageShell>
      <div className="home-landing-copy">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-studies-heading"
        >
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm">
              INDUSTRY SHOWCASE
            </p>
            <h1
              id="case-studies-heading"
              className="mt-3 text-balance text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
            >
              業界別の、実装事例。
            </h1>
            <p className="mx-auto mt-6 max-w-[40ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
              各プロダクトを開き、画面イメージと操作感をご確認ください。
            </p>
          </header>

          <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.slug} id={item.slug} className="scroll-mt-28">
                <ImplementationShowcaseCard
                  item={item}
                  href={`/case-studies/${item.slug}`}
                />
              </div>
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-xl text-center text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:mt-20 md:text-[16px]">
            各カードから詳細ページへ進み、概要・機能・画面イメージをご確認いただけます。デモは詳細ページの「実際に触る」から開けます。外部デモURLは環境変数{" "}
            <code className="rounded bg-[var(--color-bg-neutral)] px-1 py-0.5 text-[13px]">
              NEXT_PUBLIC_SHOWCASE_*_URL
            </code>{" "}
            で設定できます。
          </p>

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[16px]"
            >
              トップへ戻る
            </Link>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
