import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyBeforeAfter } from "@/components/case-studies/case-study-before-after";
import { CaseStudyFlowSteps } from "@/components/case-studies/case-study-flow-steps";
import { CaseStudyMetrics } from "@/components/case-studies/case-study-metrics";
import {
  CaseStudyArrowRight,
  CaseStudyExternal,
} from "@/components/case-studies/case-study-icons";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { Button } from "@/components/ui/button";
import { getImplementationShowcaseBySlug } from "@/lib/content/implementation-showcase";
import type { CaseStudyDetail } from "@/lib/content/case-study-detail";

type CaseStudyDetailViewProps = {
  detail: CaseStudyDetail;
  demoHref: string;
  demoOpenInNewTab: boolean;
};

const SECTION_NAV = [
  { id: "overview", label: "概要" },
  { id: "shift", label: "転換" },
  { id: "metrics", label: "変化の目安" },
  { id: "flow", label: "利用の流れ" },
  { id: "pains", label: "課題" },
  { id: "features", label: "機能" },
  { id: "screens", label: "画面" },
  { id: "spec", label: "技術" },
  { id: "try-demo", label: "デモ" },
] as const;

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function OverviewMedia({ media }: { media: CaseStudyDetail["overviewMedia"] }) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        aria-label={media.ariaLabel}
        className="h-auto w-full border border-[var(--color-border-light)] bg-black object-cover"
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
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, min(900px, 55vw)"
        priority
      />
    </div>
  );
}

