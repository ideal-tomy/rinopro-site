import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ApproachTimeline } from "@/components/illustrations/approach-timeline";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { CaseStudyBeforeAfter } from "@/components/case-studies/case-study-before-after";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { Button } from "@/components/ui/button";
import { homeLandingCtaButtonClass } from "@/lib/content/home-landing-styles";
import type { CaseStudyDetail } from "@/lib/content/case-study-detail";

type CaseStudyDetailViewProps = {
  detail: CaseStudyDetail;
  demoHref: string;
  demoOpenInNewTab: boolean;
};

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function OverviewMedia({ media }: { media: CaseStudyDetail["overviewMedia"] }) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        aria-label={media.ariaLabel}
        className="h-auto w-full rounded-2xl border border-[var(--color-border-light)] bg-black object-cover shadow-[0_8px_30px_rgb(0_0_0_/_0.06)]"
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
      />
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] shadow-[0_8px_30px_rgb(0_0_0_/_0.06)]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, min(1100px, 90vw)"
        priority
      />
    </div>
  );
}

function DemoLaunchLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function CaseStudyDetailView({
  detail,
  demoHref,
  demoOpenInNewTab,
}: CaseStudyDetailViewProps) {
  const solutionsHref = `/solutions/${detail.relatedSolutionsSlug}`;

  return (
    <div className="home-landing-copy">
      <HomeSectionShell>
        <header className="container mx-auto max-w-4xl px-4 pb-12 pt-16 text-center md:px-6 md:pb-16 md:pt-24">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[var(--color-accent-primary)] md:text-sm">
            CASE STUDY
          </p>
          <p className="mt-3 text-[15px] font-bold text-[var(--color-accent-primary)] md:text-[16px]">
            {detail.heroEyebrow}
          </p>
          <h1 className="mt-2 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]">
            {detail.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-[42ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
            {detail.heroSubtitle}
          </p>
          <p className="mt-6">
            <span className="inline-flex rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-1.5 text-[14px] font-medium text-[var(--color-text-secondary)]">
              {detail.industryTag}
            </span>
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className={homeLandingCtaButtonClass}>
              <a href="#try-demo">実際に触ってみる</a>
            </Button>
            <Button
              asChild
              className={`${homeLandingCtaButtonClass} motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02]`}
            >
              <Link href="/contact">同様の支援を相談する</Link>
            </Button>
          </div>
        </header>
      </HomeSectionShell>

      <HomeSectionShell tone="pure">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-overview"
        >
          <h2
            id="case-study-overview"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            プロダクト概要
          </h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-5 text-[15px] leading-[1.9] text-[var(--color-text-secondary)] md:mt-8 md:text-[16px]">
            {detail.overviewParagraphs.map((p, i) => (
              <p key={`overview-${i}`}>{p}</p>
            ))}
          </div>
          <IllustrationReveal className="mt-12 md:mt-14">
            <OverviewMedia media={detail.overviewMedia} />
          </IllustrationReveal>
        </section>
      </HomeSectionShell>

      <HomeSectionShell>
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-before-after"
        >
          <h2
            id="case-study-before-after"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            課題の置きどころ
          </h2>
          <IllustrationReveal className="mt-10 md:mt-12">
            <CaseStudyBeforeAfter
              beforeTitle={detail.beforeAfter.beforeTitle}
              beforeBody={detail.beforeAfter.beforeBody}
              afterTitle={detail.beforeAfter.afterTitle}
              afterBody={detail.beforeAfter.afterBody}
            />
          </IllustrationReveal>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-flow"
        >
          <h2
            id="case-study-flow"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            利用の流れ（イメージ）
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[16px]">
            現場やバックオフィスでの典型的な一周を、タイムラインで整理しています。実際の業務に合わせてステップ数や名称は調整可能です。
          </p>
          <div className="mt-12 md:mt-14">
            <ApproachTimeline steps={[...detail.flowSteps]} />
          </div>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="pure">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-pains"
        >
          <h2
            id="case-study-pains"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            解決する典型的な課題
          </h2>
          <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2">
            {detail.painPoints.map((pain) => (
              <li
                key={pain.title}
                className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] md:p-7"
              >
                <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-lg">
                  {pain.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                  {pain.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </HomeSectionShell>

      <HomeSectionShell>
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-features"
        >
          <h2
            id="case-study-features"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            主な機能
          </h2>
          <ul className="mx-auto mt-10 max-w-3xl space-y-6 md:mt-12">
            {detail.features.map((f) => (
              <li key={f.title} className="flex gap-4 border-b border-[var(--color-border-light)] pb-6 last:border-0 last:pb-0">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
                  aria-hidden
                />
                <div>
                  <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-lg">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                    {f.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
            {detail.gallery.map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
                <div className="relative aspect-video w-full bg-[var(--color-bg-neutral)]">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="border-t border-[var(--color-border-light)] px-4 py-3 text-[14px] leading-[1.75] text-[var(--color-text-secondary)] md:px-5 md:py-4 md:text-[15px]">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-tech"
        >
          <h2
            id="case-study-tech"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            技術スタック・実装の考え方
          </h2>
          <ul className="mx-auto mt-10 max-w-3xl list-disc space-y-3 pl-5 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] marker:text-[var(--color-accent-primary)] md:mt-12 md:text-[16px]">
            {detail.techHighlights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="pure">
        <section
          id="try-demo"
          className="container mx-auto max-w-3xl scroll-mt-28 px-4 py-16 text-center md:px-6 md:py-24"
          aria-labelledby="case-study-try"
        >
          <h2
            id="case-study-try"
            className="text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            実際に触る
          </h2>
          <p className="mx-auto mt-6 max-w-[42ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[16px]">
            デモ環境は公開URLまたは自サイト内の体験ページから開けます。別タブで開くリンクの場合は、そのまま操作感をご確認ください。
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <DemoLaunchLink
              href={demoHref}
              className={`inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[var(--color-accent-primary)] px-10 py-[18px] text-[17px] font-semibold text-[var(--color-bg-pure)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02] md:text-[18px]`}
            >
              <span className="inline-flex items-center gap-2">
                実際に触ってみる
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </DemoLaunchLink>
            <p className="text-[14px] text-[var(--color-text-tertiary)] md:text-[15px]">
              {demoOpenInNewTab && isHttpUrl(demoHref)
                ? "デモは外部サイトへ移動します（新しいタブ）。"
                : null}
            </p>
          </div>
        </section>
      </HomeSectionShell>

      <HomeSectionShell>
        <section
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
          aria-labelledby="case-study-related"
        >
          <h2
            id="case-study-related"
            className="text-center text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            同様のご支援
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[16px]">
            このサンプルと近い文脈での構想整理から実装まで、同一チームで伴走できます。関連サービスと業界別の入口もあわせてご覧ください。
          </p>
          <ul className="mt-10 flex flex-col items-center gap-3 md:mt-12">
            {detail.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[16px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[17px]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={solutionsHref}
                className="text-[16px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[17px]"
              >
                業界別ソリューションを見る
              </Link>
            </li>
          </ul>
        </section>
      </HomeSectionShell>

      <HomeSectionShell tone="neutral">
        <section
          className="container mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-24"
          aria-labelledby="case-study-final-cta"
        >
          <h2
            id="case-study-final-cta"
            className="text-[clamp(1.35rem,3vw,1.85rem)] font-bold text-[var(--color-text-primary)]"
          >
            貴社向けの実装を相談する
          </h2>
          <p className="mx-auto mt-6 max-w-[40ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:mt-8 md:text-[16px]">
            画面キャプチャはサンプルです。要件に合わせた権限設計・連携・運用まで含めてご提案します。
          </p>
          <Button
            asChild
            className={`mt-10 ${homeLandingCtaButtonClass} motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:scale-[1.02]`}
          >
            <Link href="/contact">お問い合わせへ</Link>
          </Button>
          <p className="mt-8">
            <Link
              href="/case-studies"
              className="text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[16px]"
            >
              実装事例一覧へ戻る
            </Link>
          </p>
        </section>
      </HomeSectionShell>
    </div>
  );
}