function DemoLaunchLink({
  href,
  className,
  children,
  openInNewTab = false,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  openInNewTab?: boolean;
}) {
  if (isHttpUrl(href) || openInNewTab) {
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

function SectionHeading({
  id,
  kicker,
  title,
}: {
  id: string;
  kicker: string;
  title: string;
}) {
  return (
    <header className="mb-8 md:mb-10">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] md:text-[12px]">
        {kicker}
      </p>
      <h2
        id={id}
        className="mt-3 scroll-mt-32 text-balance text-[clamp(1.35rem,2.8vw,1.85rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
      >
        {title}
      </h2>
    </header>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-[var(--color-border-light)] py-3 last:border-b-0">
      <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">
        {label}
      </dt>
      <dd className="text-[15px] leading-[1.7] text-[var(--color-text-primary)] md:text-[16px]">
        {value}
      </dd>
    </div>
  );
}

export function CaseStudyDetailView({
  detail,
  demoHref,
  demoOpenInNewTab,
}: CaseStudyDetailViewProps) {
  const showcase = getImplementationShowcaseBySlug(detail.slug);
  const isLive =
    detail.demoFormat === "live" || (detail.demoFormat == null && showcase?.liveDemo);
  const demoFormatLabel = isLive ? "LIVE（サイト内）" : "外部デモ";
  const solutionsHref = `/solutions/${detail.relatedSolutionsSlug}`;
  const navItems = SECTION_NAV.filter(
    (item) => item.id !== "metrics" || (detail.metrics && detail.metrics.length > 0)
  );

  return (
    <div className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Hero — 左寄せ・非対称 */}
      <section className="border-b border-[var(--color-border-light)]">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-10 py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-end md:gap-0 md:py-20 lg:py-24">
            <div className="md:pr-10 lg:pr-16">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-primary)] md:text-[12px]">
                {detail.heroEyebrow}
              </p>
              <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.12] tracking-tight">
                {detail.heroTitle}
              </h1>
              <p className="mt-6 max-w-[38ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
                {detail.heroSubtitle}
              </p>

              <dl className="mt-10 border-t border-[var(--color-border-light)]">
                <MetaRow label="業種" value={detail.industryTag} />
                <MetaRow label="デモ形式" value={demoFormatLabel} />
                {detail.whoFor ? <MetaRow label="想定ユーザー" value={detail.whoFor} /> : null}
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <DemoLaunchLink
                  href={demoHref}
                  openInNewTab={demoOpenInNewTab}
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-8 py-3 text-[15px] font-semibold text-[var(--color-bg-pure)] md:text-[16px]"
                >
                  デモ体験
                  <CaseStudyExternal className="size-4 shrink-0" />
                </DemoLaunchLink>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-8 py-3 text-[15px] font-semibold text-[var(--color-text-primary)] md:text-[16px]"
                >
                  同様の支援を相談
                </Link>
              </div>
            </div>

            <IllustrationReveal className="md:-mr-6 lg:-mr-10">
              <OverviewMedia media={detail.overviewMedia} />
            </IllustrationReveal>
          </div>
        </div>
      </section>

      {/* 2カラム: sticky index + content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-0 md:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="hidden border-r border-[var(--color-border-light)] md:block">
            <nav
              className="sticky top-28 py-16 pr-8"
              aria-label="ページ内ナビゲーション"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                index
              </p>
              <ul className="mt-6 space-y-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-[13px] font-medium text-[var(--color-text-secondary)] underline-offset-4 hover:text-[var(--color-accent-primary)] hover:underline md:text-[14px]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 border-[var(--color-border-light)] md:border-l md:pl-10 lg:pl-14">
            {/* Overview */}
            <section
              id="overview"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-overview-heading"
            >
              <SectionHeading
                id="case-study-overview-heading"
                kicker="01 / overview"
                title="プロダクト概要"
              />
              <div className="max-w-[52ch] space-y-5 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]">
                {detail.overviewParagraphs.map((p, i) => (
                  <p key={`overview-${i}`}>{p}</p>
                ))}
              </div>
            </section>

            {/* Shift */}
            <section
              id="shift"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-shift-heading"
            >
              <SectionHeading
                id="case-study-shift-heading"
                kicker="02 / shift"
                title="課題から、どう変わるか"
              />
              <CaseStudyBeforeAfter
                beforeTitle={detail.beforeAfter.beforeTitle}
                beforeBody={detail.beforeAfter.beforeBody}
                afterTitle={detail.beforeAfter.afterTitle}
                afterBody={detail.beforeAfter.afterBody}
              />
            </section>

            {/* Metrics */}
            {detail.metrics && detail.metrics.length > 0 ? (
              <section
                id="metrics"
                className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
                aria-labelledby="case-study-metrics-heading"
              >
                <SectionHeading
                  id="case-study-metrics-heading"
                  kicker="03 / metrics"
                  title="変化の目安"
                />
                <CaseStudyMetrics metrics={detail.metrics} />
              </section>
            ) : null}

            {/* Flow */}
            <section
              id="flow"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-flow-heading"
            >
              <SectionHeading
                id="case-study-flow-heading"
                kicker="04 / flow"
                title="利用の流れ（イメージ）"
              />
              <p className="mb-8 max-w-[48ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                現場やバックオフィスでの典型的な一周です。ステップ数や名称は御社の業務に合わせて調整できます。
              </p>
              <CaseStudyFlowSteps steps={detail.flowSteps} />
            </section>

            {/* Pains */}
            <section
              id="pains"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-pains-heading"
            >
              <SectionHeading
                id="case-study-pains-heading"
                kicker="05 / pains"
                title="解決する典型的な課題"
              />
              <ul className="divide-y divide-[var(--color-border-light)] border-y border-[var(--color-border-light)]">
                {detail.painPoints.map((pain, index) => (
                  <li
                    key={pain.title}
                    className="grid gap-3 py-7 md:grid-cols-[4rem_1fr] md:gap-8 md:py-8"
                  >
                    <span className="font-mono text-[13px] font-bold tabular-nums text-[var(--color-accent-primary)] md:pt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] md:text-[18px]">
                        {pain.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                        {pain.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Features */}
            <section
              id="features"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-features-heading"
            >
              <SectionHeading
                id="case-study-features-heading"
                kicker="06 / features"
                title="主な機能"
              />
              <ul className="divide-y divide-[var(--color-border-light)] border-y border-[var(--color-border-light)]">
                {detail.features.map((f, index) => (
                  <li
                    key={f.title}
                    className="grid gap-3 py-8 md:grid-cols-[5rem_1fr] md:gap-10 md:py-10"
                  >
                    <span className="font-mono text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-none tabular-nums text-[var(--color-accent-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] md:text-[19px]">
                        {f.title}
                      </h3>
                      <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                        {f.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Gallery — 非対称 */}
            <section
              id="screens"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-screens-heading"
            >
              <SectionHeading
                id="case-study-screens-heading"
                kicker="07 / screens"
                title="画面イメージ"
              />
              {detail.galleryNote ? (
                <p className="mb-8 max-w-[52ch] text-[14px] leading-[1.85] text-[var(--color-text-tertiary)] md:text-[15px]">
                  {detail.galleryNote}
                </p>
              ) : null}
              <div className="grid gap-6 md:gap-8">
                {detail.gallery[0] ? (
                  <figure className="border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
                    <div className="relative aspect-[16/9] w-full bg-[var(--color-bg-neutral)]">
                      <Image
                        src={detail.gallery[0].src}
                        alt={detail.gallery[0].alt}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />
                    </div>
                    <figcaption className="border-t border-[var(--color-border-light)] px-5 py-4 text-[14px] leading-[1.75] text-[var(--color-text-secondary)] md:px-6 md:text-[15px]">
                      {detail.gallery[0].caption}
                    </figcaption>
                  </figure>
                ) : null}
                {detail.gallery.length > 1 ? (
                  <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                    {detail.gallery.slice(1).map((g) => (
                      <figure
                        key={g.src}
                        className="border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
                      >
                        <div className="relative aspect-video w-full bg-[var(--color-bg-neutral)]">
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 45vw"
                          />
                        </div>
                        <figcaption className="border-t border-[var(--color-border-light)] px-4 py-3 text-[14px] leading-[1.75] text-[var(--color-text-secondary)] md:px-5 md:py-4">
                          {g.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            {/* Tech spec */}
            <section
              id="spec"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-24"
              aria-labelledby="case-study-spec-heading"
            >
              <SectionHeading
                id="case-study-spec-heading"
                kicker="08 / spec"
                title="技術・実装の考え方"
              />
              <dl className="border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
                {detail.techHighlights.map((line, index) => (
                  <div
                    key={line}
                    className="grid gap-2 border-b border-[var(--color-border-light)] px-5 py-5 last:border-b-0 md:grid-cols-[7rem_1fr] md:gap-6 md:px-6 md:py-6"
                  >
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-primary)]">
                      spec {String(index + 1).padStart(2, "0")}
                    </dt>
                    <dd className="text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                      {line}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Try demo */}
            <section
              id="try-demo"
              className="scroll-mt-28 border-b border-[var(--color-border-light)] py-16 md:py-28"
              aria-labelledby="case-study-try-heading"
            >
              <SectionHeading
                id="case-study-try-heading"
                kicker="09 / demo"
                title="実際に触る"
              />
              <p className="max-w-[44ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                デモ環境は公開URLまたは自サイト内の体験ページから開けます。操作感をご確認いただいたうえで、要件のすり合わせに進めます。
              </p>
              <div className="mt-10">
                <DemoLaunchLink
                  href={demoHref}
                  openInNewTab={demoOpenInNewTab}
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-10 py-[18px] text-[17px] font-semibold text-[var(--color-bg-pure)] md:text-[18px]"
                >
                  デモ体験を開く
                  <CaseStudyArrowRight className="size-5" />
                </DemoLaunchLink>
                <p className="mt-4 text-[14px] text-[var(--color-text-tertiary)] md:text-[15px]">
                  {demoOpenInNewTab
                    ? isHttpUrl(demoHref)
                      ? "外部サイトへ移動します（新しいタブ）。"
                      : "新しいタブで開きます。"
                    : null}
                </p>
              </div>
            </section>

            {/* Related + final CTA */}
            <section
              className="py-16 md:py-24"
              aria-labelledby="case-study-related-heading"
            >
              <SectionHeading
                id="case-study-related-heading"
                kicker="10 / next"
                title="同様のご支援"
              />
              <p className="max-w-[48ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                このサンプルと近い文脈での構想整理から実装まで、同一チームで伴走できます。
              </p>
              <ul className="mt-8 space-y-3">
                {detail.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-[16px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[17px]"
                    >
                      {link.label}
                      <CaseStudyArrowRight className="size-4" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={solutionsHref}
                    className="inline-flex items-center gap-2 text-[16px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[17px]"
                  >
                    業界別ソリューションを見る
                    <CaseStudyArrowRight className="size-4" />
                  </Link>
                </li>
              </ul>

              <div className="mt-16 border-t border-[var(--color-border-light)] pt-16 md:mt-20 md:pt-20">
                <h3 className="text-[clamp(1.25rem,2.5vw,1.65rem)] font-bold text-[var(--color-text-primary)]">
                  貴社向けの実装を相談する
                </h3>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
                  画面はサンプルです。権限設計・連携・運用まで含めてご提案します。
                </p>
                <Button
                  asChild
                  className="mt-8 min-h-12 rounded-none border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-10 text-[16px] font-semibold text-[var(--color-bg-pure)] hover:bg-[var(--color-accent-primary-hover)]"
                >
                  <Link href="/contact">お問い合わせへ</Link>
                </Button>
                <p className="mt-8">
                  <Link
                    href="/experience"
                    className="text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[16px]"
                  >
                    体験ギャラリーへ戻る
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
